import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { SubscriptionStatus } from "@/generated/prisma";

const VALOR_PLANO_DESTAQUE = 2900;

function somarDias(data: Date, dias: number) {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + dias);
  return novaData;
}

function formatarAssinatura(assinatura: {
  id: string;
  planName: string;
  amountCents: number;
  status: SubscriptionStatus;
  paymentMethod: string | null;
  paidAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
}) {
  return {
    id: assinatura.id,
    planName: assinatura.planName,
    amountCents: assinatura.amountCents,
    status: assinatura.status,
    paymentMethod: assinatura.paymentMethod,
    paidAt: assinatura.paidAt?.toISOString() ?? null,
    expiresAt: assinatura.expiresAt?.toISOString() ?? null,
    createdAt: assinatura.createdAt.toISOString(),
  };
}

function assinaturaEstaAtiva(assinatura: {
  status: SubscriptionStatus;
  expiresAt: Date | null;
}) {
  if (assinatura.status !== SubscriptionStatus.PAGO) {
    return false;
  }

  if (!assinatura.expiresAt) {
    return false;
  }

  return assinatura.expiresAt.getTime() > Date.now();
}

export async function GET() {
  const usuario = await getCurrentUser();

  if (!usuario || (usuario.role !== "PARTNER" && usuario.role !== "ADMIN")) {
    return NextResponse.json(
      { error: "Acesso não autorizado." },
      { status: 403 }
    );
  }

  const assinatura = await prisma.partnerSubscription.findFirst({
    where: {
      userId: usuario.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!assinatura) {
    return NextResponse.json({
      subscription: null,
      active: false,
    });
  }

  return NextResponse.json({
    subscription: formatarAssinatura(assinatura),
    active: assinaturaEstaAtiva(assinatura),
  });
}

export async function POST(request: NextRequest) {
  const usuario = await getCurrentUser();

  if (!usuario || (usuario.role !== "PARTNER" && usuario.role !== "ADMIN")) {
    return NextResponse.json(
      { error: "Acesso não autorizado." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const paymentMethod = String(body.paymentMethod ?? "").trim().toUpperCase();

    if (paymentMethod !== "PIX" && paymentMethod !== "CARTAO") {
      return NextResponse.json(
        { error: "Selecione uma forma de pagamento válida." },
        { status: 400 }
      );
    }

    const agora = new Date();

    const assinatura = await prisma.partnerSubscription.create({
      data: {
        userId: usuario.id,
        planName: "Plano Destaque",
        amountCents: VALOR_PLANO_DESTAQUE,
        status: SubscriptionStatus.PAGO,
        paymentMethod,
        paidAt: agora,
        expiresAt: somarDias(agora, 30),
      },
    });

    return NextResponse.json({
      subscription: formatarAssinatura(assinatura),
      active: true,
      message: "Plano Destaque ativado com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Não foi possível processar o pagamento." },
      { status: 500 }
    );
  }
}