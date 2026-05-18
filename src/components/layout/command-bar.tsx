"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
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
  const [now, setNow] = useState<Date | null>(null);
  const copy = commandBarCopy(language);

  useEffect(() => {
    setNow(new Date());
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

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
        <span className="h-3 w-px bg-[var(--line-strong)]" />
        <span className="marginalia">{formatTime(now ?? new Date())}</span>
        <span className="h-3 w-px bg-[var(--line-strong)]" />
        <span className="marginalia">{now ? copy.synced : copy.syncing}</span>
      </div>
    </div>
  );
}
