import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { Role } from "@/generated/prisma";
import { setAuthCookie } from "@/lib/auth";

function normalizarRole(role: unknown): Role {
  const valor = String(role ?? "TOURIST").toUpperCase();

  if (valor === "PARTNER") {
    return Role.PARTNER;
  }

  return Role.TOURIST;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const role = normalizarRole(body.role);

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Preencha nome, e-mail e senha." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha precisa ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    const usuarioExistente = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: "Já existe uma conta com este e-mail." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    await setAuthCookie(usuario);

    return NextResponse.json({
      user: usuario,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Não foi possível criar a conta." },
      { status: 500 }
    );
  }
}