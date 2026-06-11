import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function normalizarAcessibilidade(valor: string) {
  const texto = valor?.toLowerCase();

  if (texto === "baixa") {
    return "BAIXA";
  }

  if (texto === "alta") {
    return "ALTA";
  }

  return "MEDIA";
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
    const solicitacoes = await prisma.partnerRequest.findMany({
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
      },
    );
  }
}

export async function POST(request: Request) {
  try {
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
        },
      );
    }

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
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Erro ao criar solicitação:", error);

    return NextResponse.json(
      {
        error: "Erro ao criar solicitação.",
      },
      {
        status: 500,
      },
    );
  }
}
