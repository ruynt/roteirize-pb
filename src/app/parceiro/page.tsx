"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useState } from "react";

const tipos = [
  "Ponto turístico",
  "Restaurante",
  "Guia turístico",
  "Experiência cultural",
  "Artesanato",
  "Evento",
  "Ecoturismo",
  "Outro",
];

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
  status: "Aguardando aprovação" | "Aprovado" | "Rejeitado";
  criadoEm: string;
};

export default function ParceiroPage() {
  const [enviado, setEnviado] = useState(false);

  const [formulario, setFormulario] = useState({
    nome: "",
    tipo: "Ponto turístico",
    cidade: "",
    endereco: "",
    descricao: "",
    horario: "",
    preco: "",
    contato: "",
    acessibilidade: "Média",
  });

  function atualizarCampo(campo: string, valor: string) {
    setFormulario((dadosAtuais) => ({
      ...dadosAtuais,
      [campo]: valor,
    }));
  }

  function limparFormulario() {
    setFormulario({
      nome: "",
      tipo: "Ponto turístico",
      cidade: "",
      endereco: "",
      descricao: "",
      horario: "",
      preco: "",
      contato: "",
      acessibilidade: "Média",
    });
  }

  function enviarFormulario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const novaSolicitacao: SolicitacaoParceiro = {
      id: Date.now(),
      ...formulario,
      status: "Aguardando aprovação",
      criadoEm: new Date().toLocaleDateString("pt-BR"),
    };

    const solicitacoesSalvas = localStorage.getItem("roteirize_solicitacoes");

    const solicitacoes: SolicitacaoParceiro[] = solicitacoesSalvas
      ? JSON.parse(solicitacoesSalvas)
      : [];

    const novasSolicitacoes = [novaSolicitacao, ...solicitacoes];

    localStorage.setItem(
      "roteirize_solicitacoes",
      JSON.stringify(novasSolicitacoes)
    );

    setEnviado(true);
    limparFormulario();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="font-heading font-black text-[#10B981]">
            Área do parceiro local
          </p>

          <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight text-[#0F2433] md:text-5xl">
            Cadastre experiências, serviços e lugares para compor roteiros pela
            Paraíba.
          </h1>

          <p className="mt-4 max-w-3xl leading-8 text-[#45617A]">
            Esta área permite que pequenos negócios, guias, restaurantes,
            artesãos e iniciativas culturais enviem informações para análise da
            equipe da plataforma.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[1fr_380px]">
        <form
          onSubmit={enviarFormulario}
          className="rounded-3xl bg-white p-6 card-shadow"
        >
          <h2 className="text-2xl font-black text-[#0F2433]">
            Solicitar cadastro
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#45617A]">
            Preencha os dados abaixo. No sistema final, esse cadastro ficaria com
            status “aguardando aprovação” até ser validado por um administrador.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-black text-[#0F2433]">
                Nome do local ou serviço
              </label>

              <input
                value={formulario.nome}
                onChange={(event) => atualizarCampo("nome", event.target.value)}
                placeholder="Ex: Restaurante Regional da Orla"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-black text-[#0F2433]">
                Tipo de cadastro
              </label>

              <select
                value={formulario.tipo}
                onChange={(event) => atualizarCampo("tipo", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
              >
                {tipos.map((tipo) => (
                  <option key={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-black text-[#0F2433]">
                Cidade
              </label>

              <input
                value={formulario.cidade}
                onChange={(event) =>
                  atualizarCampo("cidade", event.target.value)
                }
                placeholder="Ex: João Pessoa"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-black text-[#0F2433]">
                Endereço
              </label>

              <input
                value={formulario.endereco}
                onChange={(event) =>
                  atualizarCampo("endereco", event.target.value)
                }
                placeholder="Rua, bairro, referência..."
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-black text-[#0F2433]">
                Horário de funcionamento ou melhor horário
              </label>

              <input
                value={formulario.horario}
                onChange={(event) =>
                  atualizarCampo("horario", event.target.value)
                }
                placeholder="Ex: 08h às 17h"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="text-sm font-black text-[#0F2433]">
                Faixa de preço
              </label>

              <input
                value={formulario.preco}
                onChange={(event) => atualizarCampo("preco", event.target.value)}
                placeholder="Ex: Gratuito, R$ 30 a R$ 60"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="text-sm font-black text-[#0F2433]">
                Contato
              </label>

              <input
                value={formulario.contato}
                onChange={(event) =>
                  atualizarCampo("contato", event.target.value)
                }
                placeholder="WhatsApp, Instagram ou e-mail"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="text-sm font-black text-[#0F2433]">
                Acessibilidade
              </label>

              <select
                value={formulario.acessibilidade}
                onChange={(event) =>
                  atualizarCampo("acessibilidade", event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
              >
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-black text-[#0F2433]">
                Descrição da experiência
              </label>

              <textarea
                value={formulario.descricao}
                onChange={(event) =>
                  atualizarCampo("descricao", event.target.value)
                }
                placeholder="Descreva o local, serviço ou experiência oferecida..."
                rows={5}
                className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#10B981]"
                required
              />
            </div>
          </div>

          <button className="mt-6 rounded-2xl bg-[#10B981] px-6 py-4 font-black text-white transition hover:bg-[#0F4C5C]">
            Enviar para análise
          </button>
        </form>

        <aside className="h-fit rounded-3xl bg-[#0F2433] p-6 text-white">
          <h2 className="text-2xl font-black">Como funciona?</h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="font-black">1. O parceiro envia o cadastro</p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                O local, serviço ou experiência é enviado com dados básicos,
                endereço, descrição e contato.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-4">
              <p className="font-black">2. A equipe analisa</p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Um administrador verifica se as informações fazem sentido e se
                estão alinhadas à proposta turística.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-4">
              <p className="font-black">3. O local entra nos roteiros</p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Após aprovado, o cadastro pode aparecer em buscas, filtros e
                roteiros sugeridos.
              </p>
            </div>
          </div>

          {enviado && (
            <div className="mt-6 rounded-3xl bg-[#10B981] p-5 text-white">
              <p className="text-lg font-black">Solicitação enviada!</p>

              <p className="mt-2 text-sm leading-6 text-white/90">
                Seu cadastro foi salvo nesta demonstração e está disponível no
                painel do administrador.
              </p>

              <Link
                href="/admin"
                className="mt-4 block rounded-2xl bg-white px-4 py-3 text-center font-black text-[#0F4C5C]"
              >
                Ver no painel admin
              </Link>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}