"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CHAVE_ROTEIROS_SALVOS = "roteirize_roteiros_salvos";

type ParadaSalva = {
  id: string;
  nome: string;
  cidade: string;
  categoria: string;
  endereco: string;
  chegada: string;
  saida: string;
  deslocamentoAntes: number;
  tempoSugeridoMin: number;
  custo: string;
  precoEstimado: string;
  avisos?: string[];
};

type RoteiroSalvo = {
  id: string;
  titulo: string;
  criadoEm: string;
  paradas: ParadaSalva[];
};

type Selo = {
  id: string;
  titulo: string;
  descricao: string;
  emoji: string;
  desbloqueado: boolean;
  progresso: string;
};

export default function PassaportePage() {
  const [roteiros, setRoteiros] = useState<RoteiroSalvo[]>([]);

  useEffect(() => {
    const roteirosTexto = localStorage.getItem(CHAVE_ROTEIROS_SALVOS);

    if (!roteirosTexto) {
      return;
    }

    try {
      const roteirosSalvos = JSON.parse(roteirosTexto) as RoteiroSalvo[];
      setRoteiros(roteirosSalvos);
    } catch {
      localStorage.removeItem(CHAVE_ROTEIROS_SALVOS);
    }
  }, []);

  const estatisticas = useMemo(() => {
    const paradas = roteiros.flatMap((roteiro) => roteiro.paradas);

    const categorias = paradas.map((parada) => parada.categoria);
    const cidades = Array.from(new Set(paradas.map((parada) => parada.cidade)));

    return {
      totalRoteiros: roteiros.length,
      totalParadas: paradas.length,
      totalCidades: cidades.length,
      categorias,
      cidades,
      temPraia: categorias.includes("Praia"),
      temCultura: categorias.includes("Cultura"),
      temGastronomia: categorias.includes("Gastronomia"),
      temNatureza: categorias.includes("Natureza"),
      temExperiencia: categorias.includes("Experiência"),
      temParceiroLocal: paradas.some((parada) =>
        parada.nome.toLowerCase().includes("teste"),
      ),
    };
  }, [roteiros]);

  const selos: Selo[] = [
    {
      id: "planejador",
      titulo: "Planejador de Viagens",
      descricao: "Salve pelo menos um roteiro personalizado.",
      emoji: "🧭",
      desbloqueado: estatisticas.totalRoteiros >= 1,
      progresso: `${estatisticas.totalRoteiros}/1 roteiro salvo`,
    },
    {
      id: "praia",
      titulo: "Roteiro de Praia",
      descricao: "Inclua pelo menos uma praia em um roteiro.",
      emoji: "🏖️",
      desbloqueado: estatisticas.temPraia,
      progresso: estatisticas.temPraia
        ? "Praia incluída"
        : "Nenhuma praia ainda",
    },
    {
      id: "cultura",
      titulo: "Explorador Cultural",
      descricao: "Inclua pelo menos um local cultural no roteiro.",
      emoji: "🏛️",
      desbloqueado: estatisticas.temCultura,
      progresso: estatisticas.temCultura
        ? "Local cultural incluído"
        : "Nenhum local cultural ainda",
    },
    {
      id: "gastronomia",
      titulo: "Sabor Paraibano",
      descricao: "Inclua uma experiência gastronômica no roteiro.",
      emoji: "🍽️",
      desbloqueado: estatisticas.temGastronomia,
      progresso: estatisticas.temGastronomia
        ? "Gastronomia incluída"
        : "Nenhum restaurante ainda",
    },
    {
      id: "natureza",
      titulo: "Ecoturista",
      descricao: "Inclua um local de natureza ou área verde.",
      emoji: "🌿",
      desbloqueado: estatisticas.temNatureza,
      progresso: estatisticas.temNatureza
        ? "Natureza incluída"
        : "Nenhum local de natureza ainda",
    },
    {
      id: "experiencia",
      titulo: "Vivência Local",
      descricao: "Inclua uma experiência local ou passeio guiado.",
      emoji: "🤝",
      desbloqueado: estatisticas.temExperiencia,
      progresso: estatisticas.temExperiencia
        ? "Experiência incluída"
        : "Nenhuma experiência ainda",
    },
    {
      id: "cidades",
      titulo: "Explorador da Paraíba",
      descricao: "Monte roteiros envolvendo pelo menos 3 cidades diferentes.",
      emoji: "🗺️",
      desbloqueado: estatisticas.totalCidades >= 3,
      progresso: `${estatisticas.totalCidades}/3 cidades visitadas`,
    },
    {
      id: "premium",
      titulo: "Turista Avançado",
      descricao: "Salve pelo menos 3 roteiros personalizados.",
      emoji: "⭐",
      desbloqueado: estatisticas.totalRoteiros >= 3,
      progresso: `${estatisticas.totalRoteiros}/3 roteiros salvos`,
    },
  ];

  const selosDesbloqueados = selos.filter((selo) => selo.desbloqueado).length;
  const percentual =
    selos.length > 0
      ? Math.round((selosDesbloqueados / selos.length) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      <section className="soft-grid border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <div className="max-w-3xl">
            <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-sm font-bold text-[#0F4C5C]">
              Passaporte Digital
            </span>

            <h1 className="font-heading mt-6 text-4xl font-black leading-tight text-[#0F2433] md:text-6xl">
              Acompanhe suas conquistas turísticas pela Paraíba.
            </h1>

            <p className="mt-5 text-lg leading-8 text-[#45617A]">
              O passaporte digital adiciona uma camada de gamificação ao
              Roteirize PB. Conforme o turista salva roteiros e explora
              categorias diferentes, novos selos são desbloqueados.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-5 md:grid-cols-4">
          <div className="card-shadow rounded-[1.5rem] bg-white p-5">
            <p className="font-heading text-xs font-bold text-[#45617A]">
              Roteiros salvos
            </p>
            <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
              {estatisticas.totalRoteiros}
            </p>
          </div>

          <div className="card-shadow rounded-[1.5rem] bg-white p-5">
            <p className="font-heading text-xs font-bold text-[#45617A]">
              Locais no passaporte
            </p>
            <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
              {estatisticas.totalParadas}
            </p>
          </div>

          <div className="card-shadow rounded-[1.5rem] bg-white p-5">
            <p className="font-heading text-xs font-bold text-[#45617A]">
              Cidades exploradas
            </p>
            <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
              {estatisticas.totalCidades}
            </p>
          </div>

          <div className="card-shadow rounded-[1.5rem] bg-white p-5">
            <p className="font-heading text-xs font-bold text-[#45617A]">
              Selos desbloqueados
            </p>
            <p className="font-heading mt-2 text-3xl font-black text-[#10B981]">
              {selosDesbloqueados}/{selos.length}
            </p>
          </div>
        </div>

        <div className="card-shadow mt-8 rounded-[2rem] border border-slate-100 bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                Progresso do passaporte
              </h2>

              <p className="mt-2 text-sm text-[#45617A]">
                Complete roteiros variados para liberar novos selos.
              </p>
            </div>

            <span className="font-heading rounded-full bg-[#10B981]/10 px-5 py-3 text-sm font-black text-[#0F4C5C]">
              {percentual}% completo
            </span>
          </div>

          <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#10B981]"
              style={{
                width: `${percentual}%`,
              }}
            />
          </div>
        </div>

        {roteiros.length === 0 ? (
          <div className="card-shadow mt-8 rounded-[2rem] border border-slate-100 bg-white p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F2C98A]/45 text-3xl">
              🎒
            </div>

            <h2 className="font-heading mt-5 text-2xl font-black text-[#0F2433]">
              Seu passaporte ainda está vazio
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#45617A]">
              Gere e salve um roteiro para começar a desbloquear selos virtuais.
            </p>

            <Link
              href="/criar-roteiro"
              className="font-heading mt-6 inline-flex rounded-full bg-[#0F4C5C] px-6 py-3 text-sm font-black text-white transition hover:bg-[#10B981]"
            >
              Criar primeiro roteiro
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {selos.map((selo) => (
              <article
                key={selo.id}
                className={
                  selo.desbloqueado
                    ? "card-shadow rounded-[2rem] border border-[#10B981]/20 bg-white p-6"
                    : "rounded-[2rem] border border-slate-100 bg-white/70 p-6 opacity-70"
                }
              >
                <div
                  className={
                    selo.desbloqueado
                      ? "flex h-16 w-16 items-center justify-center rounded-3xl bg-[#10B981]/10 text-3xl"
                      : "flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl grayscale"
                  }
                >
                  {selo.emoji}
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <span
                    className={
                      selo.desbloqueado
                        ? "font-heading rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-bold text-[#0F4C5C]"
                        : "font-heading rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-[#45617A]"
                    }
                  >
                    {selo.desbloqueado ? "Desbloqueado" : "Bloqueado"}
                  </span>
                </div>

                <h3 className="font-heading mt-4 text-xl font-black text-[#0F2433]">
                  {selo.titulo}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#45617A]">
                  {selo.descricao}
                </p>

                <p className="mt-4 text-xs font-bold text-[#0F4C5C]">
                  {selo.progresso}
                </p>
              </article>
            ))}
          </div>
        )}

        {roteiros.length > 0 && (
          <div className="card-shadow mt-8 rounded-[2rem] border border-slate-100 bg-white p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                  Últimos roteiros considerados
                </h2>

                <p className="mt-2 text-sm text-[#45617A]">
                  O passaporte usa os roteiros salvos no navegador para calcular
                  os selos.
                </p>
              </div>

              <Link
                href="/roteiros-salvos"
                className="font-heading rounded-full border border-slate-200 px-5 py-3 text-center text-sm font-bold text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
              >
                Ver roteiros salvos
              </Link>
            </div>

            <div className="mt-6 grid gap-4">
              {roteiros.slice(0, 3).map((roteiro) => (
                <article
                  key={roteiro.id}
                  className="rounded-[1.5rem] bg-slate-50 p-5"
                >
                  <h3 className="font-heading text-lg font-black text-[#0F2433]">
                    {roteiro.titulo}
                  </h3>

                  <p className="mt-2 text-sm text-[#45617A]">
                    {roteiro.paradas.length} parada(s):{" "}
                    {roteiro.paradas.map((parada) => parada.nome).join(", ")}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
