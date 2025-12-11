// MUST set TLS rejection BEFORE any imports that might use it
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";

// Load environment variables
config({ path: ".env.local" });

// Initialize Prisma client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Load translation files
function loadTranslations() {
  const messagesPath = path.join(process.cwd(), "components/LanguageSwitcher/messages");
  const en = JSON.parse(fs.readFileSync(path.join(messagesPath, "en.json"), "utf-8"));
  const sv = JSON.parse(fs.readFileSync(path.join(messagesPath, "sv.json"), "utf-8"));
  const fr = JSON.parse(fs.readFileSync(path.join(messagesPath, "fr.json"), "utf-8"));
  return { en, sv, fr };
}

// Schedule events data
const scheduleEvents = [
  {
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "16:00",
    descriptionKey: "lohengrinDesc",
    startDate: { day: 16, monthKey: "october", year: 2025 },
  },
  {
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "16:00",
    descriptionKey: "lohengrinDesc",
    startDate: { day: 1, monthKey: "november", year: 2025 },
  },
  {
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "17:00",
    descriptionKey: "lohengrinDesc",
    startDate: { day: 6, monthKey: "november", year: 2025 },
  },
  {
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "16:00",
    descriptionKey: "lohengrinDesc",
    startDate: { day: 9, monthKey: "november", year: 2025 },
  },
  {
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "16:00",
    descriptionKey: "lohengrinDesc",
    startDate: { day: 15, monthKey: "november", year: 2025 },
  },
  {
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "16:00",
    descriptionKey: "lohengrinDesc",
    startDate: { day: 23, monthKey: "november", year: 2025 },
  },
  {
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "16:00",
    descriptionKey: "lohengrinDesc",
    startDate: { day: 30, monthKey: "november", year: 2025 },
  },
  {
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "16:00",
    descriptionKey: "lohengrinDesc",
    startDate: { day: 16, monthKey: "december", year: 2025 },
  },
  {
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "16:00",
    descriptionKey: "lohengrinDesc",
    startDate: { day: 16, monthKey: "december", year: 2025 },
  },
  {
    title: "Faurés Requiem",
    location: "Brännkyrka kyrka",
    time: "16:00",
    descriptionKey: "faureDesc",
    startDate: { day: 2, monthKey: "november", year: 2025 },
  },
  {
    title: "Carmen",
    location: "Malmö Opera",
    time: "19:00",
    descriptionKey: "carmenDesc",
    startDate: { day: 21, monthKey: "january", year: 2026 },
  },
  {
    title: "Carmen",
    location: "Malmö Opera",
    time: "19:00",
    descriptionKey: "carmenDesc",
    startDate: { day: 23, monthKey: "january", year: 2026 },
  },
  {
    title: "Carmen",
    location: "Malmö Opera",
    time: "16:00",
    descriptionKey: "carmenDesc",
    startDate: { day: 25, monthKey: "january", year: 2026 },
  },
  {
    title: "Carmen",
    location: "Malmö Opera",
    time: "19:00",
    descriptionKey: "carmenDesc",
    startDate: { day: 27, monthKey: "january", year: 2026 },
  },
  {
    title: "Carmen",
    location: "Malmö Opera",
    time: "19:00",
    descriptionKey: "carmenDesc",
    startDate: { day: 29, monthKey: "january", year: 2026 },
  },
  {
    title: "Carmen",
    location: "Malmö Opera",
    time: "18:00",
    descriptionKey: "carmenDesc",
    startDate: { day: 31, monthKey: "january", year: 2026 },
  },
  {
    title: "Carmen",
    location: "Malmö Opera",
    time: "19:00",
    descriptionKey: "carmenDesc",
    startDate: { day: 3, monthKey: "february", year: 2026 },
  },
  {
    title: "Carmen",
    location: "Malmö Opera",
    time: "16:00",
    descriptionKey: "carmenDesc",
    startDate: { day: 8, monthKey: "february", year: 2026 },
  },
  {
    title: "Carmen",
    location: "Malmö Opera",
    time: "18:00",
    descriptionKey: "carmenDesc",
    startDate: { day: 14, monthKey: "february", year: 2026 },
  },
  {
    title: "Carmen",
    location: "Malmö Opera",
    time: "16:00",
    descriptionKey: "carmenDesc",
    startDate: { day: 22, monthKey: "february", year: 2026 },
  },
  {
    title: "Carmen",
    location: "Malmö Opera",
    time: "18:00",
    descriptionKey: "carmenDesc",
    startDate: { day: 28, monthKey: "february", year: 2026 },
  },
  {
    title: "Carmen",
    location: "Malmö Opera",
    time: "19:00",
    descriptionKey: "carmenDesc",
    startDate: { day: 4, monthKey: "march", year: 2026 },
  },
  {
    title: "Carmen",
    location: "Malmö Opera",
    time: "16:00",
    descriptionKey: "carmenDesc",
    startDate: { day: 8, monthKey: "march", year: 2026 },
  },
  {
    title: "Carmen",
    location: "Malmö Opera",
    time: "19:00",
    descriptionKey: "carmenDesc",
    startDate: { day: 10, monthKey: "march", year: 2026 },
  },
  {
    title: "Carmen",
    location: "Malmö Opera",
    time: "19:00",
    descriptionKey: "carmenDesc",
    startDate: { day: 13, monthKey: "march", year: 2026 },
  },
  {
    title: "Carmen",
    location: "Malmö Opera",
    time: "16:00",
    descriptionKey: "carmenDesc",
    startDate: { day: 15, monthKey: "march", year: 2026 },
  },
];

