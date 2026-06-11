"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { FormEvent, useState } from "react";

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

export default function ParceiroPage() {
  const [formulario, setFormulario] =
    useState<FormularioParceiro>(formularioInicial);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  function atualizarCampo(campo: keyof FormularioParceiro, valor: string) {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor,
    }));
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
        "Solicitação enviada com sucesso! Agora ela ficará aguardando análise no painel do administrador.",
      );
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

      <section className="soft-grid border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <div className="max-w-3xl">
            <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-sm font-bold text-[#0F4C5C]">
              Área do parceiro local
            </span>

            <h1 className="font-heading mt-6 text-4xl font-black leading-tight text-[#0F2433] md:text-6xl">
              Cadastre seu serviço turístico para análise.
            </h1>

            <p className="mt-5 text-lg leading-8 text-[#45617A]">
              Guias, restaurantes, artesãos, experiências locais e pequenos
              empreendedores podem solicitar participação no Roteirize PB. A
              solicitação será enviada para o banco e analisada no painel
              administrativo.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={enviarSolicitacao}
          className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-black text-[#0F2433]">
                Dados da solicitação
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#45617A]">
                Preencha as informações principais. Depois, o administrador
                poderá aprovar ou rejeitar o cadastro.
              </p>
            </div>

            <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-xs font-bold text-[#0F4C5C]">
              Neon + Prisma
            </span>
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
              <label className="font-heading text-sm font-bold text-[#0F4C5C]">
                Descrição *
              </label>
              <textarea
                value={formulario.descricao}
                onChange={(event) =>
                  atualizarCampo("descricao", event.target.value)
                }
                placeholder="Descreva a experiência, o diferencial do serviço e por que ele deveria aparecer para turistas."
                rows={5}
                className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#10B981]"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={enviando}
              className="font-heading rounded-full bg-[#0F4C5C] px-7 py-4 text-sm font-black text-white transition hover:bg-[#10B981] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enviando ? "Enviando..." : "Enviar para análise"}
            </button>
          </div>
        </form>

        <aside className="space-y-5">
          <div className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6">
            <h2 className="font-heading text-2xl font-black text-[#0F2433]">
              Como funciona?
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-6 text-[#45617A]">
              <p>
                <strong className="text-[#0F4C5C]">1.</strong> O parceiro envia
                a solicitação.
              </p>

              <p>
                <strong className="text-[#0F4C5C]">2.</strong> O administrador
                avalia as informações.
              </p>

              <p>
                <strong className="text-[#0F4C5C]">3.</strong> Quando aprovado,
                o local poderá aparecer para turistas na plataforma.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#0F4C5C] p-6 text-white">
            <h3 className="font-heading text-xl font-black">
              Marketplace turístico
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/85">
              Essa área representa o mini-ecossistema para pequenos
              empreendedores locais, uma das funcionalidades solicitadas no
              projeto.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
