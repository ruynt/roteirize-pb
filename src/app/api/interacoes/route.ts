import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { InteractionType } from "@/generated/prisma";

const TIPOS_VALIDOS = new Set(Object.values(InteractionType));

function pesoInteracao(tipo: InteractionType) {
  const pesos: Record<InteractionType, number> = {
    VIEW: 0.8,
    DETAIL_OPENED: 1.6,
    SELECT: 3.5,
    UNSELECT: -2.5,
    CHECKIN: 5,
    CHECKIN_REMOVED: -4,
    ITINERARY_SAVED: 4,
  };

  return pesos[tipo];
}

export async function POST(request: Request) {
  try {
    const usuario = await getCurrentUser();
    const body = await request.json();
    const tipo = String(body.type ?? body.tipo ?? "VIEW").toUpperCase();
    const placeId = String(body.placeId ?? "").trim() || null;
    const anonymousId = String(body.anonymousId ?? "").trim() || null;

    if (!TIPOS_VALIDOS.has(tipo as InteractionType)) {
      return NextResponse.json(
        {
          error: "Tipo de interação inválido.",
        },
        {
          status: 400,
        }
      );
    }

    if (!usuario && !anonymousId) {
      return NextResponse.json(
        {
          error: "Informe um usuário autenticado ou identificador anônimo.",
        },
        {
          status: 400,
        }
      );
    }

    if (placeId) {
      const lugarExiste = await prisma.place.findFirst({
        where: {
          id: placeId,
          approved: true,
        },
        select: {
          id: true,
        },
      });

      if (!lugarExiste) {
        return NextResponse.json(
          {
            error: "Local não encontrado para registrar interação.",
          },
          {
            status: 404,
          }
        );
      }
    }

    const type = tipo as InteractionType;
    const pesoRecebido = Number(body.weight ?? body.peso);
    const weight = Number.isFinite(pesoRecebido) ? pesoRecebido : pesoInteracao(type);

    const interacao = await prisma.userPlaceInteraction.create({
      data: {
        type,
        weight,
        placeId,
        anonymousId,
        userId: usuario?.id ?? null,
        metadata:
          body.metadata && typeof body.metadata === "object" ? body.metadata : undefined,
      },
    });

    return NextResponse.json(
      {
        id: interacao.id,
        type: interacao.type,
        placeId: interacao.placeId,
        weight: interacao.weight,
        createdAt: interacao.createdAt,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Erro ao registrar interação:", error);

    return NextResponse.json(
      {
        error: "Erro ao registrar interação para recomendação.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const usuario = await getCurrentUser();

    if (!usuario) {
      return NextResponse.json([]);
    }

    const interacoes = await prisma.userPlaceInteraction.findMany({
      where: {
        userId: usuario.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 80,
    });

    return NextResponse.json(interacoes);
  } catch (error) {
    console.error("Erro ao buscar interações:", error);

    return NextResponse.json(
      {
        error: "Erro ao buscar interações.",
      },
      {
        status: 500,
      }
    );
  }
}
