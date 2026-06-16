import Header from "@/components/Header";
import Link from "next/link";

type IconeNome =
  | "waves"
  | "landmark"
  | "utensils"
  | "leaf"
  | "compass"
  | "suitcase"
  | "handshake"
  | "check"
  | "star";

const categorias: {
  nome: string;
  descricao: string;
  icone: IconeNome;
}[] = [
  {
    nome: "Praias",
    descricao: "Orla, litoral sul e paisagens naturais.",
    icone: "waves",
  },
  {
    nome: "Cultura",
    descricao: "História, arquitetura, museus e memória.",
    icone: "landmark",
  },
  {
    nome: "Gastronomia",
    descricao: "Restaurantes regionais e sabores locais.",
    icone: "utensils",
  },
  {
    nome: "Natureza",
    descricao: "Trilhas, mirantes, parques e ecoturismo.",
    icone: "leaf",
  },
  {
    nome: "Experiências",
    descricao: "Guias, artesanato e vivências locais.",
    icone: "compass",
  },
];

const publicos: {
  titulo: string;
  descricao: string;
  icone: IconeNome;
  href: string;
  cta: string;
}[] = [
  {
    titulo: "Para turistas",
    descricao:
      "Descubra lugares, receba recomendações, monte roteiros, faça check-in e acompanhe seu passaporte digital.",
    icone: "suitcase",
    href: "/explorar",
    cta: "Explorar lugares",
  },
  {
    titulo: "Para parceiros locais",
    descricao:
      "Cadastre experiências, acompanhe solicitações, ative o Plano Destaque e apareça para quem está planejando a viagem.",
    icone: "handshake",
    href: "/parceiro",
    cta: "Ser parceiro",
  },
];

const funcionamento = [
  {
    passo: "1",
    titulo: "Descubra",
    descricao:
      "Explore atrativos culturais, ecológicos, gastronômicos e experiências locais pela Paraíba.",
  },
  {
    passo: "2",
    titulo: "Personalize",
    descricao:
      "Monte roteiros considerando interesses, tempo disponível, orçamento e deslocamentos.",
  },
  {
    passo: "3",
    titulo: "Vivencie",
    descricao:
      "Faça check-in, avance no passaporte digital e salve roteiros para continuar depois.",
  },
];

const itensParceiro = [
  "Cadastrar local ou experiência",
  "Acompanhar o status da análise",
  "Ativar Plano Destaque",
  "Aparecer no catálogo turístico após aprovação",
];

const resumoCatalogo = {
  totalLocais: 19,
  totalCidades: 9,
  totalCategorias: categorias.length,
};

const experienciasInicio: {
  titulo: string;
  descricao: string;
  href: string;
  cta: string;
  destaque: string;
  icone: IconeNome;
}[] = [
  {
    titulo: "Explorar pontos turísticos",
    descricao:
      "Veja praias, espaços culturais, natureza e experiências locais cadastradas no catálogo.",
    href: "/explorar",
    cta: "Explorar agora",
    destaque: "Catálogo",
    icone: "compass",
  },
  {
    titulo: "Criar roteiro personalizado",
    descricao:
      "Monte uma sugestão de viagem com base em tempo, orçamento, transporte e interesses.",
    href: "/criar-roteiro",
    cta: "Criar roteiro",
    destaque: "Roteiro",
    icone: "suitcase",
  },
  {
    titulo: "Ver mapa interativo",
    descricao:
      "Visualize pontos turísticos no mapa e organize melhor as paradas do passeio.",
    href: "/mapa",
    cta: "Abrir mapa",
    destaque: "Mapa",
    icone: "landmark",
  },
  {
    titulo: "Acompanhar passaporte",
    descricao:
      "Faça check-ins, desbloqueie selos virtuais e acompanhe sua jornada pela Paraíba.",
    href: "/passaporte",
    cta: "Ver passaporte",
    destaque: "Gamificação",
    icone: "star",
  },
];

function Icone({
  nome,
  className = "h-7 w-7",
}: {
  nome: IconeNome;
  className?: string;
}) {
  const classes = `${className} stroke-current`;

  if (nome === "waves") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
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
        strokeWidth="1.8"
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
        strokeWidth="1.8"
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
        strokeWidth="1.8"
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

  if (nome === "compass") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
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

  if (nome === "suitcase") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="M9 7V5.8C9 4.8 9.8 4 10.8 4h2.4C14.2 4 15 4.8 15 5.8V7" />
        <rect x="4" y="7" width="16" height="13" rx="3" />
        <path d="M4 12h16" />
        <path d="M9 12v2" />
        <path d="M15 12v2" />
      </svg>
    );
  }

  if (nome === "handshake") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="m8.5 12.5 2.2-2.2a2 2 0 0 1 2.8 0l.4.4" />
        <path d="m14 10.8 1.6-1.6a2 2 0 0 1 2.8 0L21 11.8" />
        <path d="m3 12 3.2-3.2a2 2 0 0 1 2.8 0l1.7 1.7" />
        <path d="m7 14 4.2 4.2a2 2 0 0 0 2.8 0l4.8-4.8" />
        <path d="m12 19 1.4 1.4a2 2 0 0 0 2.8 0l.6-.6" />
        <path d="m5.5 13.5 3.8 3.8" />
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

