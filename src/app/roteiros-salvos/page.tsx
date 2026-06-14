"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CHAVE_ROTEIROS_SALVOS = "roteirize_roteiros_salvos";

type IconeNome =
  | "route"
  | "map"
  | "clock"
  | "wallet"
  | "signal"
  | "passport"
  | "copy"
  | "trash"
  | "plus"
  | "pin"
  | "warning"
  | "check";

type ParadaSalva = {
  id?: string;
  nome?: string;
  cidade?: string;
  categoria?: string;
  endereco?: string;
  chegada?: string;
  saida?: string;
  deslocamentoAntes?: number;
  tempoSugeridoMin?: number;
  custo?: string;
  precoEstimado?: string;
  avisos?: string[];
};

type ResumoRoteiro = {
  totalVisitas?: number;
  totalDeslocamento?: number;
  totalGeral?: number;
  custoEstimado?: number;
  nivel?: string;
  custo?: {
    minimo?: number;
    maximo?: number;
  };
};

type RoteiroSalvo = {
  id: string;
  titulo?: string;
  criadoEm?: string;
  parametros?: {
    cidadeBase?: string;
    tempoDisponivel?: number;
    horarioInicio?: string;
    transporte?: string;
    orcamento?: string;
    ritmo?: string;
    incluirAlmoco?: boolean;
    interesses?: string[];
    priorizarSelecionados?: boolean;
  };
  resumo?: ResumoRoteiro;
  paradas?: ParadaSalva[];
};

