"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { Card, SectionHeading, Toast } from "@/components/ui/surfaces";
import type { BusinessSnapshot, Product } from "@/lib/domain/types";
import { importExperienceCopy } from "@/lib/i18n";

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

function draftFromProduct(product: Product): ProductDraft {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    category: product.category,
    unit: product.unit,
    unitPrice: String(product.unitPrice ?? 0),
    formula: product.materials.length
      ? product.materials.map((material, index) => ({
          id: `${product.id}-${index}`,
          materialName: material.materialName,
          unit: material.unit,
          quantity: String(material.quantity)
        }))
      : [createFormulaRow()]
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

export function ImportExperience({
  snapshot,
  editingProductId
}: Readonly<{ snapshot: BusinessSnapshot; editingProductId?: string }>) {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = importExperienceCopy(language);
  const [workspace, setWorkspace] = useState(snapshot);
  const editingProduct = editingProductId ? workspace.products.find((product) => product.id === editingProductId) : undefined;
  const [productDraft, setProductDraft] = useState<ProductDraft>(() =>
    editingProduct ? draftFromProduct(editingProduct) : createProductDraft()
  );
  const [toast, setToast] = useState<{ message: string; tone: Tone } | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  const isEditing = Boolean(editingProduct);

  const productCount = String(workspace.products.length);
  const supplierCount = String(workspace.suppliers.length);
  const materialCount = String(workspace.materials.length);

  useEffect(() => {
    setProductDraft(editingProduct ? draftFromProduct(editingProduct) : createProductDraft());
  }, [editingProduct]);

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
      setToast({ message: copy.enterRequired, tone: "warn" });
      return;
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      setToast({ message: copy.priceNegative, tone: "warn" });
      return;
    }
    if (!formula.length) {
      setToast({ message: copy.formulaRequired, tone: "warn" });
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
        setToast({ message: data.error ?? copy.saveError, tone: "error" });
        return;
      }

      setWorkspace(data.snapshot);
      const savedProduct = data.snapshot.products.find(
        (product) => product.id === productDraft.id || product.sku === sku
      );
      setProductDraft(savedProduct ? draftFromProduct(savedProduct) : createProductDraft());
      setToast({ message: isEditing ? copy.productUpdated : copy.productSaved, tone: "success" });
      router.refresh();
    } finally {
      setSavingProduct(false);
    }
  }

  return (
    <section className="space-y-6">
      <Card className="p-6">
        {editingProduct ? (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-4 py-3">
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.32em] text-[var(--muted-strong)]">
                {copy.editing}
              </p>
              <p className="mt-1 font-display text-lg text-[var(--ink)]">{editingProduct.name}</p>
            </div>
            <Link href="/products" className="btn btn-soft">
              {copy.backToCatalog}
            </Link>
          </div>
        ) : null}
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
              placeholder={copy.skuPlaceholder}
              className="field font-mono text-sm"
            />
            <input
              value={productDraft.name}
              onChange={(event) => setProductDraft((current) => ({ ...current, name: event.target.value }))}
              placeholder={copy.namePlaceholder}
              className="field"
            />
            <input
              value={productDraft.category}
              onChange={(event) => setProductDraft((current) => ({ ...current, category: event.target.value }))}
              placeholder={copy.categoryPlaceholder}
              className="field"
            />
            <input
              value={productDraft.unit}
              onChange={(event) => setProductDraft((current) => ({ ...current, unit: event.target.value }))}
              placeholder={copy.unitPlaceholder}
              className="field"
            />
            <input
              value={productDraft.unitPrice}
              onChange={(event) => setProductDraft((current) => ({ ...current, unitPrice: event.target.value }))}
              placeholder={copy.unitPricePlaceholder}
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
              {isEditing ? copy.updateProduct : copy.saveProduct}
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => setProductDraft(editingProduct ? draftFromProduct(editingProduct) : createProductDraft())}
              disabled={savingProduct}
            >
              {copy.reset}
            </button>
          </div>
        </form>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: language === "es" ? "Productos" : "Products", value: productCount, href: "/products" },
          { label: language === "es" ? "Materiales" : "Materials", value: materialCount, href: "/purchasing" },
          { label: language === "es" ? "Proveedores" : "Suppliers", value: supplierCount, href: "/contacts" }
        ].map(({ label, value, href }) => (
          <Link
            key={label}
            href={href as Route}
            className="rounded-[18px] border border-[var(--line)] bg-[var(--paper-bright)] px-4 py-4 transition-colors hover:border-[var(--ink)] hover:bg-[var(--paper)]"
          >
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-[var(--muted)]">{label}</p>
            <p className="mt-2 font-display text-[clamp(1.6rem,2.4vw,2rem)] leading-none text-[var(--ink)]">
              {String(value).padStart(2, "0")}
            </p>
          </Link>
        ))}
      </div>

      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} /> : null}
    </section>
  );
}
