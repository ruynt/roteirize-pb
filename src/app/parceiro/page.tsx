"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type FormularioParceiro = {
  nome: string;
  tipo: string;
  cidade: string;
  endereco: string;
  descricao: string;
  horario: string;
  preco: string;
  contato: string;
  acessibilidade: string;
};

type SolicitacaoParceiro = {
  id: string;
  nome: string;
  tipo: string;
  cidade: string;
  endereco: string;
  descricao: string;
  horario: string | null;
  preco: string | null;
  contato: string | null;
  acessibilidade: string;
  status: string;
  statusOriginal: "AGUARDANDO_APROVACAO" | "APROVADO" | "REJEITADO";
  criadoEm: string;
};

const formularioInicial: FormularioParceiro = {
  nome: "",
  tipo: "Ponto turístico",
  cidade: "João Pessoa",
  endereco: "",
  descricao: "",
  horario: "",
  preco: "",
  contato: "",
  acessibilidade: "Média",
};

const tipos = [
  "Ponto turístico",
  "Restaurante",
  "Guia turístico",
  "Artesanato",
  "Experiência local",
  "Hospedagem",
  "Transporte turístico",
];

const cidades = [
  "João Pessoa",
  "Cabedelo",
  "Conde",
  "Campina Grande",
  "Areia",
  "Bananeiras",
  "Outras cidades",
];

const niveisAcessibilidade = ["Baixa", "Média", "Alta"];

const etapas = [
  {
    numero: "1",
    titulo: "Envio da experiência",
    descricao:
      "O parceiro informa os dados principais do local, serviço ou vivência turística.",
  },
  {
    numero: "2",
    titulo: "Análise da equipe",
    descricao:
      "A solicitação é revisada para manter a qualidade das informações exibidas aos turistas.",
  },
  {
    numero: "3",
    titulo: "Publicação no catálogo",
    descricao:
      "Após aprovação, o local pode aparecer no Explorar, no Mapa e no criador de roteiros.",
  },
];

const beneficios = [
  "Apareça para turistas que buscam experiências na Paraíba.",
  "Entre no catálogo usado para montar roteiros personalizados.",
  "Divulgue informações como preço, contato, endereço e acessibilidade.",
];

function formatarData(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(data));
}

function classeStatus(status: SolicitacaoParceiro["statusOriginal"]) {
  if (status === "APROVADO") {
    return "bg-[#10B981]/10 text-[#0F4C5C]";
  }

  if (status === "REJEITADO") {
    return "bg-red-50 text-red-600";
  }

  return "bg-[#F2C98A]/30 text-[#0F4C5C]";
}

function textoAjudaStatus(status: SolicitacaoParceiro["statusOriginal"]) {
  if (status === "APROVADO") {
    return "Sua experiência foi aprovada e pode aparecer na plataforma.";
  }

  if (status === "REJEITADO") {
    return "A solicitação foi rejeitada. Revise as informações antes de reenviar.";
  }

  return "A equipe ainda está analisando esta solicitação.";
}

