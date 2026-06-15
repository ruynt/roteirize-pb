"use client";

import Link from "next/link";
import { registrarInteracaoTuristica } from "@/lib/interacoes-client";
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

type IconeNome = "pin" | "passport" | "trash" | "check";

function Icone({
  nome,
  className = "h-5 w-5",
}: {
  nome: IconeNome;
  className?: string;
}) {
  const classes = `${className} stroke-current`;

  if (nome === "pin") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  }

  if (nome === "passport") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <rect x="6" y="3" width="12" height="18" rx="2" />
        <circle cx="12" cy="11" r="3" />
        <path d="M9 16h6" />
      </svg>
    );
  }

  if (nome === "trash") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        aria-hidden="true"
      >
        <path d="M4 7h16" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M9 7V4h6v3" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={classes}
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

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
      (checkin) => checkin.id === lugar.id
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
      JSON.stringify([novoCheckin, ...checkins])
    );

    setCheckinRealizado(true);
    setDataCheckin(novoCheckin.data);

    registrarInteracaoTuristica({
      placeId: lugar.id,
      type: "CHECKIN",
      metadata: {
        nome: lugar.nome,
        cidade: lugar.cidade,
        categoria: lugar.categoria,
        origem: "passaporte-digital",
      },
    });
  }

  function removerCheckin() {
    const checkins = carregarCheckins();
    const checkinsAtualizados = checkins.filter(
      (checkin) => checkin.id !== lugar.id
    );

    localStorage.setItem(CHAVE_CHECKINS, JSON.stringify(checkinsAtualizados));

    setCheckinRealizado(false);
    setDataCheckin("");

    registrarInteracaoTuristica({
      placeId: lugar.id,
      type: "CHECKIN_REMOVED",
      metadata: {
        nome: lugar.nome,
        cidade: lugar.cidade,
        categoria: lugar.categoria,
        origem: "passaporte-digital",
      },
    });
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
          <Icone nome="pin" className="h-6 w-6" />
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
            <p className="font-heading flex items-center gap-2 text-sm font-black text-[#0F4C5C]">
              <Icone nome="check" className="h-4 w-4" />
              Check-in realizado
            </p>

            <p className="mt-1 text-xs font-semibold text-[#45617A]">
              {dataCheckin
                ? `Registrado em ${new Date(dataCheckin).toLocaleDateString(
                    "pt-BR"
                  )}`
                : "Este local já está no seu passaporte."}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/passaporte"
              className="font-heading inline-flex items-center justify-center gap-2 rounded-full bg-[#0F4C5C] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#10B981]"
            >
              <Icone nome="passport" className="h-4 w-4" />
              Ver passaporte
            </Link>

            <button
              type="button"
              onClick={removerCheckin}
              className="font-heading inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#45617A] transition hover:border-red-200 hover:text-red-500"
            >
              <Icone nome="trash" className="h-4 w-4" />
              Remover check-in
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={fazerCheckin}
          className="font-heading mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#10B981] px-5 py-4 text-sm font-black text-white transition hover:bg-[#0F4C5C]"
        >
          <Icone nome="pin" className="h-4 w-4" />
          Fazer check-in
        </button>
      )}
    </div>
  );
}