async function seedSchedule() {
  try {
    console.log("📝 Seeding Schedule section...");

    const { en, sv, fr } = loadTranslations();

    // Generate UUIDs for events to ensure same ID across languages
    const eventIds = scheduleEvents.map(() => randomUUID());

    // Create base events with English data
    const events = scheduleEvents.map((event, index) => {
      const enMonth = en.Schedule[
        event.startDate.monthKey as keyof typeof en.Schedule
      ] as string;
      const enDesc = en.Schedule[
        event.descriptionKey as keyof typeof en.Schedule
      ] as string;

      return {
        id: eventIds[index],
        title: event.title,
        location: event.location,
        time: event.time || null,
        description: enDesc,
        startDate: {
          day: event.startDate.day,
          month: enMonth,
          year: event.startDate.year,
        },
      };
    });

    // Create schedule data with localized content
    // Structure: items on top level (after migration), language-specific fields in locale objects
    const scheduleData = {
      // Items on top level with localized descriptions
      items: events.map((event, index) => {
        const eventData = scheduleEvents[index];
        const enDesc = en.Schedule[
          eventData.descriptionKey as keyof typeof en.Schedule
        ] as string;
        const svDesc = sv.Schedule[
          eventData.descriptionKey as keyof typeof sv.Schedule
        ] as string;
        const frDesc = fr.Schedule[
          eventData.descriptionKey as keyof typeof fr.Schedule
        ] as string;

        return {
          ...event,
          id: eventIds[index],
          description: {
            en: enDesc,
            sv: svDesc,
            fr: frDesc,
          },
        };
      }),
      // Language-specific fields
      en: {
        scheduleTitle: en.Schedule.title,
        scheduleUnderTitle: en.Schedule.undertitle,
        scheduleBookTitle: en.Schedule.bookTitle,
        scheduleBookDesc: en.Schedule.bookDesc,
        scheduleBookEmail: "ecm.schoeffler@gmail.com",
        scheduleBookPhone: "+46735362254",
      },
      sv: {
        scheduleTitle: sv.Schedule.title,
        scheduleUnderTitle: sv.Schedule.undertitle,
        scheduleBookTitle: sv.Schedule.bookTitle,
        scheduleBookDesc: sv.Schedule.bookDesc,
        scheduleBookEmail: "ecm.schoeffler@gmail.com",
        scheduleBookPhone: "+46735362254",
      },
      fr: {
        scheduleTitle: fr.Schedule.title,
        scheduleUnderTitle: fr.Schedule.undertitle,
        scheduleBookTitle: fr.Schedule.bookTitle,
        scheduleBookDesc: fr.Schedule.bookDesc,
        scheduleBookEmail: "ecm.schoeffler@gmail.com",
        scheduleBookPhone: "+46735362254",
      },
    };

    await prisma.content.upsert({
      where: { sectionId: "schedule" },
      update: { data: scheduleData },
      create: { sectionId: "schedule", data: scheduleData },
    });

    console.log("✅ Schedule section seeded successfully!");
    console.log(`   - Added ${scheduleEvents.length} events`);
  } catch (error) {
    console.error("❌ Error seeding schedule:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedSchedule()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  });


