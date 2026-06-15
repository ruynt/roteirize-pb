import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { gerarRecomendacoesML, type ContextoRecomendacaoML } from "@/lib/recomendacao-ml";
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

async function carregarLugares() {
  const agora = new Date();

  const lugares = await prisma.place.findMany({
    where: {
      approved: true,
    },
    include: {
      partner: {
        select: {
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
            },
            take: 1,
          },
        },
      },
    },
  });

  return lugares.map((lugar) => ({
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
    destaque: Boolean(lugar.partner?.subscriptions.length),
    parceiroNome: lugar.partner?.name ?? null,
  }));
}

async function carregarInteracoesServidor(anonymousId?: string) {
  const usuario = await getCurrentUser();

  if (!usuario && !anonymousId) {
    return [];
  }

  const interacoes = await prisma.userPlaceInteraction.findMany({
    where: usuario
      ? {
          userId: usuario.id,
        }
      : {
          anonymousId,
        },
    select: {
      placeId: true,
      type: true,
      weight: true,
      createdAt: true,
      metadata: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 120,
  });

  return interacoes.map((interacao) => ({
    placeId: interacao.placeId,
    type: interacao.type,
    weight: interacao.weight,
    createdAt: interacao.createdAt.toISOString(),
    metadata: interacao.metadata as Record<string, unknown> | null,
  }));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const anonymousId = String(body.anonymousId ?? "").trim() || undefined;
    const contexto: ContextoRecomendacaoML = {
      checkins: Array.isArray(body.checkins) ? body.checkins : [],
      roteirosSalvos: Array.isArray(body.roteirosSalvos) ? body.roteirosSalvos : [],
      lugaresSelecionados: Array.isArray(body.lugaresSelecionados)
        ? body.lugaresSelecionados.map(String)
        : [],
      interacoes: [
        ...(Array.isArray(body.interacoes) ? body.interacoes : []),
        ...(await carregarInteracoesServidor(anonymousId)),
      ],
    };

    const lugares = await carregarLugares();
    const resultado = gerarRecomendacoesML(lugares, contexto, 6);

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Erro ao gerar recomendações:", error);

    return NextResponse.json(
      {
        error: "Erro ao gerar recomendações personalizadas.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const lugares = await carregarLugares();
    const interacoes = await carregarInteracoesServidor();
    const resultado = gerarRecomendacoesML(lugares, { interacoes }, 6);

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Erro ao gerar recomendações:", error);

    return NextResponse.json(
      {
        error: "Erro ao gerar recomendações personalizadas.",
      },
      {
        status: 500,
      }
    );
  }
}
