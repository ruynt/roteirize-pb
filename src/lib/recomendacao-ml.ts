export type LugarRecomendacaoML = {
  id: string;
  nome: string;
  cidade: string;
  categoria: string;
  descricao: string;
  endereco?: string;
  custo: string;
  precoEstimado?: string;
  nota: number;
  tempoSugeridoMin?: number;
  horarioIdeal?: string;
  acessibilidade: string;
  tags: string[];
  distanciaCentroKm?: number;
  imagemClasse?: string;
  fotoPrincipalUrl?: string | null;
  galeriaUrls?: string[];
  destaque?: boolean;
  parceiroNome?: string | null;
};

export type InteracaoRecomendacaoML = {
  placeId?: string | null;
  tipo?: string;
  type?: string;
  peso?: number;
  weight?: number;
  createdAt?: string;
  metadata?: Record<string, unknown> | null;
};

export type CheckinRecomendacaoML = {
  id: string;
  nome?: string;
  cidade?: string;
  categoria?: string;
  data?: string;
};

export type ParadaRoteiroRecomendacaoML = {
  id?: string;
  nome?: string;
  cidade?: string;
  categoria?: string;
  custo?: string;
};

export type RoteiroRecomendacaoML = {
  id?: string;
  titulo?: string;
  criadoEm?: string;
  parametros?: {
    cidadeBase?: string;
    orcamento?: string;
    interesses?: string[];
  };
  paradas?: ParadaRoteiroRecomendacaoML[];
};

export type ContextoRecomendacaoML = {
  checkins?: CheckinRecomendacaoML[];
  roteirosSalvos?: RoteiroRecomendacaoML[];
  lugaresSelecionados?: string[];
  interacoes?: InteracaoRecomendacaoML[];
};

export type RecomendacaoML = {
  lugar: LugarRecomendacaoML;
  pontuacao: number;
  confianca: number;
  motivos: string[];
  sinais: {
    similaridadePerfil: number;
    afinidadeCategoria: number;
    afinidadeCidade: number;
    afinidadeCusto: number;
    popularidade: number;
    diversidade: number;
    destaque: number;
    penalizacaoVisitado: number;
  };
};

export type ResultadoRecomendacaoML = {
  modelo: string;
  explicacaoModelo: string;
  perfil: {
    totalInteracoes: number;
    totalCheckins: number;
    totalRoteiros: number;
    totalSelecionados: number;
    categoriasPreferidas: string[];
    cidadesPreferidas: string[];
    custosPreferidos: string[];
    palavrasChave: string[];
  };
  recomendacoes: RecomendacaoML[];
};

type Vetor = Record<string, number>;

const STOPWORDS = new Set([
  "a",
  "ao",
  "aos",
  "as",
  "com",
  "da",
  "das",
  "de",
  "do",
  "dos",
  "e",
  "em",
  "na",
  "nas",
  "no",
  "nos",
  "o",
  "os",
  "para",
  "por",
  "que",
  "um",
  "uma",
  "local",
  "turistico",
  "turística",
  "turistico",
  "experiencia",
  "experiência",
]);

const PESOS_INTERACAO: Record<string, number> = {
  VIEW: 0.8,
  DETAIL_OPENED: 1.6,
  SELECT: 3.5,
  UNSELECT: -2.5,
  CHECKIN: 5,
  CHECKIN_REMOVED: -4,
  ITINERARY_SAVED: 4,
};

