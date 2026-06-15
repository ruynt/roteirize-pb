"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

export type ImagemGaleria = {
  url: string;
  alt?: string;
  legenda?: string;
};

type GaleriaModalProps = {
  aberto: boolean;
  imagens: ImagemGaleria[];
  indiceAtual: number;
  titulo?: string;
  onClose: () => void;
  onSelecionarIndice: (indice: number) => void;
};

type GaleriaFotosClicavelProps = {
  imagens: ImagemGaleria[];
  titulo?: string;
  descricao?: string;
  destacarPrimeiraImagem?: boolean;
  className?: string;
};

type BotaoAbrirGaleriaProps = {
  imagens: ImagemGaleria[];
  indiceInicial?: number;
  titulo?: string;
  className?: string;
  children: ReactNode;
};

function normalizarIndice(indice: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  if (indice < 0) {
    return total - 1;
  }

  if (indice >= total) {
    return 0;
  }

  return indice;
}

export default function GaleriaModal({
  aberto,
  imagens,
  indiceAtual,
  titulo = "Galeria de fotos",
  onClose,
  onSelecionarIndice,
}: GaleriaModalProps) {
  const imagensValidas = useMemo(
    () => imagens.filter((imagem) => Boolean(imagem.url)),
    [imagens]
  );

  const total = imagensValidas.length;
  const indiceSeguro = normalizarIndice(indiceAtual, total);
  const imagemAtual = imagensValidas[indiceSeguro];

  function irParaAnterior() {
    onSelecionarIndice(normalizarIndice(indiceSeguro - 1, total));
  }

  function irParaProxima() {
    onSelecionarIndice(normalizarIndice(indiceSeguro + 1, total));
  }

  useEffect(() => {
    if (!aberto) {
      return;
    }

    function lidarComTeclado(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft") {
        irParaAnterior();
      }

      if (event.key === "ArrowRight") {
        irParaProxima();
      }
    }

    document.addEventListener("keydown", lidarComTeclado);

    return () => {
      document.removeEventListener("keydown", lidarComTeclado);
    };
  }, [aberto, indiceSeguro, total, onClose]);

  if (!aberto || !imagemAtual) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F2433]/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      onMouseDown={onClose}
    >
      <div
        className="relative w-full max-w-6xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4 text-white">
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-white/70">
              {titulo}
            </p>

            <h2 className="font-heading mt-1 text-xl font-black md:text-2xl">
              {imagemAtual.legenda || imagemAtual.alt || "Foto ampliada"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="font-heading rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white hover:text-[#0F4C5C]"
          >
            Fechar
          </button>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl">
          <img
            src={imagemAtual.url}
            alt={imagemAtual.alt || imagemAtual.legenda || "Foto ampliada"}
            className="max-h-[72vh] w-full object-contain"
          />

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={irParaAnterior}
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0F4C5C] shadow-lg transition hover:scale-105 hover:bg-[#F2C98A]"
                aria-label="Foto anterior"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 stroke-current"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <button
                type="button"
                onClick={irParaProxima}
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0F4C5C] shadow-lg transition hover:scale-105 hover:bg-[#F2C98A]"
                aria-label="Próxima foto"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 stroke-current"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-heading text-sm font-bold text-white/85">
            Foto {indiceSeguro + 1} de {total}
          </p>

          {total > 1 && (
            <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
              {imagensValidas.map((imagem, indice) => (
                <button
                  key={`${imagem.url}-${indice}`}
                  type="button"
                  onClick={() => onSelecionarIndice(indice)}
                  className={`h-16 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                    indice === indiceSeguro
                      ? "border-[#F2C98A] opacity-100"
                      : "border-white/25 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Abrir foto ${indice + 1}`}
                >
                  <img
                    src={imagem.url}
                    alt={imagem.alt || `Miniatura ${indice + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function GaleriaFotosClicavel({
  imagens,
  titulo = "Galeria de fotos",
  descricao,
  destacarPrimeiraImagem = false,
  className = "",
}: GaleriaFotosClicavelProps) {
  const [modalAberto, setModalAberto] = useState(false);
  const [indiceAtual, setIndiceAtual] = useState(0);

  const imagensValidas = imagens.filter((imagem) => Boolean(imagem.url));

  if (imagensValidas.length === 0) {
    return null;
  }

  function abrirImagem(indice: number) {
    setIndiceAtual(indice);
    setModalAberto(true);
  }

  return (
    <>
      <section
        className={`card-shadow rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8 ${className}`}
      >
        <h2 className="font-heading text-2xl font-black text-[#0F2433]">
          {titulo}
        </h2>

        {descricao && (
          <p className="mt-2 text-sm leading-6 text-[#45617A]">{descricao}</p>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {imagensValidas.map((imagem, indice) => (
            <button
              key={`${imagem.url}-${indice}`}
              type="button"
              onClick={() => abrirImagem(indice)}
              className={`group relative overflow-hidden rounded-[1.5rem] text-left outline-none transition hover:-translate-y-1 focus:ring-4 focus:ring-[#10B981]/20 ${
                destacarPrimeiraImagem && indice === 0 ? "md:col-span-2" : ""
              }`}
              aria-label={`Ampliar foto ${indice + 1}`}
            >
              <img
                src={imagem.url}
                alt={imagem.alt || `Foto ${indice + 1}`}
                className="h-72 w-full object-cover transition duration-300 group-hover:scale-105"
              />

              <span className="absolute inset-x-3 bottom-3 rounded-2xl bg-[#0F2433]/70 px-4 py-2 text-xs font-bold text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                Clique para ampliar
              </span>
            </button>
          ))}
        </div>
      </section>

      <GaleriaModal
        aberto={modalAberto}
        imagens={imagensValidas}
        indiceAtual={indiceAtual}
        titulo={titulo}
        onClose={() => setModalAberto(false)}
        onSelecionarIndice={setIndiceAtual}
      />
    </>
  );
}

export function BotaoAbrirGaleria({
  imagens,
  indiceInicial = 0,
  titulo = "Galeria de fotos",
  className = "",
  children,
}: BotaoAbrirGaleriaProps) {
  const [modalAberto, setModalAberto] = useState(false);
  const [indiceAtual, setIndiceAtual] = useState(indiceInicial);

  const imagensValidas = imagens.filter((imagem) => Boolean(imagem.url));

  if (imagensValidas.length === 0) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIndiceAtual(indiceInicial);
          setModalAberto(true);
        }}
        className={className}
      >
        {children}
      </button>

      <GaleriaModal
        aberto={modalAberto}
        imagens={imagensValidas}
        indiceAtual={indiceAtual}
        titulo={titulo}
        onClose={() => setModalAberto(false)}
        onSelecionarIndice={setIndiceAtual}
      />
    </>
  );
}
