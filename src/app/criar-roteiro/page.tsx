"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { Categoria, Custo, Lugar, lugares } from "@/data/lugares";
import { useEffect, useMemo, useState } from "react";

const CHAVE_LUGARES_SELECIONADOS = "roteirize_lugares_selecionados";
const CHAVE_ROTEIROS_SALVOS = "roteirize_roteiros_salvos";

const interessesDisponiveis: Categoria[] = [
  "Praia",
  "Cultura",
  "Gastronomia",
  "Natureza",
  "Experiência",
];

const opcoesOrcamento: Array<Custo | "Livre"> = [
  "Gratuito",
  "Econômico",
  "Médio",
  "Alto",
  "Livre",
];

const prioridadeManha: Record<Categoria, number> = {
  Cultura: 1,
  Praia: 2,
  Natureza: 3,
  Experiência: 4,
  Gastronomia: 5,
};

const prioridadeTarde: Record<Categoria, number> = {
  Gastronomia: 1,
  Experiência: 2,
  Natureza: 3,
  Praia: 4,
  Cultura: 5,
};

type ItemRoteiroGerado = {
  lugar: Lugar;
  chegada: string;
  saida: string;
  deslocamentoAntes: number;
};

type RoteiroSalvo = {
  id: number;
  titulo: string;
  criadoEm: string;
  cidadeBase: string;
  tempoDisponivel: number;
  horarioInicio: string;
  transporte: string;
  orcamento: Custo | "Livre";
  ritmo: string;
  incluirAlmoco: boolean;
  interesses: Categoria[];
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
    categoria: Categoria;
    chegada: string;
    saida: string;
    deslocamentoAntes: number;
    tempoSugeridoMin: number;
    precoEstimado: string;
    nota: number;
  }>;
};

