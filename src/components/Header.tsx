"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const CHAVE_USUARIO = "roteirize_usuario";

type UsuarioLogado = {
  perfil: "TOURIST" | "PARTNER" | "ADMIN";
  perfilLabel: string;
};

const linksBase = [
  {
    label: "Início",
    href: "/",
  },
  {
    label: "Explorar",
    href: "/explorar",
  },
  {
    label: "Criar",
    href: "/criar-roteiro",
  },
  {
    label: "Roteiros",
    href: "/roteiros-salvos",
  },
  {
    label: "Passaporte",
    href: "/passaporte",
  },
  {
    label: "Parceiros",
    href: "/parceiro",
  },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem(CHAVE_USUARIO);

    if (usuarioSalvo) {
      try {
        setUsuario(JSON.parse(usuarioSalvo) as UsuarioLogado);
      } catch {
        localStorage.removeItem(CHAVE_USUARIO);
      }
    }
  }, []);

  const links = useMemo(() => {
    if (usuario?.perfil === "ADMIN") {
      return [
        ...linksBase,
        {
          label: "Admin",
          href: "/admin",
        },
      ];
    }

    return linksBase;
  }, [usuario]);

  function linkAtivo(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  function sair() {
    localStorage.removeItem(CHAVE_USUARIO);
    setUsuario(null);
    setMenuAberto(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 py-3">
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 md:grid-cols-[285px_1fr_auto]">
          <Link href="/" className="flex items-center">
            <div className="relative hidden h-14 w-[265px] md:block">
              <Image
                src="/branding/logo-header.png"
                alt="Roteirize PB"
                fill
                priority
                sizes="265px"
                className="object-contain object-left"
              />
            </div>

            <div className="relative h-14 w-14 md:hidden">
              <Image
                src="/branding/icone-marca.png"
                alt="Roteirize PB"
                fill
                priority
                sizes="56px"
                className="object-contain"
              />
            </div>
          </Link>

          <nav className="hidden items-center justify-center gap-7 text-sm font-semibold text-[#45617A] md:flex lg:gap-9">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  linkAtivo(link.href)
                    ? "font-heading whitespace-nowrap text-[#10B981]"
                    : "font-heading whitespace-nowrap transition hover:text-[#10B981]"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setMenuAberto((estadoAtual) => !estadoAtual)}
              className="font-heading rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-[#0F4C5C] md:hidden"
            >
              Menu
            </button>

            {usuario ? (
              <div className="hidden items-center gap-2 md:flex">
                <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-xs font-bold text-[#0F4C5C]">
                  {usuario.perfilLabel}
                </span>

                <button
                  onClick={sair}
                  className="font-heading rounded-full bg-[#0F4C5C] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#10B981]"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="font-heading rounded-full bg-[#0F4C5C] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#10B981] md:px-6"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>

        {menuAberto && (
          <nav className="mt-3 grid gap-2 rounded-3xl border border-slate-100 bg-white p-3 shadow-sm md:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuAberto(false)}
                className={
                  linkAtivo(link.href)
                    ? "font-heading rounded-2xl bg-[#10B981]/10 px-4 py-3 text-sm font-bold text-[#10B981]"
                    : "font-heading rounded-2xl px-4 py-3 text-sm font-bold text-[#45617A] transition hover:bg-slate-50 hover:text-[#10B981]"
                }
              >
                {link.label}
              </Link>
            ))}

            {usuario ? (
              <button
                onClick={sair}
                className="font-heading rounded-2xl bg-[#0F4C5C] px-4 py-3 text-left text-sm font-bold text-white"
              >
                Sair da conta • {usuario.perfilLabel}
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuAberto(false)}
                className="font-heading rounded-2xl bg-[#0F4C5C] px-4 py-3 text-sm font-bold text-white"
              >
                Entrar
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
