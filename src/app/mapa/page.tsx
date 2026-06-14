"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CHAVE_LUGARES_SELECIONADOS = "roteirize_lugares_selecionados";

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
};

type ModoTransporte = "driving" | "walking" | "bicycling" | "transit";

const nomesModos: Record<ModoTransporte, string> = {
  driving: "Carro",
  walking: "A pé",
  bicycling: "Bicicleta",
  transit: "Transporte público",
};

function IconeEstrela({ className = "h-4 w-4" }: { className?: string }) {
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

function textoQuantidade(valor: number, singular: string, plural: string) {
  return valor === 1 ? `${valor} ${singular}` : `${valor} ${plural}`;
}

function montarEndereco(lugar: Lugar) {
  return `${lugar.endereco}, ${lugar.cidade}, Paraíba`;
}

function carregarSelecionados() {
  if (typeof window === "undefined") {
    return [];
  }

  const texto = localStorage.getItem(CHAVE_LUGARES_SELECIONADOS);

  if (!texto) {
    return [];
  }

  try {
    const dados = JSON.parse(texto);

    if (!Array.isArray(dados)) {
      return [];
    }

    return dados.map(String);
  } catch {
    localStorage.removeItem(CHAVE_LUGARES_SELECIONADOS);
    return [];
  }
}

function montarLinkRotaGoogle(lugares: Lugar[], modo: ModoTransporte) {
  if (lugares.length === 0) {
    return "https://www.google.com/maps";
  }

  if (lugares.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      montarEndereco(lugares[0]),
    )}`;
  }

  const origem = encodeURIComponent(montarEndereco(lugares[0]));
  const destino = encodeURIComponent(
    montarEndereco(lugares[lugares.length - 1]),
  );

  const intermediarios = lugares
    .slice(1, -1)
    .map((lugar) => montarEndereco(lugar))
    .join("|");

  const waypoints = intermediarios
    ? `&waypoints=${encodeURIComponent(intermediarios)}`
    : "";

  return `https://www.google.com/maps/dir/?api=1&origin=${origem}&destination=${destino}${waypoints}&travelmode=${modo}`;
}

