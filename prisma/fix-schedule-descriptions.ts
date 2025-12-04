// MUST set TLS rejection BEFORE any imports that might use it
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";
import type { ContentData } from "../components/AdminDashboard/types";

// Load environment variables
config({ path: ".env.local" });

// Initialize Prisma client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Disable SSL certificate validation for development
  ssl:
    process.env.NODE_ENV !== "production"
      ? { rejectUnauthorized: false }
      : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Ladda translation-filer
function loadTranslations() {
  const messagesPath = path.join(
    process.cwd(),
    "components",
    "LanguageSwitcher",
    "messages"
  );
  const en = JSON.parse(
    fs.readFileSync(path.join(messagesPath, "en.json"), "utf-8")
  );
  const sv = JSON.parse(
    fs.readFileSync(path.join(messagesPath, "sv.json"), "utf-8")
  );
  const fr = JSON.parse(
    fs.readFileSync(path.join(messagesPath, "fr.json"), "utf-8")
  );
  return { en, sv, fr };
}

async function fixScheduleDescriptions() {
  try {
    console.log("Starting schedule descriptions fix...");

    // Hämta schedule-data från databasen
    const scheduleContent = await prisma.content.findUnique({
      where: { sectionId: "schedule" },
    });

    if (!scheduleContent || !scheduleContent.data) {
      console.log("No schedule content found in database.");
      return;
    }

    const data = scheduleContent.data as Record<string, unknown>;

    // Kolla om items finns på toppnivån
    if (!("items" in data) || !Array.isArray(data.items)) {
      console.log(
        "No items found on top level. Run migrate-schedule-items first."
      );
      return;
    }

    const items = data.items as ContentData[];
    console.log(`Found ${items.length} items on top level`);

    // Ladda translations
    const { en, sv, fr } = loadTranslations();

    // Mappning från event title till description key
    const titleToDescriptionKey: Record<string, string> = {
      Lohengrin: "lohengrinDesc",
      "Faurés Requiem": "faureDesc",
      Carmen: "carmenDesc",
    };

    // Konvertera descriptions från strängar till lokaliserade objekt
    const fixedItems = items.map((item) => {
      const fixedItem: ContentData = { ...item };

      // Hämta description key baserat på title
      const title = item.title as string;
      const descriptionKey = titleToDescriptionKey[title];

      // Om item redan har en lokaliserad description (objekt), behåll den
      if (
        item.description &&
        typeof item.description === "object" &&
        !Array.isArray(item.description)
      ) {
        const existingDesc = item.description as Record<string, string>;
        if (existingDesc.en || existingDesc.sv || existingDesc.fr) {
          console.log(
            `✓ Keeping existing localized description for "${title}"`
          );
          return fixedItem;
        }
      }

      // Om description är en sträng eller saknas, konvertera från translation-filer
      if (descriptionKey) {
        // Hämta descriptions från translation-filer
        const descriptions: Record<string, string> = {
          en:
            (en.Schedule as Record<string, string>)[descriptionKey] ||
            (item.description as string) ||
            "",
          sv: (sv.Schedule as Record<string, string>)[descriptionKey] || "",
          fr: (fr.Schedule as Record<string, string>)[descriptionKey] || "",
        };

        // Sätt alltid descriptions (även om några är tomma)
        fixedItem.description = descriptions;
        console.log(`✅ Fixed description for "${title}":`);
        if (descriptions.en)
          console.log(`   - EN: ${descriptions.en.substring(0, 60)}...`);
        if (descriptions.sv)
          console.log(`   - SV: ${descriptions.sv.substring(0, 60)}...`);
        if (descriptions.fr)
          console.log(`   - FR: ${descriptions.fr.substring(0, 60)}...`);
      } else {
        // Om ingen mapping finns, konvertera befintlig sträng till objekt
        if (item.description && typeof item.description === "string") {
          fixedItem.description = {
            en: item.description,
            sv: item.description, // Fallback till engelska
            fr: item.description, // Fallback till engelska
          };
          console.log(
            `⚠️  Converted string description to object for "${title}" (no translation key found)`
          );
        } else {
          console.warn(
            `⚠️  No description key mapping for title "${title}" and no existing description`
          );
        }
      }

      return fixedItem;
    });

    // Uppdatera databasen
    const newData: Record<string, unknown> = {
      ...data,
      items: fixedItems,
    };

    await prisma.content.update({
      where: { sectionId: "schedule" },
      data: {
        data: newData as ContentData,
      },
    });

    console.log("✅ Descriptions fixed successfully!");
    console.log(`   - Fixed ${fixedItems.length} items`);
    console.log(
      "   - All descriptions are now localized objects with en, sv, fr"
    );
  } catch (error) {
    console.error("❌ Fix failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixScheduleDescriptions().catch((error) => {
  console.error("Fix error:", error);
  process.exit(1);
});
