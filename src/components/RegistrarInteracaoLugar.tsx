"use client";

import { useEffect } from "react";
import { registrarInteracaoTuristica } from "@/lib/interacoes-client";

type RegistrarInteracaoLugarProps = {
  lugar: {
    id: string;
    nome: string;
    cidade: string;
    categoria: string;
  };
};

export default function RegistrarInteracaoLugar({ lugar }: RegistrarInteracaoLugarProps) {
  useEffect(() => {
    registrarInteracaoTuristica({
      placeId: lugar.id,
      type: "DETAIL_OPENED",
      metadata: {
        nome: lugar.nome,
        cidade: lugar.cidade,
        categoria: lugar.categoria,
        origem: "detalhes-do-local",
      },
    });
  }, [lugar.id, lugar.nome, lugar.cidade, lugar.categoria]);

  return null;
}
