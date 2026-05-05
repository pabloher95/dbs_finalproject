"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent, type ReactNode } from "react";

const DEFAULT_BUSINESS_NAME = "Your Business";

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
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!needsSetup) {
    return children;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = name.trim();

    if (!nextName) {
      setError("Enter a company name.");
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
      setError(payload?.error ?? "Unable to save the company name.");
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      {children}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--paper)]/85 px-4 py-8 backdrop-blur-sm">
        <div className="w-full max-w-lg border border-[var(--ink)] bg-[var(--paper-bright)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.16)] md:p-8">
          <p className="eyebrow text-[var(--vermilion)]">First step</p>
          <h2 className="editorial mt-3 text-[clamp(2rem,4vw,3rem)]">Name your studio</h2>
          <p className="mt-4 text-sm leading-6 text-[var(--ink-soft)]">
            This name appears in the workspace header and in your dashboard reading view.
          </p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <label className="block">
              <span className="marginalia">Company name</span>
              <input
                autoFocus
                className="mt-2 w-full border border-[var(--line-strong)] bg-[var(--paper)] px-4 py-3 text-[1rem] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-soft)] focus:border-[var(--vermilion)]"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Northline Studio"
                maxLength={80}
              />
            </label>

            {error ? <p className="text-sm text-[var(--vermilion)]">{error}</p> : null}

            <button type="submit" className="btn btn-vermilion" disabled={isPending}>
              {isPending ? "Saving..." : "Save name"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
