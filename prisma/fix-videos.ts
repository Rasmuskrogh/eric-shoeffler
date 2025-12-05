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
import { randomUUID } from "crypto";
import type { ContentData } from "../components/AdminDashboard/types";

// Load environment variables
config({ path: ".env.local" });

// Initialize Prisma client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV !== "production"
      ? { rejectUnauthorized: false }
      : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Helper function to convert YouTube embed URL to watch URL
function embedToWatchUrl(embedUrl: string): string {
  const match = embedUrl.match(/youtube\.com\/embed\/([^?&]+)/);
  if (match && match[1]) {
    return `https://www.youtube.com/watch?v=${match[1]}`;
  }
  return embedUrl;
}

// Videos data (from app/media/page.tsx)
const videosData = [
  {
    embedUrl: "https://www.youtube.com/embed/R60gOl6xHy0",
    title: "Vous qui faites l'endormie",
    descriptionKey: "vousQuiFaitesL'endormieDesc",
  },
  {
    embedUrl: "https://www.youtube.com/embed/8hWd6sFgq7c?si=dTl06n0WdJvWoqjk",
    title: "Stars",
    descriptionKey: "starsDesc",
  },
  {
    embedUrl: "https://www.youtube.com/embed/jJaEdbr-ZrY?si=1jMrK-9DUqi9K84J",
    title: "Le couteau",
    descriptionKey: "leCouteauDesc",
  },
  {
    embedUrl: "https://www.youtube.com/embed/_x1brW-4cXU?si=XZUFgYV5zEI7l84_",
    title: "En visa till Karin när hon hade dansat",
    descriptionKey: "enVisaTillKarinDesc",
  },
  {
    embedUrl: "https://www.youtube.com/embed/ntgveY_yZAA?si=sCbixb5-Q_41YOMn",
    title: '"Jag ger dig min morgon" – Fred Åkerström cover',
    description: "Stockholm Music Group",
  },
  {
    embedUrl: "https://www.youtube.com/embed/gWM82gyJuqM?si=57CLGsFxV523QPG5",
    title: '"Hallelujah" – as a Duo',
    description: "Stockholm Music Group",
  },
];

async function fixVideos() {
  try {
    console.log("Starting videos fix...");

    // Ladda translation-filer
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

    // Hämta media-data från databasen
    const mediaContent = await prisma.content.findUnique({
      where: { sectionId: "media" },
    });

    if (!mediaContent || !mediaContent.data) {
      console.log("No media content found in database.");
      return;
    }

    const data = mediaContent.data as Record<string, unknown>;

    // Generate UUIDs for videos to ensure same ID across languages
    const videoIds = videosData.map(() => randomUUID());

    // Skapa videos med description som språk-objekt
    const videos = videosData.map((video, index) => {
      const enDesc = video.descriptionKey
        ? (en.Media[video.descriptionKey as keyof typeof en.Media] as string) ||
          video.description ||
          ""
        : video.description || "";
      const svDesc = video.descriptionKey
        ? (sv.Media[video.descriptionKey as keyof typeof sv.Media] as string) ||
          video.description ||
          ""
        : video.description || "";
      const frDesc = video.descriptionKey
        ? (fr.Media[video.descriptionKey as keyof typeof fr.Media] as string) ||
          video.description ||
          ""
        : video.description || "";

      return {
        id: videoIds[index],
        youtubeUrl: embedToWatchUrl(video.embedUrl),
        title: video.title,
        description: {
          en: enDesc,
          sv: svDesc,
          fr: frDesc,
        },
      };
    });

    // Uppdatera data - behåll allt annat, bara uppdatera videos
    const updatedData: Record<string, unknown> = {
      ...data,
      videos: videos,
    };

    await prisma.content.update({
      where: { sectionId: "media" },
      data: {
        data: updatedData as ContentData,
      },
    });

    console.log("✅ Videos fixed successfully!");
    console.log(`   - Restored ${videos.length} videos`);
    console.log("   - All descriptions are localized objects with en, sv, fr");
  } catch (error) {
    console.error("❌ Fix failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixVideos().catch((error) => {
  console.error("Fix error:", error);
  process.exit(1);
});
