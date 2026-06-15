export type TipoInteracaoTuristica =
  | "VIEW"
  | "DETAIL_OPENED"
  | "SELECT"
  | "UNSELECT"
  | "CHECKIN"
  | "CHECKIN_REMOVED"
  | "ITINERARY_SAVED";

export type InteracaoTuristicaLocal = {
  placeId?: string | null;
  type: TipoInteracaoTuristica;
  weight?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export const CHAVE_INTERACOES_ML = "roteirize_interacoes_ml";
const LIMITE_INTERACOES_LOCAIS = 120;

function obterPesoInteracao(type: TipoInteracaoTuristica) {
  const pesos: Record<TipoInteracaoTuristica, number> = {
    VIEW: 0.8,
    DETAIL_OPENED: 1.6,
    SELECT: 3.5,
    UNSELECT: -2.5,
    CHECKIN: 5,
    CHECKIN_REMOVED: -4,
    ITINERARY_SAVED: 4,
  };

  return pesos[type];
}

export function obterAnonymousId() {
  if (typeof window === "undefined") {
    return "";
  }

  const chave = "roteirize_anonymous_id";
  const atual = localStorage.getItem(chave);

  if (atual) {
    return atual;
  }

  const novo = crypto.randomUUID();
  localStorage.setItem(chave, novo);
  return novo;
}

export function carregarInteracoesTuristicas(): InteracaoTuristicaLocal[] {
  if (typeof window === "undefined") {
    return [];
  }

  const texto = localStorage.getItem(CHAVE_INTERACOES_ML);

  if (!texto) {
    return [];
  }

  try {
    const dados = JSON.parse(texto);

    if (!Array.isArray(dados)) {
      return [];
    }

    return dados as InteracaoTuristicaLocal[];
  } catch {
    localStorage.removeItem(CHAVE_INTERACOES_ML);
    return [];
  }
}

export function salvarInteracaoLocal(interacao: Omit<InteracaoTuristicaLocal, "createdAt" | "weight"> & { weight?: number }) {
  if (typeof window === "undefined") {
    return null;
  }

  const novaInteracao: InteracaoTuristicaLocal = {
    ...interacao,
    weight: interacao.weight ?? obterPesoInteracao(interacao.type),
    createdAt: new Date().toISOString(),
  };

  const interacoes = carregarInteracoesTuristicas();
  const atualizadas = [novaInteracao, ...interacoes].slice(0, LIMITE_INTERACOES_LOCAIS);
  localStorage.setItem(CHAVE_INTERACOES_ML, JSON.stringify(atualizadas));

  return novaInteracao;
}

export async function registrarInteracaoTuristica(
  interacao: Omit<InteracaoTuristicaLocal, "createdAt" | "weight"> & { weight?: number }
) {
  const interacaoLocal = salvarInteracaoLocal(interacao);

  if (!interacaoLocal) {
    return;
  }

  try {
    await fetch("/api/interacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...interacaoLocal,
        anonymousId: obterAnonymousId(),
      }),
    });
  } catch (error) {
    console.warn("Interação salva localmente, mas não enviada ao servidor.", error);
  }
}
