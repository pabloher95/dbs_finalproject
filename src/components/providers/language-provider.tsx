"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Language } from "@/lib/i18n";
import { isLanguage } from "@/lib/i18n";

const LANGUAGE_COOKIE = "smallbiz-language";
const LANGUAGE_STORAGE_KEY = "smallbiz.language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function persistLanguage(language: Language) {
  document.documentElement.lang = language;
  document.cookie = `${LANGUAGE_COOKIE}=${language}; path=/; max-age=31536000; samesite=lax`;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // ignore storage failures
  }
}

export function LanguageProvider({
  initialLanguage,
  children
}: Readonly<{ initialLanguage: Language; children: ReactNode }>) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (isLanguage(stored) && stored !== language) {
        setLanguageState(stored);
        persistLanguage(stored);
        return;
      }
    } catch {
      // ignore storage failures
    }

    persistLanguage(language);
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage(nextLanguage) {
        setLanguageState(nextLanguage);
        persistLanguage(nextLanguage);
      }
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }
  return context;
}
