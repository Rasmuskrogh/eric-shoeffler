import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";
import type { ContentData } from "../components/AdminDashboard/types";

// Load environment variables
config({ path: ".env.local" });

// Only disable TLS certificate validation in development environment
if (process.env.NODE_ENV === "development" && !process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

// Initialize Prisma client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function migrateScheduleItems() {
  try {
    console.log("Starting schedule items migration...");

    // Hämta schedule-data från databasen
    const scheduleContent = await prisma.content.findUnique({
      where: { sectionId: "schedule" },
    });

    if (!scheduleContent || !scheduleContent.data) {
      console.log("No schedule content found in database.");
      return;
    }

    const data = scheduleContent.data as Record<string, unknown>;
    console.log("Current structure keys:", Object.keys(data));

    // Kolla om data redan är migrerad (items på toppnivån)
    const hasItemsOnTopLevel = "items" in data && Array.isArray(data.items);
    
    if (hasItemsOnTopLevel) {
      console.log("⚠️  Data appears to already be migrated (items on top level).");
      console.log("Checking if descriptions need to be converted to localized objects...");
      
      const existingItems = data.items as ContentData[];
      let needsConversion = false;
      
      // Kolla om någon description redan är lokaliserat objekt
      existingItems.forEach((item) => {
        if (item.description && typeof item.description === "string") {
          needsConversion = true;
        }
      });
      
      if (!needsConversion) {
        console.log("✅ Descriptions are already localized. Nothing to do.");
        return;
      }
      
      console.log("Found items with string descriptions. Need to convert...");
      // Vi behöver hitta originaldata från backup eller seed-filer
      // För nu, låt oss bara varna användaren
      console.warn("⚠️  Cannot convert: items already on top level but descriptions are strings.");
      console.warn("   You may need to restore from backup or re-seed the database.");
      return;
    }

    // Identifiera språk-nycklar
    const possibleLanguages = ["en", "sv", "fr", "de", "es", "it", "pt", "ru", "zh", "ja", "ko"];
    const languageKeys: string[] = [];
    const itemsFromLanguages: ContentData[][] = [];

    // Hämta items från varje språk
    possibleLanguages.forEach((lang) => {
      if (lang in data) {
        const langData = data[lang] as Record<string, unknown>;
        if (langData && typeof langData === "object" && !Array.isArray(langData)) {
          if ("items" in langData && Array.isArray(langData.items)) {
            languageKeys.push(lang);
            itemsFromLanguages.push(langData.items as ContentData[]);
            console.log(`Found items in ${lang}: ${langData.items.length} items`);
          }
        }
      }
    });

    if (itemsFromLanguages.length === 0) {
      console.log("No items found in any language. Nothing to migrate.");
      return;
    }

    // Använd items från första språket som bas
    const baseItems = itemsFromLanguages[0] as ContentData[];
    
    if (itemsFromLanguages.length > 1) {
      const allSame = itemsFromLanguages.every(
        (items) => items.length === baseItems.length
      );
      if (!allSame) {
        console.warn("⚠️  Warning: Different number of items in different languages!");
        console.warn("Using items from first language found:", languageKeys[0]);
      }
    }

    console.log(`Migrating ${baseItems.length} items to top level...`);

    // Konvertera items: samla description från alla språk
    // Skapa en map för snabbare lookup baserat på ID
    const itemsMapByLang: Record<string, Map<string, ContentData>> = {};
    languageKeys.forEach((lang, index) => {
      const langItems = itemsFromLanguages[index] as ContentData[];
      const map = new Map<string, ContentData>();
      langItems.forEach((item) => {
        if (item.id && typeof item.id === "string") {
          map.set(item.id, item);
        }
      });
      itemsMapByLang[lang] = map;
    });

    const migratedItems = baseItems.map((item) => {
      const migratedItem: ContentData = { ...item };
      
      // Konvertera description till lokaliserat objekt
      const descriptions: Record<string, string> = {};
      languageKeys.forEach((lang) => {
        const langItemMap = itemsMapByLang[lang];
        if (item.id && typeof item.id === "string") {
          const langItem = langItemMap.get(item.id);
          if (langItem && langItem.description && typeof langItem.description === "string") {
            descriptions[lang] = langItem.description;
          }
        }
      });
      
      // Om vi hittade minst en description, sätt den som objekt
      // Annars behåll den ursprungliga (om den finns)
      if (Object.keys(descriptions).length > 0) {
        migratedItem.description = descriptions;
      } else if (item.description && typeof item.description === "string") {
        // Om ingen lokaliserad description hittades, behåll den ursprungliga
        // och konvertera den till objekt med första språket
        migratedItem.description = {
          [languageKeys[0]]: item.description,
        };
      }
      
      return migratedItem;
    });

    // Skapa ny struktur
    const newData: Record<string, unknown> = {
      items: migratedItems, // Lägg items på toppnivån med lokaliserade fält
    };

    // Kopiera alla språk-objekt men ta bort items från dem
    possibleLanguages.forEach((lang) => {
      if (lang in data) {
        const langData = data[lang] as Record<string, unknown>;
        if (langData && typeof langData === "object" && !Array.isArray(langData)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { items, ...langDataWithoutItems } = langData;
          newData[lang] = langDataWithoutItems;
        }
      }
    });

    // Uppdatera databasen
    await prisma.content.update({
      where: { sectionId: "schedule" },
      data: {
        data: newData as ContentData,
      },
    });

    console.log("✅ Migration completed successfully!");
    console.log(`   - Moved ${migratedItems.length} items to top level`);
    console.log(`   - Converted descriptions to localized objects for ${languageKeys.length} languages`);
    console.log(`   - Removed items from ${languageKeys.length} language objects`);
    console.log("   - New structure: items on top level, language-specific fields in language objects");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateScheduleItems()
  .catch((error) => {
    console.error("Migration error:", error);
    process.exit(1);
  });

