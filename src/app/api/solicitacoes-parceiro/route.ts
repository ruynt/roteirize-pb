import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { AccessibilityLevel } from "@/generated/prisma";

function normalizarAcessibilidade(valor: string): AccessibilityLevel {
  const texto = valor?.toLowerCase();

  if (texto === "baixa") {
    return AccessibilityLevel.BAIXA;
  }

  if (texto === "alta") {
    return AccessibilityLevel.ALTA;
  }

  return AccessibilityLevel.MEDIA;
}

function formatarAcessibilidade(valor: string) {
  const niveis: Record<string, string> = {
    BAIXA: "Baixa",
    MEDIA: "Média",
    ALTA: "Alta",
  };

  return niveis[valor] ?? valor;
}

function formatarStatus(valor: string) {
  const status: Record<string, string> = {
    AGUARDANDO_APROVACAO: "Aguardando aprovação",
    APROVADO: "Aprovado",
    REJEITADO: "Rejeitado",
  };

  return status[valor] ?? valor;
}

export async function GET() {
  try {
    const usuario = await getCurrentUser();

    const where =
      usuario?.role === "ADMIN"
        ? {}
        : usuario?.role === "PARTNER"
          ? {
              userId: usuario.id,
            }
          : {
              id: "__sem_resultados__",
            };

    const solicitacoes = await prisma.partnerRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const solicitacoesFormatadas = solicitacoes.map((solicitacao) => ({
      id: solicitacao.id,
      nome: solicitacao.name,
      tipo: solicitacao.type,
      cidade: solicitacao.city,
      endereco: solicitacao.address,
      descricao: solicitacao.description,
      horario: solicitacao.schedule,
      preco: solicitacao.priceRange,
      contato: solicitacao.contact,
      acessibilidade: formatarAcessibilidade(solicitacao.accessibility),
      status: formatarStatus(solicitacao.status),
      statusOriginal: solicitacao.status,
      criadoEm: solicitacao.createdAt,
      parceiroId: solicitacao.userId,
      parceiroNome: solicitacao.user?.name ?? null,
      parceiroEmail: solicitacao.user?.email ?? null,
    }));

    return NextResponse.json(solicitacoesFormatadas);
  } catch (error) {
    console.error("Erro ao buscar solicitações:", error);

    return NextResponse.json(
      {
        error: "Erro ao buscar solicitações.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const usuario = await getCurrentUser();
    const body = await request.json();

    const nome = String(body.nome ?? "").trim();
    const tipo = String(body.tipo ?? "").trim();
    const cidade = String(body.cidade ?? "").trim();
    const endereco = String(body.endereco ?? "").trim();
    const descricao = String(body.descricao ?? "").trim();
    const horario = String(body.horario ?? "").trim();
    const preco = String(body.preco ?? "").trim();
    const contato = String(body.contato ?? "").trim();
    const acessibilidade = String(body.acessibilidade ?? "Média").trim();

    if (!nome || !tipo || !cidade || !endereco || !descricao) {
      return NextResponse.json(
        {
          error:
            "Preencha pelo menos nome, tipo, cidade, endereço e descrição.",
        },
        {
          status: 400,
        }
      );
    }

    const podeVincularParceiro =
      usuario?.role === "PARTNER" || usuario?.role === "ADMIN";

    const solicitacao = await prisma.partnerRequest.create({
      data: {
        name: nome,
        type: tipo,
        city: cidade,
        address: endereco,
        description: descricao,
        schedule: horario || null,
        priceRange: preco || null,
        contact: contato || null,
        accessibility: normalizarAcessibilidade(acessibilidade),
        status: "AGUARDANDO_APROVACAO",
        userId: podeVincularParceiro ? usuario.id : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        id: solicitacao.id,
        nome: solicitacao.name,
        tipo: solicitacao.type,
        cidade: solicitacao.city,
        endereco: solicitacao.address,
        descricao: solicitacao.description,
        horario: solicitacao.schedule,
        preco: solicitacao.priceRange,
        contato: solicitacao.contact,
        acessibilidade: formatarAcessibilidade(solicitacao.accessibility),
        status: formatarStatus(solicitacao.status),
        statusOriginal: solicitacao.status,
        criadoEm: solicitacao.createdAt,
        parceiroId: solicitacao.userId,
        parceiroNome: solicitacao.user?.name ?? null,
        parceiroEmail: solicitacao.user?.email ?? null,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Erro ao criar solicitação:", error);

    return NextResponse.json(
      {
        error: "Erro ao criar solicitação.",
      },
      {
        status: 500,
      }
    );
  }
}
