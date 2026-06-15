import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function formatarCategoria(categoria: string) {
  const categorias: Record<string, string> = {
    PRAIA: "Praia",
    CULTURA: "Cultura",
    GASTRONOMIA: "Gastronomia",
    NATUREZA: "Natureza",
    EXPERIENCIA: "Experiência",
  };

  return categorias[categoria] ?? categoria;
}

function formatarCusto(custo: string) {
  const custos: Record<string, string> = {
    GRATUITO: "Gratuito",
    ECONOMICO: "Econômico",
    MEDIO: "Médio",
    ALTO: "Alto",
  };

  return custos[custo] ?? custo;
}

function formatarAcessibilidade(acessibilidade: string) {
  const niveis: Record<string, string> = {
    BAIXA: "Baixa",
    MEDIA: "Média",
    ALTA: "Alta",
  };

  return niveis[acessibilidade] ?? acessibilidade;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const lugar = await prisma.place.findFirst({
      where: {
        id,
        approved: true,
      },
    });

    if (!lugar) {
      return NextResponse.json(
        {
          error: "Lugar não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      id: lugar.id,
      nome: lugar.name,
      cidade: lugar.city,
      categoria: formatarCategoria(lugar.category),
      descricao: lugar.description,
      endereco: lugar.address,
      custo: formatarCusto(lugar.costLevel),
      precoEstimado: lugar.estimatedPrice,
      nota: lugar.rating,
      tempoSugeridoMin: lugar.suggestedDurationMin,
      horarioIdeal: lugar.idealTime,
      acessibilidade: formatarAcessibilidade(lugar.accessibility),
      tags: lugar.tags,
      distanciaCentroKm: lugar.distanceFromCenterKm,
      imagemClasse: lugar.imageClass,
      fotoPrincipalUrl: lugar.mainImageUrl,
      galeriaUrls: lugar.galleryImageUrls,
    });
  } catch (error) {
    console.error("Erro ao buscar lugar:", error);

    return NextResponse.json(
      {
        error: "Erro ao buscar lugar.",
      },
      {
        status: 500,
      },
    );
  }
}
