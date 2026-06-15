"use client";

import { useId } from "react";

type BotaoUploadImagemProps = {
  label: string;
  descricao?: string;
  textoCarregando?: string;
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onFilesSelected: (arquivos: FileList | null) => void;
};

export default function BotaoUploadImagem({
  label,
  descricao,
  textoCarregando = "Enviando...",
  multiple = false,
  disabled = false,
  loading = false,
  onFilesSelected,
}: BotaoUploadImagemProps) {
  const inputId = useId();
  const bloqueado = disabled || loading;

  return (
    <div>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        multiple={multiple}
        disabled={bloqueado}
        onChange={(event) => {
          onFilesSelected(event.currentTarget.files);
          event.currentTarget.value = "";
        }}
        className="sr-only"
      />

      <label
        htmlFor={inputId}
        className={`group mt-3 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed px-4 py-4 text-sm font-black transition duration-300 ${
          bloqueado
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
            : "border-[#0F4C5C]/30 bg-white text-[#0F4C5C] hover:-translate-y-1 hover:border-[#10B981] hover:bg-[#10B981]/10 hover:text-[#0F4C5C] hover:shadow-lg"
        }`}
      >
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-2xl transition duration-300 ${
            bloqueado
              ? "bg-white text-slate-400"
              : "bg-[#0F4C5C] text-white group-hover:rotate-6 group-hover:scale-110 group-hover:bg-[#10B981]"
          }`}
        >
          {loading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 stroke-current"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          )}
        </span>

        <span className="font-heading">
          {loading ? textoCarregando : label}
        </span>
      </label>

      {descricao && (
        <p className="mt-2 text-xs leading-5 text-[#45617A]">{descricao}</p>
      )}
    </div>
  );
}
