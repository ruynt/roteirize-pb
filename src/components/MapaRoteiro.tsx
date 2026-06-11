"use client";

type ParadaMapa = {
  lugar: {
    nome: string;
    cidade: string;
    endereco: string;
  };
};

type MapaRoteiroProps = {
  paradas: ParadaMapa[];
};

function montarTextoLocal(parada: ParadaMapa) {
  return `${parada.lugar.nome}, ${parada.lugar.endereco}, ${parada.lugar.cidade}, Paraíba`;
}

function montarLinkGoogleMaps(paradas: ParadaMapa[]) {
  if (paradas.length === 0) {
    return "https://www.google.com/maps";
  }

  if (paradas.length === 1) {
    const destino = encodeURIComponent(montarTextoLocal(paradas[0]));
    return `https://www.google.com/maps/search/?api=1&query=${destino}`;
  }

  const origem = encodeURIComponent(montarTextoLocal(paradas[0]));
  const destino = encodeURIComponent(
    montarTextoLocal(paradas[paradas.length - 1]),
  );

  const pontosIntermediarios = paradas
    .slice(1, -1)
    .map((parada) => montarTextoLocal(parada))
    .join("|");

  const waypoints = pontosIntermediarios
    ? `&waypoints=${encodeURIComponent(pontosIntermediarios)}`
    : "";

  return `https://www.google.com/maps/dir/?api=1&origin=${origem}&destination=${destino}${waypoints}&travelmode=driving`;
}

function montarLinkMapaEmbed(paradas: ParadaMapa[]) {
  if (paradas.length === 0) {
    return "";
  }

  const primeiroLocal = encodeURIComponent(montarTextoLocal(paradas[0]));
  return `https://maps.google.com/maps?q=${primeiroLocal}&output=embed`;
}

export default function MapaRoteiro({ paradas }: MapaRoteiroProps) {
  if (paradas.length === 0) {
    return null;
  }

  const linkGoogleMaps = montarLinkGoogleMaps(paradas);
  const linkMapaEmbed = montarLinkMapaEmbed(paradas);

  return (
    <section className="card-shadow rounded-[2rem] border border-slate-100 bg-white p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-black text-[#0F2433]">
            Mapa do roteiro
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#45617A]">
            Visualização geográfica aproximada do roteiro. O botão abre a rota
            completa no Google Maps com os pontos planejados.
          </p>
        </div>

        <a
          href={linkGoogleMaps}
          target="_blank"
          rel="noreferrer"
          className="font-heading rounded-full bg-[#0F4C5C] px-6 py-3 text-center text-sm font-black text-white transition hover:bg-[#10B981]"
        >
          Abrir rota no Google Maps
        </a>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100">
        <iframe
          title="Mapa aproximado do roteiro"
          src={linkMapaEmbed}
          className="h-[340px] w-full"
          loading="lazy"
        />
      </div>

      <div className="mt-5 grid gap-3">
        {paradas.map((parada, index) => (
          <div
            key={`${parada.lugar.nome}-${index}`}
            className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
          >
            <span className="font-heading flex h-9 w-9 items-center justify-center rounded-full bg-[#10B981]/10 text-sm font-black text-[#0F4C5C]">
              {index + 1}
            </span>

            <div>
              <p className="font-heading text-sm font-black text-[#0F2433]">
                {parada.lugar.nome}
              </p>

              <p className="text-xs text-[#45617A]">{parada.lugar.endereco}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
