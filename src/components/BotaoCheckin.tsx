"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CHAVE_CHECKINS = "roteirize_checkins";

type Checkin = {
  id: string;
  nome: string;
  cidade: string;
  categoria: string;
  data: string;
};

type BotaoCheckinProps = {
  lugar: {
    id: string;
    nome: string;
    cidade: string;
    categoria: string;
  };
};

function carregarCheckins(): Checkin[] {
  if (typeof window === "undefined") {
    return [];
  }

  const checkinsSalvos = localStorage.getItem(CHAVE_CHECKINS);

  if (!checkinsSalvos) {
    return [];
  }

  try {
    const dados = JSON.parse(checkinsSalvos);

    if (!Array.isArray(dados)) {
      return [];
    }

    return dados;
  } catch {
    localStorage.removeItem(CHAVE_CHECKINS);
    return [];
  }
}

export default function BotaoCheckin({ lugar }: BotaoCheckinProps) {
  const [checkinRealizado, setCheckinRealizado] = useState(false);
  const [dataCheckin, setDataCheckin] = useState("");

  useEffect(() => {
    const checkins = carregarCheckins();
    const checkinExistente = checkins.find(
      (checkin) => checkin.id === lugar.id,
    );

    if (checkinExistente) {
      setCheckinRealizado(true);
      setDataCheckin(checkinExistente.data);
    }
  }, [lugar.id]);

  function fazerCheckin() {
    const checkins = carregarCheckins();
    const jaExiste = checkins.some((checkin) => checkin.id === lugar.id);

    if (jaExiste) {
      setCheckinRealizado(true);
      return;
    }

    const novoCheckin: Checkin = {
      id: lugar.id,
      nome: lugar.nome,
      cidade: lugar.cidade,
      categoria: lugar.categoria,
      data: new Date().toISOString(),
    };

    localStorage.setItem(
      CHAVE_CHECKINS,
      JSON.stringify([novoCheckin, ...checkins]),
    );

    setCheckinRealizado(true);
    setDataCheckin(novoCheckin.data);
  }

  function removerCheckin() {
    const checkins = carregarCheckins();
    const checkinsAtualizados = checkins.filter(
      (checkin) => checkin.id !== lugar.id,
    );

    localStorage.setItem(CHAVE_CHECKINS, JSON.stringify(checkinsAtualizados));

    setCheckinRealizado(false);
    setDataCheckin("");
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#10B981]/10 text-2xl">
          📍
        </div>

        <div>
          <h3 className="font-heading text-lg font-black text-[#0F2433]">
            Check-in turístico
          </h3>

          <p className="mt-1 text-sm leading-6 text-[#45617A]">
            Registre sua visita para desbloquear selos no Passaporte Digital.
          </p>
        </div>
      </div>

      {checkinRealizado ? (
        <div className="mt-5 space-y-3">
          <div className="rounded-2xl border border-[#10B981]/20 bg-[#10B981]/10 p-4">
            <p className="font-heading text-sm font-black text-[#0F4C5C]">
              Check-in realizado
            </p>

            <p className="mt-1 text-xs font-semibold text-[#45617A]">
              {dataCheckin
                ? `Registrado em ${new Date(dataCheckin).toLocaleDateString(
                    "pt-BR",
                  )}`
                : "Este local já está no seu passaporte."}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/passaporte"
              className="font-heading rounded-full bg-[#0F4C5C] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#10B981]"
            >
              Ver passaporte
            </Link>

            <button
              type="button"
              onClick={removerCheckin}
              className="font-heading rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#45617A] transition hover:border-red-200 hover:text-red-500"
            >
              Remover check-in
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={fazerCheckin}
          className="font-heading mt-5 w-full rounded-full bg-[#10B981] px-5 py-4 text-sm font-black text-white transition hover:bg-[#0F4C5C]"
        >
          Fazer check-in
        </button>
      )}
    </div>
  );
}
