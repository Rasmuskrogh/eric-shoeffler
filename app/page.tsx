import { cookies } from "next/headers";
import { getContent } from "@/lib/getContent";
import HomeClient from "@/components/pages/HomeClient";

export default async function Page() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("language")?.value || "sv";
  const homeData = await getContent("home", locale);
  const contactData = await getContent("contact", locale);

  return <HomeClient homeData={homeData} contactData={contactData} />;
}
