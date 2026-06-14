type LugarRecomendado = {
  nome: string;
  cidade: string;
  categoria: string;
  custo: string;
  nota: number;
};

type ParadaRecomendacao = {
  lugar: LugarRecomendado;
  avisos?: string[];
};

type ResumoRecomendacaoProps = {
  roteiro: ParadaRecomendacao[];
  cidadeBase: string;
  orcamento: string;
  ritmo: string;
  transporte: string;
  interesses: string[];
  priorizarSelecionados: boolean;
};

type IconeNome =
  | "spark"
  | "settings"
  | "check"
  | "grid"
  | "city"
  | "star"
  | "warning";

function Icone({
  nome,
  className = "h-5 w-5",
}: {
  nome: IconeNome;
  className?: string;
}) {
  const classes = `${className} stroke-current`;

  if (nome === "spark") {
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
        <path d="M12 3 14 9l6 2-6 2-2 8-2-8-6-2 6-2 2-6Z" />
      </svg>
    );
  }

  if (nome === "settings") {
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
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.05.05a2.1 2.1 0 0 1-3 3l-.05-.05a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1 1.65V21a2.1 2.1 0 0 1-4.2 0v-.08a1.8 1.8 0 0 0-1-1.65 1.8 1.8 0 0 0-2 .36l-.05.05a2.1 2.1 0 0 1-3-3l.05-.05a1.8 1.8 0 0 0 .36-2 1.8 1.8 0 0 0-1.65-1H3a2.1 2.1 0 0 1 0-4.2h.08a1.8 1.8 0 0 0 1.65-1 1.8 1.8 0 0 0-.36-2l-.05-.05a2.1 2.1 0 0 1 3-3l.05.05a1.8 1.8 0 0 0 2 .36 1.8 1.8 0 0 0 1-1.65V3a2.1 2.1 0 0 1 4.2 0v.08a1.8 1.8 0 0 0 1 1.65 1.8 1.8 0 0 0 2-.36l.05-.05a2.1 2.1 0 0 1 3 3l-.05.05a1.8 1.8 0 0 0-.36 2 1.8 1.8 0 0 0 1.65 1H21a2.1 2.1 0 0 1 0 4.2h-.08a1.8 1.8 0 0 0-1.52 1.43Z" />
      </svg>
    );
  }

  if (nome === "check") {
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

  if (nome === "grid") {
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
        <rect x="4" y="4" width="6" height="6" rx="1.5" />
        <rect x="14" y="4" width="6" height="6" rx="1.5" />
        <rect x="4" y="14" width="6" height="6" rx="1.5" />
        <rect x="14" y="14" width="6" height="6" rx="1.5" />
      </svg>
    );
  }

  if (nome === "city") {
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
        <path d="M4 21h16" />
        <path d="M6 21V7l6-4 6 4v14" />
        <path d="M9 21v-6h6v6" />
        <path d="M9 10h.01" />
        <path d="M15 10h.01" />
      </svg>
    );
  }

  if (nome === "star") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        aria-hidden="true"
      >
        <path d="m12 3 2.7 5.47 6.03.88-4.36 4.25 1.03 6-5.4-2.84-5.4 2.84 1.03-6-4.36-4.25 6.03-.88L12 3Z" />
      </svg>
    );
  }

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
      <path d="M12 4 3 20h18L12 4Z" />
      <path d="M12 9v5" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export default function ResumoRecomendacao({
  roteiro,
  cidadeBase,
  orcamento,
  ritmo,
  transporte,
  interesses,
  priorizarSelecionados,
}: ResumoRecomendacaoProps) {
  if (roteiro.length === 0) {
    return null;
  }

  const categoriasIncluidas = Array.from(
    new Set(roteiro.map((parada) => parada.lugar.categoria))
  );

  const cidadesIncluidas = Array.from(
    new Set(roteiro.map((parada) => parada.lugar.cidade))
  );

  const mediaNotas =
    roteiro.reduce((total, parada) => total + parada.lugar.nota, 0) /
    roteiro.length;

  const interessesAtendidos = interesses.filter((interesse) =>
    categoriasIncluidas.includes(interesse)
  );

  const possuiAvisos = roteiro.some(
    (parada) => (parada.avisos ?? []).length > 0
  );

  const criterios = [
    "Afinidade com os interesses selecionados.",
    "Compatibilidade com orçamento e cidade base.",
    "Avaliação dos locais e tempo disponível.",
    "Horário ideal de visita e deslocamento estimado.",
  ];

  return (
    <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-black text-[#0F2433]">
            Por que esse roteiro foi recomendado?
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#45617A]">
            O sistema combina suas preferências com os dados dos locais para
            montar uma sugestão personalizada.
          </p>
        </div>

        <span className="font-heading inline-flex items-center gap-2 rounded-full bg-[#10B981]/10 px-4 py-2 text-xs font-black text-[#0F4C5C]">
          <Icone nome="spark" className="h-4 w-4" />
          Recomendação inteligente
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="font-heading flex items-center gap-2 text-sm font-black text-[#0F4C5C]">
            <Icone nome="settings" className="h-4 w-4" />
            Preferências usadas
          </p>

          <p className="mt-3 text-sm leading-6 text-[#45617A]">
            Cidade base: <strong>{cidadeBase}</strong>
            <br />
            Orçamento: <strong>{orcamento}</strong>
            <br />
            Transporte: <strong>{transporte}</strong>
            <br />
            Ritmo: <strong>{ritmo}</strong>
          </p>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="font-heading flex items-center gap-2 text-sm font-black text-[#0F4C5C]">
            <Icone nome="check" className="h-4 w-4" />
            Critérios considerados
          </p>

          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#45617A]">
            {criterios.map((criterio) => (
              <li key={criterio} className="flex gap-2">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#10B981]/10 text-[#0F4C5C]">
                  <Icone nome="check" className="h-3 w-3" />
                </span>
                <span>{criterio}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-100 bg-white p-5">
          <p className="font-heading flex items-center gap-2 text-xs font-bold text-[#45617A]">
            <Icone nome="grid" className="h-4 w-4" />
            Categorias no roteiro
          </p>

          <p className="mt-2 text-sm font-black text-[#0F4C5C]">
            {categoriasIncluidas.join(", ")}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-5">
          <p className="font-heading flex items-center gap-2 text-xs font-bold text-[#45617A]">
            <Icone nome="city" className="h-4 w-4" />
            Cidades incluídas
          </p>

          <p className="mt-2 text-sm font-black text-[#0F4C5C]">
            {cidadesIncluidas.join(", ")}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-5">
          <p className="font-heading flex items-center gap-2 text-xs font-bold text-[#45617A]">
            <Icone nome="star" className="h-4 w-4 text-amber-600" />
            Média das avaliações
          </p>

          <p className="mt-2 inline-flex items-center gap-1 text-sm font-black text-[#0F4C5C]">
            <Icone nome="star" className="h-4 w-4 text-amber-600" />
            {mediaNotas.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-[#F2C98A]/30 p-5">
        <p className="font-heading flex items-center gap-2 text-sm font-black text-[#0F4C5C]">
          <Icone
            nome={possuiAvisos ? "warning" : "spark"}
            className="h-4 w-4"
          />
          Leitura da recomendação
        </p>

        <p className="mt-2 text-sm leading-6 text-[#45617A]">
          {interessesAtendidos.length > 0
            ? `O roteiro atende aos interesses em ${interessesAtendidos.join(
                ", "
              )}.`
            : "O roteiro priorizou disponibilidade, orçamento e cidade base, mesmo sem uma categoria de interesse dominante."}{" "}
          {priorizarSelecionados
            ? "Os locais selecionados pelo turista foram priorizados na montagem."
            : "A seleção manual não foi priorizada nesta geração."}{" "}
          {possuiAvisos
            ? "Alguns pontos receberam aviso de horário, então o turista deve conferir antes de seguir."
            : "Não foram identificados conflitos relevantes com os horários ideais dos locais."}
        </p>
      </div>
    </section>
  );
}