function formatarHora(minutosTotais: number) {
  const horas = Math.floor(minutosTotais / 60);
  const minutos = minutosTotais % 60;

  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

function horaParaMinutos(hora: string) {
  const [horas, minutos] = hora.split(":").map(Number);
  return horas * 60 + minutos;
}

function custoPermitido(lugar: Lugar, orcamento: Custo | "Livre") {
  if (orcamento === "Livre") return true;

  const ordem: Record<Custo, number> = {
    Gratuito: 1,
    Econômico: 2,
    Médio: 3,
    Alto: 4,
  };

  return ordem[lugar.custo] <= ordem[orcamento];
}

function estimarCusto(lugar: Lugar) {
  if (lugar.custo === "Gratuito") return { minimo: 0, maximo: 20 };
  if (lugar.custo === "Econômico") return { minimo: 10, maximo: 80 };
  if (lugar.custo === "Médio") return { minimo: 50, maximo: 120 };

  return { minimo: 100, maximo: 200 };
}

function calcularDeslocamento(transporte: string, ritmo: string) {
  let deslocamento = 20;

  if (transporte === "A pé") deslocamento = 30;
  if (transporte === "Ônibus") deslocamento = 35;
  if (transporte === "Uber") deslocamento = 20;
  if (transporte === "Carro") deslocamento = 18;

  if (ritmo === "Leve") deslocamento += 10;
  if (ritmo === "Intenso") deslocamento -= 5;

  return Math.max(deslocamento, 10);
}

function calcularLimiteDeParadas(ritmo: string) {
  if (ritmo === "Leve") return 4;
  if (ritmo === "Moderado") return 5;

  return 7;
}

export default function CriarRoteiroPage() {
  const [cidadeBase, setCidadeBase] = useState("João Pessoa e região");
  const [tempoDisponivel, setTempoDisponivel] = useState(8);
  const [horarioInicio, setHorarioInicio] = useState("08:00");
  const [transporte, setTransporte] = useState("Carro");
  const [orcamento, setOrcamento] = useState<Custo | "Livre">("Médio");
  const [ritmo, setRitmo] = useState("Moderado");
  const [incluirAlmoco, setIncluirAlmoco] = useState(true);
  const [usarSelecionados, setUsarSelecionados] = useState(true);
  const [lugaresSelecionadosIds, setLugaresSelecionadosIds] = useState<number[]>(
    []
  );
  const [roteiroSalvo, setRoteiroSalvo] = useState(false);

  const [interesses, setInteresses] = useState<Categoria[]>([
    "Praia",
    "Cultura",
    "Gastronomia",
  ]);

  useEffect(() => {
    const lugaresSalvos = localStorage.getItem(CHAVE_LUGARES_SELECIONADOS);

    if (lugaresSalvos) {
      const idsSalvos = JSON.parse(lugaresSalvos);

      if (Array.isArray(idsSalvos)) {
        setLugaresSelecionadosIds(idsSalvos);
      }
    }
  }, []);

  const lugaresSelecionados = useMemo(() => {
    return lugares.filter((lugar) => lugaresSelecionadosIds.includes(lugar.id));
  }, [lugaresSelecionadosIds]);

  const cidades = useMemo(() => {
    return [
      "João Pessoa e região",
      "Todas",
      ...Array.from(new Set(lugares.map((lugar) => lugar.cidade))),
    ];
  }, []);

  function limparSelecao() {
    localStorage.removeItem(CHAVE_LUGARES_SELECIONADOS);
    setLugaresSelecionadosIds([]);
    setUsarSelecionados(false);
  }

  const roteiro = useMemo<ItemRoteiroGerado[]>(() => {
    const tempoMaximoMin = tempoDisponivel * 60;
    const deslocamentoMedio = calcularDeslocamento(transporte, ritmo);
    const limiteParadas = calcularLimiteDeParadas(ritmo);

    const usarBaseSelecionada =
      usarSelecionados && lugaresSelecionadosIds.length > 0;

    const baseDeLugares = usarBaseSelecionada ? lugaresSelecionados : lugares;

    const dentroDaCidade = (lugar: Lugar) => {
      if (cidadeBase === "Todas") return true;

      if (cidadeBase === "João Pessoa e região") {
        return lugar.distanciaCentroKm <= 40;
      }

      return lugar.cidade === cidadeBase;
    };

    const candidatos = baseDeLugares
      .filter(dentroDaCidade)
      .filter((lugar) => custoPermitido(lugar, orcamento))
      .filter((lugar) => {
        if (interesses.length === 0) return true;
        if (incluirAlmoco && lugar.categoria === "Gastronomia") return true;

        return interesses.includes(lugar.categoria);
      });

    let restaurante = incluirAlmoco
      ? candidatos
          .filter((lugar) => lugar.categoria === "Gastronomia")
          .sort((a, b) => b.nota - a.nota)[0]
      : undefined;

    if (!restaurante && incluirAlmoco) {
      restaurante = lugares
        .filter(dentroDaCidade)
        .filter((lugar) => custoPermitido(lugar, orcamento))
        .filter((lugar) => lugar.categoria === "Gastronomia")
        .sort((a, b) => b.nota - a.nota)[0];
    }

    const candidatosSemRestaurante = candidatos.filter(
      (lugar) => lugar.id !== restaurante?.id
    );

    const manha = candidatosSemRestaurante
      .filter((lugar) => lugar.categoria !== "Gastronomia")
      .sort((a, b) => {
        const prioridade =
          prioridadeManha[a.categoria] - prioridadeManha[b.categoria];

        if (prioridade !== 0) return prioridade;

        return b.nota - a.nota;
      });

    const tarde = candidatosSemRestaurante
      .filter((lugar) => lugar.categoria !== "Gastronomia")
      .sort((a, b) => {
        const prioridade =
          prioridadeTarde[a.categoria] - prioridadeTarde[b.categoria];

        if (prioridade !== 0) return prioridade;

        return b.nota - a.nota;
      });

    const ordemSugerida: Lugar[] = [];

    for (const lugar of manha) {
      if (!ordemSugerida.some((item) => item.id === lugar.id)) {
        ordemSugerida.push(lugar);
      }

      if (ordemSugerida.length >= 2) break;
    }

    if (restaurante) {
      ordemSugerida.push(restaurante);
    }

    for (const lugar of tarde) {
      if (!ordemSugerida.some((item) => item.id === lugar.id)) {
        ordemSugerida.push(lugar);
      }

      if (ordemSugerida.length >= limiteParadas) break;
    }

    let tempoUsado = 0;
    let horarioAtual = horaParaMinutos(horarioInicio);

    const selecionados: ItemRoteiroGerado[] = [];

    for (const lugar of ordemSugerida) {
      const deslocamentoAntes =
        selecionados.length === 0 ? 0 : deslocamentoMedio;

      const tempoNecessario = deslocamentoAntes + lugar.tempoSugeridoMin;

      if (tempoUsado + tempoNecessario <= tempoMaximoMin) {
        horarioAtual += deslocamentoAntes;

        const chegada = formatarHora(horarioAtual);

        horarioAtual += lugar.tempoSugeridoMin;

        const saida = formatarHora(horarioAtual);

        selecionados.push({
          lugar,
          chegada,
          saida,
          deslocamentoAntes,
        });

        tempoUsado += tempoNecessario;
      }
    }

    return selecionados;
  }, [
    cidadeBase,
    tempoDisponivel,
    horarioInicio,
    transporte,
    orcamento,
    ritmo,
    incluirAlmoco,
    interesses,
    usarSelecionados,
    lugaresSelecionados,
    lugaresSelecionadosIds.length,
  ]);

  const resumo = useMemo(() => {
    const tempoTotalLocais = roteiro.reduce(
      (total, item) => total + item.lugar.tempoSugeridoMin,
      0
    );

    const tempoTotalDeslocamento = roteiro.reduce(
      (total, item) => total + item.deslocamentoAntes,
      0
    );

    const custo = roteiro.reduce(
      (total, item) => {
        const custoLugar = estimarCusto(item.lugar);

        return {
          minimo: total.minimo + custoLugar.minimo,
          maximo: total.maximo + custoLugar.maximo,
        };
      },
      { minimo: 0, maximo: 0 }
    );

    return {
      tempoTotalLocais,
      tempoTotalDeslocamento,
      custo,
      nivel:
        roteiro.length >= 6
          ? "Intenso"
          : roteiro.length >= 4
            ? "Moderado"
            : "Leve",
    };
  }, [roteiro]);

  function alternarInteresse(interesse: Categoria) {
    setInteresses((interessesAtuais) => {
      if (interessesAtuais.includes(interesse)) {
        return interessesAtuais.filter((item) => item !== interesse);
      }

      return [...interessesAtuais, interesse];
    });
  }

  function salvarRoteiro() {
    if (roteiro.length === 0) return;

    const roteirosSalvos = localStorage.getItem(CHAVE_ROTEIROS_SALVOS);

    const roteiros: RoteiroSalvo[] = roteirosSalvos
      ? JSON.parse(roteirosSalvos)
      : [];

    const novoRoteiro: RoteiroSalvo = {
      id: Date.now(),
      titulo: `Roteiro em ${cidadeBase}`,
      criadoEm: new Date().toLocaleDateString("pt-BR"),
      cidadeBase,
      tempoDisponivel,
      horarioInicio,
      transporte,
      orcamento,
      ritmo,
      incluirAlmoco,
      interesses,
      resumo,
      paradas: roteiro.map((item) => ({
        lugarId: item.lugar.id,
        nome: item.lugar.nome,
        cidade: item.lugar.cidade,
        categoria: item.lugar.categoria,
        chegada: item.chegada,
        saida: item.saida,
        deslocamentoAntes: item.deslocamentoAntes,
        tempoSugeridoMin: item.lugar.tempoSugeridoMin,
        precoEstimado: item.lugar.precoEstimado,
        nota: item.lugar.nota,
      })),
    };

    localStorage.setItem(
      CHAVE_ROTEIROS_SALVOS,
      JSON.stringify([novoRoteiro, ...roteiros])
    );

    setRoteiroSalvo(true);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="font-heading font-black text-[#10B981]">
            Criador de roteiros
          </p>

          <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight text-[#0F2433] md:text-5xl">
            Monte um itinerário funcional para sua viagem.
          </h1>

          <p className="mt-4 max-w-3xl leading-8 text-[#45617A]">
            O sistema organiza locais com base em tempo disponível, interesses,
            orçamento, cidade base, ritmo da viagem e deslocamento médio entre
            os pontos.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <aside className="h-fit rounded-3xl bg-white p-6 card-shadow">
            <h2 className="text-2xl font-black text-[#0F2433]">
              Preferências da viagem
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#45617A]">
              Altere as informações abaixo para gerar diferentes possibilidades
              de roteiro.
            </p>

            <div className="mt-6 rounded-3xl bg-[#10B981]/10 p-4">
              <p className="text-sm font-black text-[#0F4C5C]">
                Seleção da página Explorar
              </p>

              <p className="mt-2 text-3xl font-black text-[#0F2433]">
                {lugaresSelecionadosIds.length} lugares
              </p>

              {lugaresSelecionadosIds.length > 0 ? (
                <>
                  <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-4">
                    <input
                      type="checkbox"
                      checked={usarSelecionados}
                      onChange={(event) =>
                        setUsarSelecionados(event.target.checked)
                      }
                      className="h-5 w-5 accent-[#10B981]"
                    />

                    <span className="text-sm font-black text-[#0F2433]">
                      Priorizar apenas lugares selecionados
                    </span>
                  </label>

                  <button
                    onClick={limparSelecao}
                    className="mt-3 w-full rounded-2xl border border-[#10B981]/30 px-4 py-3 text-sm font-black text-[#0F4C5C] transition hover:bg-white"
                  >
                    Limpar seleção
                  </button>
                </>
              ) : (
                <div className="mt-4">
                  <p className="text-sm leading-6 text-[#45617A]">
                    Nenhum lugar foi selecionado ainda. Você pode montar um
                    roteiro automático ou escolher locais manualmente na página
                    Explorar.
                  </p>

                  <Link
                    href="/explorar"
                    className="mt-3 block rounded-2xl bg-[#10B981] px-4 py-3 text-center text-sm font-black text-white transition hover:bg-[#0F4C5C]"
                  >
                    Escolher lugares
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="text-sm font-black text-[#0F2433]">
                  Cidade base
                </label>

                <select
                  value={cidadeBase}
                  onChange={(event) => setCidadeBase(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
                >
                  {cidades.map((cidade) => (
                    <option key={cidade}>{cidade}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-black text-[#0F2433]">
                  Tempo disponível
                </label>

                <select
                  value={tempoDisponivel}
                  onChange={(event) =>
                    setTempoDisponivel(Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
                >
                  <option value={4}>Meio dia - 4 horas</option>
                  <option value={8}>1 dia - 8 horas</option>
                  <option value={10}>Dia completo - 10 horas</option>
                  <option value={16}>Fim de semana - 16 horas</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-black text-[#0F2433]">
                  Horário inicial
                </label>

                <input
                  type="time"
                  value={horarioInicio}
                  onChange={(event) => setHorarioInicio(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-sm font-black text-[#0F2433]">
                  Transporte
                </label>

                <select
                  value={transporte}
                  onChange={(event) => setTransporte(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
                >
                  <option>Carro</option>
                  <option>Uber</option>
                  <option>Ônibus</option>
                  <option>A pé</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-black text-[#0F2433]">
                  Orçamento máximo
                </label>

                <select
                  value={orcamento}
                  onChange={(event) =>
                    setOrcamento(event.target.value as Custo | "Livre")
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
                >
                  {opcoesOrcamento.map((opcao) => (
                    <option key={opcao}>{opcao}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-black text-[#0F2433]">
                  Ritmo do roteiro
                </label>

                <select
                  value={ritmo}
                  onChange={(event) => setRitmo(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
                >
                  <option>Leve</option>
                  <option>Moderado</option>
                  <option>Intenso</option>
                </select>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={incluirAlmoco}
                  onChange={(event) => setIncluirAlmoco(event.target.checked)}
                  className="h-5 w-5 accent-[#10B981]"
                />

                <span className="text-sm font-black text-[#0F2433]">
                  Incluir parada para almoço
                </span>
              </label>

              <div>
                <label className="text-sm font-black text-[#0F2433]">
                  Interesses
                </label>

                <div className="mt-3 flex flex-wrap gap-2">
                  {interessesDisponiveis.map((interesse) => {
                    const ativo = interesses.includes(interesse);

                    return (
                      <button
                        key={interesse}
                        onClick={() => alternarInteresse(interesse)}
                        className={`rounded-full px-4 py-2 text-sm font-black transition ${
                          ativo
                            ? "bg-[#10B981] text-white"
                            : "bg-slate-100 text-[#45617A] hover:bg-slate-200"
                        }`}
                      >
                        {interesse}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          <section className="rounded-3xl bg-white p-6 card-shadow">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-heading font-black text-[#10B981]">
                  Roteiro gerado automaticamente
                </p>

                <h2 className="mt-1 text-2xl font-black text-[#0F2433]">
                  Roteiro sugerido
                </h2>

                <p className="mt-1 text-sm text-[#45617A]">
                  {roteiro.length} paradas selecionadas com base nas
                  preferências.
                </p>
              </div>

              <button
                onClick={salvarRoteiro}
                disabled={roteiro.length === 0}
                className="rounded-2xl bg-[#10B981] px-5 py-3 font-black text-white transition hover:bg-[#0F4C5C] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Salvar roteiro
              </button>
            </div>

            {roteiroSalvo && (
              <div className="mt-6 rounded-3xl bg-[#10B981]/10 p-5">
                <p className="font-black text-[#0F4C5C]">
                  Roteiro salvo com sucesso!
                </p>

                <p className="mt-2 text-sm leading-6 text-[#45617A]">
                  Você pode acessar esse roteiro depois na página de roteiros
                  salvos.
                </p>

                <Link
                  href="/roteiros-salvos"
                  className="mt-4 inline-flex rounded-2xl bg-[#10B981] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0F4C5C]"
                >
                  Ver roteiros salvos
                </Link>
              </div>
            )}

            {roteiro.length === 0 ? (
              <div className="py-16 text-center">
                <h3 className="text-2xl font-black text-[#0F2433]">
                  Nenhum roteiro encontrado
                </h3>

                <p className="mt-2 text-[#45617A]">
                  Tente aumentar o tempo disponível, selecionar mais interesses
                  ou liberar o orçamento.
                </p>
              </div>
            ) : (
              <div className="mt-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm font-black text-[#45617A]">
                      Tempo em visitas
                    </p>

                    <p className="mt-2 text-2xl font-black text-[#0F2433]">
                      {Math.floor(resumo.tempoTotalLocais / 60)}h{" "}
                      {resumo.tempoTotalLocais % 60}min
                    </p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm font-black text-[#45617A]">
                      Deslocamento
                    </p>

                    <p className="mt-2 text-2xl font-black text-[#0F2433]">
                      {resumo.tempoTotalDeslocamento}min
                    </p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm font-black text-[#45617A]">
                      Custo estimado
                    </p>

                    <p className="mt-2 text-2xl font-black text-[#0F2433]">
                      R$ {resumo.custo.minimo} - {resumo.custo.maximo}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm font-black text-[#45617A]">Nível</p>

                    <p className="mt-2 text-2xl font-black text-[#0F2433]">
                      {resumo.nivel}
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {roteiro.map((item, index) => (
                    <article
                      key={item.lugar.id}
                      className="grid gap-4 rounded-3xl border border-slate-100 bg-white p-5 transition hover:border-[#10B981]/40 md:grid-cols-[95px_1fr_165px]"
                    >
                      <div>
                        <p className="text-sm font-black text-[#10B981]">
                          Parada {index + 1}
                        </p>

                        <p className="mt-2 text-2xl font-black text-[#0F2433]">
                          {item.chegada}
                        </p>

                        <p className="text-sm text-[#45617A]">
                          até {item.saida}
                        </p>
                      </div>

                      <div>
                        {item.deslocamentoAntes > 0 && (
                          <p className="mb-3 w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                            + {item.deslocamentoAntes} min de deslocamento
                          </p>
                        )}

                        <p className="w-fit rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-black text-[#0F4C5C]">
                          {item.lugar.categoria}
                        </p>

                        <h3 className="mt-3 text-xl font-black text-[#0F2433]">
                          {item.lugar.nome}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#45617A]">
                          {item.lugar.descricao}
                        </p>

                        <p className="mt-3 text-sm font-bold text-[#0F2433]">
                          Horário ideal: {item.lugar.horarioIdeal}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                        <p className="font-black text-[#0F2433]">
                          {item.lugar.precoEstimado}
                        </p>

                        <p className="mt-2 text-[#45617A]">
                          {item.lugar.tempoSugeridoMin} min no local
                        </p>

                        <p className="mt-2 font-black text-amber-600">
                          ★ {item.lugar.nota}
                        </p>

                        <p className="mt-2 text-[#45617A]">
                          {item.lugar.cidade}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}