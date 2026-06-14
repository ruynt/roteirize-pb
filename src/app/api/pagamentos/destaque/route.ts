import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { SubscriptionStatus } from "@/generated/prisma";

const VALOR_PLANO_DESTAQUE = 2900;
const DIAS_VALIDADE = 30;

type AssinaturaFormatavel = {
  id: string;
  planName: string;
  amountCents: number;
  status: SubscriptionStatus;
  paymentMethod: string | null;
  paidAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt?: Date;
};

function somarDias(data: Date, dias: number) {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + dias);
  return novaData;
}

function assinaturaEstaAtiva(assinatura?: {
  status: SubscriptionStatus;
  expiresAt: Date | null;
} | null) {
  if (!assinatura) {
    return false;
  }

  if (assinatura.status !== SubscriptionStatus.PAGO) {
    return false;
  }

  if (!assinatura.expiresAt) {
    return false;
  }

  return assinatura.expiresAt.getTime() > Date.now();
}

function assinaturaExpirada(assinatura?: {
  status: SubscriptionStatus;
  expiresAt: Date | null;
} | null) {
  if (!assinatura) {
    return false;
  }

  if (assinatura.status !== SubscriptionStatus.PAGO) {
    return false;
  }

  if (!assinatura.expiresAt) {
    return false;
  }

  return assinatura.expiresAt.getTime() <= Date.now();
}

function formatarAssinatura(assinatura: AssinaturaFormatavel) {
  return {
    id: assinatura.id,
    planName: assinatura.planName,
    amountCents: assinatura.amountCents,
    status: assinatura.status,
    paymentMethod: assinatura.paymentMethod,
    paidAt: assinatura.paidAt?.toISOString() ?? null,
    expiresAt: assinatura.expiresAt?.toISOString() ?? null,
    createdAt: assinatura.createdAt.toISOString(),
    updatedAt: assinatura.updatedAt?.toISOString() ?? null,
    active: assinaturaEstaAtiva(assinatura),
    expired: assinaturaExpirada(assinatura),
  };
}

async function carregarResumo(userId: string) {
  const assinaturas = await prisma.partnerSubscription.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const assinaturaAtual =
    assinaturas.find((assinatura) => assinaturaEstaAtiva(assinatura)) ??
    assinaturas[0] ??
    null;

  return {
    subscription: assinaturaAtual ? formatarAssinatura(assinaturaAtual) : null,
    active: assinaturaEstaAtiva(assinaturaAtual),
    history: assinaturas.map(formatarAssinatura),
  };
}

async function validarUsuarioParceiro() {
  const usuario = await getCurrentUser();

  if (!usuario || (usuario.role !== "PARTNER" && usuario.role !== "ADMIN")) {
    return {
      usuario: null,
      resposta: NextResponse.json(
        { error: "Acesso não autorizado." },
        { status: 403 }
      ),
    };
  }

  return {
    usuario,
    resposta: null,
  };
}

export async function GET() {
  const { usuario, resposta } = await validarUsuarioParceiro();

  if (!usuario) {
    return resposta;
  }

  const resumo = await carregarResumo(usuario.id);

  return NextResponse.json(resumo);
}

export async function POST(request: NextRequest) {
  const { usuario, resposta } = await validarUsuarioParceiro();

  if (!usuario) {
    return resposta;
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

    const resumoAtual = await carregarResumo(usuario.id);
    const assinaturaAtualAtiva = resumoAtual.subscription?.active
      ? resumoAtual.subscription
      : null;

    const agora = new Date();
    const dataBase =
      assinaturaAtualAtiva?.expiresAt && new Date(assinaturaAtualAtiva.expiresAt) > agora
        ? new Date(assinaturaAtualAtiva.expiresAt)
        : agora;

    await prisma.partnerSubscription.create({
      data: {
        userId: usuario.id,
        planName: "Plano Destaque",
        amountCents: VALOR_PLANO_DESTAQUE,
        status: SubscriptionStatus.PAGO,
        paymentMethod,
        paidAt: agora,
        expiresAt: somarDias(dataBase, DIAS_VALIDADE),
      },
    });

    const resumo = await carregarResumo(usuario.id);

    return NextResponse.json({
      ...resumo,
      message: assinaturaAtualAtiva
        ? "Plano Destaque renovado com sucesso."
        : "Plano Destaque ativado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao processar plano:", error);

    return NextResponse.json(
      { error: "Não foi possível processar o plano." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const { usuario, resposta } = await validarUsuarioParceiro();

  if (!usuario) {
    return resposta;
  }

  try {
    const body = await request.json();
    const acao = String(body.acao ?? "cancelar").trim().toLowerCase();

    if (acao !== "cancelar") {
      return NextResponse.json(
        { error: "Ação inválida." },
        { status: 400 }
      );
    }

    const agora = new Date();

    await prisma.partnerSubscription.updateMany({
      where: {
        userId: usuario.id,
        status: SubscriptionStatus.PAGO,
        expiresAt: {
          gt: agora,
        },
      },
      data: {
        status: SubscriptionStatus.CANCELADO,
      },
    });

    const resumo = await carregarResumo(usuario.id);

    return NextResponse.json({
      ...resumo,
      message: "Plano Destaque cancelado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao cancelar plano:", error);

    return NextResponse.json(
      { error: "Não foi possível cancelar o plano." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const { usuario, resposta } = await validarUsuarioParceiro();

  if (!usuario) {
    return resposta;
  }

  try {
    const agora = new Date();

    await prisma.partnerSubscription.updateMany({
      where: {
        userId: usuario.id,
        status: SubscriptionStatus.PAGO,
        expiresAt: {
          gt: agora,
        },
      },
      data: {
        status: SubscriptionStatus.CANCELADO,
      },
    });

    const resumo = await carregarResumo(usuario.id);

    return NextResponse.json({
      ...resumo,
      message: "Plano Destaque cancelado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao cancelar plano:", error);

    return NextResponse.json(
      { error: "Não foi possível cancelar o plano." },
      { status: 500 }
    );
  }
}
