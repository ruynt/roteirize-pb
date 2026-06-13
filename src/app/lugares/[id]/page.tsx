import BotaoAdicionarLugar from "@/components/BotaoAdicionarLugar";
import BotaoCheckin from "@/components/BotaoCheckin";
import Header from "@/components/Header";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type LugarPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const nomesCategorias = {
  PRAIA: "Praia",
  CULTURA: "Cultura",
  GASTRONOMIA: "Gastronomia",
  NATUREZA: "Natureza",
  EXPERIENCIA: "Experiência",
};

const nomesCustos = {
  GRATUITO: "Gratuito",
  ECONOMICO: "Econômico",
  MEDIO: "Médio",
  ALTO: "Alto",
};

const nomesAcessibilidade = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
};

export default async function LugarPage({ params }: LugarPageProps) {
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

  const categoria = nomesCategorias[lugar.category];
  const custo = nomesCustos[lugar.costLevel];
  const acessibilidade = nomesAcessibilidade[lugar.accessibility];

  const enderecoMaps = encodeURIComponent(
    `${lugar.address}, ${lugar.city}, Paraíba`,
  );

  const linkMaps = `https://www.google.com/maps/search/?api=1&query=${enderecoMaps}`;

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      <section className={`${lugar.imageClass} text-white`}>
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2">
              <span className="font-heading rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                {categoria}
              </span>

              <span className="font-heading rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                {lugar.city}
              </span>

              <span className="font-heading rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                ★ {lugar.rating.toFixed(1)}
              </span>
            </div>

            <h1 className="font-heading mt-6 text-4xl font-black leading-tight md:text-6xl">
              {lugar.name}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
              {lugar.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BotaoAdicionarLugar lugarId={lugar.id} />

              <a
                href={linkMaps}
                target="_blank"
                rel="noreferrer"
                className="font-heading rounded-full border border-white/40 bg-white/10 px-6 py-3 text-center text-sm font-black text-white backdrop-blur transition hover:bg-white hover:text-[#0F4C5C]"
              >
                Abrir no Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
            <h2 className="font-heading text-2xl font-black text-[#0F2433]">
              Sobre o local
            </h2>

            <p className="mt-4 text-base leading-8 text-[#45617A]">
              {lugar.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {lugar.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#10B981]/10 px-3 py-2 text-xs font-bold text-[#0F4C5C]"
                >
                  {tag}
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
                <p className="font-heading text-sm font-black text-[#0F4C5C]">
                  Endereço
                </p>

                <p className="mt-2 text-sm leading-6 text-[#45617A]">
                  {lugar.address}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-sm font-black text-[#0F4C5C]">
                  Cidade
                </p>

                <p className="mt-2 text-sm leading-6 text-[#45617A]">
                  {lugar.city}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-sm font-black text-[#0F4C5C]">
                  Horário ideal
                </p>

                <p className="mt-2 text-sm leading-6 text-[#45617A]">
                  {lugar.idealTime}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-sm font-black text-[#0F4C5C]">
                  Tempo sugerido
                </p>

                <p className="mt-2 text-sm leading-6 text-[#45617A]">
                  {lugar.suggestedDurationMin} minutos
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-sm font-black text-[#0F4C5C]">
                  Faixa de custo
                </p>

                <p className="mt-2 text-sm leading-6 text-[#45617A]">
                  {custo} • {lugar.estimatedPrice}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-sm font-black text-[#0F4C5C]">
                  Acessibilidade
                </p>

                <p className="mt-2 text-sm leading-6 text-[#45617A]">
                  {acessibilidade}
                </p>
              </div>
            </div>
          </section>

          <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
            <h2 className="font-heading text-2xl font-black text-[#0F2433]">
              Avaliações da comunidade
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-4xl font-black text-[#0F4C5C]">
                  ★ {lugar.rating.toFixed(1)}
                </p>

                <p className="mt-2 text-sm text-[#45617A]">
                  Média de avaliação do local.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5 md:col-span-2">
                <p className="font-heading text-sm font-black text-[#0F4C5C]">
                  Comentário em destaque
                </p>

                <p className="mt-2 text-sm leading-6 text-[#45617A]">
                  “Experiência muito boa para conhecer melhor a Paraíba e montar
                  um roteiro mais organizado.”
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <BotaoCheckin
            lugar={{
              id: lugar.id,
              nome: lugar.name,
              cidade: lugar.city,
              categoria,
            }}
          />

          <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6">
            <h2 className="font-heading text-2xl font-black text-[#0F2433]">
              Adicionar ao roteiro
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#45617A]">
              Salve este local na sua seleção e use-o na criação de um roteiro
              personalizado.
            </p>

            <div className="mt-5">
              <BotaoAdicionarLugar lugarId={lugar.id} />
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-100 bg-white p-6">
            <h3 className="font-heading text-xl font-black text-[#0F2433]">
              Explore no mapa
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#45617A]">
              Abra a localização em uma nova aba para planejar melhor seu
              deslocamento.
            </p>

            <a
              href={linkMaps}
              target="_blank"
              rel="noreferrer"
              className="font-heading mt-5 inline-flex w-full justify-center rounded-full bg-[#0F4C5C] px-5 py-3 text-sm font-black text-white transition hover:bg-[#10B981]"
            >
              Abrir rota
            </a>
          </section>

          <section className="rounded-[2rem] border border-[#F2C98A]/50 bg-[#F2C98A]/25 p-6">
            <h3 className="font-heading text-xl font-black text-[#0F4C5C]">
              Passaporte Digital
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#45617A]">
              Faça check-in em diferentes localidades para desbloquear selos e
              acompanhar sua evolução como explorador da Paraíba.
            </p>

            <Link
              href="/passaporte"
              className="font-heading mt-5 inline-flex w-full justify-center rounded-full border border-[#0F4C5C]/20 bg-white px-5 py-3 text-sm font-black text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
            >
              Ver passaporte
            </Link>
          </section>
        </aside>
      </section>
    </main>
  );
}
