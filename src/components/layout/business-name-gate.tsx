"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { businessNameCopy } from "@/lib/i18n";

const DEFAULT_BUSINESS_NAME = "Your Business";
const STORAGE_KEY = "smallbiz.business-name.dismissed";

export function BusinessNameGate({
  businessName,
  children
}: Readonly<{
  businessName: string;
  children: ReactNode;
}>) {
  const trimmedName = businessName.trim();
  const needsSetup = !trimmedName || trimmedName === DEFAULT_BUSINESS_NAME;
  const [name, setName] = useState(needsSetup ? "" : trimmedName);
  const [dismissed, setDismissed] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { language } = useLanguage();
  const copy = businessNameCopy(language);

  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (!needsSetup || dismissed) {
    return children;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = name.trim();

    if (!nextName) {
      setError(copy.enterName);
      return;
    }

    setError("");

    const response = await fetch("/api/business", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: nextName })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error ?? copy.saveError);
      return;
    }

    startTransition(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore storage failures
      }
      setDismissed(true);
      router.refresh();
    });
  }

  return (
    <>
      {children}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--paper)]/85 px-4 py-8 backdrop-blur-sm">
        <div className="w-full max-w-lg border border-[var(--ink)] bg-[var(--paper-bright)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.16)] md:p-8">
          <p className="eyebrow text-[var(--vermilion)]">{copy.firstStep}</p>
          <h2 className="editorial mt-3 text-[clamp(2rem,4vw,3rem)]">{copy.title}</h2>
          <p className="mt-4 text-sm leading-6 text-[var(--ink-soft)]">
            {copy.description}
          </p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <label className="block">
              <span className="marginalia">{copy.label}</span>
              <input
                autoFocus
                className="mt-2 w-full border border-[var(--line-strong)] bg-[var(--paper)] px-4 py-3 text-[1rem] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-soft)] focus:border-[var(--vermilion)]"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={copy.placeholder}
                maxLength={80}
              />
            </label>

            {error ? <p className="text-sm text-[var(--vermilion)]">{error}</p> : null}

            <button type="submit" className="btn btn-vermilion" disabled={isPending}>
              {isPending ? copy.saving : copy.saveName}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
