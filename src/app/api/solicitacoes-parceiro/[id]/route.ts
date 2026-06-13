import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CostLevel, PlaceCategory } from "@/generated/prisma";

function mapearTipoParaCategoria(tipo: string): PlaceCategory {
  const texto = tipo.toLowerCase();

  if (texto.includes("restaurante")) {
    return PlaceCategory.GASTRONOMIA;
  }

  if (texto.includes("guia")) {
    return PlaceCategory.EXPERIENCIA;
  }

  if (texto.includes("artesanato")) {
    return PlaceCategory.EXPERIENCIA;
  }

  if (texto.includes("experiência") || texto.includes("experiencia")) {
    return PlaceCategory.EXPERIENCIA;
  }

  if (texto.includes("ponto turístico") || texto.includes("ponto turistico")) {
    return PlaceCategory.CULTURA;
  }

  return PlaceCategory.EXPERIENCIA;
}

function estimarCustoPeloPreco(preco?: string | null): CostLevel {
  if (!preco) {
    return CostLevel.MEDIO;
  }

  const valores = preco.match(/\d+/g)?.map(Number) ?? [];

  if (valores.length === 0) {
    return CostLevel.MEDIO;
  }

  const media =
    valores.reduce((total, valor) => total + valor, 0) / valores.length;

  if (media === 0) {
    return CostLevel.GRATUITO;
  }

  if (media <= 40) {
    return CostLevel.ECONOMICO;
  }

  if (media <= 100) {
    return CostLevel.MEDIO;
  }

  return CostLevel.ALTO;
}

function imagemPorCategoria(categoria: PlaceCategory) {
  const imagens: Record<PlaceCategory, string> = {
    PRAIA: "from-cyan-300 to-blue-500",
    CULTURA: "from-amber-300 to-orange-500",
    GASTRONOMIA: "from-orange-300 to-red-500",
    NATUREZA: "from-green-300 to-emerald-600",
    EXPERIENCIA: "from-purple-300 to-blue-500",
  };

  return imagens[categoria] ?? "from-blue-300 to-emerald-500";
}

function criarTags(tipo: string, cidade: string) {
  const tags = [tipo.toLowerCase(), cidade.toLowerCase(), "parceiro local"];

  return Array.from(new Set(tags));
}

function formatarStatus(valor: string) {
  const status: Record<string, string> = {
    AGUARDANDO_APROVACAO: "Aguardando aprovação",
    APROVADO: "Aprovado",
    REJEITADO: "Rejeitado",
  };

  return status[valor] ?? valor;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const acao = String(body.acao ?? "").toLowerCase();

    const solicitacao = await prisma.partnerRequest.findUnique({
      where: {
        id,
      },
    });

    if (!solicitacao) {
      return NextResponse.json(
        {
          error: "Solicitação não encontrada.",
        },
        {
          status: 404,
        }
      );
    }

    if (acao === "rejeitar") {
      const solicitacaoAtualizada = await prisma.partnerRequest.update({
        where: {
          id,
        },
        data: {
          status: "REJEITADO",
        },
      });

      return NextResponse.json({
        id: solicitacaoAtualizada.id,
        status: formatarStatus(solicitacaoAtualizada.status),
        statusOriginal: solicitacaoAtualizada.status,
      });
    }

    if (acao === "aprovar") {
      if (solicitacao.status !== "APROVADO") {
        const categoria = mapearTipoParaCategoria(solicitacao.type);
        const custo = estimarCustoPeloPreco(solicitacao.priceRange);

        await prisma.place.create({
          data: {
            name: solicitacao.name,
            city: solicitacao.city,
            category: categoria,
            description: solicitacao.description,
            address: solicitacao.address,
            costLevel: custo,
            estimatedPrice: solicitacao.priceRange || "Consultar parceiro",
            rating: 4.5,
            suggestedDurationMin: 90,
            idealTime: solicitacao.schedule || "09h às 17h",
            accessibility: solicitacao.accessibility,
            tags: criarTags(solicitacao.type, solicitacao.city),
            distanceFromCenterKm: 5,
            imageClass: imagemPorCategoria(categoria),
            approved: true,
            partnerId: solicitacao.userId,
          },
        });
      }

      const solicitacaoAtualizada = await prisma.partnerRequest.update({
        where: {
          id,
        },
        data: {
          status: "APROVADO",
        },
      });

      return NextResponse.json({
        id: solicitacaoAtualizada.id,
        status: formatarStatus(solicitacaoAtualizada.status),
        statusOriginal: solicitacaoAtualizada.status,
      });
    }

    return NextResponse.json(
      {
        error: "Ação inválida. Use aprovar ou rejeitar.",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error("Erro ao atualizar solicitação:", error);

    return NextResponse.json(
      {
        error: "Erro ao atualizar solicitação.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.partnerRequest.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("Erro ao remover solicitação:", error);

    return NextResponse.json(
      {
        error: "Erro ao remover solicitação.",
      },
      {
        status: 500,
      }
    );
  }
}
