// src/lib/getContent.ts
import { prisma } from "./prisma";
import type { ContentData } from "@/components/AdminDashboard/types";

type LocalizedContent = Record<string, ContentData>;

export async function getContent(
  sectionId: string,
  locale?: string // Optional - om inget språk, returnera direkt
): Promise<ContentData | null> {
  const content = await prisma.content.findUnique({
    where: { sectionId },
  });

  if (!content?.data) return null;

  const data = content.data as ContentData | LocalizedContent;

  // Om locale är angiven, försök hämta från språk-struktur
  if (locale) {
    // Kolla om data är ett objekt med språk-nycklar
    if (
      typeof data === "object" &&
      data !== null &&
      !Array.isArray(data) &&
      locale in data
    ) {
      const localizedData = data as LocalizedContent;
      const langData = localizedData[locale] || {};
      
      // Identifiera språk-nycklar (vanligtvis "en", "sv", "fr")
      // Delade fält och listor är alla nycklar som inte är språk-nycklar
      const possibleLanguages = ["en", "sv", "fr", "de", "es", "it", "pt", "ru", "zh", "ja", "ko"];
      const sharedData: ContentData = {};
      Object.keys(data).forEach((key) => {
        // Om nyckeln inte är en språk-nyckel, är det troligen ett delat fält eller lista
        const value = (data as any)[key];
        const isLanguageKey = possibleLanguages.includes(key) && 
                              typeof value === "object" && 
                              value !== null && 
                              !Array.isArray(value);
        
        if (!isLanguageKey) {
          // Detta är ett delat fält eller lista på toppnivån
          sharedData[key] = value;
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
            if (item.description && typeof item.description === "object" && !Array.isArray(item.description)) {
              const descriptions = item.description as Record<string, string>;
              processedItem.description = descriptions[locale] || descriptions["en"] || "";
            }
            return processedItem;
          });
        } else {
          processedSharedData[key] = value;
        }
      });
      
      // Kombinera språk-data med delade fält/listor
      return {
        ...processedSharedData,
        ...langData,
      };
    }
  }

  // Annars returnera data direkt (fungerar både med och utan språk)
  return data as ContentData;
}
