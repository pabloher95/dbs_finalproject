"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { businessNameCopy } from "@/lib/i18n";

export function BusinessRenameButton({
  businessName
}: Readonly<{
  businessName: string;
}>) {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = businessNameCopy(language);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(businessName.trim());
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setName(businessName.trim());
      setError("");
    }
  }, [businessName, open]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setError("");
      }
    }

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }

    return undefined;
  }, [open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = name.trim();

    if (!nextName) {
      setError(copy.enterName);
      return;
    }

    if (nextName === businessName.trim()) {
      setOpen(false);
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
      router.refresh();
      setOpen(false);
    });
  }

  return (
    <>
      <button type="button" className="btn btn-soft px-3 py-2 text-[0.7rem]" onClick={() => setOpen(true)}>
        {copy.renameCompany}
      </button>

      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--paper)]/82 px-4 py-8 backdrop-blur-sm"
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  setOpen(false);
                  setError("");
                }
              }}
            >
              <div className="w-full max-w-lg border border-[var(--ink)] bg-[var(--paper-bright)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.16)] md:p-8">
                <p className="eyebrow text-[var(--vermilion)]">{copy.firstStep}</p>
                <h2 className="editorial mt-3 text-[clamp(2rem,4vw,3rem)]">{copy.title}</h2>
                <p className="mt-4 text-sm leading-6 text-[var(--ink-soft)]">{copy.description}</p>

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

                  <div className="flex flex-wrap gap-3">
                    <button type="submit" className="btn btn-vermilion" disabled={isPending}>
                      {isPending ? copy.saving : copy.saveName}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        setOpen(false);
                        setError("");
                      }}
                      disabled={isPending}
                    >
                      {copy.cancel}
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
