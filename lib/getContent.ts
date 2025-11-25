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
      return localizedData[locale] || null;
    }
  }

  // Annars returnera data direkt (fungerar både med och utan språk)
  return data as ContentData;
}
