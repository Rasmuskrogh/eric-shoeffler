import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const cookieStore = await cookies();
  const locale = cookieStore.get("language")?.value || "sv";

  return {
    locale,
    messages: (
      await import(`../../components/LanguageSwitcher/messages/${locale}.json`)
    ).default,
  };
});
