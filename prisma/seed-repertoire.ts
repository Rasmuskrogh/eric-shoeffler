import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";
config({ path: ".env.local" });

// Allow self-signed certificates when not in production (needed for some PostgreSQL providers)
if (process.env.NODE_ENV !== "production" && !process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const repertoireData = {
  availableNow: [
    { composer: "Bizet", role: "Morales", opera: "Carmen" },
    { composer: "Bizet", role: "Zuniga", opera: "Carmen" },
    { composer: "Bizet", role: "Dancaïro", opera: "Carmen" },
    { composer: "Mozart", role: "Masetto", opera: "Don Giovanni" },
    { composer: "Verdi", role: "Monterone", opera: "Rigoletto" },
    { composer: "Verdi", role: "Ceprano", opera: "Rigoletto" },
    { composer: "Wagner", role: "Vierte Edelmann", opera: "Lohengrin" },
  ],
  inPreparation: [
    { composer: "Mozart", role: "Leporello", opera: "Don Giovanni" },
    { composer: "Mozart", role: "Figaro", opera: "Le nozze di Figaro" },
    { composer: "Bizet", role: "Escamillo", opera: "Carmen" },
    { composer: "Gounod", role: "Méphistophélès", opera: "Faust" },
    { composer: "Beethoven", role: "Don Pizarro", opera: "Fidelio" },
  ],
  en: { repertoireTitle: "Repertoire" },
  sv: { repertoireTitle: "Repertoar" },
  fr: { repertoireTitle: "Répertoire" },
};

async function seedRepertoire() {
  try {
    console.log("🌱 Seeding Repertoire section...");

    await prisma.content.upsert({
      where: { sectionId: "repertoire" },
      update: { data: repertoireData },
      create: { sectionId: "repertoire", data: repertoireData },
    });

    console.log("✅ Repertoire section seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding repertoire:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seedRepertoire().catch((error) => {
  console.error(error);
  process.exit(1);
});
