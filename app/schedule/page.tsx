import { cookies } from "next/headers";
import { getContent } from "@/lib/getContent";
import ScheduleClient from "@/components/pages/ScheduleClient";

export default async function AgendaPage() {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get("language")?.value || "sv";
    const scheduleData = await getContent("schedule", locale);

    return <ScheduleClient scheduleData={scheduleData} locale={locale} />;
  } catch (error) {
    console.error("[SchedulePage] Error loading schedule data:", error);
    // Return a fallback UI if there's an error
    try {
      const cookieStore = await cookies();
      const locale = cookieStore.get("language")?.value || "sv";
      return <ScheduleClient scheduleData={null} locale={locale} />;
    } catch {
      return <ScheduleClient scheduleData={null} locale="sv" />;
    }
  }
}
