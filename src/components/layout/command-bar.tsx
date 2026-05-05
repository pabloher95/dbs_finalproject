"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { appNav } from "@/lib/data/navigation";

function activeLabel(pathname: string | null) {
  if (!pathname) return "Home";
  const match = appNav.find((item) =>
    item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`)
  );
  return match?.label ?? "Home";
}

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function CommandBar({ businessName }: Readonly<{ businessName: string }>) {
  const pathname = usePathname();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const label = activeLabel(pathname);

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
        <span className="marginalia">{formatTime(now ?? new Date())}</span>
        <span className="h-3 w-px bg-[var(--line-strong)]" />
        <span className="marginalia">{now ? "synced" : "syncing"}</span>
      </div>
    </div>
  );
}
