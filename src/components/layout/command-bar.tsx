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
      <div className="flex min-w-0 items-center gap-3">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-[var(--muted-strong)]">
          {businessName}
        </span>
        <span className="hidden text-[var(--line-strong)] md:inline">/</span>
        <span className="hidden font-display italic text-lg md:inline">{label}</span>
      </div>
      {now ? (
        <span className="hidden font-mono text-[0.66rem] uppercase tracking-[0.28em] text-[var(--muted-strong)] md:inline">
          {formatTime(now)}
        </span>
      ) : null}
    </div>
  );
}
