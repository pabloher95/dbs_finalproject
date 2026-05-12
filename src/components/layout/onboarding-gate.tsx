"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { onboardingCopy } from "@/lib/i18n";

const STORAGE_KEY = "smallbiz.onboarding.dismissed";

export function OnboardingGate({
  children,
  defaultOpen = true
}: Readonly<{
  children: React.ReactNode;
  defaultOpen?: boolean;
}>) {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const copy = onboardingCopy(language);

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
        <div className="reveal mb-8 border-y border-[var(--ink)] bg-[var(--paper-bright)]">
          <div className="grid gap-6 px-6 py-6 md:grid-cols-12 md:items-center md:px-8 md:py-7">
            <div className="md:col-span-9">
              <p className="eyebrow text-[var(--vermilion)]">{copy.eyebrow}</p>
              <p className="font-display mt-2 text-3xl leading-tight tracking-tight text-[var(--ink)] md:text-4xl">
                {copy.title}
              </p>
              <p className="mt-3 max-w-xl text-[0.95rem] leading-6 text-[var(--ink-soft)]">
                {copy.description}
              </p>
            </div>
            <div className="md:col-span-3 flex flex-wrap items-center gap-2 md:justify-end">
              <Link href={"/import" as Route} className="btn btn-vermilion" onClick={dismiss}>
                {copy.beginIntake} →
              </Link>
              <button type="button" onClick={dismiss} className="link-rule">
                {copy.skip}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {children}
    </>
  );
}
