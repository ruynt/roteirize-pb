"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Assinatura = {
  id: string;
  planName: string;
  amountCents: number;
  status: "PENDENTE" | "PAGO" | "CANCELADO";
  paymentMethod: string | null;
  paidAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  active: boolean;
  expired: boolean;
};

type ResumoPlano = {
  subscription: Assinatura | null;
  active: boolean;
  history: Assinatura[];
  message?: string;
};

type MetodoPagamento = "PIX" | "CARTAO";

function formatarValor(centavos: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(centavos / 100);
}

function formatarData(data?: string | null) {
  if (!data) {
    return "Não informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(data));
}

function formatarMetodo(metodo?: string | null) {
  if (metodo === "PIX") {
    return "PIX";
  }

  if (metodo === "CARTAO") {
    return "Cartão";
  }

  return "Não informado";
}

function formatarStatus(assinatura: Assinatura | null) {
  if (!assinatura) {
    return "Inativo";
  }

  if (assinatura.active) {
    return "Ativo";
  }

  if (assinatura.status === "CANCELADO") {
    return "Cancelado";
  }

  if (assinatura.expired) {
    return "Expirado";
  }

  if (assinatura.status === "PENDENTE") {
    return "Pendente";
  }

  return "Inativo";
}

function classeStatus(assinatura: Assinatura | null) {
  const status = formatarStatus(assinatura);

  if (status === "Ativo") {
    return "bg-[#10B981]/10 text-[#0F4C5C]";
  }

  if (status === "Cancelado" || status === "Expirado") {
    return "bg-red-50 text-red-600";
  }

  if (status === "Pendente") {
    return "bg-[#F2C98A]/30 text-[#0F4C5C]";
  }

  return "bg-slate-100 text-[#45617A]";
}

export default function PlanosPage() {
  const [resumo, setResumo] = useState<ResumoPlano>({
    subscription: null,
    active: false,
    history: [],
  });

  const [metodoPagamento, setMetodoPagamento] =
    useState<MetodoPagamento>("PIX");
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const assinaturaAtual = resumo.subscription;
  const statusAtual = formatarStatus(assinaturaAtual);
  const planoAtivo = resumo.active;

  const diasRestantes = useMemo(() => {
    if (!assinaturaAtual?.expiresAt || !assinaturaAtual.active) {
      return 0;
    }

    const diferenca =
      new Date(assinaturaAtual.expiresAt).getTime() - Date.now();

    return Math.max(0, Math.ceil(diferenca / (1000 * 60 * 60 * 24)));
  }, [assinaturaAtual]);

  async function carregarPlano() {
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

      setResumo({
        subscription: dados.subscription ?? null,
        active: Boolean(dados.active),
        history: dados.history ?? [],
      });
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
    carregarPlano();
  }, []);

  async function ativarOuRenovarPlano() {
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
          paymentMethod: metodoPagamento,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error ?? "Não foi possível processar o plano.");
      }

      setResumo({
        subscription: dados.subscription ?? null,
        active: Boolean(dados.active),
        history: dados.history ?? [],
      });

      setMensagem(dados.message ?? "Plano atualizado com sucesso.");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível processar o plano.");
      }
    } finally {
      setProcessando(false);
    }
  }

  async function cancelarPlano() {
    const confirmar = confirm(
      "Tem certeza que deseja cancelar o Plano Destaque? Seus locais deixarão de aparecer como destaque."
    );

    if (!confirmar) {
      return;
    }

    try {
      setProcessando(true);
      setErro("");
      setMensagem("");

      const resposta = await fetch("/api/pagamentos/destaque", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          acao: "cancelar",
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error ?? "Não foi possível cancelar o plano.");
      }

      setResumo({
        subscription: dados.subscription ?? null,
        active: Boolean(dados.active),
        history: dados.history ?? [],
      });

      setMensagem(dados.message ?? "Plano cancelado com sucesso.");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível cancelar o plano.");
      }
    } finally {
      setProcessando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div className="max-w-4xl">
              <span className="font-heading rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                Central do parceiro
              </span>

              <h1 className="font-heading mt-6 text-4xl font-black leading-tight md:text-6xl">
                Gerencie seu Plano Destaque.
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
                Ative, renove ou cancele a assinatura que aumenta a visibilidade
                das experiências cadastradas pelo parceiro no Roteirize PB.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#gerenciar-plano"
                  className="font-heading rounded-full bg-white px-6 py-3 text-center text-sm font-black text-[#0F4C5C] transition hover:bg-[#F2C98A]"
                >
                  Gerenciar plano
                </a>

                <Link
                  href="/parceiro"
                  className="font-heading rounded-full border border-white/40 bg-white/10 px-6 py-3 text-center text-sm font-black text-white backdrop-blur transition hover:bg-white hover:text-[#0F4C5C]"
                >
                  Cadastrar experiência
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/20 bg-white/15 p-6 backdrop-blur">
              <p className="font-heading text-sm font-bold text-white/80">
                Status atual
              </p>

              <div
                className={`mt-4 inline-flex rounded-full px-4 py-2 font-heading text-sm font-black ${classeStatus(
                  assinaturaAtual
                )}`}
              >
                {carregando ? "Carregando..." : statusAtual}
              </div>

              <p className="font-heading mt-5 text-3xl font-black text-white">
                {planoAtivo ? `${diasRestantes} dias restantes` : "Sem plano ativo"}
              </p>

              <p className="mt-3 text-sm leading-6 text-white/85">
                {planoAtivo
                  ? "Enquanto o plano estiver ativo, os locais vinculados ao parceiro podem aparecer como destaque."
                  : "Ative o plano para destacar experiências aprovadas no catálogo da plataforma."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="gerenciar-plano"
        className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1fr_420px]"
      >
        <div className="space-y-8">
          <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-xs font-black text-[#0F4C5C]">
                  Assinatura
                </span>

                <h2 className="font-heading mt-4 text-2xl font-black text-[#0F2433]">
                  Plano Destaque
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#45617A]">
                  O plano aumenta a visibilidade dos locais aprovados do
                  parceiro, exibindo o selo de destaque no catálogo enquanto a
                  assinatura estiver ativa.
                </p>
              </div>

              <div
                className={`w-fit rounded-full px-4 py-2 font-heading text-sm font-black ${classeStatus(
                  assinaturaAtual
                )}`}
              >
                {carregando ? "Carregando..." : statusAtual}
              </div>
            </div>

            {erro && (
              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
                {erro}
              </div>
            )}

            {mensagem && (
              <div className="mt-6 rounded-2xl border border-[#10B981]/20 bg-[#10B981]/10 p-4 text-sm font-semibold text-[#0F4C5C]">
                {mensagem}
              </div>
            )}

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Valor
                </p>

                <p className="font-heading mt-2 text-2xl font-black text-[#0F4C5C]">
                  {formatarValor(2900)}
                </p>

                <p className="mt-1 text-xs font-semibold text-[#45617A]">
                  por 30 dias
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Ativação
                </p>

                <p className="font-heading mt-2 text-lg font-black text-[#0F4C5C]">
                  {formatarData(assinaturaAtual?.paidAt)}
                </p>

                <p className="mt-1 text-xs font-semibold text-[#45617A]">
                  pagamento confirmado
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Validade
                </p>

                <p className="font-heading mt-2 text-lg font-black text-[#0F4C5C]">
                  {formatarData(assinaturaAtual?.expiresAt)}
                </p>

                <p className="mt-1 text-xs font-semibold text-[#45617A]">
                  {planoAtivo ? `${diasRestantes} dias restantes` : "sem validade ativa"}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Método
                </p>

                <p className="font-heading mt-2 text-lg font-black text-[#0F4C5C]">
                  {formatarMetodo(assinaturaAtual?.paymentMethod)}
                </p>

                <p className="mt-1 text-xs font-semibold text-[#45617A]">
                  pagamento em modo teste
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-[#F2C98A]/60 bg-[#F2C98A]/20 p-5">
              <h3 className="font-heading text-lg font-black text-[#0F4C5C]">
                O que o Destaque faz?
              </h3>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-4">
                  <p className="font-heading text-sm font-black text-[#0F2433]">
                    Selo visual
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#45617A]">
                    O local aprovado aparece com o selo “Destaque” no catálogo.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="font-heading text-sm font-black text-[#0F2433]">
                    Mais visibilidade
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#45617A]">
                    Locais com plano ativo são priorizados na listagem.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="font-heading text-sm font-black text-[#0F2433]">
                    Integração automática
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#45617A]">
                    Ao cancelar ou expirar, o local deixa de aparecer como destaque.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
            <h2 className="font-heading text-2xl font-black text-[#0F2433]">
              Histórico de pagamentos
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#45617A]">
              Acompanhe ativações, renovações e cancelamentos do Plano Destaque.
            </p>

            {carregando ? (
              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-3xl bg-slate-100"
                  />
                ))}
              </div>
            ) : resumo.history.length === 0 ? (
              <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-center">
                <p className="font-heading text-lg font-black text-[#0F2433]">
                  Nenhum pagamento registrado
                </p>

                <p className="mt-2 text-sm leading-6 text-[#45617A]">
                  Ative o Plano Destaque para criar o primeiro registro no
                  histórico.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {resumo.history.map((assinatura) => (
                  <article
                    key={assinatura.id}
                    className="rounded-3xl border border-slate-100 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-heading text-base font-black text-[#0F2433]">
                          {assinatura.planName} —{" "}
                          {formatarMetodo(assinatura.paymentMethod)}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-[#45617A]">
                          {formatarValor(assinatura.amountCents)} • Pago em{" "}
                          {formatarData(assinatura.paidAt)} • Válido até{" "}
                          {formatarData(assinatura.expiresAt)}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-4 py-2 font-heading text-xs font-black ${classeStatus(
                          assinatura
                        )}`}
                      >
                        {formatarStatus(assinatura)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6">
            <h2 className="font-heading text-2xl font-black text-[#0F2433]">
              Pagamento teste
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#45617A]">
              Escolha uma forma de pagamento para ativar ou renovar o Plano
              Destaque por mais 30 dias.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMetodoPagamento("PIX")}
                className={
                  metodoPagamento === "PIX"
                    ? "font-heading rounded-2xl border border-[#10B981] bg-[#10B981]/10 px-4 py-4 text-sm font-black text-[#0F4C5C]"
                    : "font-heading rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-black text-[#45617A] transition hover:border-[#10B981] hover:text-[#0F4C5C]"
                }
              >
                PIX
              </button>

              <button
                type="button"
                onClick={() => setMetodoPagamento("CARTAO")}
                className={
                  metodoPagamento === "CARTAO"
                    ? "font-heading rounded-2xl border border-[#10B981] bg-[#10B981]/10 px-4 py-4 text-sm font-black text-[#0F4C5C]"
                    : "font-heading rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-black text-[#45617A] transition hover:border-[#10B981] hover:text-[#0F4C5C]"
                }
              >
                Cartão
              </button>
            </div>

            <button
              type="button"
              onClick={ativarOuRenovarPlano}
              disabled={processando}
              className="font-heading mt-5 w-full rounded-full bg-[#10B981] px-5 py-4 text-sm font-black text-white transition hover:bg-[#0F4C5C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processando
                ? "Processando..."
                : planoAtivo
                  ? "Renovar por mais 30 dias"
                  : "Ativar Plano Destaque"}
            </button>

            {planoAtivo && (
              <button
                type="button"
                onClick={cancelarPlano}
                disabled={processando}
                className="font-heading mt-3 w-full rounded-full border border-red-100 bg-white px-5 py-4 text-sm font-black text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar plano
              </button>
            )}

            <p className="mt-4 text-xs leading-5 text-[#45617A]">
              Este fluxo simula o pagamento e ativa o plano imediatamente para
              fins de demonstração do MVP.
            </p>
          </section>

          <section className="rounded-[2rem] bg-[#0F4C5C] p-6 text-white">
            <h3 className="font-heading text-xl font-black">
              Fluxo integrado
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/85">
              O status do plano é usado automaticamente pelo catálogo. Se o plano
              estiver ativo, locais aprovados do parceiro podem aparecer como
              destaque. Se for cancelado ou expirar, o destaque é removido.
            </p>

            <Link
              href="/explorar"
              className="font-heading mt-5 inline-flex w-full justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-[#0F4C5C] transition hover:bg-[#F2C98A]"
            >
              Ver no Explorar
            </Link>
          </section>

          <section className="rounded-[2rem] border border-[#F2C98A]/60 bg-[#F2C98A]/25 p-6">
            <h3 className="font-heading text-xl font-black text-[#0F4C5C]">
              Para produção
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#45617A]">
              Em uma versão real, este fluxo poderia ser conectado a um gateway
              como Mercado Pago, PagBank ou Stripe, mantendo a mesma lógica de
              ativação do destaque.
            </p>
          </section>
        </aside>
      </section>
    </main>
  );
}
