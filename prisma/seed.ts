import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.itineraryStop.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.review.deleteMany();
  await prisma.partnerRequest.deleteMany();
  await prisma.place.deleteMany();

  await prisma.place.createMany({
    data: [
      {
        name: "Centro Histórico",
        city: "João Pessoa",
        category: "CULTURA",
        description:
          "Roteiro cultural com igrejas, praças, arquitetura histórica e espaços de memória.",
        address: "Centro, João Pessoa - PB",
        costLevel: "ECONOMICO",
        estimatedPrice: "R$ 0 a R$ 20",
        rating: 4.6,
        suggestedDurationMin: 90,
        idealTime: "09h às 16h",
        accessibility: "MEDIA",
        tags: ["história", "arquitetura", "cultura"],
        distanceFromCenterKm: 0,
        imageClass: "from-amber-300 to-orange-500",
        approved: true,
      },
      {
        name: "Praia de Cabo Branco",
        city: "João Pessoa",
        category: "PRAIA",
        description:
          "Praia urbana ideal para caminhada, banho de mar, fotos e início de roteiros pela orla.",
        address: "Cabo Branco, João Pessoa - PB",
        costLevel: "GRATUITO",
        estimatedPrice: "R$ 0",
        rating: 4.8,
        suggestedDurationMin: 120,
        idealTime: "08h às 14h",
        accessibility: "ALTA",
        tags: ["praia", "orla", "caminhada"],
        distanceFromCenterKm: 8,
        imageClass: "from-cyan-300 to-blue-500",
        approved: true,
      },
      {
        name: "Restaurante Regional",
        city: "João Pessoa",
        category: "GASTRONOMIA",
        description:
          "Restaurante com pratos regionais, culinária paraibana e opções para parada de almoço.",
        address: "Tambaú, João Pessoa - PB",
        costLevel: "MEDIO",
        estimatedPrice: "R$ 50 a R$ 90",
        rating: 4.7,
        suggestedDurationMin: 90,
        idealTime: "12h às 14h",
        accessibility: "ALTA",
        tags: ["gastronomia", "regional", "almoço"],
        distanceFromCenterKm: 7,
        imageClass: "from-orange-300 to-red-500",
        approved: true,
      },
      {
        name: "Farol do Cabo Branco",
        city: "João Pessoa",
        category: "CULTURA",
        description:
          "Ponto turístico simbólico da cidade, próximo à Estação Cabo Branco e ao Extremo Oriental das Américas.",
        address: "Altiplano Cabo Branco, João Pessoa - PB",
        costLevel: "GRATUITO",
        estimatedPrice: "R$ 0",
        rating: 4.5,
        suggestedDurationMin: 60,
        idealTime: "09h às 16h",
        accessibility: "MEDIA",
        tags: ["farol", "mirante", "foto"],
        distanceFromCenterKm: 10,
        imageClass: "from-blue-300 to-emerald-500",
        approved: true,
      },
      {
        name: "Parque Arruda Câmara",
        city: "João Pessoa",
        category: "NATUREZA",
        description:
          "Área verde tradicional da cidade, conhecida como Bica, com espaços de lazer e contato com a natureza.",
        address: "Roger, João Pessoa - PB",
        costLevel: "ECONOMICO",
        estimatedPrice: "R$ 5 a R$ 20",
        rating: 4.4,
        suggestedDurationMin: 120,
        idealTime: "08h às 15h",
        accessibility: "MEDIA",
        tags: ["natureza", "família", "parque"],
        distanceFromCenterKm: 3,
        imageClass: "from-green-300 to-emerald-600",
        approved: true,
      },
      {
        name: "Praia de Tambaba",
        city: "Conde",
        category: "PRAIA",
        description:
          "Praia do litoral sul paraibano, conhecida por paisagens naturais, falésias e águas claras.",
        address: "Conde - PB",
        costLevel: "GRATUITO",
        estimatedPrice: "R$ 0",
        rating: 4.8,
        suggestedDurationMin: 180,
        idealTime: "08h às 14h",
        accessibility: "BAIXA",
        tags: ["praia", "litoral sul", "natureza"],
        distanceFromCenterKm: 35,
        imageClass: "from-sky-300 to-teal-500",
        approved: true,
      },
      {
        name: "Centro Histórico de Areia",
        city: "Areia",
        category: "CULTURA",
        description:
          "Roteiro cultural em cidade histórica do Brejo Paraibano, com casarios, museus e patrimônio arquitetônico.",
        address: "Centro, Areia - PB",
        costLevel: "ECONOMICO",
        estimatedPrice: "R$ 10 a R$ 40",
        rating: 4.7,
        suggestedDurationMin: 150,
        idealTime: "09h às 16h",
        accessibility: "MEDIA",
        tags: ["brejo", "história", "cultura"],
        distanceFromCenterKm: 120,
        imageClass: "from-yellow-300 to-amber-600",
        approved: true,
      },
      {
        name: "Passeio com Guia Local",
        city: "João Pessoa",
        category: "EXPERIENCIA",
        description:
          "Experiência guiada para conhecer histórias, curiosidades e pontos menos conhecidos da cidade.",
        address: "João Pessoa - PB",
        costLevel: "MEDIO",
        estimatedPrice: "R$ 40 a R$ 100",
        rating: 4.9,
        suggestedDurationMin: 120,
        idealTime: "09h às 17h",
        accessibility: "MEDIA",
        tags: ["guia", "experiência", "cultura"],
        distanceFromCenterKm: 5,
        imageClass: "from-purple-300 to-blue-500",
        approved: true,
      },
    ],
  });

  console.log("Seed finalizado com sucesso!");
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });