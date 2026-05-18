"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Toast } from "@/components/ui/surfaces";
import { commandBarCopy } from "@/lib/i18n";

type Tone = "info" | "success" | "warn" | "error";

export function DemoResetButton() {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = commandBarCopy(language);
  const [toast, setToast] = useState<{ message: string; tone: Tone } | null>(null);
  const [isPending, startTransition] = useTransition();

  async function restoreDemo() {
    if (!window.confirm(copy.restoreDemoConfirm)) {
      return;
    }

    const response = await fetch("/api/business", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action: "restore-demo" })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setToast({ message: payload?.error ?? copy.restoreDemoError, tone: "error" });
      return;
    }

    setToast({ message: copy.restoreDemoDone, tone: "success" });
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      <button type="button" className="btn btn-soft px-3 py-2 text-[0.7rem]" onClick={() => void restoreDemo()} disabled={isPending}>
        {isPending ? copy.restoringDemo : copy.restoreDemo}
      </button>
      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} /> : null}
    </>
  );
}
