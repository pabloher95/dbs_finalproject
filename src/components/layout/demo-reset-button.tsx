"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Toast } from "@/components/ui/surfaces";
import { commandBarCopy } from "@/lib/i18n";
import type { WorkspaceMode } from "@/lib/server/workspace-mode";

type Tone = "info" | "success" | "warn" | "error";

export function DemoModeToggle({ workspaceMode }: Readonly<{ workspaceMode: WorkspaceMode }>) {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = commandBarCopy(language);
  const [toast, setToast] = useState<{ message: string; tone: Tone } | null>(null);
  const [isPending, startTransition] = useTransition();

  async function setWorkspaceMode(nextMode: WorkspaceMode) {
    const response = await fetch("/api/business", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action: "set-workspace-mode", workspaceMode: nextMode })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setToast({ message: payload?.error ?? copy.workspaceModeError, tone: "error" });
      return;
    }

    setToast({ message: copy.workspaceModeUpdated, tone: "success" });
    startTransition(() => {
      router.refresh();
    });
  }

  const demoEnabled = workspaceMode === "demo";

  return (
    <>
      <div className="flex items-center gap-3">
        <span className="marginalia hidden md:inline">{copy.demoMode}</span>
        <button
          type="button"
          role="switch"
          aria-checked={demoEnabled}
          aria-label={copy.demoMode}
          className={`demo-mode-switch ${demoEnabled ? "is-on" : "is-off"}`}
          onClick={() => void setWorkspaceMode(demoEnabled ? "live" : "demo")}
          disabled={isPending}
        >
          <span className="demo-mode-switch__track" aria-hidden="true">
            <span className="demo-mode-switch__thumb" />
          </span>
          <span className="demo-mode-switch__label">
            {isPending ? copy.switchingMode : demoEnabled ? copy.demoOn : copy.demoOff}
          </span>
        </button>
      </div>
      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} /> : null}
    </>
  );
}
