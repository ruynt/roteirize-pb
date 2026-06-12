import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PartnerRequestStatus, PlaceCategory } from "@/generated/prisma";

const nomesCategorias: Record<PlaceCategory, string> = {
  PRAIA: "Praia",
  CULTURA: "Cultura",
  GASTRONOMIA: "Gastronomia",
  NATUREZA: "Natureza",
  EXPERIENCIA: "Experiência",
};

const nomesStatus: Record<PartnerRequestStatus, string> = {
  AGUARDANDO_APROVACAO: "Aguardando aprovação",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
};

export async function GET() {
  const usuario = await getCurrentUser();

  if (!usuario || usuario.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Acesso não autorizado." },
      { status: 403 }
    );
  }

  try {
    const [
      totalLocais,
      locaisAprovados,
      solicitacoesPendentes,
      solicitacoesAprovadas,
      solicitacoesRejeitadas,
      porCidade,
      porCategoria,
      melhoresLocais,
      solicitacoesRecentes,
    ] = await Promise.all([
      prisma.place.count(),
      prisma.place.count({
        where: {
          approved: true,
        },
      }),
      prisma.partnerRequest.count({
        where: {
          status: PartnerRequestStatus.AGUARDANDO_APROVACAO,
        },
      }),
      prisma.partnerRequest.count({
        where: {
          status: PartnerRequestStatus.APROVADO,
        },
      }),
      prisma.partnerRequest.count({
        where: {
          status: PartnerRequestStatus.REJEITADO,
        },
      }),
      prisma.place.groupBy({
        by: ["city"],
        where: {
          approved: true,
        },
        _count: {
          _all: true,
        },
      }),
      prisma.place.groupBy({
        by: ["category"],
        where: {
          approved: true,
        },
        _count: {
          _all: true,
        },
      }),
      prisma.place.findMany({
        where: {
          approved: true,
        },
        orderBy: [
          {
            rating: "desc",
          },
          {
            name: "asc",
          },
        ],
        take: 5,
        select: {
          id: true,
          name: true,
          city: true,
          category: true,
          rating: true,
        },
      }),
      prisma.partnerRequest.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          name: true,
          type: true,
          city: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    const cidadesFormatadas = porCidade
      .map((item) => ({
        cidade: item.city,
        total: item._count._all,
      }))
      .sort((a, b) => b.total - a.total);

    const categoriasFormatadas = porCategoria
      .map((item) => ({
        categoria: nomesCategorias[item.category],
        total: item._count._all,
      }))
      .sort((a, b) => b.total - a.total);

    const melhoresLocaisFormatados = melhoresLocais.map((local) => ({
      id: local.id,
      nome: local.name,
      cidade: local.city,
      categoria: nomesCategorias[local.category],
      nota: local.rating,
    }));

    const solicitacoesRecentesFormatadas = solicitacoesRecentes.map(
      (solicitacao) => ({
        id: solicitacao.id,
        nome: solicitacao.name,
        tipo: solicitacao.type,
        cidade: solicitacao.city,
        status: nomesStatus[solicitacao.status],
        criadoEm: solicitacao.createdAt.toISOString(),
      })
    );

    return NextResponse.json({
      resumo: {
        totalLocais,
        locaisAprovados,
        solicitacoesPendentes,
        solicitacoesAprovadas,
        solicitacoesRejeitadas,
        cidadesAtendidas: cidadesFormatadas.length,
        categoriasAtivas: categoriasFormatadas.length,
      },
      porCidade: cidadesFormatadas,
      porCategoria: categoriasFormatadas,
      melhoresLocais: melhoresLocaisFormatados,
      solicitacoesRecentes: solicitacoesRecentesFormatadas,
      atualizadoEm: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Não foi possível carregar os indicadores." },
      { status: 500 }
    );
  }
}