function Icone({
  nome,
  className = "h-5 w-5",
}: {
  nome: IconeNome;
  className?: string;
}) {
  const classes = `${className} stroke-current`;

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

  if (nome === "clock") {
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
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (nome === "wallet") {
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
        <path d="M4 7a3 3 0 0 1 3-3h11v4H7a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13V8" />
        <path d="M16 14h4" />
      </svg>
    );
  }

  if (nome === "signal") {
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
        <path d="M5 19h14" />
        <path d="M7 16v-4" />
        <path d="M12 16V8" />
        <path d="M17 16V5" />
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

  if (nome === "copy") {
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
        <rect x="8" y="8" width="11" height="11" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
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

  if (nome === "plus") {
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
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    );
  }

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

  if (nome === "warning") {
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
        <path d="M12 4 3 20h18L12 4Z" />
        <path d="M12 9v5" />
        <path d="M12 17h.01" />
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
      className={classes}
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function formatarData(data?: string) {
  if (!data) {
    return "Data não informada";
  }

  try {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Data não informada";
  }
}

function calcularTotalParadas(roteiros: RoteiroSalvo[]) {
  return roteiros.reduce(
    (total, roteiro) => total + (roteiro.paradas?.length ?? 0),
    0
  );
}

function obterCustoResumo(resumo?: ResumoRoteiro) {
  if (!resumo) {
    return "Não informado";
  }

  if (typeof resumo.custoEstimado === "number") {
    return `R$ ${resumo.custoEstimado}`;
  }

  if (resumo.custo) {
    const minimo = resumo.custo.minimo ?? 0;
    const maximo = resumo.custo.maximo ?? minimo;

    if (minimo === maximo) {
      return `R$ ${minimo}`;
    }

    return `R$ ${minimo} - R$ ${maximo}`;
  }

  return "Não informado";
}

function obterTempoTotal(resumo?: ResumoRoteiro) {
  if (!resumo) {
    return "Não informado";
  }

  if (typeof resumo.totalGeral === "number") {
    return `${resumo.totalGeral} min`;
  }

  const visitas = resumo.totalVisitas ?? 0;
  const deslocamento = resumo.totalDeslocamento ?? 0;
  const total = visitas + deslocamento;

  if (total > 0) {
    return `${total} min`;
  }

  return "Não informado";
}

function montarLinkGoogleMaps(paradas: ParadaSalva[]) {
  if (paradas.length === 0) {
    return "https://www.google.com/maps";
  }

  function textoLocal(parada: ParadaSalva) {
    return `${parada.nome ?? "Local"}, ${parada.endereco ?? ""}, ${
      parada.cidade ?? "Paraíba"
    }`;
  }

  if (paradas.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      textoLocal(paradas[0])
    )}`;
  }

  const origem = encodeURIComponent(textoLocal(paradas[0]));
  const destino = encodeURIComponent(textoLocal(paradas[paradas.length - 1]));

  const waypointsTexto = paradas
    .slice(1, -1)
    .map((parada) => textoLocal(parada))
    .join("|");

  const waypoints = waypointsTexto
    ? `&waypoints=${encodeURIComponent(waypointsTexto)}`
    : "";

  return `https://www.google.com/maps/dir/?api=1&origin=${origem}&destination=${destino}${waypoints}&travelmode=driving`;
}

function montarTextoRoteiro(roteiro: RoteiroSalvo, indice: number) {
  const paradas = roteiro.paradas ?? [];

  const linhas = [
    roteiro.titulo ?? `Roteiro ${indice + 1}`,
    `Criado em: ${formatarData(roteiro.criadoEm)}`,
    roteiro.parametros?.cidadeBase
      ? `Cidade base: ${roteiro.parametros.cidadeBase}`
      : null,
    `Tempo total: ${obterTempoTotal(roteiro.resumo)}`,
    `Custo estimado: ${obterCustoResumo(roteiro.resumo)}`,
    `Nível: ${roteiro.resumo?.nivel ?? "Não informado"}`,
    "",
    "Paradas:",
    ...paradas.map((parada, index) => {
      const horario =
        parada.chegada || parada.saida
          ? ` (${parada.chegada ?? "--:--"} - ${parada.saida ?? "--:--"})`
          : "";

      return `${index + 1}. ${parada.nome ?? "Local sem nome"}${horario} - ${
        parada.endereco ?? parada.cidade ?? "Endereço não informado"
      }`;
    }),
  ].filter(Boolean);

  return linhas.join("\n");
}

export default function RoteirosSalvosPage() {
  const [roteiros, setRoteiros] = useState<RoteiroSalvo[]>([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const roteirosTexto = localStorage.getItem(CHAVE_ROTEIROS_SALVOS);

    if (!roteirosTexto) {
      return;
    }

    try {
      const roteirosSalvos = JSON.parse(roteirosTexto) as RoteiroSalvo[];
      setRoteiros(Array.isArray(roteirosSalvos) ? roteirosSalvos : []);
    } catch {
      localStorage.removeItem(CHAVE_ROTEIROS_SALVOS);
      setRoteiros([]);
      setMensagem("Havia dados antigos corrompidos. A lista foi reiniciada.");
    }
  }, []);

  const totalParadas = useMemo(
    () => calcularTotalParadas(roteiros),
    [roteiros]
  );

  const totalCidades = useMemo(() => {
    const cidades = new Set<string>();

    roteiros.forEach((roteiro) => {
      roteiro.paradas?.forEach((parada) => {
        if (parada.cidade) {
          cidades.add(parada.cidade);
        }
      });
    });

    return cidades.size;
  }, [roteiros]);

  function removerRoteiro(id: string) {
    const novaLista = roteiros.filter((roteiro) => roteiro.id !== id);

    setRoteiros(novaLista);
    localStorage.setItem(CHAVE_ROTEIROS_SALVOS, JSON.stringify(novaLista));
    setMensagem("Roteiro removido com sucesso.");
  }

  function limparTodos() {
    const confirmar = confirm(
      "Tem certeza que deseja remover todos os roteiros?"
    );

    if (!confirmar) {
      return;
    }

    setRoteiros([]);
    localStorage.removeItem(CHAVE_ROTEIROS_SALVOS);
    setMensagem("Todos os roteiros foram removidos.");
  }

  async function copiarRoteiro(roteiro: RoteiroSalvo, indice: number) {
    try {
      await navigator.clipboard.writeText(montarTextoRoteiro(roteiro, indice));
      setMensagem("Resumo do roteiro copiado.");
    } catch {
      setMensagem("Não foi possível copiar automaticamente neste navegador.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:py-16">
          <div className="max-w-4xl">
            <span className="font-heading rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
              Roteiros salvos
            </span>

            <h1 className="font-heading mt-6 text-4xl font-black leading-tight md:text-6xl">
              Consulte, copie e continue seus roteiros.
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
              Os roteiros ficam salvos neste dispositivo para facilitar a
              consulta depois da criação. Você pode revisar paradas, abrir a rota
              no Google Maps ou copiar o resumo para compartilhar.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/criar-roteiro"
                className="font-heading rounded-full bg-white px-6 py-3 text-center text-sm font-black text-[#0F4C5C] transition hover:bg-[#F2C98A]"
              >
                Criar novo roteiro
              </Link>

              <Link
                href="/explorar"
                className="font-heading rounded-full border border-white/40 bg-white/10 px-6 py-3 text-center text-sm font-black text-white backdrop-blur transition hover:bg-white hover:text-[#0F4C5C]"
              >
                Explorar lugares
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="card-shadow rounded-[1.5rem] bg-white p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
              <Icone nome="route" />
            </div>

            <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
              Roteiros salvos
            </p>

            <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
              {roteiros.length}
            </p>
          </div>

          <div className="card-shadow rounded-[1.5rem] bg-white p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
              <Icone nome="pin" />
            </div>

            <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
              Paradas planejadas
            </p>

            <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
              {totalParadas}
            </p>
          </div>

          <div className="card-shadow rounded-[1.5rem] bg-white p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
              <Icone nome="map" />
            </div>

            <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
              Cidades no roteiro
            </p>

            <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
              {totalCidades}
            </p>
          </div>

          <div className="card-shadow rounded-[1.5rem] bg-white p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
              <Icone nome="passport" />
            </div>

            <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
              Gamificação
            </p>

            <p className="font-heading mt-2 text-xl font-black text-[#10B981]">
              Passaporte ativo
            </p>
          </div>
        </div>

        {mensagem && (
          <div className="mt-6 rounded-2xl border border-[#10B981]/20 bg-[#10B981]/10 p-4 text-sm font-semibold text-[#0F4C5C]">
            {mensagem}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/criar-roteiro"
              className="font-heading inline-flex items-center justify-center gap-2 rounded-full bg-[#0F4C5C] px-6 py-3 text-center text-sm font-black text-white transition hover:bg-[#10B981]"
            >
              <Icone nome="plus" className="h-4 w-4" />
              Criar novo roteiro
            </Link>

            <Link
              href="/passaporte"
              className="font-heading inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-center text-sm font-black text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
            >
              <Icone nome="passport" className="h-4 w-4" />
              Ver passaporte digital
            </Link>
          </div>

          {roteiros.length > 0 && (
            <button
              type="button"
              onClick={limparTodos}
              className="font-heading inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-6 py-3 text-sm font-black text-red-600 transition hover:bg-red-50"
            >
              <Icone nome="trash" className="h-4 w-4" />
              Limpar todos
            </button>
          )}
        </div>

        {roteiros.length === 0 ? (
          <div className="card-shadow mt-8 rounded-[2rem] border border-slate-100 bg-white p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F2C98A]/35 text-[#0F4C5C]">
              <Icone nome="route" className="h-8 w-8" />
            </div>

            <h2 className="font-heading mt-5 text-2xl font-black text-[#0F2433]">
              Nenhum roteiro salvo ainda
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#45617A]">
              Gere um roteiro personalizado e clique em salvar para ele aparecer
              nesta página.
            </p>

            <Link
              href="/criar-roteiro"
              className="font-heading mt-6 inline-flex rounded-full bg-[#10B981] px-6 py-3 text-sm font-black text-white transition hover:bg-[#0F4C5C]"
            >
              Criar primeiro roteiro
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6">
            {roteiros.map((roteiro, roteiroIndex) => {
              const paradas = roteiro.paradas ?? [];
              const linkMaps = montarLinkGoogleMaps(paradas);

              return (
                <article
                  key={roteiro.id ?? roteiroIndex}
                  className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-xs font-bold text-[#0F4C5C]">
                        {formatarData(roteiro.criadoEm)}
                      </span>

                      <h2 className="font-heading mt-5 text-2xl font-black text-[#0F2433]">
                        {roteiro.titulo ?? `Roteiro ${roteiroIndex + 1}`}
                      </h2>

                      <p className="mt-3 text-sm leading-6 text-[#45617A]">
                        {roteiro.parametros?.cidadeBase
                          ? `Cidade base: ${roteiro.parametros.cidadeBase}.`
                          : "Roteiro personalizado gerado pela plataforma."}{" "}
                        {paradas.length} parada(s) planejada(s).
                      </p>

                      {roteiro.parametros?.interesses &&
                        roteiro.parametros.interesses.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {roteiro.parametros.interesses.map((interesse) => (
                              <span
                                key={interesse}
                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-[#45617A]"
                              >
                                {interesse}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>

                    <div className="grid min-w-72 gap-3 sm:grid-cols-3 lg:grid-cols-1">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="font-heading flex items-center gap-2 text-xs font-bold text-[#45617A]">
                          <Icone nome="clock" className="h-4 w-4" />
                          Tempo total
                        </p>

                        <p className="mt-1 font-black text-[#0F4C5C]">
                          {obterTempoTotal(roteiro.resumo)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="font-heading flex items-center gap-2 text-xs font-bold text-[#45617A]">
                          <Icone nome="wallet" className="h-4 w-4" />
                          Custo estimado
                        </p>

                        <p className="mt-1 font-black text-[#0F4C5C]">
                          {obterCustoResumo(roteiro.resumo)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="font-heading flex items-center gap-2 text-xs font-bold text-[#45617A]">
                          <Icone nome="signal" className="h-4 w-4" />
                          Nível
                        </p>

                        <p className="mt-1 font-black text-[#0F4C5C]">
                          {roteiro.resumo?.nivel ?? "Não informado"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {paradas.map((parada, index) => (
                      <div
                        key={`${parada.id ?? parada.nome}-${index}`}
                        className="rounded-[1.5rem] bg-slate-50 p-5"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <span className="font-heading rounded-full bg-white px-3 py-1 text-xs font-bold text-[#0F4C5C]">
                              Parada {index + 1}{" "}
                              <span aria-hidden="true">•</span>{" "}
                              {parada.categoria ?? "Categoria não informada"}
                            </span>

                            <h3 className="font-heading mt-3 text-lg font-black text-[#0F2433]">
                              {parada.nome ?? "Local sem nome"}
                            </h3>

                            <p className="mt-2 flex items-start gap-2 text-sm text-[#45617A]">
                              <Icone
                                nome="pin"
                                className="mt-0.5 h-4 w-4 shrink-0"
                              />
                              <span>
                                {parada.endereco ?? "Endereço não informado"}
                              </span>
                            </p>

                            {(parada.avisos?.length ?? 0) > 0 && (
                              <div className="mt-3 rounded-2xl border border-yellow-200 bg-yellow-50 p-3 text-xs font-semibold text-yellow-800">
                                {parada.avisos?.map((aviso) => (
                                  <p key={aviso} className="flex gap-2">
                                    <Icone
                                      nome="warning"
                                      className="h-4 w-4 shrink-0"
                                    />
                                    <span>{aviso}</span>
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="rounded-2xl bg-white p-4 text-sm">
                            <p className="font-heading font-black text-[#0F4C5C]">
                              {parada.chegada ?? "--:--"} -{" "}
                              {parada.saida ?? "--:--"}
                            </p>

                            <p className="mt-2 text-[#45617A]">
                              Deslocamento: {parada.deslocamentoAntes ?? 0} min
                            </p>

                            <p className="mt-1 text-[#45617A]">
                              No local: {parada.tempoSugeridoMin ?? 0} min
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={linkMaps}
                      target="_blank"
                      rel="noreferrer"
                      className="font-heading inline-flex items-center justify-center gap-2 rounded-full bg-[#0F4C5C] px-6 py-3 text-center text-sm font-black text-white transition hover:bg-[#10B981]"
                    >
                      <Icone nome="map" className="h-4 w-4" />
                      Abrir rota no Google Maps
                    </a>

                    <button
                      type="button"
                      onClick={() => copiarRoteiro(roteiro, roteiroIndex)}
                      className="font-heading inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
                    >
                      <Icone nome="copy" className="h-4 w-4" />
                      Copiar resumo
                    </button>

                    <button
                      type="button"
                      onClick={() => removerRoteiro(roteiro.id)}
                      className="font-heading inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-6 py-3 text-sm font-black text-red-600 transition hover:bg-red-50"
                    >
                      <Icone nome="trash" className="h-4 w-4" />
                      Remover roteiro
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
