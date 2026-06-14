"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CHAVE_CHECKINS = "roteirize_checkins";
const CHAVE_ROTEIROS_SALVOS = "roteirize_roteiros_salvos";

type IconeNome =
  | "pin"
  | "compass"
  | "trophy"
  | "waves"
  | "landmark"
  | "utensils"
  | "leaf"
  | "handshake"
  | "map"
  | "notebook"
  | "passport"
  | "check"
  | "trash"
  | "route"
  | "city"
  | "grid"
  | "badge";

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
  icone: IconeNome;
  desbloqueado: boolean;
  progresso: number;
  meta: number;
  textoProgresso: string;
};

function Icone({
  nome,
  className = "h-6 w-6",
}: {
  nome: IconeNome;
  className?: string;
}) {
  const classes = `${className} stroke-current`;

  if (nome === "pin") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  }

  if (nome === "compass") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2.2 5-4.8 2 2.2-5 4.8-2Z" />
        <path d="M12 3v2" />
        <path d="M12 19v2" />
        <path d="M3 12h2" />
        <path d="M19 12h2" />
      </svg>
    );
  }

  if (nome === "trophy") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
        <path d="M8 7H5a2 2 0 0 0 2 4h1" />
        <path d="M16 7h3a2 2 0 0 1-2 4h-1" />
        <path d="M12 13v4" />
        <path d="M9 21h6" />
        <path d="M10 17h4" />
      </svg>
    );
  }

  if (nome === "waves") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="M3 15c2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2 2.2 2 4.4 2" />
        <path d="M3 19c2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2 2.2 2 4.4 2" />
        <path d="M7 10c1.5-2.7 3.5-4 6-4 2.1 0 3.8.9 5 2.6" />
      </svg>
    );
  }

  if (nome === "landmark") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="M4 10h16" />
        <path d="M6 10v8" />
        <path d="M10 10v8" />
        <path d="M14 10v8" />
        <path d="M18 10v8" />
        <path d="M3 18h18" />
        <path d="M5 21h14" />
        <path d="M12 3 4 7h16l-8-4Z" />
      </svg>
    );
  }

  if (nome === "utensils") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="M6 3v7" />
        <path d="M9 3v7" />
        <path d="M6 7h3" />
        <path d="M7.5 10v11" />
        <path d="M17 3c-2 2.1-3 4.4-3 7 0 2.2 1 3.4 3 3.7V21" />
        <path d="M17 3v18" />
      </svg>
    );
  }

  if (nome === "leaf") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="M5 19c8 1 14-5 14-14-9 0-15 6-14 14Z" />
        <path d="M5 19c3-5 7-8 12-10" />
      </svg>
    );
  }

  if (nome === "handshake") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="m8.5 12.5 2.2-2.2a2 2 0 0 1 2.8 0l.4.4" />
        <path d="m14 10.8 1.6-1.6a2 2 0 0 1 2.8 0L21 11.8" />
        <path d="m3 12 3.2-3.2a2 2 0 0 1 2.8 0l1.7 1.7" />
        <path d="m7 14 4.2 4.2a2 2 0 0 0 2.8 0l4.8-4.8" />
      </svg>
    );
  }

  if (nome === "map") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" />
        <path d="M9 4v14" />
        <path d="M15 6v14" />
      </svg>
    );
  }

  if (nome === "notebook") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="M7 3h11a2 2 0 0 1 2 2v16H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" />
        <path d="M7 3v18" />
        <path d="M10 8h6" />
        <path d="M10 12h5" />
      </svg>
    );
  }

  if (nome === "passport") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <rect x="6" y="3" width="12" height="18" rx="2" />
        <circle cx="12" cy="11" r="3" />
        <path d="M9 16h6" />
      </svg>
    );
  }

  if (nome === "check") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }

  if (nome === "trash") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="M4 7h16" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M9 7V4h6v3" />
      </svg>
    );
  }

  if (nome === "route") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M18 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M6 13V8a3 3 0 0 1 3-3h6" />
        <path d="M18 11v5a3 3 0 0 1-3 3H9" />
      </svg>
    );
  }

  if (nome === "city") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="M4 21h16" />
        <path d="M6 21V7l6-4 6 4v14" />
        <path d="M9 21v-6h6v6" />
        <path d="M9 10h.01" />
        <path d="M15 10h.01" />
      </svg>
    );
  }

  if (nome === "grid") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <rect x="4" y="4" width="6" height="6" rx="1.5" />
        <rect x="14" y="4" width="6" height="6" rx="1.5" />
        <rect x="4" y="14" width="6" height="6" rx="1.5" />
        <rect x="14" y="14" width="6" height="6" rx="1.5" />
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
      className={classes}
      aria-hidden="true"
    >
      <path d="M12 3 15 9l6 .8-4.4 4.3 1 6-5.6-3-5.6 3 1-6L3 9.8 9 9l3-6Z" />
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
        icone: "pin",
        desbloqueado: estatisticas.totalCheckins >= 1,
        progresso: estatisticas.totalCheckins,
        meta: 1,
        textoProgresso: textoProgresso(
          estatisticas.totalCheckins,
          1,
          "check-in"
        ),
      },
      {
        id: "explorador-iniciante",
        nome: "Explorador Iniciante",
        descricao: "Faça check-in em 3 lugares diferentes.",
        icone: "compass",
        desbloqueado: estatisticas.totalCheckins >= 3,
        progresso: estatisticas.totalCheckins,
        meta: 3,
        textoProgresso: textoProgresso(
          estatisticas.totalCheckins,
          3,
          "check-ins"
        ),
      },
      {
        id: "explorador-avancado",
        nome: "Explorador Avançado",
        descricao: "Faça check-in em 6 lugares diferentes.",
        icone: "trophy",
        desbloqueado: estatisticas.totalCheckins >= 6,
        progresso: estatisticas.totalCheckins,
        meta: 6,
        textoProgresso: textoProgresso(
          estatisticas.totalCheckins,
          6,
          "check-ins"
        ),
      },
      {
        id: "roteiro-praia",
        nome: "Roteiro de Praia",
        descricao: "Visite pelo menos um atrativo da categoria Praia.",
        icone: "waves",
        desbloqueado: temCategoria("Praia"),
        progresso: temCategoria("Praia") ? 1 : 0,
        meta: 1,
        textoProgresso: temCategoria("Praia") ? "Concluído" : "0/1 visita",
      },
      {
        id: "explorador-cultural",
        nome: "Explorador Cultural",
        descricao: "Visite pelo menos um atrativo cultural.",
        icone: "landmark",
        desbloqueado: temCategoria("Cultura"),
        progresso: temCategoria("Cultura") ? 1 : 0,
        meta: 1,
        textoProgresso: temCategoria("Cultura") ? "Concluído" : "0/1 visita",
      },
      {
        id: "sabor-paraibano",
        nome: "Sabor Paraibano",
        descricao: "Faça check-in em uma experiência gastronômica.",
        icone: "utensils",
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
        icone: "leaf",
        desbloqueado: temCategoria("Natureza"),
        progresso: temCategoria("Natureza") ? 1 : 0,
        meta: 1,
        textoProgresso: temCategoria("Natureza") ? "Concluído" : "0/1 visita",
      },
      {
        id: "vivencia-local",
        nome: "Vivência Local",
        descricao: "Participe de uma experiência local.",
        icone: "handshake",
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
        icone: "map",
        desbloqueado: estatisticas.totalCidades >= 2,
        progresso: estatisticas.totalCidades,
        meta: 2,
        textoProgresso: textoProgresso(
          estatisticas.totalCidades,
          2,
          "cidades"
        ),
      },
      {
        id: "planejador",
        nome: "Planejador de Viagens",
        descricao: "Salve pelo menos um roteiro personalizado.",
        icone: "notebook",
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
      "Tem certeza que deseja limpar todos os check-ins do passaporte?"
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
          <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
            <div className="max-w-4xl">
              <span className="font-heading rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                Passaporte Digital
              </span>

              <h1 className="font-heading mt-6 text-4xl font-black leading-tight md:text-6xl">
                Acompanhe sua jornada pela Paraíba.
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
                Faça check-in em atrativos turísticos, desbloqueie selos
                virtuais e acompanhe sua evolução como explorador paraibano.
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

            <div className="rounded-[2rem] border border-white/20 bg-white/15 p-6 backdrop-blur">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/20 text-white">
                <Icone nome="passport" className="h-8 w-8" />
              </div>

              <p className="font-heading mt-5 text-sm font-bold text-white/80">
                Progresso do passaporte
              </p>

              <p className="font-heading mt-2 text-4xl font-black text-white">
                {progressoGeral}%
              </p>

              <p className="mt-3 text-sm leading-6 text-white/85">
                {selosDesbloqueados} de {selos.length} selo(s) desbloqueado(s).
              </p>
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
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
                  <Icone nome="pin" />
                </div>

                <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
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
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
                  <Icone nome="city" />
                </div>

                <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
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
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
                  <Icone nome="grid" />
                </div>

                <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
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
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
                  <Icone nome="route" />
                </div>

                <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
                  Roteiros
                </p>

                <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
                  {estatisticas.totalRoteiros}
                </p>

                <p className="mt-2 text-xs font-semibold text-[#45617A]">
                  {estatisticas.locaisEmRoteiros} locais planejados
                </p>
              </div>

              <div className="card-shadow rounded-[1.5rem] bg-white p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
                  <Icone nome="badge" />
                </div>

                <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
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
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F2C98A]/35 text-[#0F4C5C]">
                  <Icone nome="pin" className="h-8 w-8" />
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
                    className="font-heading inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-[#45617A] transition hover:border-red-200 hover:text-red-500"
                  >
                    <Icone nome="trash" className="h-4 w-4" />
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
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0F4C5C]">
                          <Icone nome="pin" />
                        </div>

                        <div>
                          <p className="font-heading text-base font-black text-[#0F2433]">
                            {checkin.nome}
                          </p>

                          <p className="mt-1 text-xs font-bold text-[#0F4C5C]">
                            {checkin.cidade} <span aria-hidden="true">•</span>{" "}
                            {checkin.categoria}
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
                    Math.round((selo.progresso / selo.meta) * 100)
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
                              ? "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0F4C5C]"
                              : "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-400"
                          }
                        >
                          <Icone nome={selo.icone} className="h-7 w-7" />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-heading text-lg font-black text-[#0F2433]">
                              {selo.nome}
                            </p>

                            {selo.desbloqueado && (
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#10B981] text-white">
                                <Icone nome="check" className="h-3.5 w-3.5" />
                              </span>
                            )}
                          </div>

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
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                      Roteiros salvos
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#45617A]">
                      Seus roteiros continuam registrados como parte do
                      planejamento de viagem.
                    </p>
                  </div>

                  <Link
                    href="/roteiros-salvos"
                    className="font-heading rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
                  >
                    Ver todos
                  </Link>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {roteiros.slice(0, 4).map((roteiro) => (
                    <Link
                      key={roteiro.id}
                      href="/roteiros-salvos"
                      className="rounded-[1.5rem] bg-slate-50 p-5 transition hover:bg-[#10B981]/10"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0F4C5C]">
                          <Icone nome="route" />
                        </div>

                        <div>
                          <p className="font-heading text-base font-black text-[#0F2433]">
                            {roteiro.titulo ?? "Roteiro salvo"}
                          </p>

                          <p className="mt-2 text-sm text-[#45617A]">
                            {roteiro.paradas?.length ?? 0} parada(s)
                            planejada(s)
                          </p>

                          <p className="mt-2 text-xs text-[#45617A]">
                            Criado em {formatarData(roteiro.criadoEm)}
                          </p>
                        </div>
                      </div>
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
