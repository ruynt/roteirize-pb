"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { Categoria, Custo, lugares } from "@/data/lugares";
import { useEffect, useMemo, useState } from "react";

const categorias: Array<"Todas" | Categoria> = [
  "Todas",
  "Praia",
  "Cultura",
  "Gastronomia",
  "Natureza",
  "Experiência",
];

const custos: Array<"Todos" | Custo> = [
  "Todos",
  "Gratuito",
  "Econômico",
  "Médio",
  "Alto",
];

const CHAVE_LUGARES_SELECIONADOS = "roteirize_lugares_selecionados";

export default function ExplorarPage() {
  const [categoria, setCategoria] = useState<"Todas" | Categoria>("Todas");
  const [cidade, setCidade] = useState("Todas");
  const [custo, setCusto] = useState<"Todos" | Custo>("Todos");
  const [busca, setBusca] = useState("");
  const [lugaresSelecionados, setLugaresSelecionados] = useState<number[]>([]);

  useEffect(() => {
    const lugaresSalvos = localStorage.getItem(CHAVE_LUGARES_SELECIONADOS);

    if (lugaresSalvos) {
      setLugaresSelecionados(JSON.parse(lugaresSalvos));
    }
  }, []);

  const cidades = useMemo(() => {
    return ["Todas", ...Array.from(new Set(lugares.map((lugar) => lugar.cidade)))];
  }, []);

  const lugaresFiltrados = useMemo(() => {
    return lugares.filter((lugar) => {
      const textoBusca = busca.toLowerCase().trim();

      const buscaOk =
        textoBusca === "" ||
        lugar.nome.toLowerCase().includes(textoBusca) ||
        lugar.cidade.toLowerCase().includes(textoBusca) ||
        lugar.categoria.toLowerCase().includes(textoBusca) ||
        lugar.tags.some((tag) => tag.toLowerCase().includes(textoBusca));

      const categoriaOk = categoria === "Todas" || lugar.categoria === categoria;
      const cidadeOk = cidade === "Todas" || lugar.cidade === cidade;
      const custoOk = custo === "Todos" || lugar.custo === custo;

      return buscaOk && categoriaOk && cidadeOk && custoOk;
    });
  }, [categoria, cidade, custo, busca]);

  function salvarLugaresSelecionados(novosSelecionados: number[]) {
    setLugaresSelecionados(novosSelecionados);

    localStorage.setItem(
      CHAVE_LUGARES_SELECIONADOS,
      JSON.stringify(novosSelecionados)
    );
  }

  function alternarLugarSelecionado(id: number) {
    const jaSelecionado = lugaresSelecionados.includes(id);

    if (jaSelecionado) {
      const novosSelecionados = lugaresSelecionados.filter(
        (lugarId) => lugarId !== id
      );

      salvarLugaresSelecionados(novosSelecionados);
      return;
    }

    salvarLugaresSelecionados([...lugaresSelecionados, id]);
  }

  function limparSelecao() {
    salvarLugaresSelecionados([]);
  }

  function limparFiltros() {
    setCategoria("Todas");
    setCidade("Todas");
    setCusto("Todos");
    setBusca("");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="font-heading font-black text-[#10B981]">
            Explorar lugares
          </p>

          <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight text-[#0F2433] md:text-5xl">
            Encontre praias, restaurantes, pontos turísticos e experiências
            locais.
          </h1>

          <p className="mt-4 max-w-3xl leading-8 text-[#45617A]">
            Use os filtros para encontrar locais compatíveis com o roteiro que
            você quer montar. Depois, adicione os lugares desejados ao seu
            roteiro personalizado.
          </p>

          <div className="mt-8 max-w-3xl">
            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por praia, cultura, restaurante, cidade..."
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-6 py-4 text-base outline-none transition focus:border-[#10B981] focus:bg-white"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-3xl bg-white p-5 card-shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[#0F2433]">Filtros</h2>

              <button
                onClick={limparFiltros}
                className="text-sm font-black text-[#10B981]"
              >
                Limpar
              </button>
            </div>

            <div className="mt-5">
              <label className="text-sm font-black text-[#0F2433]">
                Categoria
              </label>

              <select
                value={categoria}
                onChange={(event) =>
                  setCategoria(event.target.value as "Todas" | Categoria)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
              >
                {categorias.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="mt-5">
              <label className="text-sm font-black text-[#0F2433]">
                Cidade
              </label>

              <select
                value={cidade}
                onChange={(event) => setCidade(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
              >
                {cidades.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="mt-5">
              <label className="text-sm font-black text-[#0F2433]">
                Custo
              </label>

              <select
                value={custo}
                onChange={(event) =>
                  setCusto(event.target.value as "Todos" | Custo)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
              >
                {custos.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="mt-6 rounded-3xl bg-[#10B981]/10 p-4">
              <p className="text-sm font-black text-[#0F4C5C]">
                Lugares selecionados
              </p>

              <p className="mt-2 text-3xl font-black text-[#0F2433]">
                {lugaresSelecionados.length}
              </p>

              <p className="mt-2 text-sm leading-6 text-[#45617A]">
                Esses locais serão usados na próxima etapa para montar um roteiro
                personalizado.
              </p>

              {lugaresSelecionados.length > 0 && (
                <button
                  onClick={limparSelecao}
                  className="mt-4 w-full rounded-2xl border border-[#10B981]/30 px-4 py-3 text-sm font-black text-[#0F4C5C] transition hover:bg-white"
                >
                  Limpar seleção
                </button>
              )}
            </div>
          </aside>

          <section>
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-black text-[#0F2433]">
                  {lugaresFiltrados.length} lugares encontrados
                </p>

                <p className="mt-1 text-sm text-[#45617A]">
                  Resultado com base nos filtros selecionados.
                </p>
              </div>

              <Link
                href="/criar-roteiro"
                className="rounded-full bg-[#10B981] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#0F4C5C]"
              >
                Criar roteiro com {lugaresSelecionados.length} lugares
              </Link>
            </div>

            {lugaresFiltrados.length === 0 ? (
              <div className="rounded-3xl bg-white p-10 text-center card-shadow">
                <h3 className="text-2xl font-black text-[#0F2433]">
                  Nenhum lugar encontrado
                </h3>

                <p className="mt-2 text-[#45617A]">
                  Tente limpar os filtros ou buscar por outro termo.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {lugaresFiltrados.map((lugar) => {
                  const selecionado = lugaresSelecionados.includes(lugar.id);

                  return (
                    <article
                      key={lugar.id}
                      className="overflow-hidden rounded-3xl bg-white card-shadow transition hover:-translate-y-1"
                    >
                      <div
                        className={`relative h-40 bg-gradient-to-br ${lugar.imagemClasse}`}
                      >
                        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#0F2433] backdrop-blur">
                          {lugar.cidade}
                        </div>

                        <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-amber-600 backdrop-blur">
                          ★ {lugar.nota}
                        </div>

                        {selecionado && (
                          <div className="absolute bottom-4 left-4 rounded-full bg-[#10B981] px-3 py-1 text-xs font-black text-white backdrop-blur">
                            Selecionado
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between gap-4">
                          <p className="rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-black text-[#0F4C5C]">
                            {lugar.categoria}
                          </p>

                          <p className="text-xs font-black text-[#45617A]">
                            {lugar.custo}
                          </p>
                        </div>

                        <h2 className="mt-4 text-xl font-black text-[#0F2433]">
                          {lugar.nome}
                        </h2>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#45617A]">
                          {lugar.descricao}
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="font-black text-[#0F2433]">Tempo</p>
                            <p className="text-[#45617A]">
                              {lugar.tempoSugeridoMin} min
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="font-black text-[#0F2433]">
                              Melhor horário
                            </p>
                            <p className="text-[#45617A]">
                              {lugar.horarioIdeal}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {lugar.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-[#45617A]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <Link
                            href={`/lugares/${lugar.id}`}
                            className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-black text-[#45617A] transition hover:border-[#10B981] hover:text-[#10B981]"
                          >
                            Ver detalhes
                          </Link>

                          <button
                            onClick={() => alternarLugarSelecionado(lugar.id)}
                            className={
                              selecionado
                                ? "rounded-2xl bg-[#0F4C5C] px-4 py-3 text-sm font-black text-white transition hover:bg-red-600"
                                : "rounded-2xl bg-[#10B981] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0F4C5C]"
                            }
                          >
                            {selecionado ? "Remover" : "Adicionar"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}