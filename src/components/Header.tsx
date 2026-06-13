"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Usuario = {
  id: string;
  name: string;
  email: string;
  role: "TOURIST" | "PARTNER" | "ADMIN";
};

const linksBase = [
  {
    href: "/",
    label: "Início",
  },
  {
    href: "/explorar",
    label: "Explorar",
  },
  {
    href: "/mapa",
    label: "Mapa",
  },
  {
    href: "/criar-roteiro",
    label: "Criar",
  },
  {
    href: "/roteiros-salvos",
    label: "Roteiros",
  },
  {
    href: "/passaporte",
    label: "Passaporte",
  },
  {
    href: "/parceiro",
    label: "Parceiros",
  },
];

const nomesPerfis: Record<Usuario["role"], string> = {
  TOURIST: "Turista",
  PARTNER: "Parceiro",
  ADMIN: "Gestão",
};

export default function Header() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    async function buscarUsuario() {
      try {
        const resposta = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!resposta.ok) {
          setUsuario(null);
          return;
        }

        const dados = await resposta.json();
        setUsuario(dados.user ?? null);
      } catch {
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    }

    buscarUsuario();
  }, []);

  const links = [
    ...linksBase,
    ...(usuario?.role === "PARTNER" || usuario?.role === "ADMIN"
      ? [
          {
            href: "/planos",
            label: "Planos",
          },
        ]
      : []),
    ...(usuario?.role === "ADMIN"
      ? [
          {
            href: "/admin",
            label: "Admin",
          },
          {
            href: "/secretaria",
            label: "Gestão",
          },
        ]
      : []),
  ];

  async function sair() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setUsuario(null);
    setMenuAberto(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/branding/icone-marca.png"
            alt="Roteirize PB"
            width={42}
            height={42}
            className="md:hidden"
            style={{
              width: "42px",
              height: "42px",
              objectFit: "contain",
            }}
            priority
          />

          <Image
            src="/branding/logo-header.png"
            alt="Roteirize PB"
            width={168}
            height={42}
            className="hidden md:block"
            style={{
              width: "168px",
              height: "auto",
              objectFit: "contain",
            }}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-heading rounded-full px-3 py-2 text-sm font-bold text-[#45617A] transition hover:bg-[#10B981]/10 hover:text-[#0F4C5C]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          {carregando ? (
            <span className="h-10 w-24 animate-pulse rounded-full bg-slate-100" />
          ) : usuario ? (
            <>
              <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-xs font-black text-[#0F4C5C]">
                {nomesPerfis[usuario.role]}
              </span>

              <button
                onClick={sair}
                className="font-heading rounded-full border border-slate-200 px-5 py-2 text-sm font-bold text-[#0F4C5C] transition hover:border-red-200 hover:text-red-500"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="font-heading rounded-full bg-[#0F4C5C] px-5 py-2 text-sm font-black text-white transition hover:bg-[#10B981]"
            >
              Entrar
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuAberto(!menuAberto)}
          className="font-heading rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-[#0F4C5C] xl:hidden"
        >
          Menu
        </button>
      </div>

      {menuAberto && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuAberto(false)}
                className="font-heading rounded-2xl px-4 py-3 text-sm font-bold text-[#45617A] transition hover:bg-[#10B981]/10 hover:text-[#0F4C5C]"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 border-t border-slate-100 pt-3">
              {usuario ? (
                <div className="space-y-3">
                  <p className="font-heading rounded-2xl bg-[#10B981]/10 px-4 py-3 text-sm font-black text-[#0F4C5C]">
                    {usuario.name} • {nomesPerfis[usuario.role]}
                  </p>

                  <button
                    onClick={sair}
                    className="font-heading w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-black text-[#0F4C5C]"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuAberto(false)}
                  className="font-heading block rounded-2xl bg-[#0F4C5C] px-4 py-3 text-sm font-black text-white"
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
