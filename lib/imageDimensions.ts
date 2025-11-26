/**
 * Hämtar bilddimensioner från en URL
 * Fungerar för både Cloudinary-URLs och vanliga bild-URLs
 */
export async function getImageDimensions(
  imageUrl: string
): Promise<{ width: number; height: number } | null> {
  try {
    // För Cloudinary-URLs, extrahera dimensioner från URL eller använd API
    if (imageUrl.includes("cloudinary.com")) {
      // Cloudinary URL format: .../upload/w_800,h_600/... eller .../upload/...
      // Vi kan också använda Cloudinary API för att hämta info
      // För nu, ladda bilden och läs dimensionerna
    }

    // Ladda bilden och läs dimensionerna
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = imageUrl;
    });
  } catch (error) {
    console.error("Error getting image dimensions:", error);
    return null;
  }
}
