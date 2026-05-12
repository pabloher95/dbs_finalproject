"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/components/providers/language-provider";
import type { Language } from "@/lib/i18n";

export function AppProviders({
  initialLanguage,
  children
}: Readonly<{ initialLanguage: Language; children: ReactNode }>) {
  return <LanguageProvider initialLanguage={initialLanguage}>{children}</LanguageProvider>;
}
