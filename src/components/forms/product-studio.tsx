"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { CatalogOverview } from "@/components/layout/catalog-overview";
import { Card, Eyebrow, Pill, Toast } from "@/components/ui/surfaces";
import { getProductUnitCost, getProductUnitRevenue } from "@/lib/domain/analytics";
import type { BusinessSnapshot, Product } from "@/lib/domain/types";
import { importExperienceCopy, productStudioCopy } from "@/lib/i18n";

type Tone = "info" | "success" | "warn" | "error";

type FormulaDraft = {
  id: string;
  materialName: string;
  unit: string;
  quantity: string;
};

type ProductDraft = {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  yieldQuantity: string;
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

function draftFromProduct(product: Product): ProductDraft {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    category: product.category,
    unit: product.unit,
    yieldQuantity: String(product.yieldQuantity),
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
    <div className="grid gap-2 rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-3 md:grid-cols-[1.4fr_0.7fr_0.8fr_auto] md:items-end">
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
          placeholder="g"
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

export function ProductStudio({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = productStudioCopy(language);
  const editorCopy = importExperienceCopy(language);
  const [workspace, setWorkspace] = useState(snapshot);
  const [search, setSearch] = useState("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productDraft, setProductDraft] = useState<ProductDraft | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: Tone } | null>(null);

  const products = workspace.products;

  const filteredProducts = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return products;
    return products.filter((product) =>
      [product.name, product.sku, product.category].some((value) => value.toLowerCase().includes(key))
    );
  }, [products, search]);

  function openEditor(product: Product) {
    setEditingProductId(product.id);
    setProductDraft(draftFromProduct(product));
  }

  function closeEditor() {
    setEditingProductId(null);
    setProductDraft(null);
    setSavingProduct(false);
  }

  async function saveProduct() {
    if (!productDraft) return;

    const sku = productDraft.sku.trim();
    const name = productDraft.name.trim();
    const category = productDraft.category.trim();
    const unit = productDraft.unit.trim();
    const yieldQuantity = toNumber(productDraft.yieldQuantity);
    const unitPrice = toNumber(productDraft.unitPrice);
    const formula = productDraft.formula
      .map((row) => ({
        materialName: row.materialName.trim(),
        unit: row.unit.trim(),
        quantity: toNumber(row.quantity)
      }))
      .filter((row) => row.materialName && row.unit && Number.isFinite(row.quantity) && row.quantity > 0);

    if (!sku || !name || !category || !unit) {
      setToast({ message: editorCopy.enterRequired, tone: "warn" });
      return;
    }
    if (!Number.isFinite(yieldQuantity) || yieldQuantity <= 0) {
      setToast({
        message: language === "es" ? "El rendimiento debe ser mayor que cero." : "Yield quantity must be greater than zero.",
        tone: "warn"
      });
      return;
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      setToast({ message: editorCopy.priceNegative, tone: "warn" });
      return;
    }
    if (!formula.length) {
      setToast({ message: editorCopy.formulaRequired, tone: "warn" });
      return;
    }

    setSavingProduct(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: productDraft.id,
          sku,
          name,
          category,
          unit,
          yieldQuantity,
          unitPrice,
          formula
        })
      });
      const data = (await response.json()) as { snapshot?: BusinessSnapshot; error?: string };
      if (!response.ok || !data.snapshot) {
        setToast({ message: data.error ?? editorCopy.saveError, tone: "error" });
        return;
      }

      setWorkspace(data.snapshot);
      setToast({ message: editorCopy.productUpdated, tone: "success" });
      closeEditor();
      router.refresh();
    } finally {
      setSavingProduct(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card variant="featured" className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Eyebrow tone="flame">{copy.eyebrow}</Eyebrow>
            <p className="mt-2 font-display text-2xl leading-tight text-[var(--ink)]">{copy.title}</p>
            <p className="mt-2 max-w-2xl text-[0.92rem] leading-6 text-[var(--muted-strong)]">{copy.description}</p>
          </div>
        </div>

        <div className="mt-5">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={copy.search}
            className="field"
          />
        </div>

        {!products.length ? (
          <p className="mt-5 rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-6 text-sm text-[var(--muted-strong)]">
            {copy.noProducts}
          </p>
        ) : null}

        <div className="mt-5 space-y-3">
          {filteredProducts.map((product) => {
            const unitCost = getProductUnitCost(product, workspace.materials);
            const unitRevenue = getProductUnitRevenue(product);
            return (
              <article
                key={product.id}
                className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-xl text-[var(--ink)]">{product.name}</p>
                      <Pill>{product.category}</Pill>
                    </div>
                    <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted-strong)]">
                      {product.sku} · {product.unit} · {copy.yieldLabel} {product.yieldQuantity}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Pill tone="ink">
                      {product.materials.length} {copy.materials}
                    </Pill>
                    <Pill tone="moss">
                      {unitRevenue.toFixed(2)} {copy.unitPrice}
                    </Pill>
                    <Pill tone="amber">
                      {unitCost.toFixed(2)} {copy.unitCost}
                    </Pill>
                    <button type="button" className="btn btn-soft" onClick={() => openEditor(product)}>
                      {copy.editSpecs}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
          {products.length > 0 && filteredProducts.length === 0 ? (
            <p className="rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
              {copy.noMatch}
            </p>
          ) : null}
        </div>
      </Card>
      <CatalogOverview snapshot={workspace} />

      {productDraft && editingProductId ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--paper)]/84 px-4 py-8 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget && !savingProduct) {
              closeEditor();
            }
          }}
        >
          <Card className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[30px] bg-[var(--paper-bright)] p-0">
            <form
              className="flex max-h-[90vh] flex-col"
              onSubmit={(event) => {
                event.preventDefault();
                void saveProduct();
              }}
            >
              <div className="border-b border-[var(--ink)] px-6 py-5 md:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Eyebrow tone="flame">{editorCopy.editing}</Eyebrow>
                    <p className="editorial mt-3 text-[clamp(2rem,4vw,3rem)]">{productDraft.name || editorCopy.updateProduct}</p>
                    <p className="mt-3 max-w-2xl text-[0.95rem] leading-6 text-[var(--muted-strong)]">
                      {language === "es"
                        ? "Actualiza SKU, rendimiento, precio y fórmula sin salir del catálogo."
                        : "Update SKU, yield, price, and formula without leaving the catalog."}
                    </p>
                  </div>
                  <button type="button" className="btn btn-ghost" onClick={closeEditor} disabled={savingProduct}>
                    {language === "es" ? "Cerrar" : "Close"}
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto px-6 py-5 md:px-8">
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={productDraft.sku}
                    onChange={(event) => setProductDraft((current) => (current ? { ...current, sku: event.target.value } : current))}
                    placeholder={editorCopy.skuPlaceholder}
                    className="field font-mono text-sm"
                  />
                  <input
                    value={productDraft.name}
                    onChange={(event) => setProductDraft((current) => (current ? { ...current, name: event.target.value } : current))}
                    placeholder={editorCopy.namePlaceholder}
                    className="field"
                  />
                  <input
                    value={productDraft.category}
                    onChange={(event) => setProductDraft((current) => (current ? { ...current, category: event.target.value } : current))}
                    placeholder={editorCopy.categoryPlaceholder}
                    className="field"
                  />
                  <input
                    value={productDraft.unit}
                    onChange={(event) => setProductDraft((current) => (current ? { ...current, unit: event.target.value } : current))}
                    placeholder={editorCopy.unitPlaceholder}
                    className="field"
                  />
                  <input
                    value={productDraft.yieldQuantity}
                    onChange={(event) => setProductDraft((current) => (current ? { ...current, yieldQuantity: event.target.value } : current))}
                    placeholder={language === "es" ? "Rendimiento por lote" : "Yield per batch"}
                    className="field font-mono text-sm"
                    inputMode="decimal"
                  />
                  <input
                    value={productDraft.unitPrice}
                    onChange={(event) => setProductDraft((current) => (current ? { ...current, unitPrice: event.target.value } : current))}
                    placeholder={editorCopy.unitPricePlaceholder}
                    className="field font-mono text-sm"
                    inputMode="decimal"
                  />
                </div>

                <div className="mt-6 space-y-3 border-t border-dashed border-[var(--line)] pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                        {language === "es" ? "Fórmula" : "Formula"}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted-strong)]">
                        {language === "es"
                          ? "Un material por fila. Los cambios se guardan directamente en el catálogo."
                          : "One material per row. Changes save directly back into the catalog."}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-soft"
                      onClick={() =>
                        setProductDraft((current) =>
                          current
                            ? {
                                ...current,
                                formula: [...current.formula, createFormulaRow()]
                              }
                            : current
                        )
                      }
                    >
                      {editorCopy.addMaterial}
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
                          setProductDraft((current) =>
                            current
                              ? {
                                  ...current,
                                  formula: current.formula.map((item) => (item.id === row.id ? next : item))
                                }
                              : current
                          )
                        }
                        onRemove={() =>
                          setProductDraft((current) => {
                            if (!current) return current;
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
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-[var(--line)] px-6 py-4 md:px-8">
                <button className="btn btn-flame" type="submit" disabled={savingProduct}>
                  {savingProduct ? (language === "es" ? "Guardando..." : "Saving...") : editorCopy.updateProduct}
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => {
                    const original = workspace.products.find((product) => product.id === editingProductId);
                    if (original) {
                      setProductDraft(draftFromProduct(original));
                    }
                  }}
                  disabled={savingProduct}
                >
                  {editorCopy.reset}
                </button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}

      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} /> : null}
    </div>
  );
}
