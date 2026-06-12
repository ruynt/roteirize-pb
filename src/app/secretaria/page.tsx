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

type ResumoSecretaria = {
  resumo: {
    totalLocais: number;
    locaisAprovados: number;
    solicitacoesPendentes: number;
    solicitacoesAprovadas: number;
    solicitacoesRejeitadas: number;
    cidadesAtendidas: number;
    categoriasAtivas: number;
  };
  porCidade: {
    cidade: string;
    total: number;
  }[];
  porCategoria: {
    categoria: string;
    total: number;
  }[];
  melhoresLocais: {
    id: string;
    nome: string;
    cidade: string;
    categoria: string;
    nota: number;
  }[];
  solicitacoesRecentes: {
    id: string;
    nome: string;
    tipo: string;
    cidade: string;
    status: string;
    criadoEm: string;
  }[];
  atualizadoEm: string;
};

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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

export default function SecretariaPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [usuarioAutorizado, setUsuarioAutorizado] = useState(false);
  const [verificandoUsuario, setVerificandoUsuario] = useState(true);

  const [dados, setDados] = useState<ResumoSecretaria | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarIndicadores() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch("/api/secretaria/resumo", {
        cache: "no-store",
      });

      const dadosResposta = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dadosResposta.error ?? "Não foi possível carregar os indicadores."
        );
      }

      setDados(dadosResposta as ResumoSecretaria);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível carregar os indicadores.");
      }
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

        const respostaJson = await resposta.json();
        const usuarioAtual = respostaJson.user as Usuario | null;

        if (!usuarioAtual) {
          setUsuario(null);
          setUsuarioAutorizado(false);
          return;
        }

        setUsuario(usuarioAtual);

        if (usuarioAtual.role === "ADMIN") {
          setUsuarioAutorizado(true);
          await carregarIndicadores();
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

  const maiorValorCidade = useMemo(() => {
    if (!dados || dados.porCidade.length === 0) {
      return 1;
    }

    return Math.max(...dados.porCidade.map((item) => item.total), 1);
  }, [dados]);

  const maiorValorCategoria = useMemo(() => {
    if (!dados || dados.porCategoria.length === 0) {
      return 1;
    }

    return Math.max(...dados.porCategoria.map((item) => item.total), 1);
  }, [dados]);

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
          <section className="soft-grid border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-5 py-12">
              <div className="max-w-4xl">
                <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-sm font-bold text-[#0F4C5C]">
                  Gestão turística
                </span>

                <h1 className="font-heading mt-6 text-4xl font-black leading-tight text-[#0F2433] md:text-6xl">
                  Painel de indicadores para apoio à gestão do turismo.
                </h1>

                <p className="mt-5 text-lg leading-8 text-[#45617A]">
                  Acompanhe dados consolidados sobre atrativos cadastrados,
                  cidades atendidas, categorias turísticas, solicitações de
                  parceiros e locais de maior destaque na plataforma.
                </p>

                {usuario && (
                  <p className="mt-5 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-[#45617A]">
                    Conectado como {usuario.name}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-5 py-10">
            {erro && (
              <div className="rounded-[2rem] border border-red-100 bg-red-50 p-6 font-semibold text-red-600">
                {erro}
              </div>
            )}

            {carregando && (
              <div className="rounded-[2rem] border border-slate-100 bg-white p-8 text-center text-[#45617A]">
                Carregando indicadores...
              </div>
            )}

            {dados && (
              <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="card-shadow rounded-[1.5rem] bg-white p-5">
                    <p className="font-heading text-xs font-bold text-[#45617A]">
                      Locais cadastrados
                    </p>

                    <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
                      {dados.resumo.totalLocais}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-[#45617A]">
                      {dados.resumo.locaisAprovados} disponíveis para turistas
                    </p>
                  </div>

                  <div className="card-shadow rounded-[1.5rem] bg-white p-5">
                    <p className="font-heading text-xs font-bold text-[#45617A]">
                      Cidades atendidas
                    </p>

                    <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
                      {dados.resumo.cidadesAtendidas}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-[#45617A]">
                      Com locais aprovados no sistema
                    </p>
                  </div>

                  <div className="card-shadow rounded-[1.5rem] bg-white p-5">
                    <p className="font-heading text-xs font-bold text-[#45617A]">
                      Categorias ativas
                    </p>

                    <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
                      {dados.resumo.categoriasAtivas}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-[#45617A]">
                      Tipos de experiências disponíveis
                    </p>
                  </div>

                  <div className="card-shadow rounded-[1.5rem] bg-white p-5">
                    <p className="font-heading text-xs font-bold text-[#45617A]">
                      Solicitações pendentes
                    </p>

                    <p className="font-heading mt-2 text-3xl font-black text-[#F59E0B]">
                      {dados.resumo.solicitacoesPendentes}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-[#45617A]">
                      Aguardando análise da gestão
                    </p>
                  </div>
                </div>

                <div className="grid gap-8 xl:grid-cols-2">
                  <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                          Distribuição por cidade
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#45617A]">
                          Ajuda a identificar quais cidades possuem mais
                          atrativos cadastrados.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {dados.porCidade.length === 0 ? (
                        <p className="rounded-2xl bg-slate-50 p-5 text-sm text-[#45617A]">
                          Nenhuma cidade com local aprovado ainda.
                        </p>
                      ) : (
                        dados.porCidade.map((item) => {
                          const largura = Math.max(
                            8,
                            Math.round((item.total / maiorValorCidade) * 100)
                          );

                          return (
                            <div key={item.cidade}>
                              <div className="flex items-center justify-between gap-4">
                                <p className="font-heading text-sm font-bold text-[#0F4C5C]">
                                  {item.cidade}
                                </p>

                                <p className="text-sm font-bold text-[#45617A]">
                                  {item.total}
                                </p>
                              </div>

                              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-[#10B981]"
                                  style={{ width: `${largura}%` }}
                                />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </section>

                  <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6">
                    <div>
                      <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                        Distribuição por categoria
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-[#45617A]">
                        Mostra quais tipos de turismo estão mais representados
                        na plataforma.
                      </p>
                    </div>

                    <div className="mt-6 space-y-4">
                      {dados.porCategoria.length === 0 ? (
                        <p className="rounded-2xl bg-slate-50 p-5 text-sm text-[#45617A]">
                          Nenhuma categoria ativa ainda.
                        </p>
                      ) : (
                        dados.porCategoria.map((item) => {
                          const largura = Math.max(
                            8,
                            Math.round(
                              (item.total / maiorValorCategoria) * 100
                            )
                          );

                          return (
                            <div key={item.categoria}>
                              <div className="flex items-center justify-between gap-4">
                                <p className="font-heading text-sm font-bold text-[#0F4C5C]">
                                  {item.categoria}
                                </p>

                                <p className="text-sm font-bold text-[#45617A]">
                                  {item.total}
                                </p>
                              </div>

                              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-[#1E88E5]"
                                  style={{ width: `${largura}%` }}
                                />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </section>
                </div>

                <div className="grid gap-8 xl:grid-cols-2">
                  <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6">
                    <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                      Locais de maior destaque
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#45617A]">
                      Ranking dos atrativos aprovados com melhor avaliação.
                    </p>

                    <div className="mt-6 space-y-3">
                      {dados.melhoresLocais.length === 0 ? (
                        <p className="rounded-2xl bg-slate-50 p-5 text-sm text-[#45617A]">
                          Nenhum local aprovado ainda.
                        </p>
                      ) : (
                        dados.melhoresLocais.map((local, index) => (
                          <Link
                            key={local.id}
                            href={`/lugares/${local.id}`}
                            className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 transition hover:bg-[#10B981]/10"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-heading flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-sm font-black text-[#0F4C5C]">
                                {index + 1}
                              </span>

                              <div>
                                <p className="font-heading text-sm font-black text-[#0F2433]">
                                  {local.nome}
                                </p>

                                <p className="mt-1 text-xs font-semibold text-[#45617A]">
                                  {local.cidade} • {local.categoria}
                                </p>
                              </div>
                            </div>

                            <span className="font-heading rounded-full bg-white px-3 py-1 text-xs font-black text-[#0F4C5C]">
                              ★ {local.nota.toFixed(1)}
                            </span>
                          </Link>
                        ))
                      )}
                    </div>
                  </section>

                  <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                          Solicitações recentes
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#45617A]">
                          Últimos cadastros enviados por parceiros locais.
                        </p>
                      </div>

                      <Link
                        href="/admin"
                        className="font-heading rounded-full border border-slate-200 px-5 py-3 text-center text-sm font-bold text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
                      >
                        Ver análise
                      </Link>
                    </div>

                    <div className="mt-6 space-y-3">
                      {dados.solicitacoesRecentes.length === 0 ? (
                        <p className="rounded-2xl bg-slate-50 p-5 text-sm text-[#45617A]">
                          Nenhuma solicitação enviada ainda.
                        </p>
                      ) : (
                        dados.solicitacoesRecentes.map((solicitacao) => (
                          <div
                            key={solicitacao.id}
                            className="rounded-2xl bg-slate-50 p-4"
                          >
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
                            </div>

                            <p className="font-heading mt-3 text-sm font-black text-[#0F2433]">
                              {solicitacao.nome}
                            </p>

                            <p className="mt-1 text-xs font-semibold text-[#45617A]">
                              {solicitacao.cidade} • enviada em{" "}
                              {formatarData(solicitacao.criadoEm)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                </div>

                <div className="rounded-[2rem] border border-slate-100 bg-white p-5 text-sm font-semibold text-[#45617A]">
                  Última atualização: {formatarData(dados.atualizadoEm)}
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}