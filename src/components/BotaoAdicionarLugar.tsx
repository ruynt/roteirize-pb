"use client";

import { useRouter } from "next/navigation";
import { registrarInteracaoTuristica } from "@/lib/interacoes-client";

const CHAVE_LUGARES_SELECIONADOS = "roteirize_lugares_selecionados";

type BotaoAdicionarLugarProps = {
  lugarId: string;
};

export default function BotaoAdicionarLugar({
  lugarId,
}: BotaoAdicionarLugarProps) {
  const router = useRouter();

  function adicionarLugarECriarRoteiro() {
    const lugaresSalvos = localStorage.getItem(CHAVE_LUGARES_SELECIONADOS);

    const lugaresSelecionados: string[] = lugaresSalvos
      ? JSON.parse(lugaresSalvos).map(String)
      : [];

    const jaSelecionado = lugaresSelecionados.includes(lugarId);

    const novosSelecionados = jaSelecionado
      ? lugaresSelecionados
      : [...lugaresSelecionados, lugarId];

    localStorage.setItem(
      CHAVE_LUGARES_SELECIONADOS,
      JSON.stringify(novosSelecionados),
    );

    registrarInteracaoTuristica({
      placeId: lugarId,
      type: "SELECT",
      metadata: {
        origem: "detalhes-do-local",
        acao: "criar-roteiro-com-local",
      },
    });

    router.push("/criar-roteiro");
  }

  return (
    <button
      onClick={adicionarLugarECriarRoteiro}
      className="mt-6 block w-full rounded-2xl bg-[#10B981] px-5 py-4 text-center font-black text-white transition hover:bg-[#1E88E5]"
    >
      Criar roteiro com este local
    </button>
  );
}
