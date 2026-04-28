"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CatalogOverview } from "@/components/layout/catalog-overview";
import type { BusinessSnapshot, Product, ProductMaterial } from "@/lib/domain/types";

type ProductDraft = {
  id?: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  yieldQuantity: string;
  formula: string;
};

const emptyDraft: ProductDraft = {
  sku: "",
  name: "",
  category: "general",
  unit: "each",
  yieldQuantity: "12",
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
  const [products, setProducts] = useState(snapshot.products);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [status, setStatus] = useState<string | null>(null);
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
      setStatus("Enter both SKU and product name before saving.");
      return;
    }
    if (Number(draft.yieldQuantity) <= 0) {
      setStatus("Yield quantity must be greater than zero.");
      return;
    }

    const parsedFormula = textToFormula(draft.formula);
    if (!parsedFormula.length) {
      setStatus("Add at least one valid formula line in name:unit:quantity format.");
      return;
    }

    setStatus("Saving product...");
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
        formula: parsedFormula
      })
    });
    const data = (await response.json()) as { snapshot?: BusinessSnapshot; error?: string };
    if (!response.ok || !data.snapshot) {
      setStatus(data.error ?? "Unable to save product.");
      return;
    }

    setProducts(data.snapshot.products);
    setDraft(emptyDraft);
    setLastDeleted(null);
    setStatus("Product saved.");
    router.refresh();
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Delete ${product.name}? This can affect related orders.`)) {
      return;
    }

    setStatus(`Deleting ${product.name}...`);
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", productId: product.id })
    });
    const data = (await response.json()) as { snapshot?: BusinessSnapshot; error?: string };
    if (!response.ok || !data.snapshot) {
      setStatus(data.error ?? "Unable to delete product.");
      return;
    }

    setProducts(data.snapshot.products);
    setLastDeleted(product);
    if (draft.id === product.id) {
      setDraft(emptyDraft);
    }
    setStatus("Product deleted. You can undo this action.");
    router.refresh();
  }

  async function undoDelete() {
    if (!lastDeleted) return;
    setStatus(`Restoring ${lastDeleted.name}...`);
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
        formula: lastDeleted.materials.map((item) => ({
          materialName: item.materialName,
          unit: item.unit,
          quantity: item.quantity
        }))
      })
    });
    const data = (await response.json()) as { snapshot?: BusinessSnapshot; error?: string };
    if (!response.ok || !data.snapshot) {
      setStatus(data.error ?? "Unable to restore product.");
      return;
    }
    setProducts(data.snapshot.products);
    setLastDeleted(null);
    setStatus("Product restored.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form
          className="space-y-4 rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-5"
          onSubmit={(event) => {
            event.preventDefault();
            void saveProduct();
          }}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Product details</p>
            <h3 className="mt-2 font-[var(--font-display)] text-2xl">Add or update an item</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Give the product a name, SKU, unit, and batch yield so it can be scheduled and priced consistently.
            </p>
            {!snapshot.clients.length ? (
              <p className="mt-2 text-xs text-[var(--accent-deep)]">Tip: Add a customer next so this product can be used in orders.</p>
            ) : null}
          </div>
          <input
            value={draft.sku}
            onChange={(event) => setDraft((current) => ({ ...current, sku: event.target.value }))}
            placeholder="SKU"
            className="w-full rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
          />
          <input
            value={draft.name}
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
            placeholder="Product name"
            className="w-full rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              value={draft.category}
              onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
              placeholder="Category"
              className="rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
            />
            <input
              value={draft.unit}
              onChange={(event) => setDraft((current) => ({ ...current, unit: event.target.value }))}
              placeholder="Unit"
              className="rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
            />
            <input
              value={draft.yieldQuantity}
              onChange={(event) => setDraft((current) => ({ ...current, yieldQuantity: event.target.value }))}
              placeholder="Yield"
              className="rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
            />
          </div>
          <div className="border-t border-[var(--line)] pt-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Formula</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Add one material per line using `name:unit:quantity`, for example `Soy Wax:g:1200`.
            </p>
          </div>
          <textarea
            value={draft.formula}
            onChange={(event) => setDraft((current) => ({ ...current, formula: event.target.value }))}
            className="min-h-[180px] w-full rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
          />
          <div className="flex gap-3">
            <button className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white" type="submit">
              {draft.id ? "Update item" : "Save item"}
            </button>
            <button
              className="rounded-full border border-[var(--line)] px-5 py-3 text-sm"
              type="button"
              onClick={() => setDraft(emptyDraft)}
            >
              Reset
            </button>
          </div>
          {status ? <p className="text-sm text-[var(--muted)]">{status}</p> : null}
          {lastDeleted ? (
            <button
              type="button"
              className="rounded-full border border-[var(--line)] px-4 py-2 text-sm"
              onClick={() => void undoDelete()}
            >
              Undo last delete
            </button>
          ) : null}
        </form>
        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Review</p>
            <h3 className="mt-2 font-[var(--font-display)] text-2xl">Current catalog</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Edit products when yields change, remove placeholders, and keep formulas aligned with how the item is actually made.
            </p>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products by name, SKU, or category"
            className="w-full rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3 text-sm"
          />
          {!products.length ? (
            <p className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-4 text-sm text-[var(--muted)]">
              No products yet. Save your first item to build formulas and unlock purchasing planning.
            </p>
          ) : null}
          {filteredProducts.map((product) => (
            <article key={product.id} className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {product.sku} · {product.yieldQuantity} {product.unit}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-full border border-[var(--line)] px-3 py-2 text-sm"
                    type="button"
                    onClick={() =>
                      setDraft({
                        id: product.id,
                        sku: product.sku,
                        name: product.name,
                        category: product.category,
                        unit: product.unit,
                        yieldQuantity: String(product.yieldQuantity),
                        formula: formulaToText(product.materials)
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-full border border-[var(--line)] px-3 py-2 text-sm text-[var(--accent-deep)]"
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
            <p className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-4 text-sm text-[var(--muted)]">
              No products match that search yet.
            </p>
          ) : null}
        </div>
      </div>
      <CatalogOverview snapshot={displaySnapshot} />
    </div>
  );
}
