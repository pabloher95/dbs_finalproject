import { cookies, headers } from "next/headers";
import { isLanguage, type Language } from "@/lib/i18n";

export async function getRequestLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const cookieLanguage = cookieStore.get("smallbiz-language")?.value;
  if (isLanguage(cookieLanguage)) return cookieLanguage;

  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language")?.toLowerCase() ?? "";
  if (acceptLanguage.includes("es")) return "es";

  return "en";
}
