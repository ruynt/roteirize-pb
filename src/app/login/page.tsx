"use client";

import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Perfil = "TOURIST" | "PARTNER" | "ADMIN";

const destinosPorPerfil: Record<Perfil, string> = {
  TOURIST: "/criar-roteiro",
  PARTNER: "/parceiro",
  ADMIN: "/admin",
};

const nomesPerfisCadastro: Record<"TOURIST" | "PARTNER", string> = {
  TOURIST: "Turista",
  PARTNER: "Parceiro local",
};

const perfisCadastro: Array<"TOURIST" | "PARTNER"> = ["TOURIST", "PARTNER"];

export default function LoginPage() {
  const router = useRouter();

  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"TOURIST" | "PARTNER">("TOURIST");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function enviarFormulario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setCarregando(true);
      setErro("");
      setMensagem("");

      const rota =
        modo === "login" ? "/api/auth/login" : "/api/auth/register";

      const resposta = await fetch(rota, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          modo === "login"
            ? {
                email,
                password,
              }
            : {
                name,
                email,
                password,
                role,
              }
        ),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error ?? "Não foi possível autenticar.");
      }

      const perfil = dados.user.role as Perfil;

      setMensagem(
        modo === "login"
          ? "Login realizado com sucesso."
          : "Conta criada com sucesso."
      );

      router.push(destinosPorPerfil[perfil] ?? "/");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível autenticar.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      <section className="soft-grid border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <div className="max-w-3xl">
            <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-sm font-bold text-[#0F4C5C]">
              Acesso à plataforma
            </span>

            <h1 className="font-heading mt-6 text-4xl font-black leading-tight text-[#0F2433] md:text-6xl">
              Entre ou crie sua conta no Roteirize PB.
            </h1>

            <p className="mt-5 text-lg leading-8 text-[#45617A]">
              Acesse sua conta para criar roteiros, salvar viagens, acompanhar
              seu passaporte digital ou cadastrar experiências locais.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1fr_420px]">
        <div className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
          <div className="flex rounded-full bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setModo("login");
                setErro("");
                setMensagem("");
              }}
              className={
                modo === "login"
                  ? "font-heading flex-1 rounded-full bg-white px-5 py-3 text-sm font-black text-[#0F4C5C] shadow-sm"
                  : "font-heading flex-1 rounded-full px-5 py-3 text-sm font-black text-[#45617A]"
              }
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={() => {
                setModo("cadastro");
                setErro("");
                setMensagem("");
              }}
              className={
                modo === "cadastro"
                  ? "font-heading flex-1 rounded-full bg-white px-5 py-3 text-sm font-black text-[#0F4C5C] shadow-sm"
                  : "font-heading flex-1 rounded-full px-5 py-3 text-sm font-black text-[#45617A]"
              }
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={enviarFormulario} className="mt-8 space-y-5">
            {modo === "cadastro" && (
              <div>
                <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                  Nome
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ex: Maria Silva"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
                />
              </div>
            )}

            <div>
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                E-mail
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@email.com"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                Senha
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              />
            </div>

            {modo === "cadastro" && (
              <div>
                <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                  Tipo de conta
                </label>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {perfisCadastro.map((perfil) => (
                    <button
                      key={perfil}
                      type="button"
                      onClick={() => setRole(perfil)}
                      className={
                        role === perfil
                          ? "rounded-2xl border border-[#10B981] bg-[#10B981]/10 p-4 text-left"
                          : "rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-[#10B981]"
                      }
                    >
                      <p className="font-heading text-sm font-black text-[#0F4C5C]">
                        {nomesPerfisCadastro[perfil]}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-[#45617A]">
                        {perfil === "TOURIST"
                          ? "Crie roteiros, salve viagens e acompanhe seu passaporte digital."
                          : "Cadastre locais, serviços e experiências para análise da plataforma."}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {erro && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
                {erro}
              </div>
            )}

            {mensagem && (
              <div className="rounded-2xl border border-[#10B981]/20 bg-[#10B981]/10 p-4 text-sm font-semibold text-[#0F4C5C]">
                {mensagem}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="font-heading w-full rounded-full bg-[#0F4C5C] px-6 py-4 text-sm font-black text-white transition hover:bg-[#10B981] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando
                ? "Aguarde..."
                : modo === "login"
                ? "Entrar"
                : "Criar conta"}
            </button>
          </form>
        </div>

        <aside className="card-shadow h-fit rounded-[2rem] border border-slate-100 bg-white p-6">
          <h2 className="font-heading text-2xl font-black text-[#0F2433]">
            O que você pode fazer
          </h2>

          <div className="mt-5 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="font-heading font-black text-[#0F4C5C]">
                Planejar viagens
              </p>

              <p className="mt-2 text-sm leading-6 text-[#45617A]">
                Monte roteiros personalizados conforme cidade, tempo disponível,
                orçamento, ritmo e interesses.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="font-heading font-black text-[#0F4C5C]">
                Salvar roteiros
              </p>

              <p className="mt-2 text-sm leading-6 text-[#45617A]">
                Guarde sugestões de viagem e acesse seus roteiros salvos quando
                quiser.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="font-heading font-black text-[#0F4C5C]">
                Cadastrar experiências
              </p>

              <p className="mt-2 text-sm leading-6 text-[#45617A]">
                Parceiros locais podem enviar atrativos, serviços e experiências
                para análise da plataforma.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}