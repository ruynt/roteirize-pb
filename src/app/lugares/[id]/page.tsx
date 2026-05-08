import Header from "@/components/Header";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lugares } from "@/data/lugares";

type DetalhesLugarPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DetalhesLugarPage({
  params,
}: DetalhesLugarPageProps) {
  const { id } = await params;

  const lugar = lugares.find((item) => item.id === Number(id));

  if (!lugar) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link
          href="/explorar"
          className="mb-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-[#45617A] shadow-sm transition hover:text-[#10B981]"
        >
          ← Voltar para explorar
        </Link>

        <div className="overflow-hidden rounded-[2rem] bg-white card-shadow">
          <div className={`h-72 bg-gradient-to-br ${lugar.imagemClasse}`}>
            <div className="flex h-full items-end bg-gradient-to-t from-black/60 to-transparent p-8">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-black text-[#10B981] backdrop-blur">
                    {lugar.categoria}
                  </span>

                  <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-black text-amber-600 backdrop-blur">
                    ★ {lugar.nota}
                  </span>

                  <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-black text-[#0F2433] backdrop-blur">
                    {lugar.custo}
                  </span>
                </div>

                <h1 className="mt-4 max-w-4xl text-4xl font-black text-white md:text-6xl">
                  {lugar.nome}
                </h1>

                <p className="mt-3 text-lg font-semibold text-white/90">
                  {lugar.cidade}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 lg:grid-cols-[1fr_360px] lg:p-8">
            <section>
              <h2 className="text-2xl font-black text-[#0F2433]">
                Sobre o local
              </h2>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-[#45617A]">
                {lugar.descricao}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm font-black text-[#45617A]">Endereço</p>

                  <p className="mt-2 font-bold text-[#0F2433]">
                    {lugar.endereco}
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm font-black text-[#45617A]">
                    Horário ideal
                  </p>

                  <p className="mt-2 font-bold text-[#0F2433]">
                    {lugar.horarioIdeal}
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm font-black text-[#45617A]">
                    Tempo sugerido
                  </p>

                  <p className="mt-2 font-bold text-[#0F2433]">
                    {lugar.tempoSugeridoMin} minutos
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm font-black text-[#45617A]">
                    Acessibilidade
                  </p>

                  <p className="mt-2 font-bold text-[#0F2433]">
                    {lugar.acessibilidade}
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm font-black text-[#45617A]">
                    Preço estimado
                  </p>

                  <p className="mt-2 font-bold text-[#0F2433]">
                    {lugar.precoEstimado}
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm font-black text-[#45617A]">
                    Distância do centro
                  </p>

                  <p className="mt-2 font-bold text-[#0F2433]">
                    {lugar.distanciaCentroKm} km
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-black text-[#0F2433]">
                  Tags e perfil da experiência
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {lugar.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#10B981]/10 px-4 py-2 text-sm font-black text-[#0F4C5C]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-2xl font-black text-[#0F2433]">
                  Avaliações dos visitantes
                </h2>

                <p className="mt-3 leading-7 text-[#45617A]">
                  Nesta primeira versão, as avaliações ainda estão simuladas.
                  Futuramente, turistas poderão avaliar segurança, estrutura,
                  limpeza, acessibilidade e experiência geral.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-black text-[#45617A]">
                      Experiência geral
                    </p>

                    <p className="mt-2 text-2xl font-black text-amber-600">
                      ★ {lugar.nota}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-black text-[#45617A]">
                      Indicado para
                    </p>

                    <p className="mt-2 font-bold text-[#0F2433]">
                      {lugar.tags.slice(0, 2).join(", ")}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-black text-[#45617A]">
                      Melhor uso
                    </p>

                    <p className="mt-2 font-bold text-[#0F2433]">
                      Roteiros de {lugar.categoria.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <aside className="h-fit rounded-3xl bg-[#0F2433] p-6 text-white">
              <h2 className="text-2xl font-black">Adicionar ao roteiro</h2>

              <p className="mt-3 leading-7 text-white/75">
                Inclua este local em um itinerário personalizado com tempo de
                permanência, deslocamento e horário ideal.
              </p>

              <div className="mt-6 space-y-3 rounded-3xl bg-white/10 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/70">Categoria</span>
                  <strong>{lugar.categoria}</strong>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/70">Tempo</span>
                  <strong>{lugar.tempoSugeridoMin} min</strong>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/70">Custo</span>
                  <strong>{lugar.custo}</strong>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/70">Nota</span>
                  <strong>★ {lugar.nota}</strong>
                </div>
              </div>

              <Link
                href="/criar-roteiro"
                className="mt-6 block rounded-2xl bg-[#10B981] px-5 py-4 text-center font-black text-white transition hover:bg-[#1E88E5]"
              >
                Criar roteiro com este local
              </Link>

              <Link
                href="/explorar"
                className="mt-3 block rounded-2xl bg-white px-5 py-4 text-center font-black text-[#0F2433] transition hover:bg-slate-100"
              >
                Explorar outros lugares
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}