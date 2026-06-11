"use client";

import Header from "@/components/Header";
import MapaRoteiro from "@/components/MapaRoteiro";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CHAVE_LUGARES_SELECIONADOS = "roteirize_lugares_selecionados";
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

const opcoesTransporte = ["Carro", "Uber/99", "Transporte público", "A pé"];
const opcoesOrcamento = ["Gratuito", "Econômico", "Médio", "Alto"];
const opcoesRitmo = ["Leve", "Moderado", "Intenso"];

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
    "0",
  )}`;
}

function obterJanelaHorarioIdeal(horarioIdeal: string): JanelaHorario | null {
  const texto = horarioIdeal.toLowerCase().trim();

  const resultado = texto.match(
    /(\d{1,2})h(?:(\d{2}))?\s*(?:às|as|a|-)\s*(\d{1,2})h(?:(\d{2}))?/i,
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
  saidaMinutos: number,
) {
  const janela = obterJanelaHorarioIdeal(lugar.horarioIdeal);

  if (!janela) {
    return [];
  }

  const avisos: string[] = [];

  if (chegadaMinutos < janela.inicio) {
    avisos.push(
      `Chegada prevista antes do horário ideal do local (${lugar.horarioIdeal}).`,
    );
  }

  if (chegadaMinutos > janela.fim) {
    avisos.push(
      `Chegada prevista depois do horário ideal do local (${lugar.horarioIdeal}).`,
    );
  } else if (saidaMinutos > janela.fim) {
    avisos.push(
      `A visita termina após o horário ideal do local (${lugar.horarioIdeal}).`,
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
      (fatorRitmo[ritmo] ?? 1),
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
        setErro("Não foi possível carregar os lugares do banco.");
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
      0,
    );

    const totalDeslocamento = roteiro.reduce(
      (total, parada) => total + parada.deslocamentoAntes,
      0,
    );

    const custoEstimado = roteiro.reduce(
      (total, parada) =>
        total + estimarPrecoNumerico(parada.lugar.precoEstimado),
      0,
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
        },
      );

      if (selecionadosValidos.length > 0) {
        candidatos = selecionadosValidos;
      }
    }

    const ordenados = [...candidatos].sort(
      (a, b) => calcularPontuacao(b) - calcularPontuacao(a),
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
      (parada) => parada.lugar.categoria === "Gastronomia",
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
          ritmo,
        );

        const chegada = arredondarParaMultiplo(horarioAtual + deslocamento, 5);
        const saida = arredondarParaMultiplo(
          chegada + restaurante.tempoSugeridoMin,
          5,
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
        "Não foi possível montar um roteiro com esses filtros. Tente aumentar o tempo disponível ou mudar o orçamento.",
      );
      return;
    }

    const possuiAvisos = paradas.some((parada) => parada.avisos.length > 0);

    setRoteiro(paradas);
    setMensagem(
      possuiAvisos
        ? "Roteiro gerado, mas alguns locais têm avisos de horário. Confira antes de seguir."
        : "Roteiro gerado com sucesso!",
    );
  }

  function salvarRoteiro() {
    if (roteiro.length === 0) {
      setMensagem("Gere um roteiro antes de salvar.");
      return;
    }

    const roteirosSalvosTexto = localStorage.getItem(CHAVE_ROTEIROS_SALVOS);
    const roteirosSalvos = roteirosSalvosTexto
      ? JSON.parse(roteirosSalvosTexto)
      : [];

    const novoRoteiro = {
      id: crypto.randomUUID(),
      titulo: `Roteiro em ${cidadeBase} - ${new Date().toLocaleDateString(
        "pt-BR",
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
      JSON.stringify([novoRoteiro, ...roteirosSalvos]),
    );

    setMensagem("Roteiro salvo com sucesso!");
  }

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      <section className="soft-grid border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <div className="max-w-3xl">
            <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-sm font-bold text-[#0F4C5C]">
              Criador inteligente de roteiros
            </span>

            <h1 className="font-heading mt-6 text-4xl font-black leading-tight text-[#0F2433] md:text-6xl">
              Monte um roteiro personalizado com base no seu tempo e interesses.
            </h1>

            <p className="mt-5 text-lg leading-8 text-[#45617A]">
              O Roteirize PB usa os lugares cadastrados no banco e organiza uma
              sugestão de roteiro considerando cidade, orçamento, transporte,
              ritmo, interesses, horários ideais e locais selecionados na página
              Explorar.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[420px_1fr]">
        <aside className="card-shadow h-fit rounded-[2rem] border border-slate-100 bg-white p-6">
          <h2 className="font-heading text-2xl font-black text-[#0F2433]">
            Preferências
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#45617A]">
            Ajuste os campos abaixo para o sistema gerar uma sugestão de
            roteiro.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
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
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
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
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
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
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
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
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
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
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
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
              <p className="font-heading text-sm font-bold text-[#0F4C5C]">
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
                          ? "font-heading rounded-full bg-[#10B981] px-4 py-2 text-xs font-bold text-white"
                          : "font-heading rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-[#45617A] transition hover:border-[#10B981] hover:text-[#10B981]"
                      }
                    >
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
                <span className="font-heading block text-sm font-bold text-[#0F4C5C]">
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
                <span className="font-heading block text-sm font-bold text-[#0F4C5C]">
                  Priorizar lugares selecionados
                </span>
                <span className="mt-1 block text-xs leading-5 text-[#45617A]">
                  Usa os locais marcados na página Explorar como prioridade.
                </span>
              </span>
            </label>

            <button
              onClick={gerarRoteiro}
              disabled={carregando}
              className="font-heading w-full rounded-full bg-[#0F4C5C] px-6 py-4 text-sm font-black text-white transition hover:bg-[#10B981] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? "Carregando lugares..." : "Gerar roteiro"}
            </button>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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
                    className="rounded-full bg-[#10B981]/10 px-3 py-2 text-xs font-bold text-[#0F4C5C]"
                  >
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
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F2C98A]/50 text-3xl">
                🧭
              </div>

              <h2 className="font-heading mt-5 text-2xl font-black text-[#0F2433]">
                Seu roteiro aparecerá aqui
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#45617A]">
                Preencha suas preferências e clique em gerar roteiro. O sistema
                buscará os lugares do banco e organizará uma sequência viável.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                  <p className="font-heading text-xs font-bold text-[#45617A]">
                    Tempo nos locais
                  </p>
                  <p className="font-heading mt-2 text-2xl font-black text-[#0F4C5C]">
                    {resumo.totalVisitas} min
                  </p>
                </div>

                <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                  <p className="font-heading text-xs font-bold text-[#45617A]">
                    Deslocamento
                  </p>
                  <p className="font-heading mt-2 text-2xl font-black text-[#0F4C5C]">
                    {resumo.totalDeslocamento} min
                  </p>
                </div>

                <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                  <p className="font-heading text-xs font-bold text-[#45617A]">
                    Custo médio
                  </p>
                  <p className="font-heading mt-2 text-2xl font-black text-[#0F4C5C]">
                    R$ {resumo.custoEstimado}
                  </p>
                </div>

                <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                  <p className="font-heading text-xs font-bold text-[#45617A]">
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
                      Gerado com base nos dados carregados do Neon + Prisma.
                    </p>
                  </div>

                  <button
                    onClick={salvarRoteiro}
                    className="font-heading rounded-full bg-[#10B981] px-6 py-3 text-sm font-black text-white transition hover:bg-[#0F4C5C]"
                  >
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
                              Parada {index + 1} • {parada.lugar.categoria}
                            </span>

                            <h3 className="font-heading mt-4 text-xl font-black text-[#0F2433]">
                              {parada.lugar.nome}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#45617A]">
                              {parada.lugar.descricao}
                            </p>

                            <p className="mt-3 text-sm font-semibold text-[#45617A]">
                              {parada.lugar.endereco}
                            </p>

                            <p className="mt-2 text-xs font-bold text-[#0F4C5C]">
                              Horário ideal: {parada.lugar.horarioIdeal}
                            </p>

                            {avisosDaParada.length > 0 && (
                              <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
                                <p className="font-heading text-xs font-black text-yellow-800">
                                  Atenção ao horário
                                </p>

                                <ul className="mt-2 space-y-1 text-xs font-semibold leading-5 text-yellow-800">
                                  {avisosDaParada.map((aviso) => (
                                    <li key={aviso}>• {aviso}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="min-w-40 rounded-2xl bg-white p-4 text-sm">
                            <p className="font-heading font-black text-[#0F4C5C]">
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

              <MapaRoteiro paradas={roteiro} />
            </>
          )}
        </section>
      </section>
    </main>
  );
}
