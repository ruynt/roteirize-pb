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

const categoriasEstrategicas = [
  "Cultural",
  "Ecológico",
  "Gastronômico",
  "Histórico",
  "Religioso",
  "Aventura",
];

type IconeNome = "lock" | "star";

function Icone({
  nome,
  className = "h-5 w-5",
}: {
  nome: IconeNome;
  className?: string;
}) {
  if (nome === "star") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        aria-hidden="true"
      >
        <path d="m12 3 2.7 5.47 6.03.88-4.36 4.25 1.03 6-5.4-2.84-5.4 2.84 1.03-6-4.36-4.25 6.03-.88L12 3Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} stroke-current`}
      aria-hidden="true"
    >
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 15v2" />
    </svg>
  );
}

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

function percentual(valor: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((valor / total) * 100);
}

function textoPlural(valor: number, singular: string, plural: string) {
  return `${valor} ${valor === 1 ? singular : plural}`;
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

  const totalSolicitacoes = useMemo(() => {
    if (!dados) {
      return 0;
    }

    return (
      dados.resumo.solicitacoesPendentes +
      dados.resumo.solicitacoesAprovadas +
      dados.resumo.solicitacoesRejeitadas
    );
  }, [dados]);

  const taxaAprovacao = useMemo(() => {
    if (!dados) {
      return 0;
    }

    return percentual(dados.resumo.solicitacoesAprovadas, totalSolicitacoes);
  }, [dados, totalSolicitacoes]);

  const taxaPendencia = useMemo(() => {
    if (!dados) {
      return 0;
    }

    return percentual(dados.resumo.solicitacoesPendentes, totalSolicitacoes);
  }, [dados, totalSolicitacoes]);

  const cidadeMaisForte = dados?.porCidade[0] ?? null;
  const cidadeMenosCoberta =
    dados && dados.porCidade.length > 0
      ? dados.porCidade[dados.porCidade.length - 1]
      : null;
  const categoriaMaisForte = dados?.porCategoria[0] ?? null;

  const categoriasAusentes = useMemo(() => {
    if (!dados) {
      return [];
    }

    const categoriasAtuais = dados.porCategoria.map((item) =>
      item.categoria.toLowerCase()
    );

    return categoriasEstrategicas.filter(
      (categoria) =>
        !categoriasAtuais.some((atual) =>
          atual.includes(categoria.toLowerCase())
        )
    );
  }, [dados]);

  const oportunidades = useMemo(() => {
    if (!dados) {
      return [];
    }

    const lista: {
      titulo: string;
      descricao: string;
      prioridade: "Alta" | "Média" | "Baixa";
    }[] = [];

    if (dados.resumo.solicitacoesPendentes > 0) {
      lista.push({
        titulo: "Reduzir fila de análise",
        descricao: `${textoPlural(
          dados.resumo.solicitacoesPendentes,
          "solicitação está pendente",
          "solicitações estão pendentes"
        )}. Revisar esses cadastros pode ampliar rapidamente a oferta turística.`,
        prioridade: "Alta",
      });
    }

    if (dados.resumo.cidadesAtendidas < 5) {
      lista.push({
        titulo: "Ampliar cobertura territorial",
        descricao:
          "Poucas cidades estão representadas. A gestão pode priorizar captação de parceiros em municípios ainda pouco contemplados.",
        prioridade: "Alta",
      });
    }

    if (categoriasAusentes.length > 0) {
      lista.push({
        titulo: "Diversificar experiências",
        descricao: `Categorias estratégicas ainda pouco representadas: ${categoriasAusentes
          .slice(0, 3)
          .join(", ")}.`,
        prioridade: "Média",
      });
    }

    if (cidadeMenosCoberta && cidadeMaisForte && cidadeMaisForte.total > 1) {
      lista.push({
        titulo: `Fortalecer ${cidadeMenosCoberta.cidade}`,
        descricao: `${cidadeMenosCoberta.cidade} aparece com apenas ${textoPlural(
          cidadeMenosCoberta.total,
          "atrativo",
          "atrativos"
        )}. É uma oportunidade para equilibrar os roteiros entre cidades.`,
        prioridade: "Média",
      });
    }

    if (lista.length === 0) {
      lista.push({
        titulo: "Base turística equilibrada",
        descricao:
          "Os indicadores atuais mostram boa distribuição inicial de cidades, categorias e solicitações.",
        prioridade: "Baixa",
      });
    }

    return lista;
  }, [dados, categoriasAusentes, cidadeMenosCoberta, cidadeMaisForte]);

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
              <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
                <div className="max-w-4xl">
                  <span className="font-heading rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                    Gestão turística
                  </span>

                  <h1 className="font-heading mt-6 text-4xl font-black leading-tight md:text-6xl">
                    Painel de inteligência para apoiar decisões no turismo.
                  </h1>

                  <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
                    Acompanhe atrativos cadastrados, cidades atendidas,
                    categorias turísticas, solicitações de parceiros e
                    oportunidades para ampliar a cobertura de experiências na
                    Paraíba.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a
                      href="#indicadores"
                      className="font-heading rounded-full bg-white px-6 py-3 text-center text-sm font-black text-[#0F4C5C] transition hover:bg-[#F2C98A]"
                    >
                      Ver indicadores
                    </a>

                    <Link
                      href="/admin"
                      className="font-heading rounded-full border border-white/40 bg-white/10 px-6 py-3 text-center text-sm font-black text-white backdrop-blur transition hover:bg-white hover:text-[#0F4C5C]"
                    >
                      Analisar solicitações
                    </Link>
                  </div>

                  {usuario && (
                    <p className="mt-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                      Conectado como {usuario.name}
                    </p>
                  )}
                </div>

                <div className="rounded-[2rem] border border-white/20 bg-white/15 p-6 backdrop-blur">
                  <p className="font-heading text-sm font-bold text-white/80">
                    Diagnóstico rápido
                  </p>

                  <p className="font-heading mt-3 text-3xl font-black text-white">
                    {dados
                      ? `${dados.resumo.cidadesAtendidas} cidades`
                      : "Carregando"}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/85">
                    {dados
                      ? `${textoPlural(
                          dados.resumo.totalLocais,
                          "local cadastrado",
                          "locais cadastrados"
                        )} e ${textoPlural(
                          dados.resumo.categoriasAtivas,
                          "categoria ativa",
                          "categorias ativas"
                        )} ajudam a orientar o planejamento turístico.`
                      : "Buscando a visão consolidada da plataforma."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="indicadores" className="mx-auto max-w-7xl px-5 py-10">
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
                      {cidadeMaisForte
                        ? `${cidadeMaisForte.cidade} concentra mais registros`
                        : "Sem cidades cadastradas"}
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
                      {categoriaMaisForte
                        ? `${categoriaMaisForte.categoria} é a mais presente`
                        : "Tipos de experiências disponíveis"}
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
                      {taxaPendencia}% da fila de solicitações
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-[#10B981]/20 bg-[#10B981]/10 p-5">
                    <p className="font-heading text-sm font-black text-[#0F4C5C]">
                      Taxa de aprovação
                    </p>

                    <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
                      {taxaAprovacao}%
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#45617A]">
                      Relação entre solicitações aprovadas e o total de análises
                      registradas.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-[#F2C98A]/60 bg-[#F2C98A]/25 p-5">
                    <p className="font-heading text-sm font-black text-[#0F4C5C]">
                      Cidade com menor cobertura
                    </p>

                    <p className="font-heading mt-2 text-2xl font-black text-[#0F4C5C]">
                      {cidadeMenosCoberta?.cidade ?? "Sem dados"}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#45617A]">
                      {cidadeMenosCoberta
                        ? `${textoPlural(
                            cidadeMenosCoberta.total,
                            "registro",
                            "registros"
                          )} cadastrados.`
                        : "Ainda não há distribuição territorial suficiente."}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                    <p className="font-heading text-sm font-black text-[#0F4C5C]">
                      Categorias a desenvolver
                    </p>

                    <p className="font-heading mt-2 text-2xl font-black text-[#0F4C5C]">
                      {categoriasAusentes.length}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#45617A]">
                      {categoriasAusentes.length > 0
                        ? categoriasAusentes.slice(0, 3).join(", ")
                        : "A base atual já contempla as categorias estratégicas."}
                    </p>
                  </div>
                </div>

                <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                        Oportunidades para planejamento turístico
                      </h2>

                      <p className="mt-2 max-w-3xl text-sm leading-6 text-[#45617A]">
                        Leituras automáticas a partir dos dados cadastrados para
                        orientar ações da gestão, captação de parceiros e
                        fortalecimento de roteiros.
                      </p>
                    </div>

                    <Link
                      href="/admin"
                      className="font-heading rounded-full border border-slate-200 px-5 py-3 text-center text-sm font-bold text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
                    >
                      Ir para análise
                    </Link>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {oportunidades.map((oportunidade) => (
                      <article
                        key={oportunidade.titulo}
                        className="rounded-[1.5rem] bg-slate-50 p-5"
                      >
                        <span
                          className={
                            oportunidade.prioridade === "Alta"
                              ? "font-heading rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600"
                              : oportunidade.prioridade === "Média"
                                ? "font-heading rounded-full bg-[#F2C98A]/35 px-3 py-1 text-xs font-black text-[#0F4C5C]"
                                : "font-heading rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-black text-[#0F4C5C]"
                          }
                        >
                          Prioridade {oportunidade.prioridade}
                        </span>

                        <h3 className="font-heading mt-4 text-lg font-black text-[#0F2433]">
                          {oportunidade.titulo}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#45617A]">
                          {oportunidade.descricao}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>

                <div className="grid gap-8 xl:grid-cols-2">
                  <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                          Distribuição por cidade
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#45617A]">
                          Ajuda a identificar concentração territorial e
                          municípios com potencial de expansão.
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
                              <span className="inline-flex items-center gap-1">
                                <Icone
                                  nome="star"
                                  className="h-4 w-4 text-amber-500"
                                />
                                {local.nota.toFixed(1)}
                              </span>
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

                <section className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[1.5rem] bg-[#0F4C5C] p-5 text-white">
                    <h3 className="font-heading text-lg font-black">
                      Planejamento territorial
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/85">
                      Identifique cidades com menos atrativos cadastrados e
                      direcione ações de captação turística.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] bg-white p-5">
                    <h3 className="font-heading text-lg font-black text-[#0F2433]">
                      Desenvolvimento local
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#45617A]">
                      Acompanhe parceiros, experiências enviadas e oportunidades
                      para pequenos negócios.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] bg-white p-5">
                    <h3 className="font-heading text-lg font-black text-[#0F2433]">
                      Curadoria turística
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#45617A]">
                      Use solicitações e categorias para manter a plataforma mais
                      diversa e útil ao turista.
                    </p>
                  </div>
                </section>

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
