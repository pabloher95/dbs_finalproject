"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { Card, SectionHeading, Toast } from "@/components/ui/surfaces";
import type { BusinessSnapshot } from "@/lib/domain/types";
import { importExperienceCopy, productStudioCopy } from "@/lib/i18n";

type Tone = "info" | "success" | "warn" | "error";

type FormulaDraft = {
  id: string;
  materialName: string;
  unit: string;
  quantity: string;
};

type ProductDraft = {
  id?: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  unitPrice: string;
  formula: FormulaDraft[];
};

function createFormulaRow(): FormulaDraft {
  return {
    id: crypto.randomUUID(),
    materialName: "",
    unit: "g",
    quantity: ""
  };
}

function createProductDraft(): ProductDraft {
  return {
    sku: "",
    name: "",
    category: "general",
    unit: "each",
    unitPrice: "0",
    formula: [createFormulaRow()]
  };
}

function toNumber(value: string) {
  return Number(value.trim());
}

function FormulaRowField({
  row,
  index,
  onChange,
  onRemove,
  canRemove,
  language
}: Readonly<{
  row: FormulaDraft;
  index: number;
  onChange: (next: FormulaDraft) => void;
  onRemove: () => void;
  canRemove: boolean;
  language: "en" | "es";
}>) {
  return (
    <div className="grid gap-2 rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,0.66)] p-3 md:grid-cols-[1.4fr_0.7fr_0.8fr_auto] md:items-end">
      <label className="grid gap-1">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
          {language === "es" ? "Material" : "Material"}
        </span>
        <input
          value={row.materialName}
          onChange={(event) => onChange({ ...row, materialName: event.target.value })}
          placeholder={language === "es" ? `Material ${index + 1}` : `Material ${index + 1}`}
          className="field"
        />
      </label>
      <label className="grid gap-1">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
          {language === "es" ? "Unidad" : "Unit"}
        </span>
        <input
          value={row.unit}
          onChange={(event) => onChange({ ...row, unit: event.target.value })}
          placeholder={language === "es" ? "g" : "g"}
          className="field"
        />
      </label>
      <label className="grid gap-1">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
          {language === "es" ? "Cantidad" : "Quantity"}
        </span>
        <input
          value={row.quantity}
          onChange={(event) => onChange({ ...row, quantity: event.target.value })}
          placeholder="100"
          className="field font-mono text-sm"
          inputMode="decimal"
        />
      </label>
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        className="btn btn-ghost md:justify-self-end"
      >
        {language === "es" ? "Quitar" : "Remove"}
      </button>
    </div>
  );
}

