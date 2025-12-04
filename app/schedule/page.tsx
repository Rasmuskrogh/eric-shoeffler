import { cookies } from "next/headers";
import { getContent } from "@/lib/getContent";
import ScheduleClient from "@/components/pages/ScheduleClient";

export default async function AgendaPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("language")?.value || "sv";
  const scheduleData = await getContent("schedule", locale);

  return <ScheduleClient scheduleData={scheduleData} locale={locale} />;
}
