import Header from "@/components/Header";
import Link from "next/link";
import { lugares } from "@/data/lugares";

const categorias = [
  {
    nome: "Praias",
    descricao: "Orla, litoral sul e paisagens naturais.",
    icone: "🌊",
  },
  {
    nome: "Cultura",
    descricao: "História, arquitetura, museus e memória.",
    icone: "🏛️",
  },
  {
    nome: "Gastronomia",
    descricao: "Restaurantes regionais e sabores locais.",
    icone: "🍽️",
  },
  {
    nome: "Natureza",
    descricao: "Trilhas, mirantes, parques e ecoturismo.",
    icone: "🌿",
  },
  {
    nome: "Experiências",
    descricao: "Guias, artesanato e vivências locais.",
    icone: "🧭",
  },
];

export default function Home() {
  const destaques = lugares.slice(0, 4);

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="hero-gradient text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
              Turismo cultural, ecológico e gastronômico na Paraíba
            </p>

            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
              Planeje sua experiência pela Paraíba de forma inteligente.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">
              Crie roteiros personalizados considerando tempo disponível,
              orçamento, interesses, horários ideais e deslocamento entre os
              pontos turísticos.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/criar-roteiro"
                className="rounded-full bg-emerald-500 px-7 py-4 text-center font-black text-white transition hover:bg-emerald-400"
              >
                Criar meu roteiro
              </Link>

              <Link
                href="/explorar"
                className="rounded-full bg-white px-7 py-4 text-center font-black text-slate-900 transition hover:bg-slate-100"
              >
                Explorar lugares
              </Link>
            </div>
          </div>

          <div className="card-shadow rounded-[2rem] bg-white p-5 text-slate-900">
            <div className="rounded-[1.5rem] bg-slate-50 p-5">
              <h2 className="text-2xl font-black">Monte um roteiro rápido</h2>

              <p className="mt-1 text-sm text-slate-500">
                Exemplo da experiência principal do sistema.
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
                        className="rounded-full bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/criar-roteiro"
                  className="mt-2 rounded-2xl bg-emerald-600 px-5 py-4 text-center font-black text-white transition hover:bg-emerald-700"
                >
                  Gerar roteiro inteligente
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-black text-emerald-700">Categorias</p>

            <h2 className="mt-1 text-3xl font-black text-slate-900">
              Explore do seu jeito
            </h2>
          </div>

          <Link href="/explorar" className="font-bold text-emerald-700">
            Ver todos
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {categorias.map((categoria) => (
            <div
              key={categoria.nome}
              className="card-shadow rounded-3xl bg-white p-5 transition hover:-translate-y-1"
            >
              <div className="text-3xl">{categoria.icone}</div>

              <h3 className="mt-4 font-black text-slate-900">
                {categoria.nome}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {categoria.descricao}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="roteiros" className="soft-grid bg-white py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8">
            <p className="font-black text-emerald-700">Roteiros em destaque</p>

            <h2 className="mt-1 text-3xl font-black text-slate-900">
              Ideias prontas para começar
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            {destaques.map((lugar) => (
              <div
                key={lugar.id}
                className="card-shadow overflow-hidden rounded-3xl bg-white"
              >
                <div
                  className={`h-36 bg-gradient-to-br ${lugar.imagemClasse}`}
                />

                <div className="p-5">
                  <p className="text-xs font-black uppercase text-emerald-700">
                    {lugar.categoria}
                  </p>

                  <h3 className="mt-2 text-lg font-black text-slate-900">
                    {lugar.nome}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {lugar.cidade} • {lugar.tempoSugeridoMin} min
                  </p>

                  <p className="mt-3 text-sm font-bold text-amber-600">
                    ★ {lugar.nota}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="parceiros" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 rounded-[2rem] bg-slate-900 p-8 text-white md:grid-cols-[1.2fr_0.8fr] md:p-12">
          <div>
            <p className="font-black text-emerald-300">Parceiros locais</p>

            <h2 className="mt-2 text-4xl font-black">
              Divulgue experiências, serviços e lugares da Paraíba.
            </h2>

            <p className="mt-4 max-w-2xl leading-8 text-white/75">
              Guias, restaurantes, artesãos e iniciativas culturais poderão
              cadastrar seus serviços para análise e inclusão nos roteiros da
              plataforma.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 text-slate-900">
            <h3 className="text-xl font-black">Painel do parceiro</h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>✓ Cadastrar local ou experiência</li>
              <li>✓ Informar horários, valores e endereço</li>
              <li>✓ Receber avaliações dos turistas</li>
              <li>✓ Aguardar aprovação do administrador</li>
            </ul>

            <Link
              href="/parceiro"
              className="mt-6 block w-full rounded-2xl bg-emerald-600 px-5 py-3 text-center font-black text-white transition hover:bg-emerald-700"
            >
              Quero ser parceiro
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}