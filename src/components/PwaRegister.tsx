"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

const CHAVE_BANNER_PWA = "roteirize_pwa_banner_oculto";

function podeExibirBanner() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(CHAVE_BANNER_PWA) !== "sim";
}

export default function PwaRegister() {
  const [instalavel, setInstalavel] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [mostrarBanner, setMostrarBanner] = useState(false);
  const [instalado, setInstalado] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const registrarServiceWorker = async () => {
      if (!("serviceWorker" in navigator)) {
        return;
      }

      const ambienteSeguro =
        window.location.protocol === "https:" ||
        window.location.hostname === "localhost";

      if (!ambienteSeguro) {
        return;
      }

      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch (error) {
        console.warn("Não foi possível registrar o modo offline.", error);
      }
    };

    registrarServiceWorker();

    const controlarInstalacao = (event: Event) => {
      event.preventDefault();

      if (!podeExibirBanner()) {
        return;
      }

      setInstalavel(event as BeforeInstallPromptEvent);
      setMostrarBanner(true);
    };

    const confirmarInstalacao = () => {
      setInstalado(true);
      setMostrarBanner(false);
      setInstalavel(null);
      window.localStorage.setItem(CHAVE_BANNER_PWA, "sim");
    };

    window.addEventListener("beforeinstallprompt", controlarInstalacao);
    window.addEventListener("appinstalled", confirmarInstalacao);

    if (window.matchMedia?.("(display-mode: standalone)").matches) {
      setInstalado(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", controlarInstalacao);
      window.removeEventListener("appinstalled", confirmarInstalacao);
    };
  }, []);

  async function instalarAplicativo() {
    if (!instalavel) {
      return;
    }

    await instalavel.prompt();

    const escolha = await instalavel.userChoice;

    if (escolha.outcome === "accepted") {
      setInstalado(true);
    }

    setMostrarBanner(false);
    setInstalavel(null);
    window.localStorage.setItem(CHAVE_BANNER_PWA, "sim");
  }

  function ocultarBanner() {
    setMostrarBanner(false);
    window.localStorage.setItem(CHAVE_BANNER_PWA, "sim");
  }

  if (!mostrarBanner || instalado || !instalavel) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-[90] mx-auto max-w-xl rounded-[1.5rem] border border-white/40 bg-[#0F4C5C]/95 p-4 text-white shadow-2xl backdrop-blur md:bottom-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading text-sm font-black">
            Instalar Roteirize PB
          </p>

          <p className="mt-1 text-xs leading-5 text-white/85">
            Acesse pelo celular com aparência de app e carregamento otimizado.
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={ocultarBanner}
            className="font-heading rounded-full border border-white/25 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/10"
          >
            Agora não
          </button>

          <button
            type="button"
            onClick={instalarAplicativo}
            className="font-heading rounded-full bg-white px-4 py-2 text-xs font-black text-[#0F4C5C] transition hover:bg-[#F2C98A]"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
}
