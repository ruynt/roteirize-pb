import BotaoAdicionarLugar from "@/components/BotaoAdicionarLugar";
import Header from "@/components/Header";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type LugarPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatarCategoria(categoria: string) {
  const categorias: Record<string, string> = {
    PRAIA: "Praia",
    CULTURA: "Cultura",
    GASTRONOMIA: "Gastronomia",
    NATUREZA: "Natureza",
    EXPERIENCIA: "Experiência",
  };

  return categorias[categoria] ?? categoria;
}

function formatarCusto(custo: string) {
  const custos: Record<string, string> = {
    GRATUITO: "Gratuito",
    ECONOMICO: "Econômico",
    MEDIO: "Médio",
    ALTO: "Alto",
  };

  return custos[custo] ?? custo;
}

function formatarAcessibilidade(acessibilidade: string) {
  const niveis: Record<string, string> = {
    BAIXA: "Baixa",
    MEDIA: "Média",
    ALTA: "Alta",
  };

  return niveis[acessibilidade] ?? acessibilidade;
}

function montarLinkMaps(endereco: string, cidade: string) {
  const termo = encodeURIComponent(`${endereco}, ${cidade}, Paraíba`);
  return `https://www.google.com/maps/search/?api=1&query=${termo}`;
}

export default async function LugarDetalhesPage({ params }: LugarPageProps) {
  const { id } = await params;

  const lugar = await prisma.place.findFirst({
    where: {
      id,
      approved: true,
    },
  });

  if (!lugar) {
    notFound();
  }

  const lugarFormatado = {
    id: lugar.id,
    nome: lugar.name,
    cidade: lugar.city,
    categoria: formatarCategoria(lugar.category),
    descricao: lugar.description,
    endereco: lugar.address,
    custo: formatarCusto(lugar.costLevel),
    precoEstimado: lugar.estimatedPrice,
    nota: lugar.rating,
    tempoSugeridoMin: lugar.suggestedDurationMin,
    horarioIdeal: lugar.idealTime,
    acessibilidade: formatarAcessibilidade(lugar.accessibility),
    tags: lugar.tags,
    distanciaCentroKm: lugar.distanceFromCenterKm,
    imagemClasse: lugar.imageClass,
  };

  const linkMaps = montarLinkMaps(
    lugarFormatado.endereco,
    lugarFormatado.cidade,
  );

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      <section
        className={`bg-gradient-to-br ${lugarFormatado.imagemClasse} text-white`}
      >
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
          <Link
            href="/explorar"
            className="font-heading inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/30"
          >
            ← Voltar para explorar
          </Link>

          <div className="mt-10 max-w-4xl">
            <span className="font-heading rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur">
              {lugarFormatado.categoria}
            </span>

            <h1 className="font-heading mt-6 text-4xl font-black leading-tight md:text-6xl">
              {lugarFormatado.nome}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">
              {lugarFormatado.descricao}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur">
                ★ {lugarFormatado.nota.toFixed(1)}
              </span>

              <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur">
                {lugarFormatado.cidade}
              </span>

              <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur">
                {lugarFormatado.custo}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
            <h2 className="font-heading text-2xl font-black text-[#0F2433]">
              Sobre o local
            </h2>

            <p className="mt-4 text-base leading-8 text-[#45617A]">
              {lugarFormatado.descricao}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {lugarFormatado.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#10B981]/10 px-3 py-2 text-xs font-bold text-[#0F4C5C]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>

          <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
            <h2 className="font-heading text-2xl font-black text-[#0F2433]">
              Informações úteis
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-sm font-bold text-[#45617A]">
                  Endereço
                </p>
                <p className="mt-2 font-bold text-[#0F2433]">
                  {lugarFormatado.endereco}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-sm font-bold text-[#45617A]">
                  Melhor horário
                </p>
                <p className="mt-2 font-bold text-[#0F2433]">
                  {lugarFormatado.horarioIdeal}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-sm font-bold text-[#45617A]">
                  Duração sugerida
                </p>
                <p className="mt-2 font-bold text-[#0F2433]">
                  {lugarFormatado.tempoSugeridoMin} minutos
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-sm font-bold text-[#45617A]">
                  Faixa de preço
                </p>
                <p className="mt-2 font-bold text-[#0F2433]">
                  {lugarFormatado.precoEstimado}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-sm font-bold text-[#45617A]">
                  Acessibilidade
                </p>
                <p className="mt-2 font-bold text-[#0F2433]">
                  {lugarFormatado.acessibilidade}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-sm font-bold text-[#45617A]">
                  Distância aproximada do centro
                </p>
                <p className="mt-2 font-bold text-[#0F2433]">
                  {lugarFormatado.distanciaCentroKm} km
                </p>
              </div>
            </div>
          </section>

          <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
            <h2 className="font-heading text-2xl font-black text-[#0F2433]">
              Avaliações simuladas
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading font-black text-[#0F4C5C]">★★★★★</p>
                <p className="mt-3 text-sm leading-6 text-[#45617A]">
                  Local muito interessante para incluir em um roteiro pela
                  Paraíba. As informações de horário e duração ajudam bastante
                  no planejamento.
                </p>
              </article>

              <article className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading font-black text-[#0F4C5C]">★★★★☆</p>
                <p className="mt-3 text-sm leading-6 text-[#45617A]">
                  Boa opção para turistas que querem conhecer experiências
                  locais com mais organização e previsibilidade.
                </p>
              </article>
            </div>
          </section>
        </div>

        <aside className="card-shadow h-fit rounded-[2rem] border border-slate-100 bg-white p-6">
          <h2 className="font-heading text-2xl font-black text-[#0F2433]">
            Adicionar ao roteiro
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#45617A]">
            Salve este local na sua seleção e gere um roteiro personalizado com
            base no seu tempo, orçamento, transporte e interesses.
          </p>

          <BotaoAdicionarLugar lugarId={lugarFormatado.id} />

          <a
            href={linkMaps}
            target="_blank"
            rel="noreferrer"
            className="font-heading mt-3 block rounded-2xl border border-slate-200 px-5 py-4 text-center font-black text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
          >
            Abrir rota no Google Maps
          </a>

          <div className="mt-6 rounded-3xl bg-[#F2C98A]/35 p-5">
            <p className="font-heading text-sm font-black text-[#0F4C5C]">
              Dados vindos do banco
            </p>
            <p className="mt-2 text-xs leading-5 text-[#45617A]">
              Esta página consulta o Neon usando Prisma, o que ajuda a mostrar
              que o projeto já possui persistência real de dados.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
