export type Categoria =
  | "Praia"
  | "Cultura"
  | "Gastronomia"
  | "Natureza"
  | "Experiência";

export type Custo = "Gratuito" | "Econômico" | "Médio" | "Alto";

export type Lugar = {
  id: number;
  nome: string;
  cidade: string;
  categoria: Categoria;
  descricao: string;
  endereco: string;
  custo: Custo;
  precoEstimado: string;
  nota: number;
  tempoSugeridoMin: number;
  horarioIdeal: string;
  acessibilidade: "Baixa" | "Média" | "Alta";
  tags: string[];
  distanciaCentroKm: number;
  imagemClasse: string;
};

export const lugares: Lugar[] = [
  {
    id: 1,
    nome: "Praia de Cabo Branco",
    cidade: "João Pessoa",
    categoria: "Praia",
    descricao:
      "Praia urbana ideal para caminhada, banho de mar, fotos e início de roteiros pela orla.",
    endereco: "Av. Cabo Branco, João Pessoa - PB",
    custo: "Gratuito",
    precoEstimado: "R$ 0",
    nota: 4.8,
    tempoSugeridoMin: 120,
    horarioIdeal: "08h às 14h",
    acessibilidade: "Média",
    tags: ["praia", "natureza", "família", "fotografia"],
    distanciaCentroKm: 7.2,
    imagemClasse: "from-cyan-500 to-blue-700",
  },
  {
    id: 2,
    nome: "Centro Histórico",
    cidade: "João Pessoa",
    categoria: "Cultura",
    descricao:
      "Roteiro cultural com igrejas, praças, arquitetura histórica e espaços de memória.",
    endereco: "Centro, João Pessoa - PB",
    custo: "Gratuito",
    precoEstimado: "R$ 0 a R$ 20",
    nota: 4.6,
    tempoSugeridoMin: 90,
    horarioIdeal: "09h às 16h",
    acessibilidade: "Média",
    tags: ["cultura", "história", "arquitetura", "fotografia"],
    distanciaCentroKm: 0.5,
    imagemClasse: "from-amber-500 to-orange-700",
  },
  {
    id: 3,
    nome: "Restaurante Regional",
    cidade: "João Pessoa",
    categoria: "Gastronomia",
    descricao:
      "Experiência gastronômica com pratos regionais, ideal para encaixar no horário do almoço.",
    endereco: "Tambaú, João Pessoa - PB",
    custo: "Médio",
    precoEstimado: "R$ 50 a R$ 90",
    nota: 4.7,
    tempoSugeridoMin: 90,
    horarioIdeal: "11h30 às 14h30",
    acessibilidade: "Alta",
    tags: ["gastronomia", "regional", "almoço", "família"],
    distanciaCentroKm: 6.5,
    imagemClasse: "from-red-500 to-yellow-600",
  },
  {
    id: 4,
    nome: "Feirinha de Artesanato",
    cidade: "João Pessoa",
    categoria: "Experiência",
    descricao:
      "Espaço para comprar lembranças, conhecer artesanato local e apoiar pequenos produtores.",
    endereco: "Tambaú, João Pessoa - PB",
    custo: "Econômico",
    precoEstimado: "R$ 10 a R$ 80",
    nota: 4.5,
    tempoSugeridoMin: 60,
    horarioIdeal: "16h às 21h",
    acessibilidade: "Alta",
    tags: ["artesanato", "compras", "cultura", "experiência"],
    distanciaCentroKm: 6.8,
    imagemClasse: "from-emerald-500 to-teal-700",
  },
  {
    id: 5,
    nome: "Pôr do Sol no Jacaré",
    cidade: "Cabedelo",
    categoria: "Natureza",
    descricao:
      "Experiência clássica para encerrar o dia com vista para o pôr do sol e música regional.",
    endereco: "Praia do Jacaré, Cabedelo - PB",
    custo: "Gratuito",
    precoEstimado: "R$ 0 a R$ 40",
    nota: 4.9,
    tempoSugeridoMin: 90,
    horarioIdeal: "16h às 18h",
    acessibilidade: "Média",
    tags: ["natureza", "pôr do sol", "casal", "fotografia"],
    distanciaCentroKm: 18,
    imagemClasse: "from-orange-400 to-purple-700",
  },
  {
    id: 6,
    nome: "Praia de Tambaba",
    cidade: "Conde",
    categoria: "Praia",
    descricao:
      "Praia do litoral sul com paisagem marcante, indicada para roteiros de natureza e fotografia.",
    endereco: "Conde - PB",
    custo: "Gratuito",
    precoEstimado: "R$ 0",
    nota: 4.8,
    tempoSugeridoMin: 150,
    horarioIdeal: "08h às 15h",
    acessibilidade: "Baixa",
    tags: ["praia", "natureza", "fotografia", "litoral sul"],
    distanciaCentroKm: 38,
    imagemClasse: "from-sky-500 to-emerald-700",
  },
  {
    id: 7,
    nome: "Trilha Ecológica Guiada",
    cidade: "Bananeiras",
    categoria: "Natureza",
    descricao:
      "Atividade de ecoturismo com guia local, indicada para quem busca contato com a natureza.",
    endereco: "Bananeiras - PB",
    custo: "Médio",
    precoEstimado: "R$ 60 a R$ 120",
    nota: 4.7,
    tempoSugeridoMin: 180,
    horarioIdeal: "07h às 11h",
    acessibilidade: "Baixa",
    tags: ["natureza", "trilha", "aventura", "ecoturismo"],
    distanciaCentroKm: 130,
    imagemClasse: "from-green-600 to-lime-800",
  },
  {
    id: 8,
    nome: "Oficina de Artesanato Local",
    cidade: "João Pessoa",
    categoria: "Experiência",
    descricao:
      "Vivência cultural com artesãos locais, ideal para turistas que buscam experiências autênticas.",
    endereco: "João Pessoa - PB",
    custo: "Econômico",
    precoEstimado: "R$ 30 a R$ 60",
    nota: 4.9,
    tempoSugeridoMin: 90,
    horarioIdeal: "14h às 17h",
    acessibilidade: "Média",
    tags: ["artesanato", "cultura", "experiência", "local"],
    distanciaCentroKm: 5.4,
    imagemClasse: "from-yellow-500 to-amber-700",
  },
];