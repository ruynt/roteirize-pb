"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CHAVE_ROTEIROS_SALVOS = "roteirize_roteiros_salvos";

type RoteiroSalvo = {
  id: number;
  titulo: string;
  criadoEm: string;
  cidadeBase: string;
  tempoDisponivel: number;
  horarioInicio: string;
  transporte: string;
  orcamento: string;
  ritmo: string;
  incluirAlmoco: boolean;
  interesses: string[];
  resumo: {
    tempoTotalLocais: number;
    tempoTotalDeslocamento: number;
    custo: {
      minimo: number;
      maximo: number;
    };
    nivel: string;
  };
  paradas: Array<{
    lugarId: number;
    nome: string;
    cidade: string;
    categoria: string;
    chegada: string;
    saida: string;
    deslocamentoAntes: number;
    tempoSugeridoMin: number;
    precoEstimado: string;
    nota: number;
  }>;
};

export default function RoteirosSalvosPage() {
  const [roteiros, setRoteiros] = useState<RoteiroSalvo[]>([]);

  useEffect(() => {
    const roteirosSalvos = localStorage.getItem(CHAVE_ROTEIROS_SALVOS);

    if (roteirosSalvos) {
      const dados: RoteiroSalvo[] = JSON.parse(roteirosSalvos);
      setRoteiros(dados);
    }
  }, []);

  const resumo = useMemo(() => {
    const totalParadas = roteiros.reduce(
      (total, roteiro) => total + roteiro.paradas.length,
      0
    );

    return {
      totalRoteiros: roteiros.length,
      totalParadas,
    };
  }, [roteiros]);

  function salvarRoteiros(novosRoteiros: RoteiroSalvo[]) {
    setRoteiros(novosRoteiros);
    localStorage.setItem(
      CHAVE_ROTEIROS_SALVOS,
      JSON.stringify(novosRoteiros)
    );
  }

  function removerRoteiro(id: number) {
    const novosRoteiros = roteiros.filter((roteiro) => roteiro.id !== id);
    salvarRoteiros(novosRoteiros);
  }

  function limparTodos() {
    setRoteiros([]);
    localStorage.removeItem(CHAVE_ROTEIROS_SALVOS);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="font-heading font-black text-[#10B981]">
            Roteiros salvos
          </p>

          <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight text-[#0F2433] md:text-5xl">
            Consulte os roteiros que você salvou.
          </h1>

          <p className="mt-4 max-w-3xl leading-8 text-[#45617A]">
            Nesta versão de demonstração, os roteiros ficam salvos no navegador
            usando localStorage. Em uma versão final, seriam armazenados em banco
            de dados vinculados à conta do usuário.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 card-shadow">
            <p className="text-sm font-black text-[#45617A]">
              Roteiros salvos
            </p>

            <p className="mt-2 text-3xl font-black text-[#0F2433]">
              {resumo.totalRoteiros}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 card-shadow">
            <p className="text-sm font-black text-[#45617A]">
              Paradas planejadas
            </p>

            <p className="mt-2 text-3xl font-black text-[#0F2433]">
              {resumo.totalParadas}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 card-shadow">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#0F2433]">
                Meus roteiros
              </h2>

              <p className="mt-1 text-sm text-[#45617A]">
                Lista de roteiros gerados e salvos na plataforma.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/criar-roteiro"
                className="rounded-2xl bg-[#10B981] px-4 py-3 text-center font-black text-white transition hover:bg-[#0F4C5C]"
              >
                Criar novo roteiro
              </Link>

              {roteiros.length > 0 && (
                <button
                  onClick={limparTodos}
                  className="rounded-2xl border border-slate-200 px-4 py-3 font-black text-[#45617A] transition hover:border-red-300 hover:text-red-600"
                >
                  Limpar todos
                </button>
              )}
            </div>
          </div>

          {roteiros.length === 0 ? (
            <div className="py-14 text-center">
              <h3 className="text-2xl font-black text-[#0F2433]">
                Nenhum roteiro salvo ainda
              </h3>

              <p className="mt-2 text-[#45617A]">
                Gere um roteiro e clique em “Salvar roteiro” para ele aparecer
                aqui.
              </p>

              <Link
                href="/criar-roteiro"
                className="mt-6 inline-flex rounded-2xl bg-[#10B981] px-5 py-3 font-black text-white transition hover:bg-[#0F4C5C]"
              >
                Criar roteiro
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-5">
              {roteiros.map((roteiro) => (
                <article
                  key={roteiro.id}
                  className="rounded-3xl border border-slate-100 bg-white p-5 transition hover:border-[#10B981]/40"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-black text-[#0F4C5C]">
                          {roteiro.cidadeBase}
                        </span>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                          Salvo em {roteiro.criadoEm}
                        </span>

                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                          {roteiro.resumo.nivel}
                        </span>
                      </div>

                      <h3 className="mt-4 text-2xl font-black text-[#0F2433]">
                        {roteiro.titulo}
                      </h3>

                      <p className="mt-2 leading-7 text-[#45617A]">
                        {roteiro.paradas.length} paradas • Início às{" "}
                        {roteiro.horarioInicio} • Transporte:{" "}
                        {roteiro.transporte} • Orçamento: {roteiro.orcamento}
                      </p>
                    </div>

                    <button
                      onClick={() => removerRoteiro(roteiro.id)}
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-[#45617A] transition hover:border-red-300 hover:text-red-600"
                    >
                      Remover
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-4">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-black text-[#45617A]">
                        Tempo em visitas
                      </p>

                      <p className="mt-1 font-bold text-[#0F2433]">
                        {Math.floor(roteiro.resumo.tempoTotalLocais / 60)}h{" "}
                        {roteiro.resumo.tempoTotalLocais % 60}min
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-black text-[#45617A]">
                        Deslocamento
                      </p>

                      <p className="mt-1 font-bold text-[#0F2433]">
                        {roteiro.resumo.tempoTotalDeslocamento}min
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-black text-[#45617A]">
                        Custo estimado
                      </p>

                      <p className="mt-1 font-bold text-[#0F2433]">
                        R$ {roteiro.resumo.custo.minimo} -{" "}
                        {roteiro.resumo.custo.maximo}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-black text-[#45617A]">
                        Interesses
                      </p>

                      <p className="mt-1 font-bold text-[#0F2433]">
                        {roteiro.interesses.join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {roteiro.paradas.map((parada, index) => (
                      <div
                        key={`${roteiro.id}-${parada.lugarId}-${index}`}
                        className="grid gap-3 rounded-2xl border border-slate-100 p-4 md:grid-cols-[90px_1fr_140px]"
                      >
                        <div>
                          <p className="text-xs font-black text-[#10B981]">
                            Parada {index + 1}
                          </p>

                          <p className="mt-1 text-xl font-black text-[#0F2433]">
                            {parada.chegada}
                          </p>

                          <p className="text-sm text-[#45617A]">
                            até {parada.saida}
                          </p>
                        </div>

                        <div>
                          {parada.deslocamentoAntes > 0 && (
                            <p className="mb-2 w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                              + {parada.deslocamentoAntes} min de deslocamento
                            </p>
                          )}

                          <p className="w-fit rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-black text-[#0F4C5C]">
                            {parada.categoria}
                          </p>

                          <h4 className="mt-2 text-lg font-black text-[#0F2433]">
                            {parada.nome}
                          </h4>

                          <p className="mt-1 text-sm text-[#45617A]">
                            {parada.cidade}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-3 text-sm">
                          <p className="font-black text-[#0F2433]">
                            {parada.precoEstimado}
                          </p>

                          <p className="mt-1 text-[#45617A]">
                            {parada.tempoSugeridoMin} min
                          </p>

                          <p className="mt-1 font-black text-amber-600">
                            ★ {parada.nota}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}