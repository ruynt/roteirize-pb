"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
};

const filtros = ["Todas", "Aguardando aprovação", "Aprovado", "Rejeitado"];

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

export default function AdminPage() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoParceiro[]>([]);
  const [filtro, setFiltro] = useState("Todas");
  const [carregando, setCarregando] = useState(true);
  const [processandoId, setProcessandoId] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [usuarioAutorizado, setUsuarioAutorizado] = useState(false);
  const [verificandoUsuario, setVerificandoUsuario] = useState(true);

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
    const usuarioSalvo = localStorage.getItem("roteirize_usuario");

    if (!usuarioSalvo) {
      setUsuarioAutorizado(false);
      setVerificandoUsuario(false);
      return;
    }

    try {
      const usuario = JSON.parse(usuarioSalvo) as {
        perfil?: string;
      };

      if (usuario.perfil === "ADMIN") {
        setUsuarioAutorizado(true);
        buscarSolicitacoes();
      } else {
        setUsuarioAutorizado(false);
      }
    } catch {
      localStorage.removeItem("roteirize_usuario");
      setUsuarioAutorizado(false);
    } finally {
      setVerificandoUsuario(false);
    }
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
              Acesso restrito ao administrador
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#45617A]">
              Para acessar este painel, entre usando o perfil de administrador
              na tela de login.
            </p>

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
                  Painel administrativo
                </span>

                <h1 className="font-heading mt-6 text-4xl font-black leading-tight text-[#0F2433] md:text-6xl">
                  Gerencie solicitações de parceiros locais.
                </h1>

                <p className="mt-5 text-lg leading-8 text-[#45617A]">
                  Este painel reúne os cadastros enviados por parceiros locais.
                  Ao aprovar uma solicitação, o local passa a aparecer na página
                  Explorar para os turistas.
                </p>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-5 py-10">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="card-shadow rounded-[1.5rem] bg-white p-5">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Total
                </p>
                <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
                  {solicitacoes.length}
                </p>
              </div>

              <div className="card-shadow rounded-[1.5rem] bg-white p-5">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Pendentes
                </p>
                <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
                  {totalPendentes}
                </p>
              </div>

              <div className="card-shadow rounded-[1.5rem] bg-white p-5">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Aprovadas
                </p>
                <p className="font-heading mt-2 text-3xl font-black text-[#10B981]">
                  {totalAprovadas}
                </p>
              </div>

              <div className="card-shadow rounded-[1.5rem] bg-white p-5">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Rejeitadas
                </p>
                <p className="font-heading mt-2 text-3xl font-black text-red-500">
                  {totalRejeitadas}
                </p>
              </div>
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

                  <Link
                    href="/parceiro"
                    className="font-heading rounded-full border border-slate-200 px-5 py-3 text-center text-sm font-bold text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
                  >
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
                  <h3 className="font-heading text-xl font-black text-[#0F2433]">
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

                            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                              <p>
                                <strong className="text-[#0F4C5C]">
                                  Endereço:
                                </strong>{" "}
                                {solicitacao.endereco}
                              </p>

                              <p>
                                <strong className="text-[#0F4C5C]">
                                  Horário:
                                </strong>{" "}
                                {solicitacao.horario || "Não informado"}
                              </p>

                              <p>
                                <strong className="text-[#0F4C5C]">
                                  Preço:
                                </strong>{" "}
                                {solicitacao.preco || "Não informado"}
                              </p>

                              <p>
                                <strong className="text-[#0F4C5C]">
                                  Contato:
                                </strong>{" "}
                                {solicitacao.contato || "Não informado"}
                              </p>

                              <p>
                                <strong className="text-[#0F4C5C]">
                                  Acessibilidade:
                                </strong>{" "}
                                {solicitacao.acessibilidade}
                              </p>

                              <p>
                                <strong className="text-[#0F4C5C]">
                                  Enviada em:
                                </strong>{" "}
                                {formatarData(solicitacao.criadoEm)}
                              </p>
                            </div>
                          </div>

                          <div className="flex min-w-52 flex-col gap-3">
                            {pendente && (
                              <>
                                <button
                                  onClick={() =>
                                    atualizarSolicitacao(
                                      solicitacao.id,
                                      "aprovar"
                                    )
                                  }
                                  disabled={processando}
                                  className="font-heading rounded-full bg-[#10B981] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0F4C5C] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {processando ? "Aguarde..." : "Aprovar"}
                                </button>

                                <button
                                  onClick={() =>
                                    atualizarSolicitacao(
                                      solicitacao.id,
                                      "rejeitar"
                                    )
                                  }
                                  disabled={processando}
                                  className="font-heading rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-black text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  Rejeitar
                                </button>
                              </>
                            )}

                            <button
                              onClick={() =>
                                removerSolicitacao(solicitacao.id)
                              }
                              disabled={processando}
                              className="font-heading rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#45617A] transition hover:border-red-200 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
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