"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CHAVE_LUGARES_SELECIONADOS = "roteirize_lugares_selecionados";
const CHAVE_CHECKINS = "roteirize_checkins";
const CHAVE_ROTEIROS_SALVOS = "roteirize_roteiros_salvos";

type Lugar = {
  id: string;
  nome: string;
  cidade: string;
  categoria: string;
  descricao: string;
  endereco: string;
  custo: string;
  precoEstimado: string;
  nota: number;
  tempoSugeridoMin: number;
  horarioIdeal: string;
  acessibilidade: string;
  tags: string[];
  distanciaCentroKm: number;
  imagemClasse: string;
  destaque?: boolean;
  parceiroNome?: string | null;
};

type Checkin = {
  id: string;
  nome: string;
  cidade: string;
  categoria: string;
  data: string;
};

type ParadaSalva = {
  id?: string;
  nome?: string;
  cidade?: string;
  categoria?: string;
  custo?: string;
};

type RoteiroSalvo = {
  id: string;
  titulo?: string;
  criadoEm?: string;
  parametros?: {
    cidadeBase?: string;
    orcamento?: string;
    interesses?: string[];
  };
  paradas?: ParadaSalva[];
};

type Recomendacao = {
  lugar: Lugar;
  pontuacao: number;
  motivos: string[];
};

type IconeNome = "star" | "check";

