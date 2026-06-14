"use client";

import Header from "@/components/Header";
import MapaRoteiro from "@/components/MapaRoteiro";
import ResumoRecomendacao from "@/components/ResumoRecomendacao";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CHAVE_LUGARES_SELECIONADOS = "roteirize_lugares_selecionados";
const CHAVE_ROTEIROS_SALVOS = "roteirize_roteiros_salvos";

type IconeNome =
  | "route"
  | "compass"
  | "mapPin"
  | "clock"
  | "car"
  | "wallet"
  | "activity"
  | "utensils"
  | "selection"
  | "check"
  | "save"
  | "warning"
  | "map"
  | "spark"
  | "calendar"
  | "timer"
  | "move"
  | "plus";

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

type ParadaRoteiro = {
  lugar: Lugar;
  chegada: string;
  saida: string;
  deslocamentoAntes: number;
  avisos: string[];
};

type JanelaHorario = {
  inicio: number;
  fim: number;
};

type RoteiroSalvo = {
  id: string;
  titulo?: string;
  criadoEm?: string;
};

const opcoesTransporte = ["Carro", "Uber/99", "Transporte público", "A pé"];
const opcoesOrcamento = ["Gratuito", "Econômico", "Médio", "Alto"];
const opcoesRitmo = ["Leve", "Moderado", "Intenso"];

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

  if (nome === "mapPin") {
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

  if (nome === "car") {
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
        <path d="M5 16h14" />
        <path d="M6 16l1-5a3 3 0 0 1 3-2h4a3 3 0 0 1 3 2l1 5" />
        <path d="M7 16v2" />
        <path d="M17 16v2" />
        <circle cx="8" cy="18" r="1.5" />
        <circle cx="16" cy="18" r="1.5" />
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

  if (nome === "activity") {
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

  if (nome === "selection") {
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
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="m8 12 3 3 5-6" />
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

  if (nome === "save") {
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
        <path d="M5 3h12l2 2v16H5V3Z" />
        <path d="M8 3v6h8V3" />
        <path d="M8 21v-7h8v7" />
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

  if (nome === "spark") {
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
        <path d="M12 3 14 9l6 2-6 2-2 8-2-8-6-2 6-2 2-6Z" />
      </svg>
    );
  }

  if (nome === "calendar") {
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
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="M4 10h16" />
      </svg>
    );
  }

  if (nome === "timer") {
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
        <path d="M10 2h4" />
        <path d="M12 14 15 9" />
        <circle cx="12" cy="14" r="8" />
      </svg>
    );
  }

  if (nome === "move") {
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
        <path d="M7 7h10" />
        <path d="M7 12h10" />
        <path d="M7 17h10" />
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
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function arredondarParaMultiplo(valor: number, multiplo = 5) {
  return Math.round(valor / multiplo) * multiplo;
}

function converterHorarioParaMinutos(horario: string) {
  const [horas, minutos] = horario.split(":").map(Number);
  return horas * 60 + minutos;
}

function converterMinutosParaHorario(totalMinutos: number) {
  const minutosArredondados = arredondarParaMultiplo(totalMinutos, 5);
  const horas = Math.floor(minutosArredondados / 60) % 24;
  const minutos = minutosArredondados % 60;

  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(
    2,
    "0"
  )}`;
}

function obterJanelaHorarioIdeal(horarioIdeal: string): JanelaHorario | null {
  const texto = horarioIdeal.toLowerCase().trim();

  const resultado = texto.match(
    /(\d{1,2})h(?:(\d{2}))?\s*(?:às|as|a|-)\s*(\d{1,2})h(?:(\d{2}))?/i
  );

  if (!resultado) {
    return null;
  }

  const horaInicio = Number(resultado[1]);
  const minutoInicio = resultado[2] ? Number(resultado[2]) : 0;
  const horaFim = Number(resultado[3]);
  const minutoFim = resultado[4] ? Number(resultado[4]) : 0;

  const inicio = horaInicio * 60 + minutoInicio;
  let fim = horaFim * 60 + minutoFim;

  if (fim <= inicio) {
    fim += 24 * 60;
  }

  return {
    inicio,
    fim,
  };
}

function obterAvisosHorarioIdeal(
  lugar: Lugar,
  chegadaMinutos: number,
  saidaMinutos: number
) {
  const janela = obterJanelaHorarioIdeal(lugar.horarioIdeal);

  if (!janela) {
    return [];
  }

  const avisos: string[] = [];

  if (chegadaMinutos < janela.inicio) {
    avisos.push(
      `Chegada prevista antes do horário ideal do local (${lugar.horarioIdeal}).`
    );
  }

  if (chegadaMinutos > janela.fim) {
    avisos.push(
      `Chegada prevista depois do horário ideal do local (${lugar.horarioIdeal}).`
    );
  } else if (saidaMinutos > janela.fim) {
    avisos.push(
      `A visita termina após o horário ideal do local (${lugar.horarioIdeal}).`
    );
  }

  return avisos;
}

function calcularDeslocamento(lugar: Lugar, transporte: string, ritmo: string) {
  const basePorDistancia = Math.max(8, Math.round(lugar.distanciaCentroKm * 2));

  const fatorTransporte: Record<string, number> = {
    Carro: 0.8,
    "Uber/99": 0.9,
    "Transporte público": 1.4,
    "A pé": 2,
  };

  const fatorRitmo: Record<string, number> = {
    Leve: 1.2,
    Moderado: 1,
    Intenso: 0.85,
  };

  const deslocamento = Math.round(
    basePorDistancia *
      (fatorTransporte[transporte] ?? 1) *
      (fatorRitmo[ritmo] ?? 1)
  );

  return Math.max(5, arredondarParaMultiplo(deslocamento, 5));
}

function custoCabeNoOrcamento(custo: string, orcamento: string) {
  const pesos: Record<string, number> = {
    Gratuito: 1,
    Econômico: 2,
    Médio: 3,
    Alto: 4,
  };

  return (pesos[custo] ?? 4) <= (pesos[orcamento] ?? 4);
}

function estimarPrecoNumerico(precoEstimado: string) {
  const valores = precoEstimado.match(/\d+/g)?.map(Number) ?? [];

  if (valores.length === 0) {
    return 0;
  }

  const soma = valores.reduce((total, valor) => total + valor, 0);
  return Math.round(soma / valores.length);
}

function classificarNivel(totalMinutos: number) {
  if (totalMinutos <= 240) {
    return "Roteiro leve";
  }

  if (totalMinutos <= 420) {
    return "Roteiro moderado";
  }

  return "Roteiro intenso";
}

function carregarRoteirosSalvos() {
  const texto = localStorage.getItem(CHAVE_ROTEIROS_SALVOS);

  if (!texto) {
    return [];
  }

  try {
    const dados = JSON.parse(texto) as RoteiroSalvo[];
    return Array.isArray(dados) ? dados : [];
  } catch {
    localStorage.removeItem(CHAVE_ROTEIROS_SALVOS);
    return [];
  }
}

export default function CriarRoteiroPage() {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [lugaresSelecionados, setLugaresSelecionados] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [cidadeBase, setCidadeBase] = useState("João Pessoa");
  const [tempoDisponivel, setTempoDisponivel] = useState(5);
  const [horarioInicio, setHorarioInicio] = useState("08:00");
  const [transporte, setTransporte] = useState("Carro");
  const [orcamento, setOrcamento] = useState("Médio");
  const [ritmo, setRitmo] = useState("Moderado");
  const [incluirAlmoco, setIncluirAlmoco] = useState(true);
  const [priorizarSelecionados, setPriorizarSelecionados] = useState(true);
  const [interesses, setInteresses] = useState<string[]>(["Praia", "Cultura"]);

  const [roteiro, setRoteiro] = useState<ParadaRoteiro[]>([]);
  const [mensagem, setMensagem] = useState("");

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
        setErro("Não foi possível carregar os lugares disponíveis.");
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
        const selecionados = JSON.parse(selecionadosSalvos) as unknown[];
        setLugaresSelecionados(selecionados.map(String));
      } catch {
        localStorage.removeItem(CHAVE_LUGARES_SELECIONADOS);
      }
    }
  }, []);

  const cidades = useMemo(() => {
    return [
      "Todas",
      ...Array.from(new Set(lugares.map((lugar) => lugar.cidade))),
    ];
  }, [lugares]);

  const categorias = useMemo(() => {
    return Array.from(new Set(lugares.map((lugar) => lugar.categoria)));
  }, [lugares]);

  const lugaresSelecionadosDetalhados = useMemo(() => {
    return lugares.filter((lugar) => lugaresSelecionados.includes(lugar.id));
  }, [lugares, lugaresSelecionados]);

  const resumo = useMemo(() => {
    const totalVisitas = roteiro.reduce(
      (total, parada) => total + parada.lugar.tempoSugeridoMin,
      0
    );

    const totalDeslocamento = roteiro.reduce(
      (total, parada) => total + parada.deslocamentoAntes,
      0
    );

    const custoEstimado = roteiro.reduce(
      (total, parada) =>
        total + estimarPrecoNumerico(parada.lugar.precoEstimado),
      0
    );

    return {
      totalVisitas,
      totalDeslocamento,
      totalGeral: totalVisitas + totalDeslocamento,
      custoEstimado,
      nivel: classificarNivel(totalVisitas + totalDeslocamento),
    };
  }, [roteiro]);

  function alternarInteresse(categoria: string) {
    const jaSelecionado = interesses.includes(categoria);

    if (jaSelecionado) {
      setInteresses(interesses.filter((item) => item !== categoria));
      return;
    }

    setInteresses([...interesses, categoria]);
  }

  function calcularPontuacao(lugar: Lugar) {
    let pontuacao = lugar.nota * 10;

    if (interesses.includes(lugar.categoria)) {
      pontuacao += 25;
    }

    if (cidadeBase === "Todas" || lugar.cidade === cidadeBase) {
      pontuacao += 15;
    }

    if (custoCabeNoOrcamento(lugar.custo, orcamento)) {
      pontuacao += 12;
    } else {
      pontuacao -= 20;
    }

    if (lugaresSelecionados.includes(lugar.id)) {
      pontuacao += 30;
    }

    pontuacao -= Math.min(lugar.distanciaCentroKm / 2, 20);

    return pontuacao;
  }

  function gerarRoteiro() {
    setMensagem("");

    if (lugares.length === 0) {
      setMensagem("Nenhum lugar disponível para gerar o roteiro.");
      return;
    }

    const tempoMaximoMinutos = tempoDisponivel * 60;
    const inicioEmMinutos = converterHorarioParaMinutos(horarioInicio);

    let candidatos = lugares.filter((lugar) => {
      const combinaCidade =
        cidadeBase === "Todas" || lugar.cidade === cidadeBase;
      const combinaCusto = custoCabeNoOrcamento(lugar.custo, orcamento);

      return combinaCidade && combinaCusto;
    });

    if (
      priorizarSelecionados &&
      lugaresSelecionados.length > 0 &&
      lugaresSelecionadosDetalhados.length > 0
    ) {
      const selecionadosValidos = lugaresSelecionadosDetalhados.filter(
        (lugar) => {
          const combinaCidade =
            cidadeBase === "Todas" || lugar.cidade === cidadeBase;
          const combinaCusto = custoCabeNoOrcamento(lugar.custo, orcamento);

          return combinaCidade && combinaCusto;
        }
      );

      if (selecionadosValidos.length > 0) {
        candidatos = selecionadosValidos;
      }
    }

    const ordenados = [...candidatos].sort(
      (a, b) => calcularPontuacao(b) - calcularPontuacao(a)
    );

    const paradas: ParadaRoteiro[] = [];
    let tempoUsado = 0;
    let horarioAtual = inicioEmMinutos;

    for (const lugar of ordenados) {
      const deslocamento =
        paradas.length === 0
          ? Math.min(calcularDeslocamento(lugar, transporte, ritmo), 25)
          : calcularDeslocamento(lugar, transporte, ritmo);

      const chegada = arredondarParaMultiplo(horarioAtual + deslocamento, 5);
      const saida = arredondarParaMultiplo(chegada + lugar.tempoSugeridoMin, 5);
      const tempoDaParada = deslocamento + lugar.tempoSugeridoMin;

      if (tempoUsado + tempoDaParada > tempoMaximoMinutos) {
        continue;
      }

      const avisos = obterAvisosHorarioIdeal(lugar, chegada, saida);

      paradas.push({
        lugar,
        chegada: converterMinutosParaHorario(chegada),
        saida: converterMinutosParaHorario(saida),
        deslocamentoAntes: deslocamento,
        avisos,
      });

      tempoUsado += tempoDaParada;
      horarioAtual = saida;
    }

    const temGastronomia = paradas.some(
      (parada) => parada.lugar.categoria === "Gastronomia"
    );

    if (incluirAlmoco && !temGastronomia) {
      const restaurante = lugares
        .filter((lugar) => {
          const combinaCidade =
            cidadeBase === "Todas" || lugar.cidade === cidadeBase;
          const combinaCusto = custoCabeNoOrcamento(lugar.custo, orcamento);

          return (
            lugar.categoria === "Gastronomia" &&
            combinaCidade &&
            combinaCusto &&
            !paradas.some((parada) => parada.lugar.id === lugar.id)
          );
        })
        .sort((a, b) => b.nota - a.nota)[0];

      if (restaurante) {
        const deslocamento = calcularDeslocamento(
          restaurante,
          transporte,
          ritmo
        );

        const chegada = arredondarParaMultiplo(horarioAtual + deslocamento, 5);
        const saida = arredondarParaMultiplo(
          chegada + restaurante.tempoSugeridoMin,
          5
        );
        const tempoDaParada = deslocamento + restaurante.tempoSugeridoMin;

        if (tempoUsado + tempoDaParada <= tempoMaximoMinutos) {
          const avisos = obterAvisosHorarioIdeal(restaurante, chegada, saida);

          paradas.push({
            lugar: restaurante,
            chegada: converterMinutosParaHorario(chegada),
            saida: converterMinutosParaHorario(saida),
            deslocamentoAntes: deslocamento,
            avisos,
          });
        }
      }
    }

    if (paradas.length === 0) {
      setRoteiro([]);
      setMensagem(
        "Não foi possível montar um roteiro com esses filtros. Tente aumentar o tempo disponível ou mudar o orçamento."
      );
      return;
    }

    const possuiAvisos = paradas.some((parada) => parada.avisos.length > 0);

    setRoteiro(paradas);
    setMensagem(
      possuiAvisos
        ? "Roteiro gerado, mas alguns locais têm avisos de horário. Confira antes de seguir."
        : "Roteiro gerado com sucesso!"
    );
  }

  function salvarRoteiro() {
    if (roteiro.length === 0) {
      setMensagem("Gere um roteiro antes de salvar.");
      return;
    }

    const roteirosSalvos = carregarRoteirosSalvos();

    const novoRoteiro = {
      id: crypto.randomUUID(),
      titulo: `Roteiro em ${cidadeBase} - ${new Date().toLocaleDateString(
        "pt-BR"
      )}`,
      criadoEm: new Date().toISOString(),
      parametros: {
        cidadeBase,
        tempoDisponivel,
        horarioInicio,
        transporte,
        orcamento,
        ritmo,
        incluirAlmoco,
        interesses,
        priorizarSelecionados,
      },
      resumo,
      paradas: roteiro.map((parada) => ({
        id: parada.lugar.id,
        nome: parada.lugar.nome,
        cidade: parada.lugar.cidade,
        categoria: parada.lugar.categoria,
        endereco: parada.lugar.endereco,
        chegada: parada.chegada,
        saida: parada.saida,
        deslocamentoAntes: parada.deslocamentoAntes,
        tempoSugeridoMin: parada.lugar.tempoSugeridoMin,
        custo: parada.lugar.custo,
        precoEstimado: parada.lugar.precoEstimado,
        avisos: parada.avisos ?? [],
      })),
    };

    localStorage.setItem(
      CHAVE_ROTEIROS_SALVOS,
      JSON.stringify([novoRoteiro, ...roteirosSalvos])
    );

    setMensagem("Roteiro salvo com sucesso!");
  }

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
            <div className="max-w-4xl">
              <span className="font-heading rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                Criador inteligente de roteiros
              </span>

              <h1 className="font-heading mt-6 text-4xl font-black leading-tight md:text-6xl">
                Monte um roteiro personalizado com base no seu tempo e interesses.
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
                O Roteirize PB organiza uma sugestão de passeio considerando
                cidade, orçamento, transporte, ritmo, interesses, horários
                ideais e locais selecionados na página Explorar.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/20 bg-white/15 p-6 backdrop-blur">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/20 text-white">
                <Icone nome="route" className="h-8 w-8" />
              </div>

              <p className="font-heading mt-5 text-sm font-bold text-white/80">
                Planejamento rápido
              </p>

              <p className="font-heading mt-2 text-4xl font-black text-white">
                {roteiro.length || lugaresSelecionadosDetalhados.length}
              </p>

              <p className="mt-3 text-sm leading-6 text-white/85">
                {roteiro.length > 0
                  ? "parada(s) no roteiro gerado."
                  : "lugar(es) selecionado(s) serão considerados."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[420px_1fr]">
        <aside className="card-shadow h-fit rounded-[2rem] border border-slate-100 bg-white p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
              <Icone nome="compass" />
            </div>

            <div>
              <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                Preferências
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#45617A]">
                Ajuste os campos abaixo para o sistema gerar uma sugestão de
                roteiro.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label className="font-heading flex items-center gap-2 text-sm font-bold text-[#0F4C5C]">
                <Icone nome="mapPin" className="h-4 w-4" />
                Cidade base
              </label>

              <select
                value={cidadeBase}
                onChange={(event) => setCidadeBase(event.target.value)}
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
              <label className="font-heading flex items-center gap-2 text-sm font-bold text-[#0F4C5C]">
                <Icone nome="timer" className="h-4 w-4" />
                Tempo disponível: {tempoDisponivel}h
              </label>

              <input
                type="range"
                min={2}
                max={10}
                value={tempoDisponivel}
                onChange={(event) =>
                  setTempoDisponivel(Number(event.target.value))
                }
                className="mt-3 w-full"
              />
            </div>

            <div>
              <label className="font-heading flex items-center gap-2 text-sm font-bold text-[#0F4C5C]">
                <Icone nome="calendar" className="h-4 w-4" />
                Horário inicial
              </label>

              <input
                type="time"
                value={horarioInicio}
                onChange={(event) => setHorarioInicio(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="font-heading flex items-center gap-2 text-sm font-bold text-[#0F4C5C]">
                <Icone nome="car" className="h-4 w-4" />
                Transporte
              </label>

              <select
                value={transporte}
                onChange={(event) => setTransporte(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              >
                {opcoesTransporte.map((opcao) => (
                  <option key={opcao} value={opcao}>
                    {opcao}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-heading flex items-center gap-2 text-sm font-bold text-[#0F4C5C]">
                <Icone nome="wallet" className="h-4 w-4" />
                Orçamento
              </label>

              <select
                value={orcamento}
                onChange={(event) => setOrcamento(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              >
                {opcoesOrcamento.map((opcao) => (
                  <option key={opcao} value={opcao}>
                    {opcao}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-heading flex items-center gap-2 text-sm font-bold text-[#0F4C5C]">
                <Icone nome="activity" className="h-4 w-4" />
                Ritmo
              </label>

              <select
                value={ritmo}
                onChange={(event) => setRitmo(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              >
                {opcoesRitmo.map((opcao) => (
                  <option key={opcao} value={opcao}>
                    {opcao}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="font-heading flex items-center gap-2 text-sm font-bold text-[#0F4C5C]">
                <Icone nome="spark" className="h-4 w-4" />
                Interesses
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {categorias.map((categoria) => {
                  const ativo = interesses.includes(categoria);

                  return (
                    <button
                      key={categoria}
                      type="button"
                      onClick={() => alternarInteresse(categoria)}
                      className={
                        ativo
                          ? "font-heading inline-flex items-center gap-2 rounded-full bg-[#10B981] px-4 py-2 text-xs font-bold text-white"
                          : "font-heading inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-[#45617A] transition hover:border-[#10B981] hover:text-[#10B981]"
                      }
                    >
                      {ativo && <Icone nome="check" className="h-3.5 w-3.5" />}
                      {categoria}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={incluirAlmoco}
                onChange={(event) => setIncluirAlmoco(event.target.checked)}
                className="mt-1"
              />

              <span>
                <span className="font-heading flex items-center gap-2 text-sm font-bold text-[#0F4C5C]">
                  <Icone nome="utensils" className="h-4 w-4" />
                  Incluir parada para almoço
                </span>

                <span className="mt-1 block text-xs leading-5 text-[#45617A]">
                  O sistema tenta encaixar uma opção gastronômica se houver
                  tempo disponível.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={priorizarSelecionados}
                onChange={(event) =>
                  setPriorizarSelecionados(event.target.checked)
                }
                className="mt-1"
              />

              <span>
                <span className="font-heading flex items-center gap-2 text-sm font-bold text-[#0F4C5C]">
                  <Icone nome="selection" className="h-4 w-4" />
                  Priorizar lugares selecionados
                </span>

                <span className="mt-1 block text-xs leading-5 text-[#45617A]">
                  Usa os locais marcados na página Explorar como prioridade.
                </span>
              </span>
            </label>

            <button
              type="button"
              onClick={gerarRoteiro}
              disabled={carregando}
              className="font-heading inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F4C5C] px-6 py-4 text-sm font-black text-white transition hover:bg-[#10B981] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icone nome="route" className="h-4 w-4" />
              {carregando ? "Carregando lugares..." : "Gerar roteiro"}
            </button>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
                  <Icone nome="selection" />
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                    Seleção da página Explorar
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#45617A]">
                    {lugaresSelecionadosDetalhados.length > 0
                      ? `${lugaresSelecionadosDetalhados.length} lugar(es) selecionado(s) serão considerados na geração.`
                      : "Nenhum lugar foi selecionado ainda. Você pode gerar um roteiro automático ou escolher lugares em Explorar."}
                  </p>
                </div>
              </div>

              <Link
                href="/explorar"
                className="font-heading rounded-full border border-slate-200 px-5 py-3 text-center text-sm font-bold text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
              >
                Escolher lugares
              </Link>
            </div>

            {lugaresSelecionadosDetalhados.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {lugaresSelecionadosDetalhados.map((lugar) => (
                  <span
                    key={lugar.id}
                    className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/10 px-3 py-2 text-xs font-bold text-[#0F4C5C]"
                  >
                    <Icone nome="mapPin" className="h-3.5 w-3.5" />
                    {lugar.nome}
                  </span>
                ))}
              </div>
            )}
          </div>

          {erro && (
            <div className="rounded-[2rem] border border-red-100 bg-red-50 p-6 font-semibold text-red-600">
              {erro}
            </div>
          )}

          {mensagem && (
            <div className="rounded-[2rem] border border-[#10B981]/20 bg-[#10B981]/10 p-6 font-semibold text-[#0F4C5C]">
              {mensagem}
            </div>
          )}

          {roteiro.length === 0 ? (
            <div className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F2C98A]/35 text-[#0F4C5C]">
                <Icone nome="compass" className="h-8 w-8" />
              </div>

              <h2 className="font-heading mt-5 text-2xl font-black text-[#0F2433]">
                Seu roteiro aparecerá aqui
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#45617A]">
                Preencha suas preferências e clique em gerar roteiro. O sistema
                organizará uma sequência viável com base nas suas escolhas.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
                    <Icone nome="clock" className="h-5 w-5" />
                  </div>

                  <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
                    Tempo nos locais
                  </p>

                  <p className="font-heading mt-2 text-2xl font-black text-[#0F4C5C]">
                    {resumo.totalVisitas} min
                  </p>
                </div>

                <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
                    <Icone nome="move" className="h-5 w-5" />
                  </div>

                  <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
                    Deslocamento
                  </p>

                  <p className="font-heading mt-2 text-2xl font-black text-[#0F4C5C]">
                    {resumo.totalDeslocamento} min
                  </p>
                </div>

                <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
                    <Icone nome="wallet" className="h-5 w-5" />
                  </div>

                  <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
                    Custo médio
                  </p>

                  <p className="font-heading mt-2 text-2xl font-black text-[#0F4C5C]">
                    R$ {resumo.custoEstimado}
                  </p>
                </div>

                <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
                    <Icone nome="activity" className="h-5 w-5" />
                  </div>

                  <p className="font-heading mt-4 text-xs font-bold text-[#45617A]">
                    Nível
                  </p>

                  <p className="font-heading mt-2 text-lg font-black text-[#0F4C5C]">
                    {resumo.nivel}
                  </p>
                </div>
              </div>

              <div className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                      Roteiro sugerido
                    </h2>

                    <p className="mt-2 text-sm text-[#45617A]">
                      Sugestão organizada de acordo com suas preferências de
                      viagem.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={salvarRoteiro}
                    className="font-heading inline-flex items-center justify-center gap-2 rounded-full bg-[#10B981] px-6 py-3 text-sm font-black text-white transition hover:bg-[#0F4C5C]"
                  >
                    <Icone nome="save" className="h-4 w-4" />
                    Salvar roteiro
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {roteiro.map((parada, index) => {
                    const avisosDaParada = parada.avisos ?? [];

                    return (
                      <article
                        key={parada.lugar.id}
                        className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <span className="font-heading rounded-full bg-white px-3 py-1 text-xs font-bold text-[#0F4C5C]">
                              Parada {index + 1}{" "}
                              <span aria-hidden="true">•</span>{" "}
                              {parada.lugar.categoria}
                            </span>

                            <h3 className="font-heading mt-4 text-xl font-black text-[#0F2433]">
                              {parada.lugar.nome}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#45617A]">
                              {parada.lugar.descricao}
                            </p>

                            <p className="mt-3 flex items-start gap-2 text-sm font-semibold text-[#45617A]">
                              <Icone
                                nome="mapPin"
                                className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4C5C]"
                              />
                              <span>{parada.lugar.endereco}</span>
                            </p>

                            <p className="mt-2 flex items-center gap-2 text-xs font-bold text-[#0F4C5C]">
                              <Icone nome="clock" className="h-4 w-4" />
                              Horário ideal: {parada.lugar.horarioIdeal}
                            </p>

                            {avisosDaParada.length > 0 && (
                              <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
                                <p className="font-heading flex items-center gap-2 text-xs font-black text-yellow-800">
                                  <Icone nome="warning" className="h-4 w-4" />
                                  Atenção ao horário
                                </p>

                                <ul className="mt-2 space-y-2 text-xs font-semibold leading-5 text-yellow-800">
                                  {avisosDaParada.map((aviso) => (
                                    <li key={aviso} className="flex gap-2">
                                      <Icone
                                        nome="warning"
                                        className="h-4 w-4 shrink-0"
                                      />
                                      <span>{aviso}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="min-w-40 rounded-2xl bg-white p-4 text-sm">
                            <p className="font-heading flex items-center gap-2 font-black text-[#0F4C5C]">
                              <Icone nome="calendar" className="h-4 w-4" />
                              {parada.chegada} - {parada.saida}
                            </p>

                            <p className="mt-2 text-[#45617A]">
                              Deslocamento: {parada.deslocamentoAntes} min
                            </p>

                            <p className="mt-1 text-[#45617A]">
                              No local: {parada.lugar.tempoSugeridoMin} min
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <ResumoRecomendacao
                roteiro={roteiro}
                cidadeBase={cidadeBase}
                orcamento={orcamento}
                ritmo={ritmo}
                transporte={transporte}
                interesses={interesses}
                priorizarSelecionados={priorizarSelecionados}
              />

              <MapaRoteiro paradas={roteiro} />
            </>
          )}
        </section>
      </section>
    </main>
  );
}
