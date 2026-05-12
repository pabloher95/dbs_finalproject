"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { CatalogOverview } from "@/components/layout/catalog-overview";
import { Card, Eyebrow, Pill, Toast } from "@/components/ui/surfaces";
import type { BusinessSnapshot, Product, ProductMaterial } from "@/lib/domain/types";
import { productStudioCopy } from "@/lib/i18n";

type ProductDraft = {
  id?: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  yieldQuantity: string;
  unitPrice: string;
  formula: string;
};

const emptyDraft: ProductDraft = {
  sku: "",
  name: "",
  category: "general",
  unit: "each",
  yieldQuantity: "12",
  unitPrice: "34",
  formula: "Base Material:g:1000\nFinishing Material:g:500"
};

function formulaToText(materials: ProductMaterial[]) {
  return materials.map((item) => `${item.materialName}:${item.unit}:${item.quantity}`).join("\n");
}

function textToFormula(formula: string): ProductMaterial[] {
  return formula
    .split(/\r?\n/)
    .map((line, index) => {
      const [materialName, unit, quantity] = line.split(":").map((part) => part.trim());
      const parsedQuantity = Number(quantity);
      return materialName && unit && quantity
        ? {
            materialId: `material_${materialName.toLowerCase().replaceAll(/\s+/g, "_")}_${index}`,
            materialName,
            unit,
            quantity: parsedQuantity
          }
        : null;
    })
    .filter((value): value is ProductMaterial => value !== null && !Number.isNaN(value.quantity));
}

