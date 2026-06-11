"use client";

import Header from "@/components/Header";
import { useRouter } from "next/navigation";

const CHAVE_USUARIO = "roteirize_usuario";

const perfis = [
  {
    perfil: "TOURIST",
    perfilLabel: "Turista",
    titulo: "Entrar como turista",
    descricao:
      "Explore lugares, selecione experiências e gere roteiros personalizados.",
    destino: "/criar-roteiro",
    emoji: "🧭",
  },
  {
    perfil: "PARTNER",
    perfilLabel: "Parceiro local",
    titulo: "Entrar como parceiro",
    descricao:
      "Cadastre serviços turísticos, experiências locais, restaurantes ou guias para análise.",
    destino: "/parceiro",
    emoji: "🤝",
  },
  {
    perfil: "ADMIN",
    perfilLabel: "Administrador",
    titulo: "Entrar como administrador",
    descricao:
      "Acesse o painel para aprovar, rejeitar e gerenciar solicitações de parceiros.",
    destino: "/admin",
    emoji: "🛡️",
  },
] as const;

export default function LoginPage() {
  const router = useRouter();

  function entrarComo(perfilSelecionado: (typeof perfis)[number]) {
    localStorage.setItem(
      CHAVE_USUARIO,
      JSON.stringify({
        perfil: perfilSelecionado.perfil,
        perfilLabel: perfilSelecionado.perfilLabel,
        criadoEm: new Date().toISOString(),
      }),
    );

    router.push(perfilSelecionado.destino);
  }

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      <section className="soft-grid border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <div className="max-w-3xl">
            <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-sm font-bold text-[#0F4C5C]">
              Login simulado
            </span>

            <h1 className="font-heading mt-6 text-4xl font-black leading-tight text-[#0F2433] md:text-6xl">
              Escolha um perfil para acessar a plataforma.
            </h1>

            <p className="mt-5 text-lg leading-8 text-[#45617A]">
              Para fins de demonstração acadêmica, o Roteirize PB usa uma
              autenticação simulada. Cada perfil libera um fluxo diferente da
              aplicação.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {perfis.map((perfil) => (
            <button
              key={perfil.perfil}
              onClick={() => entrarComo(perfil)}
              className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-7 text-left transition hover:-translate-y-1 hover:border-[#10B981]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#10B981]/10 text-3xl">
                {perfil.emoji}
              </div>

              <h2 className="font-heading mt-6 text-2xl font-black text-[#0F2433]">
                {perfil.titulo}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#45617A]">
                {perfil.descricao}
              </p>

              <span className="font-heading mt-6 inline-flex rounded-full bg-[#0F4C5C] px-5 py-3 text-sm font-black text-white">
                Acessar como {perfil.perfilLabel}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-[2rem] border border-[#F2C98A] bg-[#F2C98A]/25 p-6">
          <h2 className="font-heading text-xl font-black text-[#0F4C5C]">
            Observação para apresentação
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#45617A]">
            Esta tela representa o controle de perfis da aplicação. Em uma
            versão de produção, seria substituída por autenticação real com
            e-mail, senha, sessões protegidas e permissões no servidor.
          </p>
        </div>
      </section>
    </main>
  );
}
