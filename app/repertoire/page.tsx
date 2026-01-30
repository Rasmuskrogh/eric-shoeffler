import { cookies } from "next/headers";
import { getContent } from "@/lib/getContent";
import RepertoireClient from "@/components/pages/RepertoireClient";

export default async function RepertoirePage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("language")?.value || "sv";
  const repertoireData = await getContent("repertoire", locale);

  return <RepertoireClient repertoireData={repertoireData} />;
}