export default function Home() {
  const { totalLocais, totalCidades, totalCategorias } = resumoCatalogo;

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      <section className="hero-gradient text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-heading mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
              Turismo inteligente, cultural e local na Paraíba
            </p>

            <h1 className="font-heading max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
              Planeje roteiros pela Paraíba com mais contexto e menos improviso.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">
              Descubra lugares, receba recomendações, monte roteiros
              personalizados e acompanhe suas experiências em um passaporte
              digital pensado para valorizar o turismo paraibano.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/explorar"
                className="font-heading rounded-full bg-white px-7 py-4 text-center font-black text-[#0F4C5C] transition hover:bg-[#F2C98A]"
              >
                Explorar lugares
              </Link>

              <Link
                href="/criar-roteiro"
                className="font-heading rounded-full bg-[#10B981] px-7 py-4 text-center font-black text-white transition hover:bg-white hover:text-[#0F4C5C]"
              >
                Criar meu roteiro
              </Link>

              <Link
                href="/parceiro"
                className="font-heading rounded-full border border-white/40 bg-white/10 px-7 py-4 text-center font-black text-white backdrop-blur transition hover:bg-white hover:text-[#0F4C5C]"
              >
                Sou parceiro
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
                <p className="font-heading text-3xl font-black text-white">
                  {totalLocais}
                </p>

                <p className="mt-1 text-xs font-semibold text-white/80">
                  locais cadastrados
                </p>
              </div>

              <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
                <p className="font-heading text-3xl font-black text-white">
                  {totalCidades}
                </p>

                <p className="mt-1 text-xs font-semibold text-white/80">
                  cidades no catálogo
                </p>
              </div>

              <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
                <p className="font-heading text-3xl font-black text-white">
                  {totalCategorias}
                </p>

                <p className="mt-1 text-xs font-semibold text-white/80">
                  categorias turísticas
                </p>
              </div>
            </div>
          </div>

          <div className="card-shadow rounded-[2rem] bg-white p-5 text-[#0F2433]">
            <div className="rounded-[1.5rem] bg-[#F5F7F8] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-heading text-sm font-black text-[#10B981]">
                    Experiência principal
                  </p>

                  <h2 className="font-heading mt-2 text-2xl font-black">
                    Monte um roteiro rápido
                  </h2>
                </div>

                <span className="rounded-full bg-[#10B981]/10 px-3 py-2 text-sm font-black text-[#0F4C5C]">
                  Personalizado
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-[#45617A]">
                Combine interesses, tempo e orçamento para criar uma sugestão de
                roteiro turístico personalizada.
              </p>

              <div className="mt-6 grid gap-4">
                <div>
                  <label className="text-sm font-bold">Cidade base</label>

                  <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    João Pessoa - PB
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-bold">Tempo</label>

                    <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      1 dia
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold">Orçamento</label>

                    <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      Econômico
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold">Interesses</label>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Praias", "Cultura", "Gastronomia"].map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[#10B981]/10 px-3 py-2 text-sm font-bold text-[#0F4C5C]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/criar-roteiro"
                  className="font-heading mt-2 rounded-2xl bg-[#10B981] px-5 py-4 text-center font-black text-white transition hover:bg-[#0F4C5C]"
                >
                  Gerar roteiro inteligente
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="mb-8 max-w-3xl">
          <p className="font-heading font-black text-[#10B981]">
            Para viajar e divulgar
          </p>

          <h2 className="font-heading mt-1 text-3xl font-black text-[#0F2433]">
            Uma plataforma para quem visita e para quem oferece experiências.
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#45617A]">
            O foco público do Roteirize PB é facilitar a vida do turista e
            aproximar parceiros locais de pessoas interessadas em conhecer a
            Paraíba.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {publicos.map((publico) => (
            <article
              key={publico.titulo}
              className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 transition hover:-translate-y-1"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#10B981]/10 text-[#0F4C5C]">
                <Icone nome={publico.icone} />
              </div>

              <h3 className="font-heading mt-5 text-xl font-black text-[#0F2433]">
                {publico.titulo}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#45617A]">
                {publico.descricao}
              </p>

              <Link
                href={publico.href}
                className="font-heading mt-5 inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
              >
                {publico.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="soft-grid bg-white py-14">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-heading font-black text-[#10B981]">
                Como funciona
              </p>

              <h2 className="font-heading mt-1 text-3xl font-black text-[#0F2433]">
                Do interesse ao roteiro pronto.
              </h2>
            </div>

            <Link
              href="/mapa"
              className="font-heading rounded-full bg-[#0F4C5C] px-6 py-3 text-center text-sm font-black text-white transition hover:bg-[#10B981]"
            >
              Ver mapa turístico
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {funcionamento.map((item) => (
              <article
                key={item.passo}
                className="rounded-[2rem] border border-slate-100 bg-white p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2C98A]/35 font-heading text-lg font-black text-[#0F4C5C]">
                  {item.passo}
                </div>

                <h3 className="font-heading mt-5 text-xl font-black text-[#0F2433]">
                  {item.titulo}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#45617A]">
                  {item.descricao}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-heading font-black text-[#10B981]">
              Categorias
            </p>

            <h2 className="font-heading mt-1 text-3xl font-black text-[#0F2433]">
              Explore do seu jeito
            </h2>
          </div>

          <Link
            href="/explorar"
            className="font-heading font-bold text-[#0F4C5C] transition hover:text-[#10B981]"
          >
            Ver todos
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {categorias.map((categoria) => (
            <div
              key={categoria.nome}
              className="card-shadow rounded-3xl bg-white p-5 transition hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
                <Icone nome={categoria.icone} />
              </div>

              <h3 className="font-heading mt-4 font-black text-[#0F2433]">
                {categoria.nome}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#45617A]">
                {categoria.descricao}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="roteiros" className="soft-grid bg-white py-14">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-heading font-black text-[#10B981]">
                Jornada turística
              </p>

              <h2 className="font-heading mt-1 text-3xl font-black text-[#0F2433]">
                Comece sua experiência pelo caminho certo
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#45617A]">
                Acesse as áreas principais do Roteirize PB sem depender de
                roteiros fixos: explore lugares, gere uma rota, acompanhe o mapa
                e registre sua evolução no passaporte digital.
              </p>
            </div>

            <Link
              href="/explorar"
              className="font-heading rounded-full border border-slate-200 px-6 py-3 text-sm font-black text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
            >
              Ver catálogo completo
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {experienciasInicio.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="card-shadow group flex min-h-[260px] flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 transition hover:-translate-y-1 hover:border-[#10B981]/40 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-heading rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-black text-[#0F4C5C]">
                      {item.destaque}
                    </span>

                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C] transition group-hover:bg-[#0F4C5C] group-hover:text-white">
                      <Icone nome={item.icone} className="h-5 w-5" />
                    </span>
                  </div>

                  <h3 className="font-heading mt-5 text-xl font-black text-[#0F2433]">
                    {item.titulo}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#45617A]">
                    {item.descricao}
                  </p>
                </div>

                <div className="font-heading mt-6 inline-flex items-center text-sm font-black text-[#0F4C5C] transition group-hover:text-[#10B981]">
                  {item.cta}
                  <span className="ml-2 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="parceiros" className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-8 rounded-[2rem] bg-[#0F2433] p-8 text-white md:grid-cols-[1.2fr_0.8fr] md:p-12">
          <div>
            <p className="font-heading font-black text-[#10B981]">
              Parceiros locais
            </p>

            <h2 className="font-heading mt-2 text-4xl font-black">
              Divulgue experiências, serviços e lugares da Paraíba.
            </h2>

            <p className="mt-4 max-w-2xl leading-8 text-white/75">
              Guias, restaurantes, artesãos, hospedagens e iniciativas culturais
              podem cadastrar seus serviços para análise, publicação e destaque
              na plataforma.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/parceiro"
                className="font-heading rounded-full bg-[#10B981] px-6 py-3 text-center text-sm font-black text-white transition hover:bg-white hover:text-[#0F4C5C]"
              >
                Quero ser parceiro
              </Link>

              <Link
                href="/planos"
                className="font-heading rounded-full border border-white/30 px-6 py-3 text-center text-sm font-black text-white transition hover:bg-white hover:text-[#0F4C5C]"
              >
                Conhecer Plano Destaque
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 text-[#0F2433]">
            <h3 className="font-heading text-xl font-black">
              Painel do parceiro
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-[#45617A]">
              {itensParceiro.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10B981]/10 text-[#0F4C5C]">
                    <Icone nome="check" className="h-3.5 w-3.5" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
