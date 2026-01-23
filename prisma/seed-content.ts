import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import { ContentData } from "../components/AdminDashboard/types";

// Load environment variables
config({ path: ".env.local" });

// Only disable TLS certificate validation in development environment
// This is needed for some PostgreSQL providers with self-signed certificates
if (process.env.NODE_ENV === "development" && !process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

// Initialize Prisma client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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

// Helper function to extract Spotify URL from embed URL
function extractSpotifyUrl(embedUrl: string): string {
  const match = embedUrl.match(
    /spotify\.com\/embed\/(track|album|playlist)\/([^?&]+)/
  );
  if (match && match[1] && match[2]) {
    return `https://open.spotify.com/${match[1]}/${match[2]}`;
  }
  return embedUrl;
}

// Helper function to build Cloudinary URL
function getCloudinaryUrl(imagePath: string, folder: string = "hero"): string {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_ACCOUNT;

  if (!cloudName) {
    // Fallback to local path if Cloudinary is not configured
    return imagePath;
  }

  // Extract image name from path (e.g., "/eric-hero.jpg" -> "eric-hero")
  const imageName = imagePath.replace(/^\//, "").replace(/\.[^.]+$/, "");

  // Build Cloudinary URL with optimization
  return `https://res.cloudinary.com/${cloudName}/image/upload/a_auto,w_auto,h_auto,f_auto,q_auto/${folder}/${imageName}`;
}

// Load translation files
function loadTranslations() {
  const messagesPath = path.join(
    process.cwd(),
    "components/LanguageSwitcher/messages"
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

// Schedule events data (from app/schedule/page.tsx)
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

// Spotify data (from app/media/page.tsx)
const spotifyData = [
  {
    embedUrl:
      "https://open.spotify.com/embed/track/3W9NQIIENxpOTRNEbmFYPG?utm_source=generator",
  },
  {
    embedUrl:
      "https://open.spotify.com/embed/track/5QsNHtONgxoLFO1GGUlZQd?utm_source=generator",
  },
];

async function seedContent() {
  try {
    console.log("🌱 Starting content seeding...");

    const { en, sv, fr } = loadTranslations();

    // 1. Home section
    console.log("📝 Seeding Home section...");
    // Delade fält (bilder) - samma för alla språk
    const sharedFields = {
      imageLarge: getCloudinaryUrl("/eric-hero.jpg", "hero"),
      imageSmall: getCloudinaryUrl("/eric-standing.JPG", "hero"),
      profileImage: getCloudinaryUrl("/eric-no-background.png", "hero"),
      SecondImage: getCloudinaryUrl("/la-boheme-quartet-large.avif", "hero"),
    };

    const homeData = {
      ...sharedFields, // Delade fält på toppnivån
      en: {
        name: en.Hero.name,
        tagline: en.Hero.tagline,
        aboutTitle: en.Short.title,
        description: en.Short.description,
        aboutButtonText: en.Short.button,
        listenTitle: en.ListenShort.title,
        listenButtonText: en.ListenShort.button,
        youtubeUrl: embedToWatchUrl(
          "https://www.youtube.com/embed/R60gOl6xHy0"
        ),
      },
      sv: {
        name: sv.Hero.name,
        tagline: sv.Hero.tagline,
        aboutTitle: sv.Short.title,
        description: sv.Short.description,
        aboutButtonText: sv.Short.button,
        listenTitle: sv.ListenShort.title,
        listenButtonText: sv.ListenShort.button,
        youtubeUrl: embedToWatchUrl(
          "https://www.youtube.com/embed/R60gOl6xHy0"
        ),
      },
      fr: {
        name: fr.Hero.name,
        tagline: fr.Hero.tagline,
        aboutTitle: fr.Short.title,
        description: fr.Short.description,
        aboutButtonText: fr.Short.button,
        listenTitle: fr.ListenShort.title,
        listenButtonText: fr.ListenShort.button,
        youtubeUrl: embedToWatchUrl(
          "https://www.youtube.com/embed/R60gOl6xHy0"
        ),
      },
    };

    await prisma.content.upsert({
      where: { sectionId: "home" },
      update: { data: homeData },
      create: { sectionId: "home", data: homeData },
    });
    console.log("✅ Home section seeded");

    // 2. Schedule section
    console.log("📝 Seeding Schedule section...");

    // Create events with localized descriptions and months
    // Generate UUIDs first to ensure same ID for same event across languages
    const eventIds = scheduleEvents.map(() => randomUUID());

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

    const scheduleData = {
      en: {
        scheduleTitle: en.Schedule.title,
        scheduleUnderTitle: en.Schedule.undertitle,
        scheduleBookTitle: en.Schedule.bookTitle,
        scheduleBookDesc: en.Schedule.bookDesc,
        scheduleBookEmail: "ecm.schoeffler@gmail.com",
        scheduleBookPhone: "+46735362254",
        items: events,
      },
      sv: {
        scheduleTitle: sv.Schedule.title,
        scheduleUnderTitle: sv.Schedule.undertitle,
        scheduleBookTitle: sv.Schedule.bookTitle,
        scheduleBookDesc: sv.Schedule.bookDesc,
        scheduleBookEmail: "ecm.schoeffler@gmail.com",
        scheduleBookPhone: "+46735362254",
        items: events.map((event, index) => {
          const eventData = scheduleEvents[index];
          const svMonth = sv.Schedule[
            eventData.startDate.monthKey as keyof typeof sv.Schedule
          ] as string;
          const svDesc = sv.Schedule[
            eventData.descriptionKey as keyof typeof sv.Schedule
          ] as string;
          return {
            ...event,
            id: eventIds[index], // Keep same UUID
            description: svDesc,
            startDate: {
              ...event.startDate,
              month: svMonth,
            },
          };
        }),
      },
      fr: {
        scheduleTitle: fr.Schedule.title,
        scheduleUnderTitle: fr.Schedule.undertitle,
        scheduleBookTitle: fr.Schedule.bookTitle,
        scheduleBookDesc: fr.Schedule.bookDesc,
        scheduleBookEmail: "ecm.schoeffler@gmail.com",
        scheduleBookPhone: "+46735362254",
        items: events.map((event, index) => {
          const eventData = scheduleEvents[index];
          const frMonth = fr.Schedule[
            eventData.startDate.monthKey as keyof typeof fr.Schedule
          ] as string;
          const frDesc = fr.Schedule[
            eventData.descriptionKey as keyof typeof fr.Schedule
          ] as string;
          return {
            ...event,
            id: eventIds[index], // Keep same UUID
            description: frDesc,
            startDate: {
              ...event.startDate,
              month: frMonth,
            },
          };
        }),
      },
    };

    await prisma.content.upsert({
      where: { sectionId: "schedule" },
      update: { data: scheduleData },
      create: { sectionId: "schedule", data: scheduleData },
    });
    console.log("✅ Schedule section seeded");

    // 3. Media section
    console.log("📝 Seeding Media section...");

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

    // Generate UUIDs for music items
    const musicIds = spotifyData.map(() => randomUUID());

    const music = spotifyData.map((spotify, index) => ({
      id: musicIds[index],
      spotifyUrl: extractSpotifyUrl(spotify.embedUrl),
      title: null as string | null,
    }));

    // Gallery är tom för nu (kommer från Cloudinary)
    const gallery: ContentData[] = [];

    const mediaData = {
      // Delade listor på toppnivån
      gallery,
      music,
      videos,
      // Språk-specifik data
      en: {
        mediaTitle: en.Media.title,
        mediaSubtitle: en.Media.undertitle,
        videoSectionTitle: en.Media.videosTitle,
        musicSectionTitle: en.Media.musicTitle,
        gallerySectionTitle: en.Media.galleryTitle,
      },
      sv: {
        mediaTitle: sv.Media.title,
        mediaSubtitle: sv.Media.undertitle,
        videoSectionTitle: sv.Media.videosTitle,
        musicSectionTitle: sv.Media.musicTitle,
        gallerySectionTitle: sv.Media.galleryTitle || en.Media.galleryTitle,
      },
      fr: {
        mediaTitle: fr.Media.title,
        mediaSubtitle: fr.Media.undertitle,
        videoSectionTitle: fr.Media.videosTitle,
        musicSectionTitle: fr.Media.musicTitle,
        gallerySectionTitle: fr.Media.galleryTitle,
      },
    };

    await prisma.content.upsert({
      where: { sectionId: "media" },
      update: { data: mediaData },
      create: { sectionId: "media", data: mediaData },
    });
    console.log("✅ Media section seeded");

    // 4. About section
    console.log("📝 Seeding About section...");
    const aboutSharedFields = {
      aboutImage: getCloudinaryUrl("/eric-about.jpg", "hero"),
    };

    const aboutData = {
      ...aboutSharedFields, // Delade fält på toppnivån
      en: {
        aboutTitle: en.About.title,
        aboutText: [
          en.About.para1,
          en.About.para2,
          en.About.para3,
          en.About.para4,
        ].join("\n\n"),
      },
      sv: {
        aboutTitle: sv.About.title,
        aboutText: [
          sv.About.para1,
          sv.About.para2,
          sv.About.para3,
          sv.About.para4,
        ].join("\n\n"),
      },
      fr: {
        aboutTitle: fr.About.title,
        aboutText: [
          fr.About.para1,
          fr.About.para2,
          fr.About.para3,
          fr.About.para4,
        ].join("\n\n"),
      },
    };

    await prisma.content.upsert({
      where: { sectionId: "about" },
      update: { data: aboutData },
      create: { sectionId: "about", data: aboutData },
    });
    console.log("✅ About section seeded");

    // 5. Contact section
    console.log("📝 Seeding Contact section...");
    const contactData = {
      en: {
        contactText: en.Hero.description,
      },
      sv: {
        contactText: sv.Hero.description,
      },
      fr: {
        contactText: fr.Hero.description,
      },
    };

    await prisma.content.upsert({
      where: { sectionId: "contact" },
      update: { data: contactData },
      create: { sectionId: "contact", data: contactData },
    });
    console.log("✅ Contact section seeded");

    console.log("🎉 Content seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding content:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seedContent().catch((error) => {
  console.error(error);
  process.exit(1);
});
