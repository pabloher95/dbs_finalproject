"use client";

import { usePathname } from "next/navigation";
import { appNav } from "@/lib/data/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { commandBarCopy, workspaceCopy } from "@/lib/i18n";

function activeLabel(pathname: string | null, language: "en" | "es") {
  const copy = workspaceCopy(language);
  if (!pathname) return copy.nav[0]?.label ?? copy.home;
  const match = appNav.find((item) =>
    item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`)
  );
  if (!match) return copy.home;
  const translated = copy.nav[appNav.indexOf(match)]?.label;
  return translated ?? match.label;
}

export function CommandBar({
  businessName,
  source
}: Readonly<{
  businessName: string;
  source: "memory" | "supabase";
}>) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const copy = commandBarCopy(language);

  const label = activeLabel(pathname, language);

  return (
    <div className="command-bar">
      <div className="flex min-w-0 items-center gap-4">
        <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-[var(--vermilion)]" />
        <div className="min-w-0">
          <p className="marginalia">{businessName}</p>
          <p className="truncate font-display text-xl leading-none tracking-tight text-[var(--ink)]">
            {label}
          </p>
        </div>
      </div>
      <div className="hidden items-center gap-4 md:flex">
        <span className="marginalia">{source === "supabase" ? copy.supabase : copy.localDemo}</span>
      </div>
    </div>
  );
}
