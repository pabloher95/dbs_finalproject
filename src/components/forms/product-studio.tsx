"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { CatalogOverview } from "@/components/layout/catalog-overview";
import { Card, Eyebrow, Pill } from "@/components/ui/surfaces";
import { getProductUnitCost, getProductUnitRevenue } from "@/lib/domain/analytics";
import type { BusinessSnapshot } from "@/lib/domain/types";
import { productStudioCopy } from "@/lib/i18n";

export function ProductStudio({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const { language } = useLanguage();
  const copy = productStudioCopy(language);
  const products = snapshot.products;
  const [search, setSearch] = useState("");

  const displaySnapshot = snapshot;

  const categoryCount = useMemo(() => new Set(products.map((product) => product.category)).size, [products]);
  const formulaLineCount = useMemo(
    () => products.reduce((sum, product) => sum + product.materials.length, 0),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return products;
    return products.filter((product) =>
      [product.name, product.sku, product.category].some((value) => value.toLowerCase().includes(key))
    );
  }, [products, search]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Eyebrow tone="flame">{copy.eyebrow}</Eyebrow>
            <p className="mt-2 font-display text-2xl leading-tight text-[var(--ink)]">{copy.title}</p>
            <p className="mt-2 max-w-2xl text-[0.92rem] leading-6 text-[var(--muted-strong)]">{copy.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill tone="ink">
              {products.length} {copy.products}
            </Pill>
            <Pill tone="moss">
              {categoryCount} {copy.categories}
            </Pill>
            <Pill tone="amber">
              {formulaLineCount} {copy.formulaLines}
            </Pill>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={copy.search}
            className="field"
          />
          <Pill className="justify-center lg:justify-self-end">
            {copy.readOnly}
          </Pill>
        </div>

        {!products.length ? (
          <p className="mt-5 rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-6 text-sm text-[var(--muted-strong)]">
            {copy.noProducts}
          </p>
        ) : null}

        <div className="mt-5 space-y-3">
          {filteredProducts.map((product) => {
            const unitCost = getProductUnitCost(product, snapshot.materials);
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
                    <Link href={`/import?productId=${encodeURIComponent(product.id)}`} className="btn btn-soft">
                      {copy.editSpecs}
                    </Link>
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
      <CatalogOverview snapshot={displaySnapshot} />
    </div>
  );
}
