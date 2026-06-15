import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { SubscriptionStatus } from "@/generated/prisma";

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

export async function GET() {
  try {
    const agora = new Date();

    const lugares = await prisma.place.findMany({
      where: {
        approved: true,
      },
      include: {
        partner: {
          select: {
            id: true,
            name: true,
            subscriptions: {
              where: {
                status: SubscriptionStatus.PAGO,
                expiresAt: {
                  gt: agora,
                },
              },
              select: {
                id: true,
                expiresAt: true,
              },
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          },
        },
      },
      orderBy: [
        {
          rating: "desc",
        },
        {
          name: "asc",
        },
      ],
    });

    const lugaresFormatados = lugares.map((lugar) => {
      const destaque = Boolean(lugar.partner?.subscriptions.length);

      return {
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
        destaque,
        parceiroNome: lugar.partner?.name ?? null,
      };
    });

    const lugaresOrdenados = lugaresFormatados.sort((a, b) => {
      if (a.destaque !== b.destaque) {
        return Number(b.destaque) - Number(a.destaque);
      }

      if (a.nota !== b.nota) {
        return b.nota - a.nota;
      }

      return a.nome.localeCompare(b.nome, "pt-BR");
    });

    return NextResponse.json(lugaresOrdenados);
  } catch (error) {
    console.error("Erro ao buscar lugares:", error);

    return NextResponse.json(
      {
        error: "Erro ao buscar lugares.",
      },
      {
        status: 500,
      }
    );
  }
}