export function ProductStudio({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = productStudioCopy(language);
  const [products, setProducts] = useState(snapshot.products);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [toast, setToast] = useState<{ message: string; tone: "info" | "success" | "warn" | "error" } | null>(null);
  const [search, setSearch] = useState("");
  const [lastDeleted, setLastDeleted] = useState<Product | null>(null);

  const displaySnapshot = useMemo(() => ({ ...snapshot, products }), [products, snapshot]);

  useEffect(() => {
    setProducts(snapshot.products);
  }, [snapshot.products]);

  const filteredProducts = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return products;
    return products.filter((product) =>
      [product.name, product.sku, product.category].some((value) => value.toLowerCase().includes(key))
    );
  }, [products, search]);

  async function saveProduct() {
    if (!draft.sku.trim() || !draft.name.trim()) {
      setToast({ message: copy.enterRequired, tone: "warn" });
      return;
    }
    if (Number(draft.yieldQuantity) <= 0) {
      setToast({ message: copy.yieldRequired, tone: "warn" });
      return;
    }
    if (Number(draft.unitPrice) < 0) {
      setToast({ message: copy.priceNegative, tone: "warn" });
      return;
    }
    const parsedFormula = textToFormula(draft.formula);
    if (!parsedFormula.length) {
      setToast({ message: copy.formulaRequired, tone: "warn" });
      return;
    }

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: draft.id,
        sku: draft.sku,
        name: draft.name,
        category: draft.category,
        unit: draft.unit,
        yieldQuantity: Number(draft.yieldQuantity),
        unitPrice: Number(draft.unitPrice),
        formula: parsedFormula
      })
    });
    const data = (await response.json()) as { snapshot?: BusinessSnapshot; error?: string };
    if (!response.ok || !data.snapshot) {
      setToast({ message: data.error ?? copy.saveError, tone: "error" });
      return;
    }
    setProducts(data.snapshot.products);
    setDraft(emptyDraft);
    setLastDeleted(null);
    setToast({ message: copy.saved, tone: "success" });
    router.refresh();
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(copy.deleteConfirm(product.name))) return;
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", productId: product.id })
    });
    const data = (await response.json()) as { snapshot?: BusinessSnapshot; error?: string };
    if (!response.ok || !data.snapshot) {
      setToast({ message: data.error ?? copy.deleteError, tone: "error" });
      return;
    }
    setProducts(data.snapshot.products);
    setLastDeleted(product);
    if (draft.id === product.id) setDraft(emptyDraft);
    setToast({ message: copy.deleted, tone: "info" });
    router.refresh();
  }

  async function undoDelete() {
    if (!lastDeleted) return;
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: lastDeleted.id,
        sku: lastDeleted.sku,
        name: lastDeleted.name,
        category: lastDeleted.category,
        unit: lastDeleted.unit,
        yieldQuantity: lastDeleted.yieldQuantity,
        unitPrice: lastDeleted.unitPrice ?? 0,
        formula: lastDeleted.materials.map((item) => ({
          materialName: item.materialName,
          unit: item.unit,
          quantity: item.quantity
        }))
      })
    });
    const data = (await response.json()) as { snapshot?: BusinessSnapshot; error?: string };
    if (!response.ok || !data.snapshot) {
      setToast({ message: data.error ?? copy.restoreError, tone: "error" });
      return;
    }
    setProducts(data.snapshot.products);
    setLastDeleted(null);
    setToast({ message: copy.restored, tone: "success" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void saveProduct();
            }}
          >
            <div>
              <Eyebrow tone="flame">{copy.eyebrow}</Eyebrow>
              <p className="mt-2 font-display text-2xl leading-tight text-[var(--ink)]">{copy.title}</p>
              <p className="mt-2 text-[0.92rem] leading-6 text-[var(--muted-strong)]">
                {copy.description}
              </p>
              {!snapshot.clients.length ? (
                <Pill tone="amber" className="mt-3">
                  {copy.noCustomersTip}
                </Pill>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                value={draft.sku}
                onChange={(event) => setDraft((current) => ({ ...current, sku: event.target.value }))}
                placeholder={copy.skuPlaceholder}
                className="field font-mono text-sm"
              />
              <input
                value={draft.name}
                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                placeholder={copy.namePlaceholder}
                className="field"
              />
              <input
                value={draft.category}
                onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
                placeholder={copy.categoryPlaceholder}
                className="field"
              />
              <input
                value={draft.unit}
                onChange={(event) => setDraft((current) => ({ ...current, unit: event.target.value }))}
                placeholder={copy.unitPlaceholder}
                className="field"
              />
              <input
                value={draft.yieldQuantity}
                onChange={(event) => setDraft((current) => ({ ...current, yieldQuantity: event.target.value }))}
                placeholder={copy.yieldQuantityPlaceholder}
                className="field font-mono text-sm"
              />
              <input
                value={draft.unitPrice}
                onChange={(event) => setDraft((current) => ({ ...current, unitPrice: event.target.value }))}
                placeholder={copy.unitPricePlaceholder}
                className="field font-mono text-sm"
                inputMode="decimal"
              />
            </div>
            <div className="border-t border-dashed border-[var(--line)] pt-4">
              <Eyebrow tone="flame">{language === "es" ? "Fórmula" : "Formula"}</Eyebrow>
              <p className="mt-2 text-[0.85rem] leading-5 text-[var(--muted-strong)]">
                {language === "es" ? "Un material por línea. Formato:" : "One material per line. Format:"}{" "}
                <span className="font-mono">name:unit:quantity</span>.
              </p>
            </div>
            <textarea
              value={draft.formula}
              onChange={(event) => setDraft((current) => ({ ...current, formula: event.target.value }))}
              className="field min-h-[170px] font-mono text-[0.8rem]"
            />
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button className="btn btn-flame" type="submit">
                {draft.id ? copy.updateItem : copy.saveItem}
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => setDraft(emptyDraft)}>
                {copy.reset}
              </button>
              {lastDeleted ? (
                <button type="button" className="btn btn-soft" onClick={() => void undoDelete()}>
                  {copy.undoLastDelete}
                </button>
              ) : null}
            </div>
          </form>
        </Card>
        <Card className="p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Eyebrow tone="flame">{language === "es" ? "Catálogo" : "Catalog"}</Eyebrow>
              <p className="mt-2 font-display text-2xl text-[var(--ink)]">
                {products.length} {language === "es" ? "artículos" : "items"}
              </p>
              <p className="mt-2 text-[0.9rem] text-[var(--muted-strong)]">
                {language === "es"
                  ? "Edita rendimientos, reemplaza marcadores y mantén las fórmulas alineadas con cómo se hacen realmente los artículos."
                  : "Edit yields, replace placeholders, and keep formulas aligned with how items are actually made."}
              </p>
            </div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={copy.search}
              className="field max-w-xs"
            />
          </div>
          {!products.length ? (
            <p className="mt-5 rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-6 text-sm text-[var(--muted-strong)]">
              No products yet. Save your first item to build formulas and unlock purchasing planning.
            </p>
          ) : null}
          <div className="mt-5 space-y-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 transition hover:border-[var(--ink)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-xl text-[var(--ink)]">{product.name}</p>
                      <Pill>{product.category}</Pill>
                    </div>
                    <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted-strong)]">
                      {product.sku} · yield {product.yieldQuantity} {product.unit} · ${Number(product.unitPrice ?? 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={() =>
                        setDraft({
                          id: product.id,
                          sku: product.sku,
                          name: product.name,
                          category: product.category,
                          unit: product.unit,
                          yieldQuantity: String(product.yieldQuantity),
                          unitPrice: String(product.unitPrice ?? 0),
                          formula: formulaToText(product.materials)
                        })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-soft"
                      type="button"
                      onClick={() => {
                        void deleteProduct(product);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {products.length > 0 && filteredProducts.length === 0 ? (
              <p className="rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
                {copy.noMatch}
              </p>
            ) : null}
          </div>
        </Card>
      </div>
      <CatalogOverview snapshot={displaySnapshot} />
      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} /> : null}
    </div>
  );
}