export default function ParceiroPage() {
  const [formulario, setFormulario] =
    useState<FormularioParceiro>(formularioInicial);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoParceiro[]>([]);
  const [carregandoSolicitacoes, setCarregandoSolicitacoes] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const camposObrigatoriosPreenchidos = useMemo(() => {
    return Boolean(
      formulario.nome.trim() &&
        formulario.tipo.trim() &&
        formulario.cidade.trim() &&
        formulario.endereco.trim() &&
        formulario.descricao.trim()
    );
  }, [formulario]);

  const resumoSolicitacoes = useMemo(() => {
    return {
      total: solicitacoes.length,
      aguardando: solicitacoes.filter(
        (solicitacao) =>
          solicitacao.statusOriginal === "AGUARDANDO_APROVACAO"
      ).length,
      aprovadas: solicitacoes.filter(
        (solicitacao) => solicitacao.statusOriginal === "APROVADO"
      ).length,
      rejeitadas: solicitacoes.filter(
        (solicitacao) => solicitacao.statusOriginal === "REJEITADO"
      ).length,
    };
  }, [solicitacoes]);

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  function atualizarCampo(campo: keyof FormularioParceiro, valor: string) {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor,
    }));
  }

  async function carregarSolicitacoes() {
    try {
      setCarregandoSolicitacoes(true);

      const resposta = await fetch("/api/solicitacoes-parceiro", {
        cache: "no-store",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error ?? "Não foi possível carregar solicitações.");
      }

      setSolicitacoes(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error(error);
      setSolicitacoes([]);
    } finally {
      setCarregandoSolicitacoes(false);
    }
  }

  async function enviarSolicitacao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setEnviando(true);
      setMensagem("");
      setErro("");

      const resposta = await fetch("/api/solicitacoes-parceiro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formulario),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error ?? "Erro ao enviar solicitação.");
      }

      setFormulario(formularioInicial);
      setMensagem(
        "Solicitação enviada com sucesso! Agora ela será analisada pela equipe antes de aparecer para os turistas."
      );
      await carregarSolicitacoes();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível enviar a solicitação.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#0F2433]">
      <Header />

      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div className="max-w-4xl">
              <span className="font-heading rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                Área do parceiro local
              </span>

              <h1 className="font-heading mt-6 text-4xl font-black leading-tight md:text-6xl">
                Divulgue sua experiência turística na Paraíba.
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
                Cadastre restaurantes, guias, vivências, pontos turísticos,
                hospedagens, artesanato ou serviços locais para análise da
                equipe. Após aprovação, sua experiência poderá aparecer para
                turistas no Roteirize PB.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#formulario-parceiro"
                  className="font-heading rounded-full bg-white px-6 py-3 text-center text-sm font-black text-[#0F4C5C] transition hover:bg-[#F2C98A]"
                >
                  Cadastrar experiência
                </a>

                <a
                  href="#minhas-solicitacoes"
                  className="font-heading rounded-full border border-white/40 bg-white/10 px-6 py-3 text-center text-sm font-black text-white backdrop-blur transition hover:bg-white hover:text-[#0F4C5C]"
                >
                  Ver minhas solicitações
                </a>

                <Link
                  href="/planos"
                  className="font-heading rounded-full border border-white/40 bg-white/10 px-6 py-3 text-center text-sm font-black text-white backdrop-blur transition hover:bg-white hover:text-[#0F4C5C]"
                >
                  Plano Destaque
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/20 bg-white/15 p-6 backdrop-blur">
              <p className="font-heading text-sm font-bold text-white/80">
                Para empreendedores locais
              </p>

              <p className="font-heading mt-3 text-3xl font-black text-white">
                Marketplace turístico
              </p>

              <p className="mt-3 text-sm leading-6 text-white/85">
                O objetivo é aproximar pequenos negócios, experiências culturais
                e serviços locais dos turistas que estão planejando roteiros pela
                Paraíba.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {etapas.map((etapa) => (
            <article
              key={etapa.numero}
              className="card-shadow rounded-[1.5rem] border border-slate-100 bg-white p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10B981]/10 font-heading text-lg font-black text-[#0F4C5C]">
                {etapa.numero}
              </div>

              <h2 className="font-heading mt-4 text-lg font-black text-[#0F2433]">
                {etapa.titulo}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#45617A]">
                {etapa.descricao}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-12 lg:grid-cols-[1fr_380px]">
        <form
          id="formulario-parceiro"
          onSubmit={enviarSolicitacao}
          className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-xs font-black text-[#0F4C5C]">
                Cadastro para análise
              </span>

              <h2 className="font-heading mt-4 text-2xl font-black text-[#0F2433]">
                Dados da experiência
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#45617A]">
                Preencha as informações com clareza. Os campos com asterisco são
                obrigatórios e ajudam a equipe a avaliar a publicação.
              </p>
            </div>

            <div
              className={
                camposObrigatoriosPreenchidos
                  ? "rounded-2xl bg-[#10B981]/10 px-4 py-3 text-sm font-bold text-[#0F4C5C]"
                  : "rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-[#45617A]"
              }
            >
              {camposObrigatoriosPreenchidos
                ? "Pronto para enviar"
                : "Preencha os obrigatórios"}
            </div>
          </div>

          {mensagem && (
            <div className="mt-6 rounded-2xl border border-[#10B981]/20 bg-[#10B981]/10 p-4 text-sm font-semibold text-[#0F4C5C]">
              {mensagem}
            </div>
          )}

          {erro && (
            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
              {erro}
            </div>
          )}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div>
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                Nome do local ou serviço *
              </label>
              <input
                value={formulario.nome}
                onChange={(event) => atualizarCampo("nome", event.target.value)}
                placeholder="Ex: Restaurante Sabor Paraibano"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                Tipo *
              </label>
              <select
                value={formulario.tipo}
                onChange={(event) => atualizarCampo("tipo", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              >
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                Cidade *
              </label>
              <select
                value={formulario.cidade}
                onChange={(event) =>
                  atualizarCampo("cidade", event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              >
                {cidades.map((cidade) => (
                  <option key={cidade} value={cidade}>
                    {cidade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                Endereço *
              </label>
              <input
                value={formulario.endereco}
                onChange={(event) =>
                  atualizarCampo("endereco", event.target.value)
                }
                placeholder="Rua, bairro ou referência"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                Horário de funcionamento
              </label>
              <input
                value={formulario.horario}
                onChange={(event) =>
                  atualizarCampo("horario", event.target.value)
                }
                placeholder="Ex: 09h às 17h"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                Faixa de preço
              </label>
              <input
                value={formulario.preco}
                onChange={(event) =>
                  atualizarCampo("preco", event.target.value)
                }
                placeholder="Ex: R$ 30 a R$ 80"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                Contato
              </label>
              <input
                value={formulario.contato}
                onChange={(event) =>
                  atualizarCampo("contato", event.target.value)
                }
                placeholder="Telefone, WhatsApp, Instagram ou e-mail"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                Acessibilidade
              </label>
              <select
                value={formulario.acessibilidade}
                onChange={(event) =>
                  atualizarCampo("acessibilidade", event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              >
                {niveisAcessibilidade.map((nivel) => (
                  <option key={nivel} value={nivel}>
                    {nivel}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-end justify-between gap-3">
                <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                  Descrição *
                </label>

                <span className="text-xs font-semibold text-[#45617A]">
                  {formulario.descricao.length} caracteres
                </span>
              </div>

              <textarea
                value={formulario.descricao}
                onChange={(event) =>
                  atualizarCampo("descricao", event.target.value)
                }
                placeholder="Descreva a experiência, o diferencial do serviço e por que ela pode enriquecer o roteiro de quem visita a Paraíba."
                rows={5}
                className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-[#45617A]">
              Após o envio, acompanhe a análise pela seção Minhas solicitações.
            </p>

            <button
              type="submit"
              disabled={enviando || !camposObrigatoriosPreenchidos}
              className="font-heading rounded-full bg-[#0F4C5C] px-7 py-4 text-sm font-black text-white transition hover:bg-[#10B981] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enviando ? "Enviando..." : "Enviar para análise"}
            </button>
          </div>
        </form>

        <aside className="space-y-5">
          <div className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6">
            <h2 className="font-heading text-2xl font-black text-[#0F2433]">
              Benefícios para parceiros
            </h2>

            <div className="mt-5 space-y-4">
              {beneficios.map((beneficio) => (
                <div key={beneficio} className="flex gap-3">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#10B981]/10 text-xs font-black text-[#0F4C5C]">
                    ✓
                  </div>

                  <p className="text-sm leading-6 text-[#45617A]">
                    {beneficio}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#0F4C5C] p-6 text-white">
            <h3 className="font-heading text-xl font-black">
              Destaque sua experiência
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/85">
              Parceiros com Plano Destaque ativo podem ganhar mais visibilidade
              no catálogo, ajudando turistas a encontrar seus serviços com mais
              facilidade.
            </p>

            <Link
              href="/planos"
              className="font-heading mt-5 inline-flex w-full justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-[#0F4C5C] transition hover:bg-[#F2C98A]"
            >
              Ver planos
            </Link>
          </div>

          <div className="rounded-[2rem] border border-[#F2C98A]/60 bg-[#F2C98A]/25 p-6">
            <h3 className="font-heading text-xl font-black text-[#0F4C5C]">
              Dica para aprovação
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#45617A]">
              Use uma descrição clara, informe endereço ou referência e indique
              horários, faixa de preço e formas de contato sempre que possível.
            </p>
          </div>
        </aside>
      </section>

      <section
        id="minhas-solicitacoes"
        className="mx-auto max-w-7xl px-5 pb-14"
      >
        <div className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-xs font-black text-[#0F4C5C]">
                Acompanhamento
              </span>

              <h2 className="font-heading mt-4 text-2xl font-black text-[#0F2433]">
                Minhas solicitações
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#45617A]">
                Acompanhe o status das experiências enviadas para análise. Após
                aprovação, elas podem aparecer para turistas na plataforma.
              </p>
            </div>

            <button
              type="button"
              onClick={carregarSolicitacoes}
              className="font-heading rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-[#0F4C5C] transition hover:border-[#10B981] hover:text-[#10B981]"
            >
              Atualizar
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="font-heading text-xs font-bold text-[#45617A]">
                Total
              </p>

              <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
                {resumoSolicitacoes.total}
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="font-heading text-xs font-bold text-[#45617A]">
                Em análise
              </p>

              <p className="font-heading mt-2 text-3xl font-black text-[#0F4C5C]">
                {resumoSolicitacoes.aguardando}
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="font-heading text-xs font-bold text-[#45617A]">
                Aprovadas
              </p>

              <p className="font-heading mt-2 text-3xl font-black text-[#10B981]">
                {resumoSolicitacoes.aprovadas}
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="font-heading text-xs font-bold text-[#45617A]">
                Rejeitadas
              </p>

              <p className="font-heading mt-2 text-3xl font-black text-red-500">
                {resumoSolicitacoes.rejeitadas}
              </p>
            </div>
          </div>

          {carregandoSolicitacoes ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-3xl bg-slate-100"
                />
              ))}
            </div>
          ) : solicitacoes.length === 0 ? (
            <div className="mt-6 rounded-3xl bg-slate-50 p-8 text-center">
              <h3 className="font-heading text-xl font-black text-[#0F2433]">
                Nenhuma solicitação encontrada
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#45617A]">
                Envie sua primeira experiência pelo formulário acima para
                acompanhar o processo de análise.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {solicitacoes.map((solicitacao) => (
                <article
                  key={solicitacao.id}
                  className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-heading text-lg font-black text-[#0F2433]">
                        {solicitacao.nome}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-[#0F4C5C]">
                        {solicitacao.cidade} • {solicitacao.tipo}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-[#45617A]">
                        Enviado em {formatarData(solicitacao.criadoEm)}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 font-heading text-xs font-black ${classeStatus(
                        solicitacao.statusOriginal
                      )}`}
                    >
                      {solicitacao.status}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#45617A]">
                    {solicitacao.descricao}
                  </p>

                  <div className="mt-4 rounded-2xl bg-white p-4">
                    <p className="font-heading text-xs font-black text-[#0F4C5C]">
                      Próximo passo
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#45617A]">
                      {textoAjudaStatus(solicitacao.statusOriginal)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
