"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eyebrow } from "@/components/ui/surfaces";

const STORAGE_KEY = "smallbiz.onboarding.dismissed";

export function OnboardingGate({
  children,
  defaultOpen = true
}: Readonly<{
  children: React.ReactNode;
  defaultOpen?: boolean;
}>) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!defaultOpen) return;
    try {
      const dismissed = window.sessionStorage.getItem(STORAGE_KEY) === "1";
      setOpen(!dismissed);
    } catch {
      setOpen(true);
    }
  }, [defaultOpen]);

  function dismiss() {
    setOpen(false);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore storage failures
    }
  }

  return (
    <>
      {open ? (
        <div className="reveal mb-5 overflow-hidden rounded-[20px] border border-[var(--line)] bg-gradient-to-br from-[var(--paper-bright)] to-[var(--paper-soft)]">
          <div className="grid gap-5 p-5 md:grid-cols-[auto_1fr_auto] md:items-center md:p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--ink)] font-display italic text-2xl text-[var(--paper-bright)]">
              SI
            </div>
            <div>
              <Eyebrow tone="flame">Welcome</Eyebrow>
              <p className="mt-1 font-display italic text-2xl leading-tight md:text-3xl">
                Three steps to your first purchasing plan.
              </p>
              <p className="mt-2 max-w-xl text-[0.9rem] leading-6 text-[var(--muted-strong)]">
                Start with the catalog or import sample data, capture an order, then preview today&apos;s
                buy list. The console keeps step state fresh as you go.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <Link href="/import" className="btn btn-flame" onClick={dismiss}>
                Begin intake
              </Link>
              <button type="button" onClick={dismiss} className="btn btn-ghost">
                Skip tour
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {children}
    </>
  );
}
