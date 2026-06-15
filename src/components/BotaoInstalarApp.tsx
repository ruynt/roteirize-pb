"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

type BotaoInstalarAppProps = {
  className?: string;
  onAfterInstall?: () => void;
};

function IconeCelular({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} stroke-current`}
      aria-hidden="true"
    >
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
      <path d="M12 6v7" />
      <path d="m9.5 10.5 2.5 2.5 2.5-2.5" />
    </svg>
  );
}

function estaRodandoComoApp() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export default function BotaoInstalarApp({
  className = "font-heading inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F4C5C] px-4 py-3 text-sm font-black text-white transition hover:bg-[#10B981]",
  onAfterInstall,
}: BotaoInstalarAppProps) {
  const [instalavel, setInstalavel] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [instalado, setInstalado] = useState(false);
  const [instalando, setInstalando] = useState(false);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (estaRodandoComoApp()) {
      setInstalado(true);
      return;
    }

    const salvarEventoDeInstalacao = (event: Event) => {
      event.preventDefault();
      setInstalavel(event as BeforeInstallPromptEvent);
      setMostrarAjuda(false);
    };

    const appInstalado = () => {
      setInstalado(true);
      setInstalavel(null);
      setMostrarAjuda(false);
      onAfterInstall?.();
    };

    window.addEventListener("beforeinstallprompt", salvarEventoDeInstalacao);
    window.addEventListener("appinstalled", appInstalado);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        salvarEventoDeInstalacao
      );
      window.removeEventListener("appinstalled", appInstalado);
    };
  }, [onAfterInstall]);

  async function instalarAplicativo() {
    if (!instalavel) {
      setMostrarAjuda((estadoAtual) => !estadoAtual);
      return;
    }

    try {
      setInstalando(true);

      await instalavel.prompt();

      const escolha = await instalavel.userChoice;

      if (escolha.outcome === "accepted") {
        setInstalado(true);
      }

      setInstalavel(null);
      setMostrarAjuda(false);
      onAfterInstall?.();
    } finally {
      setInstalando(false);
    }
  }

  if (instalado) {
    return null;
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={instalarAplicativo}
        disabled={instalando}
        className={className}
      >
        <IconeCelular />
        {instalando ? "Abrindo instalação..." : "Instalar app"}
      </button>

      {mostrarAjuda && (
        <div className="mt-3 rounded-2xl border border-[#0F4C5C]/10 bg-[#F5F7F8] p-4 text-left">
          <p className="font-heading text-xs font-black text-[#0F4C5C]">
            Como instalar
          </p>

          <p className="mt-2 text-xs leading-5 text-[#45617A]">
            Se o botão nativo não abrir agora, use o menu do navegador. No
            Chrome/Edge, toque nos três pontinhos e escolha “Instalar app” ou
            “Adicionar à tela inicial”.
          </p>

          <p className="mt-2 text-xs leading-5 text-[#45617A]">
            No iPhone, use o botão de compartilhar do Safari e escolha
            “Adicionar à Tela de Início”.
          </p>
        </div>
      )}
    </div>
  );
}
