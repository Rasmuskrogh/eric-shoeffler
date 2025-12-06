"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function changeLanguage(languageCode: string) {
  const cookieStore = await cookies();

  // Uppdatera cookie med det valda språket
  cookieStore.set("language", languageCode, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  // Revalidate den aktuella sidan
  revalidatePath("/");
}
