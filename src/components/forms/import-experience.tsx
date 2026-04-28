"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, SectionHeading } from "@/components/ui/surfaces";
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

function PreviewTable({ preview }: Readonly<{ preview: ImportPreview }>) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Summary label="Created" value={String(preview.createdRecords)} />
        <Summary label="Skipped" value={String(preview.skippedRows.length)} />
        <Summary label="Errors" value={String(preview.errors.length)} />
      </div>
      <div className="overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-white/70">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--bg-strong)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Row</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Message</th>
            </tr>
          </thead>
          <tbody>
            {preview.rowReports.map((row) => (
              <tr key={row.rowNumber} className="border-t border-[var(--line)]">
                <td className="px-4 py-3">{row.rowNumber}</td>
                <td className="px-4 py-3 capitalize">{row.status}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{row.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Summary({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-[var(--font-display)] text-3xl">{value}</p>
    </div>
  );
}

export function ImportExperience() {
  const [target, setTarget] = useState<ImportTarget>("products");
  const [csv, setCsv] = useState(examples.products);

  const preview = useMemo(
    () => (target === "products" ? parseProductImport(csv) : parseOrderImport(csv)),
    [csv, target]
  );

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6">
        <SectionHeading
          eyebrow="CSV Import"
          title="Versioned import templates with preview"
          description="Use clear templates for products, formulas, and orders so you can catch problems before they affect the rest of the workflow."
        />
        <div className="mt-6 flex flex-wrap gap-3">
          {(["products", "orders"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setTarget(option);
                setCsv(examples[option]);
              }}
              className={cls(
                "rounded-full border px-4 py-2 text-sm transition",
                target === option
                  ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                  : "border-[var(--line)] bg-white/60 text-[var(--text)]"
              )}
            >
              {option === "products" ? "Products + Formulas v1" : "Orders v1"}
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-3 text-sm text-[var(--muted)]">
          <Link className="underline decoration-[var(--accent)] underline-offset-4" href={`/api/templates/${target}`}>
            Download {target} template
          </Link>
          <span>Paste CSV below to preview import results.</span>
        </div>
        <textarea
          value={csv}
          onChange={(event) => setCsv(event.target.value)}
          className="mt-6 min-h-[320px] w-full rounded-[1.5rem] border border-[var(--line)] bg-[#fffdf9] p-4 text-sm text-[var(--text)] shadow-inner outline-none focus:border-[var(--accent)]"
        />
      </Card>
      <Card className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6">
        <SectionHeading
          eyebrow="Preview"
          title="Row-level validation report"
          description="See what is ready to import, what was skipped, and what needs correction before you move on."
        />
        <div className="mt-6">
          <PreviewTable preview={preview} />
        </div>
      </Card>
    </section>
  );
}

function cls(...values: Array<string | false>) {
  return values.filter(Boolean).join(" ");
}
