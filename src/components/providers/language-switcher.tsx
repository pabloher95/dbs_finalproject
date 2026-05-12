"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { getLanguageName, supportedLanguages, type Language } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-[rgba(19,36,58,0.12)] bg-[rgba(255,255,255,0.56)] px-3 py-2 text-sm backdrop-blur">
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted)]">
        {language === "es" ? "Idioma" : "Language"}
      </span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        className="bg-transparent text-sm outline-none"
        aria-label={language === "es" ? "Idioma" : "Language"}
      >
        {supportedLanguages.map((item) => (
          <option key={item} value={item}>
            {getLanguageName(item)}
          </option>
        ))}
      </select>
    </label>
  );
}
