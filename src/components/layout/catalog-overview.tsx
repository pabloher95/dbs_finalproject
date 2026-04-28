import { Card, SectionHeading } from "@/components/ui/surfaces";
import { expandFormulaRequirements } from "@/lib/domain/purchasing-plan";
import type { BusinessSnapshot } from "@/lib/domain/types";

export function CatalogOverview({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6">
        <SectionHeading
          eyebrow="Catalog"
          title="Products and formula math"
          description="Each product carries an explicit batch yield and material bill so order quantities can be translated into purchasing demand."
        />
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        {snapshot.products.map((product) => {
          const expansion = expandFormulaRequirements(product, product.yieldQuantity);
          return (
            <Card key={product.id} className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">{product.category}</p>
                  <h3 className="mt-2 font-[var(--font-display)] text-3xl">{product.name}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    SKU {product.sku} · batch yield {product.yieldQuantity} {product.unit}
                  </p>
                </div>
                <div className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-2 text-sm">
                  {product.materials.length} materials
                </div>
              </div>
              <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-white/70">
                <table className="min-w-full text-sm">
                  <thead className="bg-[var(--bg-strong)] text-[var(--muted)]">
                    <tr>
                      <th className="px-4 py-3 text-left">Material</th>
                      <th className="px-4 py-3 text-left">Per batch</th>
                      <th className="px-4 py-3 text-left">Per unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expansion.map((item) => (
                      <tr key={item.materialId} className="border-t border-[var(--line)]">
                        <td className="px-4 py-3">{item.materialName}</td>
                        <td className="px-4 py-3">
                          {item.batchQuantity} {item.unit}
                        </td>
                        <td className="px-4 py-3 text-[var(--muted)]">
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
