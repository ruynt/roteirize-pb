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

function IconeEstrela({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="m12 3 2.7 5.47 6.03.88-4.36 4.25 1.03 6-5.4-2.84-5.4 2.84 1.03-6-4.36-4.25 6.03-.88L12 3Z" />
    </svg>
  );
}

function classeImagem(imagemClasse?: string) {
  const classe = String(imagemClasse ?? "").trim();

  if (!classe) {
    return "bg-gradient-to-br from-cyan-300 to-blue-500";
  }

  if (classe.includes("bg-")) {
    return classe;
  }

  return `bg-gradient-to-br ${classe}`;
}

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
  const classeHero = classeImagem(lugar.imageClass);

  const enderecoMaps = encodeURIComponent(
    `${lugar.address}, ${lugar.city}, Paraíba`
  );

  const linkMaps = `https://www.google.com/maps/search/?api=1&query=${enderecoMaps}`;
  const mapaEmbed = `https://maps.google.com/maps?q=${enderecoMaps}&output=embed`;

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      <section className={`${classeHero} relative overflow-hidden text-white`}>
        <div className="absolute inset-0 bg-[#0F2433]/35" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-28 left-10 h-80 w-80 rounded-full bg-[#10B981]/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 md:py-20">
          <div className="max-w-4xl">
            <Link
              href="/explorar"
              className="font-heading inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white hover:text-[#0F4C5C]"
            >
              ← Voltar para explorar
            </Link>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="font-heading rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                {categoria}
              </span>

              <span className="font-heading rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                {lugar.city}
              </span>

              <span className="font-heading rounded-full bg-[#F2C98A] px-4 py-2 text-sm font-black text-[#0F4C5C] shadow-sm">
                <span className="inline-flex items-center gap-1">
                  <IconeEstrela className="h-4 w-4" />
                  {lugar.rating.toFixed(1)}
                </span>
              </span>
            </div>

            <h1 className="font-heading mt-6 text-4xl font-black leading-tight drop-shadow-sm md:text-6xl">
              {lugar.name}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/95">
              {lugar.description}
            </p>

            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/20 bg-white/15 p-4 backdrop-blur">
                <p className="font-heading text-xs font-bold text-white/80">
                  Custo
                </p>

                <p className="font-heading mt-1 text-lg font-black text-white">
                  {custo}
                </p>
              </div>

              <div className="rounded-3xl border border-white/20 bg-white/15 p-4 backdrop-blur">
                <p className="font-heading text-xs font-bold text-white/80">
                  Visita sugerida
                </p>

                <p className="font-heading mt-1 text-lg font-black text-white">
                  {lugar.suggestedDurationMin} min
                </p>
              </div>

              <div className="rounded-3xl border border-white/20 bg-white/15 p-4 backdrop-blur">
                <p className="font-heading text-xs font-bold text-white/80">
                  Acessibilidade
                </p>

                <p className="font-heading mt-1 text-lg font-black text-white">
                  {acessibilidade}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <BotaoAdicionarLugar lugarId={lugar.id} />

              <a
                href={linkMaps}
                target="_blank"
                rel="noreferrer"
                className="font-heading inline-flex min-h-14 min-w-[190px] items-center justify-center rounded-full border border-white/40 bg-white/10 px-7 py-3 text-center text-sm font-black text-white backdrop-blur transition hover:bg-white hover:text-[#0F4C5C]"
              >
                Abrir no Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="card-shadow overflow-hidden rounded-[2rem] border border-slate-100 bg-white">
            <div className={`${classeHero} h-3`} />

            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                    Sobre o local
                  </h2>

                  <p className="mt-4 text-base leading-8 text-[#45617A]">
                    {lugar.description}
                  </p>
                </div>

                <div className="shrink-0 rounded-3xl bg-[#10B981]/10 p-5 text-center">
                  <p className="font-heading text-3xl font-black text-[#0F4C5C]">
                    <span className="inline-flex items-center justify-center gap-2">
                      <IconeEstrela className="h-7 w-7 text-amber-500" />
                      {lugar.rating.toFixed(1)}
                    </span>
                  </p>

                  <p className="mt-1 text-xs font-bold text-[#45617A]">
                    avaliação média
                  </p>
                </div>
              </div>

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
            </div>
          </section>

          <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                  Informações úteis
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#45617A]">
                  Dados principais para planejar a visita antes de montar o
                  roteiro.
                </p>
              </div>
            </div>

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
                  Categoria
                </p>

                <p className="mt-2 text-sm leading-6 text-[#45617A]">
                  {categoria}
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

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-sm font-black text-[#0F4C5C]">
                  Distância aproximada
                </p>

                <p className="mt-2 text-sm leading-6 text-[#45617A]">
                  {lugar.distanceFromCenterKm.toFixed(1)} km do centro
                </p>
              </div>
            </div>
          </section>

          <section className="card-shadow overflow-hidden rounded-[2rem] border border-slate-100 bg-white">
            <div className="p-6 md:p-8">
              <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                Localização
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#45617A]">
                Visualização aproximada para ajudar no planejamento do
                deslocamento.
              </p>
            </div>

            <div className="mx-6 mb-6 overflow-hidden rounded-[1.5rem] border border-slate-100 md:mx-8 md:mb-8">
              <iframe
                title={`Mapa de ${lugar.name}`}
                src={mapaEmbed}
                className="h-[360px] w-full border-0"
                loading="lazy"
              />
            </div>
          </section>

          <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
            <h2 className="font-heading text-2xl font-black text-[#0F2433]">
              Experiência da comunidade
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-heading text-4xl font-black text-[#0F4C5C]">
                  <span className="inline-flex items-center gap-2">
                    <IconeEstrela className="h-8 w-8 text-amber-500" />
                    {lugar.rating.toFixed(1)}
                  </span>
                </p>

                <p className="mt-2 text-sm text-[#45617A]">
                  Média de avaliação do local.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5 md:col-span-2">
                <p className="font-heading text-sm font-black text-[#0F4C5C]">
                  Sugestão de uso no roteiro
                </p>

                <p className="mt-2 text-sm leading-6 text-[#45617A]">
                  Combine este local com outros atrativos próximos pelo mapa ou
                  adicione ao criador de roteiro para organizar horários e
                  deslocamentos.
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
              Planejar deslocamento
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#45617A]">
              Abra a localização no Google Maps ou use o mapa da plataforma para
              combinar este local com outras paradas.
            </p>

            <div className="mt-5 space-y-3">
              <a
                href={linkMaps}
                target="_blank"
                rel="noreferrer"
                className="font-heading inline-flex w-full justify-center rounded-full bg-[#0F4C5C] px-5 py-3 text-sm font-black text-white transition hover:bg-[#10B981]"
              >
                Abrir no Google Maps
              </a>

              <Link
                href="/mapa"
                className="font-heading inline-flex w-full justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
              >
                Ver no mapa turístico
              </Link>
            </div>
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
