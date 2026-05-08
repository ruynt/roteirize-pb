"use client";

import Header from "@/components/Header";
import { useEffect, useMemo, useState } from "react";

type StatusSolicitacao = "Aguardando aprovação" | "Aprovado" | "Rejeitado";

type SolicitacaoParceiro = {
  id: number;
  nome: string;
  tipo: string;
  cidade: string;
  endereco: string;
  descricao: string;
  horario: string;
  preco: string;
  contato: string;
  acessibilidade: string;
  status: StatusSolicitacao;
  criadoEm: string;
};

const solicitacoesExemplo: SolicitacaoParceiro[] = [
  {
    id: 1,
    nome: "Passeio Guiado pelo Centro Histórico",
    tipo: "Guia turístico",
    cidade: "João Pessoa",
    endereco: "Centro, João Pessoa - PB",
    descricao:
      "Passeio cultural com guia local por igrejas, praças e prédios históricos.",
    horario: "09h às 12h",
    preco: "R$ 40 por pessoa",
    contato: "@guiahistoricopb",
    acessibilidade: "Média",
    status: "Aguardando aprovação",
    criadoEm: "20/05/2026",
  },
  {
    id: 2,
    nome: "Oficina de Cerâmica Regional",
    tipo: "Experiência cultural",
    cidade: "Areia",
    endereco: "Centro de Areia - PB",
    descricao:
      "Experiência com artesão local para conhecer técnicas de cerâmica regional.",
    horario: "14h às 17h",
    preco: "R$ 60 por pessoa",
    contato: "(83) 99999-0000",
    acessibilidade: "Baixa",
    status: "Aprovado",
    criadoEm: "18/05/2026",
  },
  {
    id: 3,
    nome: "Restaurante Sabores do Sertão",
    tipo: "Restaurante",
    cidade: "Campina Grande",
    endereco: "Centro, Campina Grande - PB",
    descricao:
      "Restaurante regional com pratos típicos e proposta de valorização da culinária paraibana.",
    horario: "11h às 15h",
    preco: "R$ 35 a R$ 80",
    contato: "@saboresdosertao",
    acessibilidade: "Alta",
    status: "Rejeitado",
    criadoEm: "15/05/2026",
  },
];

