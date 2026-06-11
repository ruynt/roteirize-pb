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

export default function ExplorarPage() {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
  const [cidadeSelecionada, setCidadeSelecionada] = useState("Todas");
  const [custoSelecionado, setCustoSelecionado] = useState("Todos");
  const [lugaresSelecionados, setLugaresSelecionados] = useState<string[]>([]);

  useEffect(() => {
    async function buscarLugares() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await fetch("/api/lugares", {
          cache: "no-store",
        });

        if (!resposta.ok) {
          throw new Error("Erro ao buscar lugares.");
        }

        const dados = (await resposta.json()) as Lugar[];
        setLugares(dados);
      } catch (error) {
        console.error(error);
        setErro("Não foi possível carregar os lugares.");
      } finally {
        setCarregando(false);
      }
    }

    buscarLugares();
  }, []);

  useEffect(() => {
    const selecionadosSalvos = localStorage.getItem(CHAVE_LUGARES_SELECIONADOS);

    if (selecionadosSalvos) {
      try {
        const selecionados = JSON.parse(selecionadosSalvos) as string[];
        setLugaresSelecionados(selecionados);
      } catch {
        localStorage.removeItem(CHAVE_LUGARES_SELECIONADOS);
      }
    }
  }, []);

  const categorias = useMemo(() => {
    return [
      "Todas",
      ...Array.from(new Set(lugares.map((lugar) => lugar.categoria))),
    ];
  }, [lugares]);

  const cidades = useMemo(() => {
    return [
      "Todas",
      ...Array.from(new Set(lugares.map((lugar) => lugar.cidade))),
    ];
  }, [lugares]);

  const custos = useMemo(() => {
    return [
      "Todos",
      ...Array.from(new Set(lugares.map((lugar) => lugar.custo))),
    ];
  }, [lugares]);

  const lugaresFiltrados = useMemo(() => {
    return lugares.filter((lugar) => {
      const textoBusca = busca.trim().toLowerCase();

      const combinaBusca =
        textoBusca.length === 0 ||
        lugar.nome.toLowerCase().includes(textoBusca) ||
        lugar.cidade.toLowerCase().includes(textoBusca) ||
        lugar.descricao.toLowerCase().includes(textoBusca) ||
        lugar.tags.some((tag) => tag.toLowerCase().includes(textoBusca));

      const combinaCategoria =
        categoriaSelecionada === "Todas" ||
        lugar.categoria === categoriaSelecionada;

      const combinaCidade =
        cidadeSelecionada === "Todas" || lugar.cidade === cidadeSelecionada;

      const combinaCusto =
        custoSelecionado === "Todos" || lugar.custo === custoSelecionado;

      return combinaBusca && combinaCategoria && combinaCidade && combinaCusto;
    });
  }, [
    busca,
    categoriaSelecionada,
    cidadeSelecionada,
    custoSelecionado,
    lugares,
  ]);

  function alternarLugarSelecionado(lugarId: string) {
    const jaSelecionado = lugaresSelecionados.includes(lugarId);

    const novaLista = jaSelecionado
      ? lugaresSelecionados.filter((id) => id !== lugarId)
      : [...lugaresSelecionados, lugarId];

    setLugaresSelecionados(novaLista);
    localStorage.setItem(CHAVE_LUGARES_SELECIONADOS, JSON.stringify(novaLista));
  }

  function limparSelecao() {
    setLugaresSelecionados([]);
    localStorage.removeItem(CHAVE_LUGARES_SELECIONADOS);
  }

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      <section className="soft-grid border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <div className="max-w-3xl">
            <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-sm font-bold text-[#0F4C5C]">
              Explorar lugares
            </span>

            <h1 className="font-heading mt-6 text-4xl font-black leading-tight text-[#0F2433] md:text-6xl">
              Descubra experiências para montar seu roteiro na Paraíba.
            </h1>

            <p className="mt-5 text-lg leading-8 text-[#45617A]">
              Pesquise pontos turísticos, restaurantes, praias, espaços
              culturais e experiências locais. Selecione os locais que você quer
              incluir e depois gere um roteiro personalizado.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                Buscar
              </label>
              <input
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Ex: praia, cultura, almoço..."
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                Categoria
              </label>
              <select
                value={categoriaSelecionada}
                onChange={(event) =>
                  setCategoriaSelecionada(event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              >
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                Cidade
              </label>
              <select
                value={cidadeSelecionada}
                onChange={(event) => setCidadeSelecionada(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              >
                {cidades.map((cidade) => (
                  <option key={cidade} value={cidade}>
                    {cidade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                Custo
              </label>
              <select
                value={custoSelecionado}
                onChange={(event) => setCustoSelecionado(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              >
                {custos.map((custo) => (
                  <option key={custo} value={custo}>
                    {custo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-semibold text-[#45617A]">
              {lugaresSelecionados.length > 0
                ? `${lugaresSelecionados.length} lugar(es) selecionado(s) para o roteiro.`
                : "Nenhum lugar selecionado ainda."}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              {lugaresSelecionados.length > 0 && (
                <button
                  onClick={limparSelecao}
                  className="font-heading rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-[#45617A] transition hover:border-red-200 hover:text-red-500"
                >
                  Limpar seleção
                </button>
              )}

              <Link
                href="/criar-roteiro"
                className="font-heading rounded-full bg-[#0F4C5C] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#10B981]"
              >
                Criar roteiro
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14">
        {carregando && (
          <div className="rounded-[2rem] border border-slate-100 bg-white p-8 text-center text-[#45617A]">
            Carregando lugares do banco...
          </div>
        )}

        {!carregando && erro && (
          <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-center font-semibold text-red-600">
            {erro}
          </div>
        )}

        {!carregando && !erro && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="font-heading text-sm font-bold text-[#45617A]">
                {lugaresFiltrados.length} resultado(s) encontrado(s)
              </p>

              <p className="text-sm text-[#45617A]">
                Dados carregados pelo Neon + Prisma
              </p>
            </div>

            {lugaresFiltrados.length === 0 ? (
              <div className="rounded-[2rem] border border-slate-100 bg-white p-8 text-center">
                <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                  Nenhum lugar encontrado
                </h2>
                <p className="mt-2 text-[#45617A]">
                  Tente alterar os filtros ou buscar por outro termo.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {lugaresFiltrados.map((lugar) => {
                  const selecionado = lugaresSelecionados.includes(lugar.id);

                  return (
                    <article
                      key={lugar.id}
                      className="card-shadow overflow-hidden rounded-[2rem] border border-slate-100 bg-white"
                    >
                      <div
                        className={`h-40 bg-gradient-to-br ${lugar.imagemClasse}`}
                      />

                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="font-heading rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-bold text-[#0F4C5C]">
                              {lugar.categoria}
                            </span>

                            <h2 className="font-heading mt-4 text-2xl font-black text-[#0F2433]">
                              {lugar.nome}
                            </h2>

                            <p className="mt-1 text-sm font-semibold text-[#45617A]">
                              {lugar.cidade}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-[#F2C98A]/40 px-3 py-2 text-sm font-black text-[#0F4C5C]">
                            ★ {lugar.nota.toFixed(1)}
                          </div>
                        </div>

                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#45617A]">
                          {lugar.descricao}
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="font-heading text-xs font-bold text-[#45617A]">
                              Custo
                            </p>
                            <p className="mt-1 font-bold text-[#0F2433]">
                              {lugar.custo}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="font-heading text-xs font-bold text-[#45617A]">
                              Duração
                            </p>
                            <p className="mt-1 font-bold text-[#0F2433]">
                              {lugar.tempoSugeridoMin} min
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {lugar.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-[#45617A]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                          <Link
                            href={`/lugares/${lugar.id}`}
                            className="font-heading rounded-full border border-slate-200 px-4 py-3 text-center text-sm font-bold text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
                          >
                            Ver detalhes
                          </Link>

                          <button
                            onClick={() => alternarLugarSelecionado(lugar.id)}
                            className={
                              selecionado
                                ? "font-heading rounded-full bg-[#10B981] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0F4C5C]"
                                : "font-heading rounded-full bg-[#0F4C5C] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#10B981]"
                            }
                          >
                            {selecionado ? "Selecionado" : "Adicionar"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
