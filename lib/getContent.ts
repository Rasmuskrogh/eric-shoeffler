// src/lib/getContent.ts
import { prisma } from "./prisma";
import type { ContentData, ContentDataValue } from "@/components/AdminDashboard/types";

type LocalizedContent = Record<string, ContentData>;

function isConnectionClosedError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("closed the connection") || msg.includes("Connection terminated") || msg.includes("ECONNRESET");
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getContent(
  sectionId: string,
  locale?: string // Optional - om inget språk, returnera direkt
): Promise<ContentData | null> {
  const run = () =>
    prisma.content.findUnique({
      where: { sectionId },
    });

  const maxAttempts = 3;
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const content = await run();
      return processContent(content, sectionId, locale);
    } catch (err) {
      lastErr = err;
      if (!isConnectionClosedError(err) || attempt === maxAttempts) throw err;
      await delay(attempt * 100);
    }
  }
  throw lastErr;
}

function processContent(
  content: Awaited<ReturnType<typeof prisma.content.findUnique>>,
  sectionId: string,
  locale?: string
): ContentData | null {
  if (!content?.data) return null;

  const data = content.data as ContentData | LocalizedContent;

  // Om locale är angiven, försök hämta från språk-struktur
  if (locale) {
    // Kolla om data är ett objekt med språk-nycklar
    if (typeof data === "object" && data !== null && !Array.isArray(data) && locale in data) {
      const localizedData = data as LocalizedContent;
      const langData = localizedData[locale] || {};

      // Identifiera språk-nycklar (vanligtvis "en", "sv", "fr")
      // Delade fält och listor är alla nycklar som inte är språk-nycklar
      const possibleLanguages = ["en", "sv", "fr", "de", "es", "it", "pt", "ru", "zh", "ja", "ko"];
      const sharedData: ContentData = {};
      Object.keys(data).forEach((key) => {
        // Om nyckeln inte är en språk-nyckel, är det troligen ett delat fält eller lista
        const value = (data as Record<string, unknown>)[key];
        const isLanguageKey =
          possibleLanguages.includes(key) && typeof value === "object" && value !== null && !Array.isArray(value);

        if (!isLanguageKey) {
          // Detta är ett delat fält eller lista på toppnivån
          sharedData[key] = value as ContentDataValue;
        }
      });

      // För delade listor med localizedFields (t.ex. videos med description),
      // behöver vi bearbeta description för aktivt språk
      const processedSharedData: ContentData = {};
      Object.keys(sharedData).forEach((key) => {
        const value = sharedData[key];
        if (Array.isArray(value)) {
          // Detta är en lista - kolla om den har localizedFields
          processedSharedData[key] = value.map((item: ContentData) => {
            const processedItem: ContentData = { ...item };
            // Om item har description som objekt, hämta rätt språk
            if (item.description) {
              if (typeof item.description === "object" && !Array.isArray(item.description)) {
                // Description är redan lokaliserat objekt
                const descriptions = item.description as Record<string, string>;
                processedItem.description = descriptions[locale] || descriptions["en"] || "";
              } else if (typeof item.description === "string") {
                // Description är sträng - använd den direkt (bakåtkompatibilitet)
                processedItem.description = item.description;
              }
            }
            return processedItem;
          });
        } else {
          processedSharedData[key] = value;
        }
      });

      // Kombinera språk-data med delade fält/listor
      // For schedule: items should come from sharedData (top level) if it exists there,
      // otherwise from locale-specific data
      const result = {
        ...processedSharedData,
        ...langData,
      };

      // Special handling for schedule section:
      // After migration, items are on top level (sharedData)
      // Before migration, items are in locale-specific data (langData)
      if (sectionId === "schedule") {
        // Prefer items from sharedData (top level after migration)
        if (processedSharedData.items && Array.isArray(processedSharedData.items)) {
          result.items = processedSharedData.items;
        } else if (langData.items && Array.isArray(langData.items)) {
          // Fallback to locale-specific items (before migration)
          result.items = langData.items;
        } else {
          // Ensure items is always an array, even if empty
          result.items = [];
        }
      }

      return result;
    }
  }

  // Annars returnera data direkt (fungerar både med och utan språk)
  return data as ContentData;
}
