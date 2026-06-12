import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Preencha e-mail e senha." },
        { status: 400 }
      );
    }

    const usuario = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!usuario || !usuario.passwordHash) {
      return NextResponse.json(
        { error: "E-mail ou senha inválidos." },
        { status: 401 }
      );
    }

    const senhaCorreta = await bcrypt.compare(password, usuario.passwordHash);

    if (!senhaCorreta) {
      return NextResponse.json(
        { error: "E-mail ou senha inválidos." },
        { status: 401 }
      );
    }

    const usuarioSeguro = {
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      role: usuario.role,
    };

    await setAuthCookie(usuarioSeguro);

    return NextResponse.json({
      user: usuarioSeguro,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Não foi possível fazer login." },
      { status: 500 }
    );
  }
}