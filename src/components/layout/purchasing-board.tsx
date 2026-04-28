import { Card } from "@/components/ui/surfaces";
import { buildPurchasingPlan } from "@/lib/domain/purchasing-plan";
import type { BusinessSnapshot } from "@/lib/domain/types";

export function PurchasingBoard({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const purchasingPlan = buildPurchasingPlan(
    snapshot.orders,
    snapshot.products,
    snapshot.materials,
    snapshot.suppliers
  );

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6">
        {!snapshot.orders.some((order) => order.status === "open") ? (
          <p className="mb-4 rounded-[1rem] border border-[var(--line)] bg-white/70 p-4 text-sm text-[var(--muted)]">
            No open orders yet. Add an order in Orders to generate required material quantities.
          </p>
        ) : null}
        {!snapshot.products.length ? (
          <p className="mb-4 rounded-[1rem] border border-[var(--line)] bg-white/70 p-4 text-sm text-[var(--muted)]">
            Catalog is empty. Add products with formulas before generating a purchasing run.
          </p>
        ) : null}
        <div className="overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-white/70">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--bg-strong)] text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Required</th>
                <th className="px-4 py-3">Net to buy</th>
                <th className="px-4 py-3">Supplier</th>
              </tr>
            </thead>
            <tbody>
              {purchasingPlan.map((item) => (
                <tr key={item.materialId} className="border-t border-[var(--line)]">
                  <td className="px-4 py-3">{item.materialName}</td>
                  <td className="px-4 py-3">
                    {item.requiredQuantity.toFixed(2)} {item.unit}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {item.netToBuyQuantity.toFixed(2)} {item.unit}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {item.supplierName ? (
                      item.supplierEmail ? (
                        <a
                          href={`mailto:${item.supplierEmail}`}
                          className="font-medium text-[var(--accent)] underline decoration-[var(--accent)] underline-offset-4"
                        >
                          {item.supplierName}
                        </a>
                      ) : (
                        <span className="font-medium text-[var(--text)]">{item.supplierName}</span>
                      )
                    ) : (
                      "Unassigned"
                    )}
                  </td>
                </tr>
              ))}
              {!purchasingPlan.length ? (
                <tr className="border-t border-[var(--line)]">
                  <td className="px-4 py-4 text-sm text-[var(--muted)]" colSpan={4}>
                    Purchasing plan is empty. Import or create products and open orders to populate this view.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
