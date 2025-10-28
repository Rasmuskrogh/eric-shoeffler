import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageName = searchParams.get("image");
  const width = searchParams.get("width") || "1200";
  const isSmallScreen = searchParams.get("small") === "true";

  if (!imageName) {
    return NextResponse.json(
      { error: "Image name is required" },
      { status: 400 }
    );
  }

  const cloudinaryAccount = process.env.CLOUDINARY_ACCOUNT;

  if (!cloudinaryAccount) {
    return NextResponse.json(
      { error: "Cloudinary account not configured" },
      { status: 500 }
    );
  }

  // Determine the appropriate width based on screen size
  const imageWidth = isSmallScreen ? "800" : width;

  // Build the Cloudinary URL
  const cloudinaryUrl = `https://res.cloudinary.com/${cloudinaryAccount}/image/upload/w_${imageWidth},h_auto,f_auto,q_auto/hero/${imageName}`;

  return NextResponse.json({ url: cloudinaryUrl });
}
