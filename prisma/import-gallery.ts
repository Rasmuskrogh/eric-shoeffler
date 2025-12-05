// MUST set TLS rejection BEFORE any imports that might use it
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
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

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  bytes: number;
  width: number;
  height: number;
  context?: {
    alt?: string;
  };
}

async function importGalleryImages() {
  try {
    console.log("Starting gallery import from Cloudinary...");

    // Check Cloudinary config
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Missing Cloudinary configuration in environment variables");
      return;
    }

    // Get all images from the eric-schoeffler/gallery folder
    let result;
    try {
      result = await cloudinary.search
        .expression("folder:eric-schoeffler/gallery")
        .sort_by("public_id", "asc")
        .max_results(500) // Increase limit to get all images
        .execute();
    } catch (searchError) {
      console.log("Folder search failed, trying broader search:", searchError);
      // Fallback: search for any images with "eric-schoeffler/gallery" in the public_id
      result = await cloudinary.search
        .expression("public_id:eric-schoeffler/gallery/*")
        .sort_by("public_id", "asc")
        .max_results(500)
        .execute();
    }

    console.log(`Found ${result.resources?.length || 0} images in Cloudinary`);

    if (!result.resources || result.resources.length === 0) {
      console.log("No images found in Cloudinary gallery folder");
      return;
    }

    // Transform Cloudinary resources to gallery items
    const galleryItems: ContentData[] = result.resources.map(
      (resource: CloudinaryResource) => {
        // Use the full URL (not optimized) for database storage
        // Optimization can be done on the frontend if needed
        const url = resource.secure_url;
        
        // Extract alt text from context or use filename
        const alt =
          resource.context?.alt ||
          resource.public_id.split("/").pop()?.replace(/\.[^/.]+$/, "") ||
          "Gallery image";

        return {
          id: randomUUID(),
          url: url,
          alt: alt,
          width: resource.width,
          height: resource.height,
        };
      }
    );

    console.log(`Converted ${galleryItems.length} images to gallery items`);

    // Fetch existing media content
    const mediaContent = await prisma.content.findUnique({
      where: { sectionId: "media" },
    });

    if (!mediaContent || !mediaContent.data) {
      console.error("Media content not found in database");
      return;
    }

    const existingData = mediaContent.data as Record<string, unknown>;

    // Update only the gallery array, preserve all other data
    const updatedData = {
      ...existingData,
      gallery: galleryItems,
    };

    // Save to database
    await prisma.content.update({
      where: { sectionId: "media" },
      data: {
        data: updatedData,
      },
    });

    console.log(
      `Successfully imported ${galleryItems.length} images to gallery in database`
    );
    console.log("Gallery import completed!");
  } catch (error) {
    console.error("Error importing gallery images:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

importGalleryImages()
  .catch((error) => {
    console.error("Gallery import failed:", error);
    process.exit(1);
  });

