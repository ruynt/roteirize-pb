"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Usuario = {
  id: string;
  name: string;
  email: string;
  role: "TOURIST" | "PARTNER" | "ADMIN";
};

type IconeNome =
  | "lock"
  | "clipboard"
  | "clock"
  | "check"
  | "x"
  | "trash"
  | "refresh"
  | "plus"
  | "mapPin"
  | "user"
  | "wallet"
  | "calendar"
  | "shield"
  | "building";

type SolicitacaoParceiro = {
  id: string;
  nome: string;
  tipo: string;
  cidade: string;
  endereco: string;
  descricao: string;
  horario: string | null;
  preco: string | null;
  contato: string | null;
  acessibilidade: string;
  status: string;
  statusOriginal: string;
  criadoEm: string;
  parceiroId?: string | null;
  parceiroNome?: string | null;
  parceiroEmail?: string | null;
};

const filtros = ["Todas", "Aguardando aprovação", "Aprovado", "Rejeitado"];

function Icone({
  nome,
  className = "h-5 w-5",
}: {
  nome: IconeNome;
  className?: string;
}) {
  const classes = `${className} stroke-current`;

  if (nome === "lock") {
    return (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }

  if (nome === "clipboard") {
    return (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
        <path d="M9 5h6" />
        <path d="M9 4.5A2.5 2.5 0 0 1 11.5 2h1A2.5 2.5 0 0 1 15 4.5V6H9V4.5Z" />
        <path d="M8 5H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    );
  }

  if (nome === "clock") {
    return (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (nome === "check") {
    return (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }

  if (nome === "x") {
    return (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </svg>
    );
  }

  if (nome === "trash") {
    return (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
        <path d="M4 7h16" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M9 7V4h6v3" />
      </svg>
    );
  }

  if (nome === "refresh") {
    return (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
        <path d="M20 12a8 8 0 0 1-14.9 4" />
        <path d="M4 12A8 8 0 0 1 18.9 8" />
        <path d="M18 4v4h-4" />
        <path d="M6 20v-4h4" />
      </svg>
    );
  }

  if (nome === "plus") {
    return (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    );
  }

  if (nome === "mapPin") {
    return (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
        <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  }

  if (nome === "user") {
    return (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </svg>
    );
  }

  if (nome === "wallet") {
    return (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
        <path d="M4 7a3 3 0 0 1 3-3h11v4H7a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13V8" />
        <path d="M16 14h4" />
      </svg>
    );
  }

  if (nome === "calendar") {
    return (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="M4 10h16" />
      </svg>
    );
  }

  if (nome === "shield") {
    return (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
        <path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
      <path d="M4 21h16" />
      <path d="M6 21V7l6-4 6 4v14" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
    </svg>
  );
}

function classeStatus(status: string) {
  if (status === "Aprovado") {
    return "bg-[#10B981]/10 text-[#0F4C5C]";
  }

  if (status === "Rejeitado") {
    return "bg-red-50 text-red-600";
  }

  return "bg-[#F2C98A]/45 text-[#0F4C5C]";
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function textoProximoPasso(status: string) {
  if (status === "Aprovado") {
    return "Local aprovado e disponível para aparecer no catálogo turístico.";
  }

  if (status === "Rejeitado") {
    return "Solicitação rejeitada. O parceiro pode revisar os dados e reenviar.";
  }

  return "Solicitação aguardando curadoria. Aprove para publicar ou rejeite se precisar de ajustes.";
}

export default function AdminPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [usuarioAutorizado, setUsuarioAutorizado] = useState(false);
  const [verificandoUsuario, setVerificandoUsuario] = useState(true);

  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoParceiro[]>([]);
  const [filtro, setFiltro] = useState("Todas");
  const [carregando, setCarregando] = useState(false);
  const [processandoId, setProcessandoId] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function buscarSolicitacoes() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch("/api/solicitacoes-parceiro", {
        cache: "no-store",
      });

      if (!resposta.ok) {
        throw new Error("Erro ao buscar solicitações.");
      }

      const dados = (await resposta.json()) as SolicitacaoParceiro[];
      setSolicitacoes(dados);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar as solicitações.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    async function verificarAcesso() {
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

        if (usuarioAtual.role === "ADMIN") {
          setUsuarioAutorizado(true);
          await buscarSolicitacoes();
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

    verificarAcesso();
  }, []);

  const solicitacoesFiltradas = useMemo(() => {
    if (filtro === "Todas") {
      return solicitacoes;
    }

    return solicitacoes.filter((solicitacao) => solicitacao.status === filtro);
  }, [filtro, solicitacoes]);

  const totalPendentes = solicitacoes.filter(
    (solicitacao) => solicitacao.status === "Aguardando aprovação"
  ).length;

  const totalAprovadas = solicitacoes.filter(
    (solicitacao) => solicitacao.status === "Aprovado"
  ).length;

  const totalRejeitadas = solicitacoes.filter(
    (solicitacao) => solicitacao.status === "Rejeitado"
  ).length;

  async function atualizarSolicitacao(id: string, acao: "aprovar" | "rejeitar") {
    try {
      setProcessandoId(id);
      setMensagem("");
      setErro("");

      const resposta = await fetch(`/api/solicitacoes-parceiro/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          acao,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error ?? "Erro ao atualizar solicitação.");
      }

      await buscarSolicitacoes();

      setMensagem(
        acao === "aprovar"
          ? "Solicitação aprovada. O local agora aparece na página Explorar."
          : "Solicitação rejeitada com sucesso."
      );
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível atualizar a solicitação.");
      }
    } finally {
      setProcessandoId("");
    }
  }

  async function removerSolicitacao(id: string) {
    const confirmar = confirm("Tem certeza que deseja remover esta solicitação?");

    if (!confirmar) {
      return;
    }

    try {
      setProcessandoId(id);
      setMensagem("");
      setErro("");

      const resposta = await fetch(`/api/solicitacoes-parceiro/${id}`, {
        method: "DELETE",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error ?? "Erro ao remover solicitação.");
      }

      await buscarSolicitacoes();
      setMensagem("Solicitação removida com sucesso.");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível remover a solicitação.");
      }
    } finally {
      setProcessandoId("");
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
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-600">
              <Icone nome="lock" className="h-8 w-8" />
            </div>

            <h1 className="font-heading mt-5 text-3xl font-black text-[#0F2433]">
              Acesso restrito
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#45617A]">
              Esta área é reservada para usuários autorizados da gestão da
              plataforma.
            </p>

            {usuario && usuario.role !== "ADMIN" && (
              <p className="mx-auto mt-3 max-w-xl rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-[#45617A]">
                Você está conectado como {usuario.name}, mas esta conta não tem
                permissão para acessar este painel.
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
          <section className="hero-gradient text-white">
            <div className="mx-auto max-w-7xl px-5 py-14 md:py-16">
              <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
                <div className="max-w-4xl">
                  <span className="font-heading rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                    Painel administrativo
                  </span>

                  <h1 className="font-heading mt-6 text-4xl font-black leading-tight md:text-6xl">
                    Curadoria de experiências enviadas por parceiros.
                  </h1>

                  <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
                    Analise cadastros de parceiros locais, aprove experiências
                    para o catálogo turístico e mantenha a plataforma organizada
                    para os visitantes.
                  </p>

                  {usuario && (
                    <p className="mt-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                      Conectado como {usuario.name}
                    </p>
                  )}
                </div>

                <div className="rounded-[2rem] border border-white/20 bg-white/15 p-6 backdrop-blur">
                  <p className="font-heading text-sm font-bold text-white/80">
                    Fluxo marketplace
                  </p>

                  <p className="font-heading mt-3 text-3xl font-black text-white">
                    {totalPendentes} pendentes
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/85">
                    Aprovar uma solicitação publica a experiência no catálogo e
                    permite que ela seja usada pelos turistas nos roteiros.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-5 py-10">
            <div className="grid gap-4 md:grid-cols-4">
              <button
                type="button"
                onClick={() => setFiltro("Todas")}
                className="card-shadow rounded-[1.5rem] bg-white p-5 text-left transition hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
                  <Icone nome="clipboard" />
                </div>

                <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
                  Total
                </p>

                <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
                  {solicitacoes.length}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFiltro("Aguardando aprovação")}
                className="card-shadow rounded-[1.5rem] bg-white p-5 text-left transition hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2C98A]/35 text-[#0F4C5C]">
                  <Icone nome="clock" />
                </div>

                <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
                  Pendentes
                </p>

                <p className="font-heading mt-2 text-3xl font-black text-[#F59E0B]">
                  {totalPendentes}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFiltro("Aprovado")}
                className="card-shadow rounded-[1.5rem] bg-white p-5 text-left transition hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
                  <Icone nome="check" />
                </div>

                <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
                  Aprovadas
                </p>

                <p className="font-heading mt-2 text-3xl font-black text-[#10B981]">
                  {totalAprovadas}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFiltro("Rejeitado")}
                className="card-shadow rounded-[1.5rem] bg-white p-5 text-left transition hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <Icone nome="x" />
                </div>

                <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
                  Rejeitadas
                </p>

                <p className="font-heading mt-2 text-3xl font-black text-red-500">
                  {totalRejeitadas}
                </p>
              </button>
            </div>

            <div className="card-shadow mt-8 rounded-[2rem] border border-slate-100 bg-white p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                    Solicitações recebidas
                  </h2>

                  <p className="mt-2 text-sm text-[#45617A]">
                    Acompanhe, aprove ou rejeite os cadastros enviados pelos
                    parceiros.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <select
                    value={filtro}
                    onChange={(event) => setFiltro(event.target.value)}
                    className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold outline-none focus:border-[#10B981]"
                  >
                    {filtros.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={buscarSolicitacoes}
                    className="font-heading inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-center text-sm font-bold text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
                  >
                    <Icone nome="refresh" className="h-4 w-4" />
                    Atualizar
                  </button>

                  <Link
                    href="/parceiro"
                    className="font-heading inline-flex items-center justify-center gap-2 rounded-full bg-[#0F4C5C] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#10B981]"
                  >
                    <Icone nome="plus" className="h-4 w-4" />
                    Nova solicitação
                  </Link>
                </div>
              </div>

              {mensagem && (
                <div className="mt-6 rounded-2xl border border-[#10B981]/20 bg-[#10B981]/10 p-4 text-sm font-semibold text-[#0F4C5C]">
                  {mensagem}
                </div>
              )}

              {erro && (
                <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
                  {erro}
                </div>
              )}

              {carregando ? (
                <div className="mt-8 rounded-[2rem] bg-slate-50 p-8 text-center text-[#45617A]">
                  Carregando solicitações...
                </div>
              ) : solicitacoesFiltradas.length === 0 ? (
                <div className="mt-8 rounded-[2rem] bg-slate-50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#10B981]/10 text-[#0F4C5C]">
                    <Icone nome="clipboard" className="h-7 w-7" />
                  </div>

                  <h3 className="font-heading mt-4 text-xl font-black text-[#0F2433]">
                    Nenhuma solicitação encontrada
                  </h3>

                  <p className="mt-2 text-sm text-[#45617A]">
                    Envie uma solicitação pela área do parceiro para testar o
                    fluxo.
                  </p>
                </div>
              ) : (
                <div className="mt-8 grid gap-5">
                  {solicitacoesFiltradas.map((solicitacao) => {
                    const pendente =
                      solicitacao.status === "Aguardando aprovação";
                    const processando = processandoId === solicitacao.id;

                    return (
                      <article
                        key={solicitacao.id}
                        className="rounded-[2rem] border border-slate-100 bg-slate-50 p-5"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="max-w-3xl">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`font-heading rounded-full px-3 py-1 text-xs font-bold ${classeStatus(
                                  solicitacao.status
                                )}`}
                              >
                                {solicitacao.status}
                              </span>

                              <span className="font-heading rounded-full bg-white px-3 py-1 text-xs font-bold text-[#45617A]">
                                {solicitacao.tipo}
                              </span>

                              <span className="font-heading rounded-full bg-white px-3 py-1 text-xs font-bold text-[#45617A]">
                                {solicitacao.cidade}
                              </span>
                            </div>

                            <h3 className="font-heading mt-4 text-2xl font-black text-[#0F2433]">
                              {solicitacao.nome}
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-[#45617A]">
                              {solicitacao.descricao}
                            </p>

                            <div className="mt-4 rounded-2xl bg-white p-4">
                              <p className="font-heading text-xs font-black text-[#0F4C5C]">
                                Próximo passo
                              </p>

                              <p className="mt-1 text-xs leading-5 text-[#45617A]">
                                {textoProximoPasso(solicitacao.status)}
                              </p>
                            </div>

                            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                              <p className="flex gap-2">
                                <Icone
                                  nome="mapPin"
                                  className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4C5C]"
                                />
                                <span>
                                  <strong className="text-[#0F4C5C]">
                                    Endereço:
                                  </strong>{" "}
                                  {solicitacao.endereco}
                                </span>
                              </p>

                              <p className="flex gap-2">
                                <Icone
                                  nome="clock"
                                  className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4C5C]"
                                />
                                <span>
                                  <strong className="text-[#0F4C5C]">
                                    Horário:
                                  </strong>{" "}
                                  {solicitacao.horario || "Não informado"}
                                </span>
                              </p>

                              <p className="flex gap-2">
                                <Icone
                                  nome="wallet"
                                  className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4C5C]"
                                />
                                <span>
                                  <strong className="text-[#0F4C5C]">
                                    Preço:
                                  </strong>{" "}
                                  {solicitacao.preco || "Não informado"}
                                </span>
                              </p>

                              <p className="flex gap-2">
                                <Icone
                                  nome="user"
                                  className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4C5C]"
                                />
                                <span>
                                  <strong className="text-[#0F4C5C]">
                                    Contato:
                                  </strong>{" "}
                                  {solicitacao.contato || "Não informado"}
                                </span>
                              </p>

                              <p className="flex gap-2">
                                <Icone
                                  nome="shield"
                                  className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4C5C]"
                                />
                                <span>
                                  <strong className="text-[#0F4C5C]">
                                    Acessibilidade:
                                  </strong>{" "}
                                  {solicitacao.acessibilidade}
                                </span>
                              </p>

                              <p className="flex gap-2">
                                <Icone
                                  nome="calendar"
                                  className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4C5C]"
                                />
                                <span>
                                  <strong className="text-[#0F4C5C]">
                                    Enviada em:
                                  </strong>{" "}
                                  {formatarData(solicitacao.criadoEm)}
                                </span>
                              </p>

                              <p className="flex gap-2 md:col-span-2">
                                <Icone
                                  nome="building"
                                  className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4C5C]"
                                />
                                <span>
                                  <strong className="text-[#0F4C5C]">
                                    Parceiro:
                                  </strong>{" "}
                                  {solicitacao.parceiroNome ||
                                    solicitacao.parceiroEmail ||
                                    "Não vinculado a uma conta"}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex min-w-52 flex-col gap-3">
                            {pendente && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    atualizarSolicitacao(
                                      solicitacao.id,
                                      "aprovar"
                                    )
                                  }
                                  disabled={processando}
                                  className="font-heading inline-flex items-center justify-center gap-2 rounded-full bg-[#10B981] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0F4C5C] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  <Icone nome="check" className="h-4 w-4" />
                                  {processando ? "Aguarde..." : "Aprovar"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    atualizarSolicitacao(
                                      solicitacao.id,
                                      "rejeitar"
                                    )
                                  }
                                  disabled={processando}
                                  className="font-heading inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-black text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  <Icone nome="x" className="h-4 w-4" />
                                  Rejeitar
                                </button>
                              </>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                removerSolicitacao(solicitacao.id)
                              }
                              disabled={processando}
                              className="font-heading inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#45617A] transition hover:border-red-200 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Icone nome="trash" className="h-4 w-4" />
                              Remover
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
