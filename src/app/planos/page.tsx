"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";

type Usuario = {
  id: string;
  name: string;
  email: string;
  role: "TOURIST" | "PARTNER" | "ADMIN";
};

type Assinatura = {
  id: string;
  planName: string;
  amountCents: number;
  status: "PENDENTE" | "PAGO" | "CANCELADO";
  paymentMethod: string | null;
  paidAt: string | null;
  expiresAt: string | null;
  createdAt: string;
};

function formatarMoeda(valorCentavos: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valorCentavos / 100);
}

function formatarData(data: string | null) {
  if (!data) {
    return "Não informado";
  }

  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function traduzirMetodo(metodo: string | null) {
  if (metodo === "PIX") {
    return "Pix";
  }

  if (metodo === "CARTAO") {
    return "Cartão";
  }

  return "Não informado";
}

export default function PlanosPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [usuarioAutorizado, setUsuarioAutorizado] = useState(false);
  const [verificandoUsuario, setVerificandoUsuario] = useState(true);

  const [assinatura, setAssinatura] = useState<Assinatura | null>(null);
  const [assinaturaAtiva, setAssinaturaAtiva] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"PIX" | "CARTAO">("PIX");
  const [carregando, setCarregando] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function carregarAssinatura() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch("/api/pagamentos/destaque", {
        cache: "no-store",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error ?? "Não foi possível carregar o plano.");
      }

      setAssinatura(dados.subscription ?? null);
      setAssinaturaAtiva(Boolean(dados.active));
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível carregar o plano.");
      }
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    async function verificarUsuario() {
      try {
        setVerificandoUsuario(true);

        const resposta = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!resposta.ok) {
          setUsuario(null);
          setUsuarioAutorizado(false);
          return;
        }

        const dados = await resposta.json();
        const usuarioAtual = dados.user as Usuario | null;

        if (!usuarioAtual) {
          setUsuario(null);
          setUsuarioAutorizado(false);
          return;
        }

        setUsuario(usuarioAtual);

        if (usuarioAtual.role === "PARTNER" || usuarioAtual.role === "ADMIN") {
          setUsuarioAutorizado(true);
          await carregarAssinatura();
        } else {
          setUsuarioAutorizado(false);
        }
      } catch (error) {
        console.error(error);
        setUsuario(null);
        setUsuarioAutorizado(false);
      } finally {
        setVerificandoUsuario(false);
      }
    }

    verificarUsuario();
  }, []);

  async function ativarPlano() {
    try {
      setProcessando(true);
      setErro("");
      setMensagem("");

      const resposta = await fetch("/api/pagamentos/destaque", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error ?? "Não foi possível ativar o plano.");
      }

      setAssinatura(dados.subscription);
      setAssinaturaAtiva(Boolean(dados.active));
      setMensagem("Plano Destaque ativado com sucesso em modo teste.");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível ativar o plano.");
      }
    } finally {
      setProcessando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      {verificandoUsuario && (
        <section className="mx-auto max-w-7xl px-5 py-10">
          <div className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-8 text-center">
            <h1 className="font-heading text-2xl font-black text-[#0F2433]">
              Verificando acesso...
            </h1>

            <p className="mt-3 text-sm text-[#45617A]">
              Aguarde enquanto validamos sua sessão.
            </p>
          </div>
        </section>
      )}

      {!verificandoUsuario && !usuarioAutorizado && (
        <section className="mx-auto max-w-7xl px-5 py-10">
          <div className="card-shadow rounded-[2rem] border border-red-100 bg-white p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-3xl">
              🔒
            </div>

            <h1 className="font-heading mt-5 text-3xl font-black text-[#0F2433]">
              Área exclusiva para parceiros
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#45617A]">
              Entre com uma conta de parceiro local para acessar os planos de
              destaque da plataforma.
            </p>

            {usuario && usuario.role === "TOURIST" && (
              <p className="mx-auto mt-3 max-w-xl rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-[#45617A]">
                Você está conectado como turista. Para acessar esta área, use
                uma conta de parceiro local.
              </p>
            )}

            <Link
              href="/login"
              className="font-heading mt-6 inline-flex rounded-full bg-[#0F4C5C] px-6 py-3 text-sm font-black text-white transition hover:bg-[#10B981]"
            >
              Ir para o login
            </Link>
          </div>
        </section>
      )}

      {!verificandoUsuario && usuarioAutorizado && (
        <>
          <section className="soft-grid border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-5 py-12">
              <div className="max-w-4xl">
                <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-sm font-bold text-[#0F4C5C]">
                  Planos para parceiros
                </span>

                <h1 className="font-heading mt-6 text-4xl font-black leading-tight text-[#0F2433] md:text-6xl">
                  Destaque sua experiência turística na plataforma.
                </h1>

                <p className="mt-5 text-lg leading-8 text-[#45617A]">
                  Parceiros locais podem ativar um plano de destaque para
                  aumentar a visibilidade dos seus serviços e experiências junto
                  aos turistas.
                </p>

                {usuario && (
                  <p className="mt-5 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-[#45617A]">
                    Conectado como {usuario.name}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1fr_420px]">
            <div className="space-y-6">
              {erro && (
                <div className="rounded-[2rem] border border-red-100 bg-red-50 p-6 font-semibold text-red-600">
                  {erro}
                </div>
              )}

              {mensagem && (
                <div className="rounded-[2rem] border border-[#10B981]/20 bg-[#10B981]/10 p-6 font-semibold text-[#0F4C5C]">
                  {mensagem}
                </div>
              )}

              <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <span className="font-heading rounded-full bg-[#F2C98A]/40 px-4 py-2 text-sm font-black text-[#0F4C5C]">
                      Plano Destaque
                    </span>

                    <h2 className="font-heading mt-5 text-3xl font-black text-[#0F2433]">
                      Mais visibilidade para parceiros locais
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#45617A]">
                      O plano demonstra a estrutura inicial de monetização da
                      plataforma, permitindo que parceiros locais ativem destaque
                      para seus serviços e experiências.
                    </p>
                  </div>

                  <div className="rounded-[2rem] bg-slate-50 p-5 text-center">
                    <p className="font-heading text-sm font-bold text-[#45617A]">
                      Valor teste
                    </p>

                    <p className="font-heading mt-2 text-4xl font-black text-[#0F4C5C]">
                      {formatarMoeda(2900)}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#45617A]">
                      validade de 30 dias
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="font-heading font-black text-[#0F4C5C]">
                      Destaque comercial
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#45617A]">
                      Base para destacar parceiros dentro da experiência de
                      exploração turística.
                    </p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="font-heading font-black text-[#0F4C5C]">
                      Monetização
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#45617A]">
                      Mostra uma estratégia de sustentabilidade financeira para
                      a plataforma.
                    </p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="font-heading font-black text-[#0F4C5C]">
                      Modo teste
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#45617A]">
                      Simula o fluxo de pagamento sem realizar cobranças reais.
                    </p>
                  </div>
                </div>
              </section>

              <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
                <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                  Ativar plano
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#45617A]">
                  Selecione uma forma de pagamento de teste para ativar o plano.
                </p>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("PIX")}
                    className={
                      paymentMethod === "PIX"
                        ? "rounded-3xl border border-[#10B981] bg-[#10B981]/10 p-5 text-left"
                        : "rounded-3xl border border-slate-200 bg-white p-5 text-left transition hover:border-[#10B981]"
                    }
                  >
                    <p className="font-heading font-black text-[#0F4C5C]">
                      Pix teste
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#45617A]">
                      Confirmação imediata para demonstração.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("CARTAO")}
                    className={
                      paymentMethod === "CARTAO"
                        ? "rounded-3xl border border-[#10B981] bg-[#10B981]/10 p-5 text-left"
                        : "rounded-3xl border border-slate-200 bg-white p-5 text-left transition hover:border-[#10B981]"
                    }
                  >
                    <p className="font-heading font-black text-[#0F4C5C]">
                      Cartão teste
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#45617A]">
                      Fluxo simulado de autorização de pagamento.
                    </p>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={ativarPlano}
                  disabled={processando || carregando}
                  className="font-heading mt-6 rounded-full bg-[#0F4C5C] px-6 py-4 text-sm font-black text-white transition hover:bg-[#10B981] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {processando
                    ? "Processando..."
                    : assinaturaAtiva
                    ? "Renovar Plano Destaque"
                    : "Ativar Plano Destaque"}
                </button>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6">
                <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                  Status do plano
                </h2>

                {carregando ? (
                  <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-[#45617A]">
                    Carregando assinatura...
                  </p>
                ) : assinatura ? (
                  <div className="mt-5 space-y-3">
                    <div
                      className={
                        assinaturaAtiva
                          ? "rounded-3xl bg-[#10B981]/10 p-5"
                          : "rounded-3xl bg-slate-50 p-5"
                      }
                    >
                      <p className="font-heading text-sm font-black text-[#0F4C5C]">
                        {assinaturaAtiva ? "Plano ativo" : "Plano inativo"}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#45617A]">
                        {assinatura.planName}
                      </p>
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-[#45617A]">
                      <p>
                        <strong className="text-[#0F4C5C]">Valor:</strong>{" "}
                        {formatarMoeda(assinatura.amountCents)}
                      </p>

                      <p>
                        <strong className="text-[#0F4C5C]">Pagamento:</strong>{" "}
                        {traduzirMetodo(assinatura.paymentMethod)}
                      </p>

                      <p>
                        <strong className="text-[#0F4C5C]">Ativado em:</strong>{" "}
                        {formatarData(assinatura.paidAt)}
                      </p>

                      <p>
                        <strong className="text-[#0F4C5C]">Validade:</strong>{" "}
                        {formatarData(assinatura.expiresAt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-[#45617A]">
                    Nenhum plano ativo no momento.
                  </p>
                )}
              </section>

              <section className="rounded-[2rem] border border-slate-100 bg-white p-6">
                <h3 className="font-heading text-xl font-black text-[#0F2433]">
                  Observação para apresentação
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#45617A]">
                  Este fluxo representa o módulo inicial de monetização. Em uma
                  versão de produção, ele pode ser integrado a provedores de
                  pagamento como Mercado Pago, Stripe ou outro gateway.
                </p>
              </section>
            </aside>
          </section>
        </>
      )}
    </main>
  );
}