import { cookies } from "next/headers";
import { getContent } from "@/lib/getContent";
import MediaClient from "@/components/pages/MediaClient";

export default async function ListenPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("language")?.value || "sv";
  const mediaData = await getContent("media", locale);

  return <MediaClient mediaData={mediaData} />;
}