function Icone({
  nome,
  className = "h-4 w-4",
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
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} stroke-current`}
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function carregarLista<T>(chave: string): T[] {
  if (typeof window === "undefined") {
    return [];
  }

  const texto = localStorage.getItem(chave);

  if (!texto) {
    return [];
  }

  try {
    const dados = JSON.parse(texto);

    if (!Array.isArray(dados)) {
      return [];
    }

    return dados;
  } catch {
    localStorage.removeItem(chave);
    return [];
  }
}

function contarOcorrencias(lista: string[]) {
  return lista.reduce<Record<string, number>>((acumulador, item) => {
    if (!item) {
      return acumulador;
    }

    acumulador[item] = (acumulador[item] ?? 0) + 1;
    return acumulador;
  }, {});
}

function ordenarPreferencias(contagem: Record<string, number>) {
  return Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .map(([item]) => item);
}

function limitarLista<T>(lista: T[], quantidade: number) {
  return lista.slice(0, quantidade);
}

function textoQuantidade(valor: number, singular: string, plural: string) {
  return valor === 1 ? `${valor} ${singular}` : `${valor} ${plural}`;
}

function classeImagem(imagemClasse?: string) {
  const classe = String(imagemClasse ?? "").trim();

  if (!classe) {
    return "bg-gradient-to-br from-cyan-300 to-blue-500";
  }

  if (classe.includes("bg-")) {
    return classe;
  }

  return `bg-gradient-to-br ${classe}`;
}

export default function ExplorarPage() {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [lugaresSelecionados, setLugaresSelecionados] = useState<string[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [roteirosSalvos, setRoteirosSalvos] = useState<RoteiroSalvo[]>([]);

  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
  const [cidadeSelecionada, setCidadeSelecionada] = useState("Todas");
  const [custoSelecionado, setCustoSelecionado] = useState("Todos");
  const [mostrarSomenteDestaques, setMostrarSomenteDestaques] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarLugares() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await fetch("/api/lugares", {
          cache: "no-store",
        });

        if (!resposta.ok) {
          throw new Error("Erro ao carregar locais.");
        }

        const dados = (await resposta.json()) as Lugar[];
        setLugares(dados);
      } catch (error) {
        console.error(error);
        setErro("Não foi possível carregar os locais turísticos.");
      } finally {
        setCarregando(false);
      }
    }

    buscarLugares();
  }, []);

  useEffect(() => {
    setLugaresSelecionados(
      carregarLista<string>(CHAVE_LUGARES_SELECIONADOS).map(String)
    );

    setCheckins(carregarLista<Checkin>(CHAVE_CHECKINS));
    setRoteirosSalvos(carregarLista<RoteiroSalvo>(CHAVE_ROTEIROS_SALVOS));
  }, []);

  const categorias = useMemo(() => {
    return [
      "Todas",
      ...Array.from(new Set(lugares.map((lugar) => lugar.categoria))),
    ];
  }, [lugares]);

  const cidades = useMemo(() => {
    return ["Todas", ...Array.from(new Set(lugares.map((lugar) => lugar.cidade)))];
  }, [lugares]);

  const custos = useMemo(() => {
    return ["Todos", ...Array.from(new Set(lugares.map((lugar) => lugar.custo)))];
  }, [lugares]);

  const perfilUsuario = useMemo(() => {
    const categoriasCheckins = checkins.map((checkin) => checkin.categoria);
    const cidadesCheckins = checkins.map((checkin) => checkin.cidade);

    const categoriasRoteiros = roteirosSalvos.flatMap((roteiro) => {
      const categoriasParadas =
        roteiro.paradas
          ?.map((parada) => parada.categoria)
          .filter((categoria): categoria is string => Boolean(categoria)) ?? [];

      const interesses = roteiro.parametros?.interesses ?? [];

      return [...categoriasParadas, ...interesses];
    });

    const cidadesRoteiros = roteirosSalvos.flatMap((roteiro) => {
      const cidadesParadas =
        roteiro.paradas
          ?.map((parada) => parada.cidade)
          .filter((cidade): cidade is string => Boolean(cidade)) ?? [];

      const cidadeBase = roteiro.parametros?.cidadeBase;

      return cidadeBase ? [...cidadesParadas, cidadeBase] : cidadesParadas;
    });

    const custosRoteiros = roteirosSalvos.flatMap((roteiro) => {
      const custosParadas =
        roteiro.paradas
          ?.map((parada) => parada.custo)
          .filter((custo): custo is string => Boolean(custo)) ?? [];

      const orcamento = roteiro.parametros?.orcamento;

      return orcamento ? [...custosParadas, orcamento] : custosParadas;
    });

    const categoriasPreferidas = ordenarPreferencias(
      contarOcorrencias([...categoriasCheckins, ...categoriasRoteiros])
    );

    const cidadesPreferidas = ordenarPreferencias(
      contarOcorrencias([...cidadesCheckins, ...cidadesRoteiros])
    );

    const custosPreferidos = ordenarPreferencias(
      contarOcorrencias(custosRoteiros)
    );

    return {
      categoriasPreferidas,
      cidadesPreferidas,
      custosPreferidos,
      totalCheckins: checkins.length,
      totalRoteiros: roteirosSalvos.length,
      totalInteracoes: checkins.length + roteirosSalvos.length,
    };
  }, [checkins, roteirosSalvos]);

  const recomendacoes = useMemo<Recomendacao[]>(() => {
    if (lugares.length === 0) {
      return [];
    }

    const idsVisitados = new Set(checkins.map((checkin) => checkin.id));
    const idsSelecionados = new Set(lugaresSelecionados);
    const temHistorico = perfilUsuario.totalInteracoes > 0;

    const recomendacoesCalculadas = lugares
      .filter((lugar) => !idsVisitados.has(lugar.id))
      .map((lugar) => {
        let pontuacao = lugar.nota * 10;
        const motivos: string[] = [];

        if (lugar.destaque) {
          pontuacao += 8;
        }

        if (perfilUsuario.categoriasPreferidas.includes(lugar.categoria)) {
          const posicao = perfilUsuario.categoriasPreferidas.indexOf(
            lugar.categoria
          );

          pontuacao += Math.max(35 - posicao * 5, 15);
          motivos.push(`combina com seu interesse em ${lugar.categoria}`);
        }

        if (perfilUsuario.cidadesPreferidas.includes(lugar.cidade)) {
          const posicao = perfilUsuario.cidadesPreferidas.indexOf(lugar.cidade);

          pontuacao += Math.max(25 - posicao * 4, 10);
          motivos.push(
            `está em ${lugar.cidade}, cidade presente no seu histórico`
          );
        }

        if (perfilUsuario.custosPreferidos.includes(lugar.custo)) {
          pontuacao += 12;
          motivos.push("tem faixa de custo parecida com seus roteiros");
        }

        if (idsSelecionados.has(lugar.id)) {
          pontuacao += 15;
          motivos.push("você já selecionou este local para seu roteiro");
        }

        if (lugar.nota >= 4.7) {
          pontuacao += 10;
          motivos.push("possui avaliação alta");
        }

        if (lugar.acessibilidade === "Alta") {
          pontuacao += 4;
        }

        if (!temHistorico) {
          if (lugar.nota >= 4.6) {
            motivos.push("é uma opção bem avaliada para começar");
          }

          if (lugar.cidade === "João Pessoa") {
            pontuacao += 8;
            motivos.push("é uma boa porta de entrada para explorar a Paraíba");
          }
        }

        if (motivos.length === 0) {
          motivos.push("tem boa avaliação e diversifica sua experiência");
        }

        return {
          lugar,
          pontuacao,
          motivos: limitarLista(motivos, 2),
        };
      })
      .sort((a, b) => b.pontuacao - a.pontuacao);

    return limitarLista(recomendacoesCalculadas, 3);
  }, [checkins, lugares, lugaresSelecionados, perfilUsuario]);

  const totalDestaques = useMemo(() => {
    return lugares.filter((lugar) => lugar.destaque).length;
  }, [lugares]);

  const lugaresFiltrados = useMemo(() => {
    const textoBusca = busca.trim().toLowerCase();

    return lugares.filter((lugar) => {
      const combinaBusca =
        textoBusca.length === 0 ||
        lugar.nome.toLowerCase().includes(textoBusca) ||
        lugar.cidade.toLowerCase().includes(textoBusca) ||
        lugar.categoria.toLowerCase().includes(textoBusca) ||
        lugar.descricao.toLowerCase().includes(textoBusca) ||
        lugar.tags.some((tag) => tag.toLowerCase().includes(textoBusca));

      const combinaCategoria =
        categoriaSelecionada === "Todas" ||
        lugar.categoria === categoriaSelecionada;

      const combinaCidade =
        cidadeSelecionada === "Todas" || lugar.cidade === cidadeSelecionada;

      const combinaCusto =
        custoSelecionado === "Todos" || lugar.custo === custoSelecionado;

      const combinaDestaque = !mostrarSomenteDestaques || Boolean(lugar.destaque);

      return (
        combinaBusca &&
        combinaCategoria &&
        combinaCidade &&
        combinaCusto &&
        combinaDestaque
      );
    });
  }, [
    busca,
    categoriaSelecionada,
    cidadeSelecionada,
    custoSelecionado,
    mostrarSomenteDestaques,
    lugares,
  ]);

  function alternarLugarSelecionado(lugarId: string) {
    if (lugarId === "__limpar__") {
      setLugaresSelecionados([]);
      localStorage.setItem(CHAVE_LUGARES_SELECIONADOS, JSON.stringify([]));
      return;
    }

    const jaSelecionado = lugaresSelecionados.includes(lugarId);

    const novaLista = jaSelecionado
      ? lugaresSelecionados.filter((id) => id !== lugarId)
      : [...lugaresSelecionados, lugarId];

    setLugaresSelecionados(novaLista);
    localStorage.setItem(CHAVE_LUGARES_SELECIONADOS, JSON.stringify(novaLista));
  }

  function limparFiltros() {
    setBusca("");
    setCategoriaSelecionada("Todas");
    setCidadeSelecionada("Todas");
    setCustoSelecionado("Todos");
    setMostrarSomenteDestaques(false);
  }

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
            <div className="max-w-4xl">
              <span className="font-heading rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                Explorar a Paraíba
              </span>

              <h1 className="font-heading mt-6 text-4xl font-black leading-tight md:text-6xl">
                Descubra lugares, experiências e roteiros para sua viagem.
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
                Encontre praias, centros culturais, experiências gastronômicas,
                natureza e vivências locais para montar um roteiro personalizado.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/20 bg-white/15 p-6 backdrop-blur">
              <p className="font-heading text-sm font-bold text-white/80">
                Catálogo turístico
              </p>

              <p className="font-heading mt-3 text-4xl font-black text-white">
                {lugares.length}
              </p>

              <p className="mt-3 text-sm leading-6 text-white/85">
                local(is) disponíveis para explorar, selecionar e incluir em
                roteiros personalizados.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-5 md:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px_180px_auto]">
            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por local, cidade, categoria ou tag"
              className="rounded-full border border-slate-200 px-5 py-3 text-sm outline-none transition focus:border-[#10B981]"
            />

            <select
              value={categoriaSelecionada}
              onChange={(event) => setCategoriaSelecionada(event.target.value)}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold outline-none transition focus:border-[#10B981]"
            >
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>

            <select
              value={cidadeSelecionada}
              onChange={(event) => setCidadeSelecionada(event.target.value)}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold outline-none transition focus:border-[#10B981]"
            >
              {cidades.map((cidade) => (
                <option key={cidade} value={cidade}>
                  {cidade}
                </option>
              ))}
            </select>

            <select
              value={custoSelecionado}
              onChange={(event) => setCustoSelecionado(event.target.value)}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold outline-none transition focus:border-[#10B981]"
            >
              {custos.map((custo) => (
                <option key={custo} value={custo}>
                  {custo}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={limparFiltros}
              className="font-heading rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
            >
              Limpar
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMostrarSomenteDestaques(false)}
              className={
                !mostrarSomenteDestaques
                  ? "font-heading rounded-full bg-[#0F4C5C] px-4 py-2 text-xs font-black text-white"
                  : "font-heading rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
              }
            >
              Todos os locais
            </button>

            <button
              type="button"
              onClick={() => setMostrarSomenteDestaques(true)}
              disabled={totalDestaques === 0}
              className={
                mostrarSomenteDestaques
                  ? "font-heading rounded-full bg-[#F2C98A] px-4 py-2 text-xs font-black text-[#0F4C5C]"
                  : "font-heading rounded-full border border-[#F2C98A]/70 bg-[#F2C98A]/20 px-4 py-2 text-xs font-black text-[#0F4C5C] transition hover:bg-[#F2C98A]/40 disabled:cursor-not-allowed disabled:opacity-50"
              }
            >
              Locais em destaque
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-3 text-sm text-[#45617A] md:flex-row md:items-center md:justify-between">
            <p>
              {carregando
                ? "Carregando locais..."
                : `${textoQuantidade(
                    lugaresFiltrados.length,
                    "local encontrado",
                    "locais encontrados"
                  )}.`}
            </p>

            <p>
              {textoQuantidade(
                lugaresSelecionados.length,
                "local selecionado",
                "locais selecionados"
              )}{" "}
              para montar seu roteiro
              {totalDestaques > 0
                ? ` • ${textoQuantidade(
                    totalDestaques,
                    "local em destaque",
                    "locais em destaque"
                  )}`
                : ""}
              .
            </p>
          </div>
        </div>

        {erro && (
          <div className="mt-6 rounded-[2rem] border border-red-100 bg-red-50 p-6 font-semibold text-red-600">
            {erro}
          </div>
        )}

        {!carregando && recomendacoes.length > 0 && (
          <section className="card-shadow mt-8 rounded-[2rem] border border-[#10B981]/20 bg-white p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-xs font-black text-[#0F4C5C]">
                  Recomendações personalizadas
                </span>

                <h2 className="font-heading mt-4 text-2xl font-black text-[#0F2433]">
                  Recomendados para você
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#45617A]">
                  As sugestões consideram seus check-ins, roteiros salvos,
                  cidades e categorias mais frequentes para aproximar os locais
                  do seu perfil de viagem.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4 text-sm">
                <p className="font-heading font-black text-[#0F4C5C]">
                  Seu perfil
                </p>

                <p className="mt-2 text-xs leading-5 text-[#45617A]">
                  {perfilUsuario.totalInteracoes > 0
                    ? `${textoQuantidade(
                        perfilUsuario.totalCheckins,
                        "check-in",
                        "check-ins"
                      )} e ${textoQuantidade(
                        perfilUsuario.totalRoteiros,
                        "roteiro salvo",
                        "roteiros salvos"
                      )}.`
                    : "Perfil inicial baseado em locais bem avaliados."}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {recomendacoes.map((recomendacao) => {
                const selecionado = lugaresSelecionados.includes(
                  recomendacao.lugar.id
                );

                return (
                  <article
                    key={recomendacao.lugar.id}
                    className={
                      recomendacao.lugar.destaque
                        ? "overflow-hidden rounded-[1.5rem] border border-[#F2C98A] bg-white"
                        : "overflow-hidden rounded-[1.5rem] border border-slate-100 bg-slate-50"
                    }
                  >
                    <div
                      className={`${classeImagem(recomendacao.lugar.imagemClasse)} h-32 text-white`}
                    >
                      <div className="flex h-full items-start justify-between gap-3 p-4">
                        <span className="font-heading rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                          {recomendacao.lugar.categoria}
                        </span>

                        {recomendacao.lugar.destaque && (
                          <span className="font-heading rounded-full bg-[#F2C98A] px-3 py-1 text-xs font-black text-[#0F4C5C] shadow-sm">
                            Destaque
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-heading text-xl font-black text-[#0F2433]">
                        {recomendacao.lugar.nome}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-[#0F4C5C]">
                        {recomendacao.lugar.cidade}{" "}
                        <span aria-hidden="true">•</span>{" "}
                        <span className="inline-flex items-center gap-1">
                          <Icone
                            nome="star"
                            className="h-4 w-4 text-amber-500"
                          />
                          {recomendacao.lugar.nota.toFixed(1)}
                        </span>
                      </p>

                      <div className="mt-4 rounded-2xl bg-white p-4">
                        <p className="font-heading text-xs font-black text-[#0F4C5C]">
                          Por que recomendamos?
                        </p>

                        <ul className="mt-2 space-y-1 text-xs leading-5 text-[#45617A]">
                          {recomendacao.motivos.map((motivo) => (
                            <li key={motivo} className="flex gap-2">
                              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#10B981]/10 text-[#0F4C5C]">
                                <Icone nome="check" className="h-3 w-3" />
                              </span>
                              <span>{motivo}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-5 flex flex-col gap-2">
                        <Link
                          href={`/lugares/${recomendacao.lugar.id}`}
                          className="font-heading rounded-full bg-[#0F4C5C] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#10B981]"
                        >
                          Ver detalhes
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            alternarLugarSelecionado(recomendacao.lugar.id)
                          }
                          className={
                            selecionado
                              ? "font-heading rounded-full border border-[#10B981] bg-[#10B981]/10 px-5 py-3 text-sm font-black text-[#0F4C5C]"
                              : "font-heading rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
                          }
                        >
                          {selecionado ? "Selecionado" : "Adicionar ao roteiro"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {carregando ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-[2rem] bg-white"
              />
            ))}
          </div>
        ) : lugaresFiltrados.length === 0 ? (
          <div className="card-shadow mt-8 rounded-[2rem] bg-white p-8 text-center">
            <h2 className="font-heading text-2xl font-black text-[#0F2433]">
              Nenhum local encontrado
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#45617A]">
              Tente mudar os filtros ou limpar a busca para ver mais opções.
              {mostrarSomenteDestaques
                ? " Você também pode voltar para todos os locais."
                : ""}
            </p>

            <button
              type="button"
              onClick={limparFiltros}
              className="font-heading mt-6 rounded-full bg-[#0F4C5C] px-6 py-3 text-sm font-black text-white transition hover:bg-[#10B981]"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {lugaresFiltrados.map((lugar) => {
              const selecionado = lugaresSelecionados.includes(lugar.id);
              const visitado = checkins.some((checkin) => checkin.id === lugar.id);

              return (
                <article
                  key={lugar.id}
                  className={
                    lugar.destaque
                      ? "card-shadow overflow-hidden rounded-[2rem] border border-[#F2C98A] bg-white"
                      : "card-shadow overflow-hidden rounded-[2rem] border border-slate-100 bg-white"
                  }
                >
                  <div className={`${classeImagem(lugar.imagemClasse)} h-44 text-white`}>
                    <div className="flex h-full flex-col justify-between p-5">
                      <div className="flex flex-wrap gap-2">
                        <span className="font-heading rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                          {lugar.categoria}
                        </span>

                        {lugar.destaque && (
                          <span className="font-heading rounded-full bg-[#F2C98A] px-3 py-1 text-xs font-black text-[#0F4C5C] shadow-sm">
                            Destaque
                          </span>
                        )}

                        {visitado && (
                          <span className="font-heading rounded-full bg-[#10B981] px-3 py-1 text-xs font-bold text-white">
                            Check-in feito
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="font-heading text-sm font-bold text-white/90">
                          {lugar.cidade}
                        </p>

                        <h2 className="font-heading mt-1 text-2xl font-black">
                          {lugar.nome}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="line-clamp-3 text-sm leading-6 text-[#45617A]">
                      {lugar.descricao}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="font-heading text-xs font-bold text-[#45617A]">
                          Nota
                        </p>

                        <p className="font-heading mt-1 font-black text-[#0F4C5C]">
                          <span className="inline-flex items-center gap-1">
                            <Icone
                              nome="star"
                              className="h-4 w-4 text-amber-500"
                            />
                            {lugar.nota.toFixed(1)}
                          </span>
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="font-heading text-xs font-bold text-[#45617A]">
                          Custo
                        </p>

                        <p className="font-heading mt-1 font-black text-[#0F4C5C]">
                          {lugar.custo}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="font-heading text-xs font-bold text-[#45617A]">
                          Duração
                        </p>

                        <p className="font-heading mt-1 font-black text-[#0F4C5C]">
                          {lugar.tempoSugeridoMin} min
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="font-heading text-xs font-bold text-[#45617A]">
                          Acessibilidade
                        </p>

                        <p className="font-heading mt-1 font-black text-[#0F4C5C]">
                          {lugar.acessibilidade}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {lugar.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-bold text-[#0F4C5C]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                      <Link
                        href={`/lugares/${lugar.id}`}
                        className="font-heading rounded-full bg-[#0F4C5C] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#10B981]"
                      >
                        Ver detalhes
                      </Link>

                      <button
                        type="button"
                        onClick={() => alternarLugarSelecionado(lugar.id)}
                        className={
                          selecionado
                            ? "font-heading rounded-full border border-[#10B981] bg-[#10B981]/10 px-5 py-3 text-sm font-black text-[#0F4C5C]"
                            : "font-heading rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
                        }
                      >
                        {selecionado ? "Selecionado" : "Adicionar ao roteiro"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {lugaresSelecionados.length > 0 && (
          <div className="sticky bottom-5 z-30 mt-8">
            <div className="card-shadow mx-auto flex max-w-4xl flex-col gap-4 rounded-[2rem] border border-slate-100 bg-white/95 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-heading font-black text-[#0F2433]">
                  {textoQuantidade(
                    lugaresSelecionados.length,
                    "local selecionado",
                    "locais selecionados"
                  )}
                </p>

                <p className="text-sm text-[#45617A]">
                  Use sua seleção para montar um roteiro personalizado.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => alternarLugarSelecionado("__limpar__")}
                  className="font-heading rounded-full border border-slate-200 px-6 py-3 text-center text-sm font-black text-[#0F4C5C] transition hover:border-red-200 hover:text-red-500"
                >
                  Limpar seleção
                </button>

                <Link
                  href="/criar-roteiro"
                  className="font-heading rounded-full bg-[#10B981] px-6 py-3 text-center text-sm font-black text-white transition hover:bg-[#0F4C5C]"
                >
                  Criar roteiro
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