export function ImportExperience({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = importExperienceCopy(language);
  const productCopy = productStudioCopy(language);
  const [workspace, setWorkspace] = useState(snapshot);
  const [productDraft, setProductDraft] = useState<ProductDraft>(createProductDraft);
  const [toast, setToast] = useState<{ message: string; tone: Tone } | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  const productCount = String(workspace.products.length);
  const supplierCount = String(workspace.suppliers.length);
  const materialCount = String(workspace.materials.length);

  async function saveProduct() {
    const sku = productDraft.sku.trim();
    const name = productDraft.name.trim();
    const category = productDraft.category.trim();
    const unit = productDraft.unit.trim();
    const unitPrice = toNumber(productDraft.unitPrice);
    const formula = productDraft.formula
      .map((row) => ({
        materialName: row.materialName.trim(),
        unit: row.unit.trim(),
        quantity: toNumber(row.quantity)
      }))
      .filter((row) => row.materialName && row.unit && Number.isFinite(row.quantity) && row.quantity > 0);

    if (!sku || !name || !category || !unit) {
      setToast({ message: productCopy.enterRequired, tone: "warn" });
      return;
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      setToast({ message: productCopy.priceNegative, tone: "warn" });
      return;
    }
    if (!formula.length) {
      setToast({ message: productCopy.formulaRequired, tone: "warn" });
      return;
    }

    setSavingProduct(true);
    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: "products",
          draft: {
            id: productDraft.id,
            sku,
            name,
            category,
            unit,
            unitPrice,
            formula
          }
        })
      });
      const data = (await response.json()) as { snapshot?: BusinessSnapshot; error?: string };
      if (!response.ok || !data.snapshot) {
        setToast({ message: data.error ?? productCopy.saveError, tone: "error" });
        return;
      }

      setWorkspace(data.snapshot);
      setProductDraft(createProductDraft());
      setToast({ message: copy.productSaved, tone: "success" });
      router.refresh();
    } finally {
      setSavingProduct(false);
    }
  }

  return (
    <section className="space-y-6">
      <Card className="p-6">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
        <div className="mt-5 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[var(--muted-strong)]">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.32em]">
              {language === "es" ? "Productos" : "Products"}
            </p>
            <p className="mt-1 font-display text-3xl text-[var(--ink)]">{productCount}</p>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[var(--muted-strong)]">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.32em]">
              {language === "es" ? "Materiales" : "Materials"}
            </p>
            <p className="mt-1 font-display text-3xl text-[var(--ink)]">{materialCount}</p>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[var(--muted-strong)]">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.32em]">
              {language === "es" ? "Proveedores" : "Suppliers"}
            </p>
            <p className="mt-1 font-display text-3xl text-[var(--ink)]">{supplierCount}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void saveProduct();
          }}
        >
          <SectionHeading
            eyebrow={copy.productEyebrow}
            title={copy.productTitle}
            description={copy.productDescription}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={productDraft.sku}
              onChange={(event) => setProductDraft((current) => ({ ...current, sku: event.target.value }))}
              placeholder={productCopy.skuPlaceholder}
              className="field font-mono text-sm"
            />
            <input
              value={productDraft.name}
              onChange={(event) => setProductDraft((current) => ({ ...current, name: event.target.value }))}
              placeholder={productCopy.namePlaceholder}
              className="field"
            />
            <input
              value={productDraft.category}
              onChange={(event) => setProductDraft((current) => ({ ...current, category: event.target.value }))}
              placeholder={productCopy.categoryPlaceholder}
              className="field"
            />
            <input
              value={productDraft.unit}
              onChange={(event) => setProductDraft((current) => ({ ...current, unit: event.target.value }))}
              placeholder={productCopy.unitPlaceholder}
              className="field"
            />
            <input
              value={productDraft.unitPrice}
              onChange={(event) => setProductDraft((current) => ({ ...current, unitPrice: event.target.value }))}
              placeholder={productCopy.unitPricePlaceholder}
              className="field font-mono text-sm"
              inputMode="decimal"
            />
          </div>

          <div className="space-y-3 border-t border-dashed border-[var(--line)] pt-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                  {language === "es" ? "Fórmula" : "Formula"}
                </p>
                <p className="mt-1 text-sm text-[var(--muted-strong)]">
                  {language === "es"
                    ? "Un material por fila. El producto se guarda con esta mezcla."
                    : "One material per row. The product saves with this mix."}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-soft"
                onClick={() =>
                  setProductDraft((current) => ({
                    ...current,
                    formula: [...current.formula, createFormulaRow()]
                  }))
                }
              >
                {copy.addMaterial}
              </button>
            </div>
            <div className="space-y-3">
              {productDraft.formula.map((row, index) => (
                <FormulaRowField
                  key={row.id}
                  row={row}
                  index={index}
                  language={language}
                  canRemove={productDraft.formula.length > 1}
                  onChange={(next) =>
                    setProductDraft((current) => ({
                      ...current,
                      formula: current.formula.map((item) => (item.id === row.id ? next : item))
                    }))
                  }
                  onRemove={() =>
                    setProductDraft((current) => {
                      const next = current.formula.filter((item) => item.id !== row.id);
                      return {
                        ...current,
                        formula: next.length ? next : [createFormulaRow()]
                      };
                    })
                  }
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button className="btn btn-flame" type="submit" disabled={savingProduct}>
              {productCopy.save}
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => setProductDraft(createProductDraft())}
              disabled={savingProduct}
            >
              {productCopy.reset}
            </button>
          </div>
        </form>
      </Card>

      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} /> : null}
    </section>
  );
}
