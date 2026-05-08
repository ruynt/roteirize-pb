import Header from "@/components/Header";
import Link from "next/link";

const perfis = [
  {
    nome: "Turista",
    descricao:
      "Crie roteiros personalizados, explore pontos turísticos e salve experiências para sua viagem.",
    icone: "🧳",
    href: "/criar-roteiro",
    botao: "Entrar como turista",
  },
  {
    nome: "Parceiro Local",
    descricao:
      "Cadastre restaurantes, serviços, passeios, experiências culturais e pontos de interesse.",
    icone: "🏪",
    href: "/parceiro",
    botao: "Entrar como parceiro",
  },
  {
    nome: "Administrador",
    descricao:
      "Analise solicitações de parceiros, aprove cadastros e acompanhe os dados da plataforma.",
    icone: "🛠️",
    href: "/admin",
    botao: "Entrar como admin",
  },
];

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
            Acesso à plataforma
          </p>

          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Escolha como deseja acessar o Roteirize PB.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/90">
            Nesta primeira versão, o login é uma simulação para demonstrar os
            diferentes perfis de usuário do sistema: turista, parceiro local e
            administrador.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {perfis.map((perfil) => (
            <article
              key={perfil.nome}
              className="card-shadow flex flex-col rounded-[2rem] bg-white p-6 transition hover:-translate-y-1"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#10B981]/10 text-3xl">
                {perfil.icone}
              </div>

              <h2 className="mt-6 text-2xl font-black text-[#0F2433]">
                {perfil.nome}
              </h2>

              <p className="mt-3 flex-1 leading-7 text-[#45617A]">
                {perfil.descricao}
              </p>

              <Link
                href={perfil.href}
                className="mt-6 rounded-2xl bg-[#10B981] px-5 py-4 text-center font-black text-white transition hover:bg-[#0F4C5C]"
              >
                {perfil.botao}
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] bg-white p-6 card-shadow">
          <h2 className="text-2xl font-black text-[#0F2433]">
            Observação para apresentação
          </h2>

          <p className="mt-3 leading-8 text-[#45617A]">
            Em uma versão futura, esta tela teria autenticação real com e-mail e
            senha. Por enquanto, ela funciona como uma seleção de perfil para
            demonstrar os fluxos principais do sistema.
          </p>
        </div>
      </section>
    </main>
  );
}