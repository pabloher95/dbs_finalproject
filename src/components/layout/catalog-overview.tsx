import { Card, Eyebrow, Pill, SectionHeading } from "@/components/ui/surfaces";
import { expandFormulaRequirements } from "@/lib/domain/purchasing-plan";
import type { BusinessSnapshot } from "@/lib/domain/types";

export function CatalogOverview({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  return (
    <div className="space-y-4">
      <Card className="rounded-[28px] p-6">
        <SectionHeading
          eyebrow="Catalog"
          title="Products and formula math"
          description="Each product carries an explicit batch yield and material bill so order quantities translate cleanly into purchasing demand."
        />
      </Card>
      <div className="grid gap-4 xl:grid-cols-2">
        {snapshot.products.map((product) => {
          const expansion = expandFormulaRequirements(product, product.yieldQuantity);
          return (
            <Card key={product.id} className="rounded-[28px] p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <Eyebrow tone="flame">{product.category}</Eyebrow>
                  <p className="mt-2 font-display text-3xl leading-tight text-[var(--ink)]">{product.name}</p>
                  <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted-strong)]">
                    SKU {product.sku} · batch yield {product.yieldQuantity} {product.unit}
                  </p>
                </div>
                <Pill tone="ink">{product.materials.length} materials</Pill>
              </div>
              <div className="mt-5 overflow-hidden rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)]">
                <table className="console-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Per batch</th>
                      <th>Per unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expansion.map((item) => (
                      <tr key={item.materialId}>
                        <td>{item.materialName}</td>
                        <td className="font-mono text-[0.8rem]">
                          {item.batchQuantity} {item.unit}
                        </td>
                        <td className="font-mono text-[0.78rem] text-[var(--muted-strong)]">
                          {item.quantityPerUnit.toFixed(2)} {item.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
