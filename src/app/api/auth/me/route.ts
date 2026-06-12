import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const sessao = await getCurrentUser();

  if (!sessao) {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }

  const usuario = await prisma.user.findUnique({
    where: {
      id: sessao.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!usuario) {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }

  return NextResponse.json({
    user: usuario,
  });
}