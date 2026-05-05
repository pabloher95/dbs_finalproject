"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Pill, SectionHeading, Toast } from "@/components/ui/surfaces";
import {
  parseOrderImport,
  parseProductImport,
  type ImportPreview,
  type ImportTarget
} from "@/lib/import/parser";

const examples: Record<ImportTarget, string> = {
  products: `sku,name,category,unit,yield_quantity,material_name,material_unit,material_quantity\nCANDLE-01,Signature Candle,home goods,each,12,Soy Wax,g,1200\nCANDLE-01,Signature Candle,home goods,each,12,Fragrance Oil,g,120\nGIFT-SET,Gift Set,bundles,each,8,Gift Box Insert,each,8`,
  orders: `order_number,client_name,due_date,status,product_sku,quantity\nORD-2001,Common Goods Market,2026-04-29,open,CANDLE-01,48\nORD-2001,Common Goods Market,2026-04-29,open,GIFT-SET,24`
};

const storageKeys = {
  target: "smallbiz.import.target",
  csv: "smallbiz.import.csv",
  result: "smallbiz.import.result"
} as const;

function statusPill(status: ImportPreview["rowReports"][number]["status"]) {
  if (status === "created") return <Pill tone="moss">Ready</Pill>;
  if (status === "skipped") return <Pill tone="amber">Skipped</Pill>;
  return <Pill tone="flame">Error</Pill>;
}

function PreviewTable({ preview }: Readonly<{ preview: ImportPreview }>) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <SummaryCell label="Created" value={String(preview.createdRecords)} tone="moss" />
        <SummaryCell label="Skipped" value={String(preview.skippedRows.length)} tone="amber" />
        <SummaryCell label="Errors" value={String(preview.errors.length)} tone="flame" />
      </div>
      <div className="overflow-hidden rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)]">
        <table className="console-table">
          <thead>
            <tr>
              <th>Row</th>
              <th>State</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {preview.rowReports.map((row) => (
              <tr key={`${row.rowNumber}-${row.message}`}>
                <td className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted-strong)]">
                  {String(row.rowNumber).padStart(2, "0")}
                </td>
                <td>{statusPill(row.status)}</td>
                <td className="text-[var(--muted-strong)]">{row.message}</td>
              </tr>
            ))}
            {!preview.rowReports.length ? (
              <tr>
                <td colSpan={3} className="text-center text-sm text-[var(--muted)]">
                  Paste or drop a CSV above to preview row-level validation.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCell({
  label,
  value,
  tone
}: Readonly<{ label: string; value: string; tone: "moss" | "amber" | "flame" }>) {
  const toneClass: Record<typeof tone, string> = {
    moss: "border-[rgba(47,69,32,0.3)] bg-[rgba(90,122,60,0.10)] text-[var(--moss-deep)]",
    amber: "border-[rgba(106,71,8,0.3)] bg-[rgba(224,165,47,0.12)] text-[#5a3a06]",
    flame: "border-[rgba(183,51,18,0.45)] bg-[rgba(255,79,31,0.10)] text-[var(--flame-deep)]"
  };
  return (
    <div className={`rounded-2xl border ${toneClass[tone]} px-4 py-3`}>
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.32em]">{label}</p>
      <p className="mt-1 font-display text-3xl text-[var(--ink)]">{value}</p>
    </div>
  );
}

export function ImportExperience() {
  const router = useRouter();
  const [target, setTarget] = useState<ImportTarget>("products");
  const [csv, setCsv] = useState(examples.products);
  const [result, setResult] = useState<ImportPreview | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: "info" | "success" | "warn" | "error" } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const preview = useMemo(
    () => (target === "products" ? parseProductImport(csv) : parseOrderImport(csv)),
    [csv, target]
  );

  useEffect(() => {
    try {
      const savedTarget = window.sessionStorage.getItem(storageKeys.target);
      const savedCsv = window.sessionStorage.getItem(storageKeys.csv);
      const savedResult = window.sessionStorage.getItem(storageKeys.result);
      if (savedTarget === "products" || savedTarget === "orders") setTarget(savedTarget);
      if (savedCsv) setCsv(savedCsv);
      if (savedResult) setResult(JSON.parse(savedResult) as ImportPreview);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(storageKeys.target, target);
      window.sessionStorage.setItem(storageKeys.csv, csv);
      if (result) window.sessionStorage.setItem(storageKeys.result, JSON.stringify(result));
    } catch {
      /* ignore */
    }
  }, [target, csv, result]);

  async function loadFile(file: File) {
    const text = await file.text();
    setCsv(text);
    setToast({ message: `Loaded ${file.name}. Review preview before importing.`, tone: "info" });
  }

  async function importRows() {
    setBusy(true);
    setToast({ message: "Importing rows…", tone: "info" });
    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, csv })
      });
      const data = (await response.json()) as { preview?: ImportPreview; error?: string };
      if (!response.ok || !data.preview) {
        setToast({ message: data.error ?? "Unable to import data.", tone: "error" });
        return;
      }
      setResult(data.preview);
      setToast({ message: `Imported ${data.preview.createdRecords} rows.`, tone: "success" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="p-6">
        <SectionHeading
          eyebrow="Versioned templates"
          title="Validate before you commit"
          description="Pick a template, drop a CSV or paste rows, and see exactly what will land in the workspace."
        />
        <div className="mt-6 flex flex-wrap gap-2">
          {(["products", "orders"] as const).map((option) => {
            const active = target === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setTarget(option);
                  setCsv(examples[option]);
                  setToast({ message: `Loaded ${option} template example.`, tone: "info" });
                }}
                className={
                  active
                    ? "btn btn-ink"
                    : "btn btn-ghost"
                }
              >
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em]">
                  {option === "products" ? "Products v1" : "Orders v1"}
                </span>
              </button>
            );
          })}
          <Link href={`/api/templates/${target}`} className="btn btn-soft">
            Download template
          </Link>
        </div>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            const file = event.dataTransfer.files.item(0);
            if (file) void loadFile(file);
          }}
          className={`mt-5 cursor-pointer rounded-2xl border-2 border-dashed px-5 py-4 text-center transition ${
            isDragging
            ? "border-[var(--flame)] bg-[rgba(239,107,88,0.08)]"
              : "border-[var(--line-strong)] bg-[rgba(255,255,255,0.72)]"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void loadFile(file);
              event.currentTarget.value = "";
            }}
          />
          <p className="font-display text-lg text-[var(--ink)]">Drop a CSV or click to upload</p>
          <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
            Drafts are kept for this browser session
          </p>
        </div>
        <textarea
          value={csv}
          onChange={(event) => setCsv(event.target.value)}
          spellCheck={false}
          className="field mt-4 min-h-[260px] font-mono text-[0.78rem] leading-5"
        />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-[var(--line)] pt-4">
          <button type="button" className="btn btn-flame" disabled={busy} onClick={() => void importRows()}>
            {busy ? "Importing…" : "Import to workspace"}
          </button>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
            {preview.rowReports.length} row{preview.rowReports.length === 1 ? "" : "s"} previewed
          </span>
        </div>
      </Card>
      <Card className="p-6">
        <SectionHeading
          eyebrow="Preview"
          title="Row-level validation report"
          description="See what is ready to load, what was skipped, and what needs correction before committing."
        />
        <div className="mt-6">
          <PreviewTable preview={result ?? preview} />
        </div>
      </Card>
      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} /> : null}
    </section>
  );
}