function normalizarTexto(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(texto: string) {
  return normalizarTexto(texto)
    .split(" ")
    .filter((token) => token.length >= 3 && !STOPWORDS.has(token));
}

function incrementar(vetor: Vetor, chave: string, peso: number) {
  const chaveNormalizada = normalizarTexto(chave);

  if (!chaveNormalizada) {
    return;
  }

  vetor[chaveNormalizada] = (vetor[chaveNormalizada] ?? 0) + peso;
}

function limitarLista<T>(lista: T[], quantidade: number) {
  return lista.slice(0, quantidade);
}

function contarPreferencias(lista: string[]) {
  return Object.entries(
    lista.reduce<Record<string, number>>((acc, item) => {
      const chave = String(item ?? "").trim();

      if (!chave) {
        return acc;
      }

      acc[chave] = (acc[chave] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .map(([item]) => item);
}

function criarVetorLugar(lugar: LugarRecomendacaoML): Vetor {
  const vetor: Vetor = {};

  incrementar(vetor, `categoria:${lugar.categoria}`, 3.2);
  incrementar(vetor, `cidade:${lugar.cidade}`, 2.2);
  incrementar(vetor, `custo:${lugar.custo}`, 1.7);
  incrementar(vetor, `acessibilidade:${lugar.acessibilidade}`, 1.1);

  for (const tag of lugar.tags ?? []) {
    incrementar(vetor, `tag:${tag}`, 2.5);
  }

  for (const token of tokens(`${lugar.nome} ${lugar.descricao}`)) {
    incrementar(vetor, `texto:${token}`, 0.75);
  }

  return vetor;
}

function somarVetor(destino: Vetor, origem: Vetor, peso: number) {
  for (const [chave, valor] of Object.entries(origem)) {
    destino[chave] = (destino[chave] ?? 0) + valor * peso;
  }
}

function similaridadeCosseno(a: Vetor, b: Vetor) {
  let produto = 0;
  let normaA = 0;
  let normaB = 0;

  for (const valor of Object.values(a)) {
    normaA += valor * valor;
  }

  for (const [chave, valorB] of Object.entries(b)) {
    const valorA = a[chave] ?? 0;
    produto += valorA * valorB;
    normaB += valorB * valorB;
  }

  if (normaA === 0 || normaB === 0) {
    return 0;
  }

  return produto / (Math.sqrt(normaA) * Math.sqrt(normaB));
}

function normalizarNota(nota: number) {
  if (!Number.isFinite(nota)) {
    return 0;
  }

  return Math.max(0, Math.min(1, nota / 5));
}

function obterLugarPorId(lugares: LugarRecomendacaoML[], id?: string | null) {
  if (!id) {
    return null;
  }

  return lugares.find((lugar) => lugar.id === id) ?? null;
}

function criarPerfilUsuario(lugares: LugarRecomendacaoML[], contexto: ContextoRecomendacaoML) {
  const vetor: Vetor = {};
  const categorias: string[] = [];
  const cidades: string[] = [];
  const custos: string[] = [];
  const palavras: string[] = [];
  const visitados = new Set<string>();
  const selecionados = new Set((contexto.lugaresSelecionados ?? []).map(String));

  for (const checkin of contexto.checkins ?? []) {
    const lugar = obterLugarPorId(lugares, checkin.id);

    if (checkin.id) {
      visitados.add(checkin.id);
    }

    if (lugar) {
      somarVetor(vetor, criarVetorLugar(lugar), 5);
      categorias.push(lugar.categoria);
      cidades.push(lugar.cidade);
      custos.push(lugar.custo);
      palavras.push(...lugar.tags);
    } else {
      if (checkin.categoria) {
        incrementar(vetor, `categoria:${checkin.categoria}`, 4);
        categorias.push(checkin.categoria);
      }

      if (checkin.cidade) {
        incrementar(vetor, `cidade:${checkin.cidade}`, 3);
        cidades.push(checkin.cidade);
      }
    }
  }

  for (const id of selecionados) {
    const lugar = obterLugarPorId(lugares, id);

    if (lugar) {
      somarVetor(vetor, criarVetorLugar(lugar), 3.5);
      categorias.push(lugar.categoria);
      cidades.push(lugar.cidade);
      custos.push(lugar.custo);
      palavras.push(...lugar.tags);
    }
  }

  for (const roteiro of contexto.roteirosSalvos ?? []) {
    const interesses = roteiro.parametros?.interesses ?? [];

    for (const interesse of interesses) {
      incrementar(vetor, `tag:${interesse}`, 2.5);
      incrementar(vetor, `categoria:${interesse}`, 1.5);
      categorias.push(interesse);
      palavras.push(interesse);
    }

    if (roteiro.parametros?.cidadeBase) {
      incrementar(vetor, `cidade:${roteiro.parametros.cidadeBase}`, 2);
      cidades.push(roteiro.parametros.cidadeBase);
    }

    if (roteiro.parametros?.orcamento) {
      incrementar(vetor, `custo:${roteiro.parametros.orcamento}`, 1.5);
      custos.push(roteiro.parametros.orcamento);
    }

    for (const parada of roteiro.paradas ?? []) {
      const lugar = obterLugarPorId(lugares, parada.id);

      if (lugar) {
        somarVetor(vetor, criarVetorLugar(lugar), 3);
        categorias.push(lugar.categoria);
        cidades.push(lugar.cidade);
        custos.push(lugar.custo);
        palavras.push(...lugar.tags);
      } else {
        if (parada.categoria) {
          incrementar(vetor, `categoria:${parada.categoria}`, 2.5);
          categorias.push(parada.categoria);
        }

        if (parada.cidade) {
          incrementar(vetor, `cidade:${parada.cidade}`, 1.8);
          cidades.push(parada.cidade);
        }

        if (parada.custo) {
          incrementar(vetor, `custo:${parada.custo}`, 1.2);
          custos.push(parada.custo);
        }
      }
    }
  }

  for (const interacao of contexto.interacoes ?? []) {
    const tipo = String(interacao.type ?? interacao.tipo ?? "VIEW").toUpperCase();
    const pesoBase = PESOS_INTERACAO[tipo] ?? 1;
    const peso = Number(interacao.weight ?? interacao.peso ?? pesoBase) || pesoBase;
    const lugar = obterLugarPorId(lugares, interacao.placeId);

    if (tipo === "CHECKIN" && interacao.placeId) {
      visitados.add(interacao.placeId);
    }

    if (lugar) {
      somarVetor(vetor, criarVetorLugar(lugar), peso);
      categorias.push(lugar.categoria);
      cidades.push(lugar.cidade);
      custos.push(lugar.custo);
      palavras.push(...lugar.tags);
    }
  }

  return {
    vetor,
    visitados,
    selecionados,
    categoriasPreferidas: limitarLista(contarPreferencias(categorias), 5),
    cidadesPreferidas: limitarLista(contarPreferencias(cidades), 5),
    custosPreferidos: limitarLista(contarPreferencias(custos), 4),
    palavrasChave: limitarLista(contarPreferencias(palavras), 8),
  };
}

function criarMotivos(lugar: LugarRecomendacaoML, sinais: RecomendacaoML["sinais"], perfil: ReturnType<typeof criarPerfilUsuario>) {
  const motivos: string[] = [];

  if (sinais.similaridadePerfil >= 0.38) {
    motivos.push("combina com lugares que você já demonstrou interesse");
  }

  if (perfil.categoriasPreferidas.includes(lugar.categoria)) {
    motivos.push(`combina com sua preferência por ${lugar.categoria}`);
  }

  if (perfil.cidadesPreferidas.includes(lugar.cidade)) {
    motivos.push(`aparece em ${lugar.cidade}, cidade presente no seu histórico`);
  }

  if (perfil.custosPreferidos.includes(lugar.custo)) {
    motivos.push("tem faixa de preço parecida com seus roteiros salvos");
  }

  const tagsComuns = lugar.tags.filter((tag) => perfil.palavrasChave.includes(tag));

  if (tagsComuns.length > 0) {
    motivos.push(`tem relação com ${tagsComuns.slice(0, 2).join(" e ")}`);
  }

  if (lugar.destaque) {
    motivos.push("é uma experiência destacada na plataforma");
  }

  if (lugar.nota >= 4.7) {
    motivos.push("possui avaliação alta entre os locais disponíveis");
  }

  if (lugar.acessibilidade === "Alta") {
    motivos.push("oferece boa acessibilidade");
  }

  if (motivos.length === 0) {
    motivos.push("pode deixar seu roteiro mais variado e bem avaliado");
  }

  return limitarLista(motivos, 3);
}

export function gerarRecomendacoesML(
  lugares: LugarRecomendacaoML[],
  contexto: ContextoRecomendacaoML = {},
  limite = 6
): ResultadoRecomendacaoML {
  const perfil = criarPerfilUsuario(lugares, contexto);
  const temPerfil = Object.keys(perfil.vetor).length > 0;
  const categoriasRecomendadas = new Set<string>();

  const recomendacoes = lugares
    .map((lugar) => {
      const vetorLugar = criarVetorLugar(lugar);
      const similaridadePerfil = temPerfil
        ? Math.max(0, similaridadeCosseno(perfil.vetor, vetorLugar))
        : 0;

      const afinidadeCategoria = perfil.categoriasPreferidas.includes(lugar.categoria) ? 1 : 0;
      const afinidadeCidade = perfil.cidadesPreferidas.includes(lugar.cidade) ? 1 : 0;
      const afinidadeCusto = perfil.custosPreferidos.includes(lugar.custo) ? 1 : 0;
      const popularidade = normalizarNota(lugar.nota);
      const destaque = lugar.destaque ? 1 : 0;
      const penalizacaoVisitado = perfil.visitados.has(lugar.id) ? 1 : 0;
      const diversidade = categoriasRecomendadas.has(lugar.categoria) ? 0 : 1;

      let pontuacao =
        similaridadePerfil * 52 +
        afinidadeCategoria * 14 +
        afinidadeCidade * 9 +
        afinidadeCusto * 6 +
        popularidade * 15 +
        destaque * 5 +
        diversidade * 4 -
        penalizacaoVisitado * 28;

      if (!temPerfil) {
        pontuacao = popularidade * 72 + destaque * 10 + diversidade * 8;
      }

      const sinais = {
        similaridadePerfil,
        afinidadeCategoria,
        afinidadeCidade,
        afinidadeCusto,
        popularidade,
        diversidade,
        destaque,
        penalizacaoVisitado,
      };

      categoriasRecomendadas.add(lugar.categoria);

      return {
        lugar,
        pontuacao: Number(pontuacao.toFixed(2)),
        confianca: Number(Math.max(0.35, Math.min(0.98, temPerfil ? 0.45 + similaridadePerfil * 0.75 : 0.42)).toFixed(2)),
        motivos: criarMotivos(lugar, sinais, perfil),
        sinais,
      };
    })
    .sort((a, b) => b.pontuacao - a.pontuacao)
    .slice(0, limite);

  return {
    modelo: "roteirize-hybrid-vector-ml-v1",
    explicacaoModelo:
      "As sugestões são calculadas considerando os locais visualizados, adicionados ao roteiro, salvos ou marcados como visitados.",
    perfil: {
      totalInteracoes:
        (contexto.checkins?.length ?? 0) +
        (contexto.roteirosSalvos?.length ?? 0) +
        (contexto.lugaresSelecionados?.length ?? 0) +
        (contexto.interacoes?.length ?? 0),
      totalCheckins: contexto.checkins?.length ?? 0,
      totalRoteiros: contexto.roteirosSalvos?.length ?? 0,
      totalSelecionados: contexto.lugaresSelecionados?.length ?? 0,
      categoriasPreferidas: perfil.categoriasPreferidas,
      cidadesPreferidas: perfil.cidadesPreferidas,
      custosPreferidos: perfil.custosPreferidos,
      palavrasChave: perfil.palavrasChave,
    },
    recomendacoes,
  };
}