export default function AdminPage() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoParceiro[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<"Todos" | StatusSolicitacao>(
    "Todos"
  );

  useEffect(() => {
    const solicitacoesSalvas = localStorage.getItem("roteirize_solicitacoes");

    if (solicitacoesSalvas) {
      const dadosSalvos: SolicitacaoParceiro[] = JSON.parse(solicitacoesSalvas);
      setSolicitacoes([...dadosSalvos, ...solicitacoesExemplo]);
    } else {
      setSolicitacoes(solicitacoesExemplo);
    }
  }, []);

  function salvarSolicitacoes(novasSolicitacoes: SolicitacaoParceiro[]) {
    const solicitacoesDoUsuario = novasSolicitacoes.filter(
      (solicitacao) => solicitacao.id > 1000
    );

    localStorage.setItem(
      "roteirize_solicitacoes",
      JSON.stringify(solicitacoesDoUsuario)
    );

    setSolicitacoes(novasSolicitacoes);
  }

  function alterarStatus(id: number, novoStatus: StatusSolicitacao) {
    const novasSolicitacoes = solicitacoes.map((solicitacao) => {
      if (solicitacao.id === id) {
        return {
          ...solicitacao,
          status: novoStatus,
        };
      }

      return solicitacao;
    });

    salvarSolicitacoes(novasSolicitacoes);
  }

  function removerSolicitacao(id: number) {
    const novasSolicitacoes = solicitacoes.filter(
      (solicitacao) => solicitacao.id !== id
    );

    salvarSolicitacoes(novasSolicitacoes);
  }

  function limparSolicitacoesLocais() {
    localStorage.removeItem("roteirize_solicitacoes");
    setSolicitacoes(solicitacoesExemplo);
  }

  const solicitacoesFiltradas = useMemo(() => {
    if (filtroStatus === "Todos") return solicitacoes;

    return solicitacoes.filter(
      (solicitacao) => solicitacao.status === filtroStatus
    );
  }, [solicitacoes, filtroStatus]);

  const resumo = useMemo(() => {
    return {
      total: solicitacoes.length,
      pendentes: solicitacoes.filter(
        (solicitacao) => solicitacao.status === "Aguardando aprovação"
      ).length,
      aprovadas: solicitacoes.filter(
        (solicitacao) => solicitacao.status === "Aprovado"
      ).length,
      rejeitadas: solicitacoes.filter(
        (solicitacao) => solicitacao.status === "Rejeitado"
      ).length,
    };
  }, [solicitacoes]);

  function classeStatus(status: StatusSolicitacao) {
    if (status === "Aprovado") {
      return "bg-[#10B981]/10 text-[#10B981]";
    }

    if (status === "Rejeitado") {
      return "bg-red-50 text-red-700";
    }

    return "bg-amber-50 text-amber-700";
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="font-heading font-black text-[#10B981]">
            Painel administrativo
          </p>

          <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight text-[#0F2433] md:text-5xl">
            Gerencie solicitações de parceiros locais.
          </h1>

          <p className="mt-4 max-w-3xl leading-8 text-[#45617A]">
            Nesta área, a equipe da plataforma pode avaliar cadastros enviados
            por restaurantes, guias, artesãos e organizadores de experiências
            turísticas.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 card-shadow">
            <p className="text-sm font-black text-[#45617A]">Total</p>
            <p className="mt-2 text-3xl font-black text-[#0F2433]">
              {resumo.total}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 card-shadow">
            <p className="text-sm font-black text-[#45617A]">Pendentes</p>
            <p className="mt-2 text-3xl font-black text-amber-600">
              {resumo.pendentes}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 card-shadow">
            <p className="text-sm font-black text-[#45617A]">Aprovadas</p>
            <p className="mt-2 text-3xl font-black text-[#10B981]">
              {resumo.aprovadas}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 card-shadow">
            <p className="text-sm font-black text-[#45617A]">Rejeitadas</p>
            <p className="mt-2 text-3xl font-black text-red-600">
              {resumo.rejeitadas}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 card-shadow">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#0F2433]">
                Solicitações recebidas
              </h2>

              <p className="mt-1 text-sm text-[#45617A]">
                Aprove apenas os cadastros confiáveis e alinhados ao turismo
                local.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={filtroStatus}
                onChange={(event) =>
                  setFiltroStatus(
                    event.target.value as "Todos" | StatusSolicitacao
                  )
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold outline-none focus:border-[#10B981]"
              >
                <option>Todos</option>
                <option>Aguardando aprovação</option>
                <option>Aprovado</option>
                <option>Rejeitado</option>
              </select>

              <button
                onClick={limparSolicitacoesLocais}
                className="rounded-2xl border border-slate-200 px-4 py-3 font-black text-[#45617A] transition hover:border-red-300 hover:text-red-600"
              >
                Limpar testes
              </button>
            </div>
          </div>

          {solicitacoesFiltradas.length === 0 ? (
            <div className="py-14 text-center">
              <h3 className="text-2xl font-black text-[#0F2433]">
                Nenhuma solicitação encontrada
              </h3>

              <p className="mt-2 text-[#45617A]">
                Tente mudar o filtro ou enviar uma nova solicitação pela área do
                parceiro.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5">
              {solicitacoesFiltradas.map((solicitacao) => (
                <article
                  key={solicitacao.id}
                  className="rounded-3xl border border-slate-100 bg-white p-5 transition hover:border-[#10B981]/40"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-[#45617A]">
                          {solicitacao.tipo}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${classeStatus(
                            solicitacao.status
                          )}`}
                        >
                          {solicitacao.status}
                        </span>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                          Enviado em {solicitacao.criadoEm}
                        </span>
                      </div>

                      <h3 className="mt-4 text-2xl font-black text-[#0F2433]">
                        {solicitacao.nome}
                      </h3>

                      <p className="mt-2 max-w-3xl leading-7 text-[#45617A]">
                        {solicitacao.descricao}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          alterarStatus(solicitacao.id, "Aprovado")
                        }
                        className="rounded-2xl bg-[#10B981] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0F4C5C]"
                      >
                        Aprovar
                      </button>

                      <button
                        onClick={() =>
                          alterarStatus(solicitacao.id, "Rejeitado")
                        }
                        className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white transition hover:bg-red-700"
                      >
                        Rejeitar
                      </button>

                      <button
                        onClick={() => removerSolicitacao(solicitacao.id)}
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-[#45617A] transition hover:border-red-300 hover:text-red-600"
                      >
                        Remover
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-4">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-black text-[#45617A]">
                        Cidade
                      </p>
                      <p className="mt-1 font-bold text-[#0F2433]">
                        {solicitacao.cidade}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-black text-[#45617A]">
                        Endereço
                      </p>
                      <p className="mt-1 font-bold text-[#0F2433]">
                        {solicitacao.endereco}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-black text-[#45617A]">
                        Horário
                      </p>
                      <p className="mt-1 font-bold text-[#0F2433]">
                        {solicitacao.horario || "Não informado"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-black text-[#45617A]">
                        Faixa de preço
                      </p>
                      <p className="mt-1 font-bold text-[#0F2433]">
                        {solicitacao.preco || "Não informado"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-black text-[#45617A]">
                        Contato
                      </p>
                      <p className="mt-1 font-bold text-[#0F2433]">
                        {solicitacao.contato || "Não informado"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-black text-[#45617A]">
                        Acessibilidade
                      </p>
                      <p className="mt-1 font-bold text-[#0F2433]">
                        {solicitacao.acessibilidade}
                      </p>
                    </div>
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