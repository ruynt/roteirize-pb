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

        <span className="font-heading rounded-full bg-[#10B981]/10 px-4 py-2 text-xs font-black text-[#0F4C5C]">
          Recomendação inteligente
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="font-heading text-sm font-black text-[#0F4C5C]">
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
          <p className="font-heading text-sm font-black text-[#0F4C5C]">
            Critérios considerados
          </p>

          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#45617A]">
            <li>• Afinidade com os interesses selecionados.</li>
            <li>• Compatibilidade com orçamento e cidade base.</li>
            <li>• Avaliação dos locais e tempo disponível.</li>
            <li>• Horário ideal de visita e deslocamento estimado.</li>
          </ul>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-100 bg-white p-5">
          <p className="font-heading text-xs font-bold text-[#45617A]">
            Categorias no roteiro
          </p>

          <p className="mt-2 text-sm font-black text-[#0F4C5C]">
            {categoriasIncluidas.join(", ")}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-5">
          <p className="font-heading text-xs font-bold text-[#45617A]">
            Cidades incluídas
          </p>

          <p className="mt-2 text-sm font-black text-[#0F4C5C]">
            {cidadesIncluidas.join(", ")}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-5">
          <p className="font-heading text-xs font-bold text-[#45617A]">
            Média das avaliações
          </p>

          <p className="mt-2 text-sm font-black text-[#0F4C5C]">
            ★ {mediaNotas.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-[#F2C98A]/30 p-5">
        <p className="font-heading text-sm font-black text-[#0F4C5C]">
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