function montarSrcMapa(lugaresRota: Lugar[], lugarFoco: Lugar | null) {
  const lugarPrincipal = lugaresRota[0] ?? lugarFoco;

  if (!lugarPrincipal) {
    return "https://www.google.com/maps?q=Paraíba,Brasil&output=embed";
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(
    montarEndereco(lugarPrincipal),
  )}&output=embed`;
}

export default function MapaPage() {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [lugaresSelecionadosIds, setLugaresSelecionadosIds] = useState<
    string[]
  >([]);
  const [lugarFocoId, setLugarFocoId] = useState("");
  const [busca, setBusca] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState("Todas");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
  const [modoTransporte, setModoTransporte] =
    useState<ModoTransporte>("driving");
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

        const selecionadosSalvos = carregarSelecionados();
        setLugaresSelecionadosIds(selecionadosSalvos);

        if (selecionadosSalvos.length > 0) {
          setLugarFocoId(selecionadosSalvos[0]);
        } else if (dados.length > 0) {
          setLugarFocoId(dados[0].id);
        }
      } catch (error) {
        console.error(error);
        setErro("Não foi possível carregar os locais no mapa.");
      } finally {
        setCarregando(false);
      }
    }

    buscarLugares();
  }, []);

  const cidades = useMemo(() => {
    return [
      "Todas",
      ...Array.from(new Set(lugares.map((lugar) => lugar.cidade))),
    ];
  }, [lugares]);

  const categorias = useMemo(() => {
    return [
      "Todas",
      ...Array.from(new Set(lugares.map((lugar) => lugar.categoria))),
    ];
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

      const combinaCidade =
        cidadeSelecionada === "Todas" || lugar.cidade === cidadeSelecionada;

      const combinaCategoria =
        categoriaSelecionada === "Todas" ||
        lugar.categoria === categoriaSelecionada;

      return combinaBusca && combinaCidade && combinaCategoria;
    });
  }, [busca, cidadeSelecionada, categoriaSelecionada, lugares]);

  const lugaresSelecionados = useMemo(() => {
    return lugaresSelecionadosIds
      .map((id) => lugares.find((lugar) => lugar.id === id))
      .filter((lugar): lugar is Lugar => Boolean(lugar));
  }, [lugares, lugaresSelecionadosIds]);

  const lugarFoco = useMemo(() => {
    return (
      lugares.find((lugar) => lugar.id === lugarFocoId) ??
      lugaresSelecionados[0] ??
      lugaresFiltrados[0] ??
      null
    );
  }, [lugarFocoId, lugares, lugaresFiltrados, lugaresSelecionados]);

  const tempoTotalVisita = lugaresSelecionados.reduce((total, lugar) => {
    return total + lugar.tempoSugeridoMin;
  }, 0);

  const cidadesDaRota = Array.from(
    new Set(lugaresSelecionados.map((lugar) => lugar.cidade)),
  );

  const categoriasDaRota = Array.from(
    new Set(lugaresSelecionados.map((lugar) => lugar.categoria)),
  );

  const linkRotaGoogle = montarLinkRotaGoogle(
    lugaresSelecionados,
    modoTransporte,
  );
  const srcMapa = montarSrcMapa(lugaresSelecionados, lugarFoco);

  function salvarSelecionados(novaLista: string[]) {
    setLugaresSelecionadosIds(novaLista);
    localStorage.setItem(CHAVE_LUGARES_SELECIONADOS, JSON.stringify(novaLista));
  }

  function adicionarParada(lugarId: string) {
    if (lugaresSelecionadosIds.includes(lugarId)) {
      setLugarFocoId(lugarId);
      return;
    }

    salvarSelecionados([...lugaresSelecionadosIds, lugarId]);
    setLugarFocoId(lugarId);
  }

  function removerParada(lugarId: string) {
    salvarSelecionados(lugaresSelecionadosIds.filter((id) => id !== lugarId));
  }

  function moverParada(lugarId: string, direcao: "subir" | "descer") {
    const indiceAtual = lugaresSelecionadosIds.indexOf(lugarId);

    if (indiceAtual === -1) {
      return;
    }

    const novoIndice = direcao === "subir" ? indiceAtual - 1 : indiceAtual + 1;

    if (novoIndice < 0 || novoIndice >= lugaresSelecionadosIds.length) {
      return;
    }

    const novaLista = [...lugaresSelecionadosIds];
    const itemAtual = novaLista[indiceAtual];

    novaLista[indiceAtual] = novaLista[novoIndice];
    novaLista[novoIndice] = itemAtual;

    salvarSelecionados(novaLista);
  }

  function limparRota() {
    salvarSelecionados([]);
  }

  function limparFiltros() {
    setBusca("");
    setCidadeSelecionada("Todas");
    setCategoriaSelecionada("Todas");
  }

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:py-16">
          <div className="max-w-4xl">
            <span className="font-heading rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
              Planejador geográfico
            </span>

            <h1 className="font-heading mt-6 text-4xl font-black leading-tight md:text-6xl">
              Monte uma rota turística no mapa.
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
              Escolha locais, organize a ordem das paradas e abra o trajeto no
              Google Maps. Esta tela complementa o catálogo Explorar com uma
              visão voltada ao deslocamento.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-6 xl:grid-cols-[360px_1fr_360px]">
          <aside className="card-shadow h-fit rounded-[2rem] border border-slate-100 bg-white p-5">
            <h2 className="font-heading text-xl font-black text-[#0F2433]">
              Encontrar paradas
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#45617A]">
              Filtre os locais e adicione pontos à rota.
            </p>

            <div className="mt-5 space-y-3">
              <input
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar local ou tag"
                className="w-full rounded-full border border-slate-200 px-5 py-3 text-sm outline-none transition focus:border-[#10B981]"
              />

              <select
                value={cidadeSelecionada}
                onChange={(event) => setCidadeSelecionada(event.target.value)}
                className="w-full rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold outline-none transition focus:border-[#10B981]"
              >
                {cidades.map((cidade) => (
                  <option key={cidade} value={cidade}>
                    {cidade}
                  </option>
                ))}
              </select>

              <select
                value={categoriaSelecionada}
                onChange={(event) =>
                  setCategoriaSelecionada(event.target.value)
                }
                className="w-full rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold outline-none transition focus:border-[#10B981]"
              >
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={limparFiltros}
                className="font-heading w-full rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
              >
                Limpar filtros
              </button>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-5">
              <p className="text-sm font-semibold text-[#45617A]">
                {carregando
                  ? "Carregando locais..."
                  : textoQuantidade(
                      lugaresFiltrados.length,
                      "local disponível",
                      "locais disponíveis",
                    )}
              </p>

              {erro && (
                <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
                  {erro}
                </div>
              )}

              <div className="mt-4 max-h-[620px] space-y-3 overflow-y-auto pr-1">
                {lugaresFiltrados.map((lugar) => {
                  const estaNaRota = lugaresSelecionadosIds.includes(lugar.id);
                  const estaEmFoco = lugarFoco?.id === lugar.id;

                  return (
                    <article
                      key={lugar.id}
                      className={
                        estaEmFoco
                          ? "rounded-3xl border border-[#10B981] bg-[#10B981]/10 p-4"
                          : "rounded-3xl border border-slate-100 bg-slate-50 p-4"
                      }
                    >
                      <button
                        type="button"
                        onClick={() => setLugarFocoId(lugar.id)}
                        className="w-full text-left"
                      >
                        <p className="font-heading text-sm font-black text-[#0F2433]">
                          {lugar.nome}
                        </p>

                        <p className="mt-1 text-xs font-bold text-[#0F4C5C]">
                          {lugar.cidade} • {lugar.categoria}
                        </p>

                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#45617A]">
                          {lugar.endereco}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => adicionarParada(lugar.id)}
                        className={
                          estaNaRota
                            ? "font-heading mt-3 w-full rounded-full border border-[#10B981] bg-white px-4 py-2 text-xs font-black text-[#0F4C5C]"
                            : "font-heading mt-3 w-full rounded-full bg-[#0F4C5C] px-4 py-2 text-xs font-black text-white transition hover:bg-[#10B981]"
                        }
                      >
                        {estaNaRota ? "Na rota" : "Adicionar à rota"}
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className="space-y-5">
            <div className="card-shadow overflow-hidden rounded-[2rem] border border-slate-100 bg-white">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                    Visualização da rota
                  </h2>

                  <p className="mt-1 text-sm text-[#45617A]">
                    {lugaresSelecionados.length >= 2
                      ? "O botão de rota abre o trajeto entre as paradas selecionadas."
                      : "Selecione pelo menos duas paradas para formar uma rota."}
                  </p>
                </div>

                <select
                  value={modoTransporte}
                  onChange={(event) =>
                    setModoTransporte(event.target.value as ModoTransporte)
                  }
                  className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-[#0F4C5C] outline-none transition focus:border-[#10B981]"
                >
                  {Object.entries(nomesModos).map(([valor, nome]) => (
                    <option key={valor} value={valor}>
                      {nome}
                    </option>
                  ))}
                </select>
              </div>

              <iframe
                title="Mapa da rota turística"
                src={srcMapa}
                className="h-[540px] w-full border-0"
                loading="lazy"
              />
            </div>

            {lugarFoco && (
              <section className="card-shadow overflow-hidden rounded-[2rem] border border-slate-100 bg-white">
                <div className={`${lugarFoco.imagemClasse} p-6 text-white`}>
                  <div className="flex flex-wrap gap-2">
                    <span className="font-heading rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      {lugarFoco.categoria}
                    </span>

                    <span className="font-heading rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      {lugarFoco.cidade}
                    </span>

                    <span className="font-heading rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      <span className="inline-flex items-center gap-1">
                        <IconeEstrela className="h-4 w-4 text-amber-400" />
                        {lugarFoco.nota.toFixed(1)}
                      </span>
                    </span>
                  </div>

                  <h3 className="font-heading mt-4 text-3xl font-black">
                    {lugarFoco.nome}
                  </h3>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-white/90">
                    {lugarFoco.descricao}
                  </p>
                </div>

                <div className="grid gap-4 p-5 md:grid-cols-3">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="font-heading text-xs font-bold text-[#45617A]">
                      Endereço
                    </p>

                    <p className="mt-2 text-sm font-semibold leading-6 text-[#0F4C5C]">
                      {lugarFoco.endereco}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="font-heading text-xs font-bold text-[#45617A]">
                      Horário ideal
                    </p>

                    <p className="mt-2 text-sm font-semibold leading-6 text-[#0F4C5C]">
                      {lugarFoco.horarioIdeal}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="font-heading text-xs font-bold text-[#45617A]">
                      Tempo de visita
                    </p>

                    <p className="mt-2 text-sm font-semibold leading-6 text-[#0F4C5C]">
                      {lugarFoco.tempoSugeridoMin} minutos
                    </p>
                  </div>
                </div>
              </section>
            )}
          </section>

          <aside className="card-shadow h-fit rounded-[2rem] border border-slate-100 bg-white p-5">
            <h2 className="font-heading text-xl font-black text-[#0F2433]">
              Rota selecionada
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#45617A]">
              Organize a ordem das paradas antes de abrir a rota.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Paradas
                </p>

                <p className="font-heading mt-1 text-2xl font-black text-[#0F4C5C]">
                  {lugaresSelecionados.length}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Visita
                </p>

                <p className="font-heading mt-1 text-2xl font-black text-[#0F4C5C]">
                  {tempoTotalVisita} min
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Cidades
                </p>

                <p className="font-heading mt-1 text-2xl font-black text-[#0F4C5C]">
                  {cidadesDaRota.length}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Categorias
                </p>

                <p className="font-heading mt-1 text-2xl font-black text-[#0F4C5C]">
                  {categoriasDaRota.length}
                </p>
              </div>
            </div>

            {lugaresSelecionados.length === 0 ? (
              <div className="mt-5 rounded-3xl bg-[#F2C98A]/25 p-5">
                <p className="font-heading text-base font-black text-[#0F4C5C]">
                  Nenhuma parada ainda
                </p>

                <p className="mt-2 text-sm leading-6 text-[#45617A]">
                  Adicione locais pela lista para formar uma rota turística.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {lugaresSelecionados.map((lugar, indice) => (
                  <article
                    key={lugar.id}
                    className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F4C5C] font-heading text-sm font-black text-white">
                        {indice + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => setLugarFocoId(lugar.id)}
                          className="w-full text-left"
                        >
                          <p className="font-heading text-sm font-black text-[#0F2433]">
                            {lugar.nome}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-[#0F4C5C]">
                            {lugar.cidade} • {lugar.categoria}
                          </p>
                        </button>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => moverParada(lugar.id, "subir")}
                            disabled={indice === 0}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-[#45617A] disabled:opacity-40"
                          >
                            Subir
                          </button>

                          <button
                            type="button"
                            onClick={() => moverParada(lugar.id, "descer")}
                            disabled={indice === lugaresSelecionados.length - 1}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-[#45617A] disabled:opacity-40"
                          >
                            Descer
                          </button>

                          <button
                            type="button"
                            onClick={() => removerParada(lugar.id)}
                            className="rounded-full border border-red-100 bg-white px-3 py-1 text-xs font-bold text-red-500"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-3">
              <a
                href={linkRotaGoogle}
                target="_blank"
                rel="noreferrer"
                className={
                  lugaresSelecionados.length === 0
                    ? "font-heading pointer-events-none block rounded-full bg-slate-200 px-5 py-3 text-center text-sm font-black text-slate-400"
                    : "font-heading block rounded-full bg-[#10B981] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#0F4C5C]"
                }
              >
                Abrir rota no Google Maps
              </a>

              <Link
                href="/criar-roteiro"
                className={
                  lugaresSelecionados.length === 0
                    ? "font-heading pointer-events-none block rounded-full border border-slate-200 px-5 py-3 text-center text-sm font-black text-slate-400"
                    : "font-heading block rounded-full border border-[#0F4C5C]/20 px-5 py-3 text-center text-sm font-black text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
                }
              >
                Usar paradas no criador
              </Link>

              {lugaresSelecionados.length > 0 && (
                <button
                  type="button"
                  onClick={limparRota}
                  className="font-heading w-full rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-[#45617A] transition hover:border-red-200 hover:text-red-500"
                >
                  Limpar rota
                </button>
              )}
            </div>

            <div className="mt-6 rounded-3xl border border-[#F2C98A]/60 bg-[#F2C98A]/25 p-5">
              <p className="font-heading text-sm font-black text-[#0F4C5C]">
                Diferença para o Explorar
              </p>

              <p className="mt-2 text-xs leading-5 text-[#45617A]">
                Aqui o foco não é navegar pelo catálogo, mas montar uma
                sequência de deslocamento com múltiplas paradas e abrir a rota
                externa.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
