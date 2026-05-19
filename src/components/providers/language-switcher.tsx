"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { getLanguageName, supportedLanguages, type Language } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  return (
    <label className="inline-flex items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--paper-bright)] px-4 py-2.5 text-sm">
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted)]">
        {language === "es" ? "Idioma" : "Language"}
      </span>
      <span className="relative inline-flex items-center">
        <select
          value={language}
          onChange={(event) => {
            const nextLanguage = event.target.value as Language;
            setLanguage(nextLanguage);
            router.refresh();
          }}
          className="appearance-none bg-transparent pr-6 font-medium text-[var(--ink)] outline-none"
          aria-label={language === "es" ? "Idioma" : "Language"}
        >
          {supportedLanguages.map((item) => (
            <option key={item} value={item}>
              {getLanguageName(item)}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[0.7rem] text-[var(--muted-strong)]">
          ▾
        </span>
      </span>
    </label>
  );
}
