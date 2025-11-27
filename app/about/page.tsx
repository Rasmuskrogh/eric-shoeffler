import { cookies } from "next/headers";
import { getContent } from "@/lib/getContent";
import AboutClient from "@/components/pages/AboutClient";

export default async function AboutPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("language")?.value || "sv";
  const aboutData = await getContent("about", locale);

  return <AboutClient aboutData={aboutData} />;
}
