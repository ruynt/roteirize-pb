"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CHAVE_CHECKINS = "roteirize_checkins";
const CHAVE_ROTEIROS_SALVOS = "roteirize_roteiros_salvos";

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
};

type RoteiroSalvo = {
  id: string;
  titulo?: string;
  criadoEm?: string;
  paradas?: ParadaSalva[];
};

type Selo = {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  desbloqueado: boolean;
  progresso: number;
  meta: number;
  textoProgresso: string;
};

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

function formatarData(data?: string) {
  if (!data) {
    return "Data não informada";
  }

  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function textoProgresso(progresso: number, meta: number, unidade: string) {
  if (progresso >= meta) {
    return "Concluído";
  }

  return `${progresso}/${meta} ${unidade}`;
}

function obterCategoriasUnicas(checkins: Checkin[]) {
  return Array.from(new Set(checkins.map((checkin) => checkin.categoria)));
}

function obterCidadesUnicas(checkins: Checkin[]) {
  return Array.from(new Set(checkins.map((checkin) => checkin.cidade)));
}

export default function PassaportePage() {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [roteiros, setRoteiros] = useState<RoteiroSalvo[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setCheckins(carregarLista<Checkin>(CHAVE_CHECKINS));
    setRoteiros(carregarLista<RoteiroSalvo>(CHAVE_ROTEIROS_SALVOS));
    setCarregado(true);
  }, []);

  const estatisticas = useMemo(() => {
    const cidadesVisitadas = obterCidadesUnicas(checkins);
    const categoriasVisitadas = obterCategoriasUnicas(checkins);

    const locaisEmRoteiros = roteiros.reduce((total, roteiro) => {
      return total + (roteiro.paradas?.length ?? 0);
    }, 0);

    return {
      totalCheckins: checkins.length,
      cidadesVisitadas,
      categoriasVisitadas,
      totalCidades: cidadesVisitadas.length,
      totalCategorias: categoriasVisitadas.length,
      totalRoteiros: roteiros.length,
      locaisEmRoteiros,
    };
  }, [checkins, roteiros]);

  const selos = useMemo<Selo[]>(() => {
    const temCategoria = (categoria: string) =>
      estatisticas.categoriasVisitadas.includes(categoria);

    const lista: Selo[] = [
      {
        id: "primeiro-checkin",
        nome: "Primeiro Check-in",
        descricao: "Realize seu primeiro check-in em um atrativo turístico.",
        icone: "📍",
        desbloqueado: estatisticas.totalCheckins >= 1,
        progresso: estatisticas.totalCheckins,
        meta: 1,
        textoProgresso: textoProgresso(
          estatisticas.totalCheckins,
          1,
          "check-in",
        ),
      },
      {
        id: "explorador-iniciante",
        nome: "Explorador Iniciante",
        descricao: "Faça check-in em 3 lugares diferentes.",
        icone: "🧭",
        desbloqueado: estatisticas.totalCheckins >= 3,
        progresso: estatisticas.totalCheckins,
        meta: 3,
        textoProgresso: textoProgresso(
          estatisticas.totalCheckins,
          3,
          "check-ins",
        ),
      },
      {
        id: "explorador-avancado",
        nome: "Explorador Avançado",
        descricao: "Faça check-in em 6 lugares diferentes.",
        icone: "🏆",
        desbloqueado: estatisticas.totalCheckins >= 6,
        progresso: estatisticas.totalCheckins,
        meta: 6,
        textoProgresso: textoProgresso(
          estatisticas.totalCheckins,
          6,
          "check-ins",
        ),
      },
      {
        id: "roteiro-praia",
        nome: "Roteiro de Praia",
        descricao: "Visite pelo menos um atrativo da categoria Praia.",
        icone: "🏖️",
        desbloqueado: temCategoria("Praia"),
        progresso: temCategoria("Praia") ? 1 : 0,
        meta: 1,
        textoProgresso: temCategoria("Praia") ? "Concluído" : "0/1 visita",
      },
      {
        id: "explorador-cultural",
        nome: "Explorador Cultural",
        descricao: "Visite pelo menos um atrativo cultural.",
        icone: "🏛️",
        desbloqueado: temCategoria("Cultura"),
        progresso: temCategoria("Cultura") ? 1 : 0,
        meta: 1,
        textoProgresso: temCategoria("Cultura") ? "Concluído" : "0/1 visita",
      },
      {
        id: "sabor-paraibano",
        nome: "Sabor Paraibano",
        descricao: "Faça check-in em uma experiência gastronômica.",
        icone: "🍽️",
        desbloqueado: temCategoria("Gastronomia"),
        progresso: temCategoria("Gastronomia") ? 1 : 0,
        meta: 1,
        textoProgresso: temCategoria("Gastronomia")
          ? "Concluído"
          : "0/1 visita",
      },
      {
        id: "ecoturista",
        nome: "Ecoturista",
        descricao: "Visite um atrativo ligado à natureza.",
        icone: "🌿",
        desbloqueado: temCategoria("Natureza"),
        progresso: temCategoria("Natureza") ? 1 : 0,
        meta: 1,
        textoProgresso: temCategoria("Natureza") ? "Concluído" : "0/1 visita",
      },
      {
        id: "vivencia-local",
        nome: "Vivência Local",
        descricao: "Participe de uma experiência local.",
        icone: "🤝",
        desbloqueado: temCategoria("Experiência"),
        progresso: temCategoria("Experiência") ? 1 : 0,
        meta: 1,
        textoProgresso: temCategoria("Experiência")
          ? "Concluído"
          : "0/1 visita",
      },
      {
        id: "paraiba-em-rota",
        nome: "Paraíba em Rota",
        descricao: "Faça check-in em 2 cidades diferentes.",
        icone: "🗺️",
        desbloqueado: estatisticas.totalCidades >= 2,
        progresso: estatisticas.totalCidades,
        meta: 2,
        textoProgresso: textoProgresso(estatisticas.totalCidades, 2, "cidades"),
      },
      {
        id: "planejador",
        nome: "Planejador de Viagens",
        descricao: "Salve pelo menos um roteiro personalizado.",
        icone: "📒",
        desbloqueado: estatisticas.totalRoteiros >= 1,
        progresso: estatisticas.totalRoteiros,
        meta: 1,
        textoProgresso:
          estatisticas.totalRoteiros >= 1
            ? "Concluído"
            : `${estatisticas.totalRoteiros}/1 roteiro`,
      },
    ];

    return lista;
  }, [estatisticas]);

  const selosDesbloqueados = selos.filter((selo) => selo.desbloqueado).length;
  const progressoGeral = Math.round((selosDesbloqueados / selos.length) * 100);

  function limparCheckins() {
    const confirmar = confirm(
      "Tem certeza que deseja limpar todos os check-ins do passaporte?",
    );

    if (!confirmar) {
      return;
    }

    localStorage.removeItem(CHAVE_CHECKINS);
    setCheckins([]);
  }

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
          <div className="max-w-4xl">
            <span className="font-heading rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
              Passaporte Digital
            </span>

            <h1 className="font-heading mt-6 text-4xl font-black leading-tight md:text-6xl">
              Acompanhe sua jornada pela Paraíba.
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
              Faça check-in em atrativos turísticos, desbloqueie selos virtuais
              e acompanhe sua evolução como explorador paraibano.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/explorar"
                className="font-heading rounded-full bg-white px-6 py-3 text-center text-sm font-black text-[#0F4C5C] transition hover:bg-[#F2C98A]"
              >
                Explorar locais
              </Link>

              <Link
                href="/criar-roteiro"
                className="font-heading rounded-full border border-white/40 bg-white/10 px-6 py-3 text-center text-sm font-black text-white backdrop-blur transition hover:bg-white hover:text-[#0F4C5C]"
              >
                Criar roteiro
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        {!carregado ? (
          <div className="card-shadow rounded-[2rem] bg-white p-8 text-center text-[#45617A]">
            Carregando passaporte...
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <div className="card-shadow rounded-[1.5rem] bg-white p-5">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Check-ins
                </p>

                <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
                  {estatisticas.totalCheckins}
                </p>

                <p className="mt-2 text-xs font-semibold text-[#45617A]">
                  visitas registradas
                </p>
              </div>

              <div className="card-shadow rounded-[1.5rem] bg-white p-5">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Cidades
                </p>

                <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
                  {estatisticas.totalCidades}
                </p>

                <p className="mt-2 text-xs font-semibold text-[#45617A]">
                  cidades exploradas
                </p>
              </div>

              <div className="card-shadow rounded-[1.5rem] bg-white p-5">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Categorias
                </p>

                <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
                  {estatisticas.totalCategorias}
                </p>

                <p className="mt-2 text-xs font-semibold text-[#45617A]">
                  tipos visitados
                </p>
              </div>

              <div className="card-shadow rounded-[1.5rem] bg-white p-5">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Roteiros
                </p>

                <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
                  {estatisticas.totalRoteiros}
                </p>

                <p className="mt-2 text-xs font-semibold text-[#45617A]">
                  roteiros salvos
                </p>
              </div>

              <div className="card-shadow rounded-[1.5rem] bg-white p-5">
                <p className="font-heading text-xs font-bold text-[#45617A]">
                  Selos
                </p>

                <p className="font-heading mt-2 text-3xl font-black text-[#10B981]">
                  {selosDesbloqueados}/{selos.length}
                </p>

                <p className="mt-2 text-xs font-semibold text-[#45617A]">
                  conquistas desbloqueadas
                </p>
              </div>
            </div>

            <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                    Progresso geral
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#45617A]">
                    Complete check-ins em diferentes locais, cidades e
                    categorias para desbloquear novos selos.
                  </p>
                </div>

                <div className="font-heading rounded-full bg-[#10B981]/10 px-5 py-3 text-sm font-black text-[#0F4C5C]">
                  {progressoGeral}% concluído
                </div>
              </div>

              <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#10B981] transition-all"
                  style={{ width: `${progressoGeral}%` }}
                />
              </div>
            </section>

            {checkins.length === 0 ? (
              <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F2C98A]/50 text-3xl">
                  📍
                </div>

                <h2 className="font-heading mt-5 text-2xl font-black text-[#0F2433]">
                  Nenhum check-in realizado ainda
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#45617A]">
                  Abra a página de um local turístico e clique em “Fazer
                  check-in” para começar a desbloquear selos no passaporte.
                </p>

                <Link
                  href="/explorar"
                  className="font-heading mt-6 inline-flex rounded-full bg-[#0F4C5C] px-6 py-3 text-sm font-black text-white transition hover:bg-[#10B981]"
                >
                  Explorar locais
                </Link>
              </section>
            ) : (
              <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                      Últimos check-ins
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#45617A]">
                      Locais já registrados no seu passaporte digital.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={limparCheckins}
                    className="font-heading rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-[#45617A] transition hover:border-red-200 hover:text-red-500"
                  >
                    Limpar check-ins
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {checkins.map((checkin) => (
                    <Link
                      key={checkin.id}
                      href={`/lugares/${checkin.id}`}
                      className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5 transition hover:border-[#10B981] hover:bg-[#10B981]/10"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl">
                          📍
                        </div>

                        <div>
                          <p className="font-heading text-base font-black text-[#0F2433]">
                            {checkin.nome}
                          </p>

                          <p className="mt-1 text-xs font-bold text-[#0F4C5C]">
                            {checkin.cidade} • {checkin.categoria}
                          </p>

                          <p className="mt-2 text-xs text-[#45617A]">
                            Check-in em {formatarData(checkin.data)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
              <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                Selos do passaporte
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#45617A]">
                Os selos representam conquistas desbloqueadas pela exploração de
                diferentes locais, cidades e categorias turísticas.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {selos.map((selo) => {
                  const largura = Math.min(
                    100,
                    Math.round((selo.progresso / selo.meta) * 100),
                  );

                  return (
                    <article
                      key={selo.id}
                      className={
                        selo.desbloqueado
                          ? "rounded-[1.5rem] border border-[#10B981]/30 bg-[#10B981]/10 p-5"
                          : "rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5 opacity-75"
                      }
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={
                            selo.desbloqueado
                              ? "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl"
                              : "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl grayscale"
                          }
                        >
                          {selo.icone}
                        </div>

                        <div>
                          <p className="font-heading text-lg font-black text-[#0F2433]">
                            {selo.nome}
                          </p>

                          <p className="mt-2 text-sm leading-6 text-[#45617A]">
                            {selo.descricao}
                          </p>

                          <p
                            className={
                              selo.desbloqueado
                                ? "font-heading mt-3 text-xs font-black text-[#0F4C5C]"
                                : "font-heading mt-3 text-xs font-black text-[#45617A]"
                            }
                          >
                            {selo.textoProgresso}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                        <div
                          className={
                            selo.desbloqueado
                              ? "h-full rounded-full bg-[#10B981]"
                              : "h-full rounded-full bg-slate-300"
                          }
                          style={{ width: `${largura}%` }}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {roteiros.length > 0 && (
              <section className="rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
                <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                  Roteiros salvos
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#45617A]">
                  Seus roteiros continuam registrados como parte do planejamento
                  de viagem.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {roteiros.slice(0, 4).map((roteiro) => (
                    <Link
                      key={roteiro.id}
                      href="/roteiros-salvos"
                      className="rounded-[1.5rem] bg-slate-50 p-5 transition hover:bg-[#10B981]/10"
                    >
                      <p className="font-heading text-base font-black text-[#0F2433]">
                        {roteiro.titulo ?? "Roteiro salvo"}
                      </p>

                      <p className="mt-2 text-sm text-[#45617A]">
                        {roteiro.paradas?.length ?? 0} parada(s) planejada(s)
                      </p>

                      <p className="mt-2 text-xs text-[#45617A]">
                        Criado em {formatarData(roteiro.criadoEm)}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
