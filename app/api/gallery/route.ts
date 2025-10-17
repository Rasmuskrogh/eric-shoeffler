import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    console.log("Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
      api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
    });

    // Get all images from the eric-schoeffler/gallery folder
    let result;
    try {
      result = await cloudinary.search
        .expression("folder:eric-schoeffler/gallery")
        .sort_by("public_id", "asc")
        .max_results(50)
        .execute();
    } catch (searchError) {
      console.log("Folder search failed, trying broader search:", searchError);
      // Fallback: search for any images with "eric-schoeffler" in the public_id
      result = await cloudinary.search
        .expression("public_id:eric-schoeffler/*")
        .sort_by("public_id", "asc")
        .max_results(50)
        .execute();
    }

    console.log("Cloudinary search result:", {
      total_count: result.total_count,
      resources_count: result.resources?.length || 0,
      resources: result.resources?.map((r: any) => r.public_id) || [],
    });

    // Log large images that will be optimized
    const largeImages = result.resources.filter((r: any) => r.bytes > 2000000);
    if (largeImages.length > 0) {
      console.log(
        "Large images that will be optimized:",
        largeImages.map((img: any) => ({
          id: img.public_id,
          size: `${(img.bytes / 1000000).toFixed(2)}MB`,
        }))
      );
    }

    // Transform the results to include only what we need
    const galleryImages = result.resources.map((resource: any) => {
      // Check if image is larger than 2MB (2,000,000 bytes)
      const isLargeImage = resource.bytes > 2000000;

      // Create optimized URL for large images
      let optimizedUrl = resource.secure_url;
      if (isLargeImage) {
        // For large images, add quality parameter to reduce file size
        optimizedUrl = cloudinary.url(resource.public_id, {
          quality: "auto:low",
          fetch_format: "auto",
        });
      }

      return {
        id: resource.public_id,
        url: optimizedUrl,
        alt: resource.context?.alt || resource.public_id.split("/").pop(),
        width: Math.min(resource.width, 800),
        height: Math.min(resource.height, 600),
        originalSize: resource.bytes,
        isOptimized: isLargeImage,
      };
    });

    return NextResponse.json(galleryImages);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 }
    );
  }
}
