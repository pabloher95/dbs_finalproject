import { Card, Eyebrow, Pill } from "@/components/ui/surfaces";
import { buildPurchasingPlan } from "@/lib/domain/purchasing-plan";
import type { BusinessSnapshot } from "@/lib/domain/types";

function priorityFor(quantity: number, hasSupplier: boolean) {
  if (!hasSupplier) return { tone: "amber" as const, label: "Source" };
  if (quantity > 1000) return { tone: "flame" as const, label: "Heavy" };
  return { tone: "moss" as const, label: "Ready" };
}

export function PurchasingBoard({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const purchasingPlan = buildPurchasingPlan(
    snapshot.orders,
    snapshot.products,
    snapshot.materials,
    snapshot.suppliers
  );

  const totalLines = purchasingPlan.length;
  const linkedLines = purchasingPlan.filter((line) => Boolean(line.supplierName)).length;
  const totalUnits = purchasingPlan.reduce((sum, line) => sum + line.requiredQuantity, 0);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow tone="flame">Today&apos;s run</Eyebrow>
            <p className="mt-2 font-display italic text-3xl leading-tight">
              {totalLines} material line{totalLines === 1 ? "" : "s"} ready to source
            </p>
            <p className="mt-2 text-[0.92rem] leading-6 text-[var(--muted-strong)]">
              Roll-up of every open order, expanded by formula, grouped by material and supplier.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill tone="ink">{`${Math.round(totalUnits)} required units`}</Pill>
            <Pill tone={linkedLines === totalLines && totalLines > 0 ? "moss" : "amber"}>
              {linkedLines}/{totalLines || 0} sourced
            </Pill>
          </div>
        </div>
        {!snapshot.orders.some((order) => order.status === "open") ? (
          <p className="mt-5 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--paper-bright)] p-4 text-sm text-[var(--muted-strong)]">
            No open orders yet. Add an order in Orders to generate required material quantities.
          </p>
        ) : null}
        {!snapshot.products.length ? (
          <p className="mt-3 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--paper-bright)] p-4 text-sm text-[var(--muted-strong)]">
            Catalog is empty. Add products with formulas before generating a purchasing run.
          </p>
        ) : null}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper-bright)]">
          <table className="console-table">
            <thead>
              <tr>
                <th>Material</th>
                <th>Required</th>
                <th>Net to buy</th>
                <th>Supplier</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {purchasingPlan.map((item) => {
                const priority = priorityFor(item.netToBuyQuantity, Boolean(item.supplierName));
                return (
                  <tr key={item.materialId}>
                    <td>
                      <p className="font-display italic text-lg">{item.materialName}</p>
                    </td>
                    <td className="font-mono text-[0.78rem] uppercase tracking-[0.18em]">
                      {item.requiredQuantity.toFixed(2)} {item.unit}
                    </td>
                    <td className="font-mono text-[0.92rem]">
                      <span className="font-display italic text-2xl text-[var(--ink)]">
                        {item.netToBuyQuantity.toFixed(2)}
                      </span>{" "}
                      <span className="text-xs text-[var(--muted-strong)]">{item.unit}</span>
                    </td>
                    <td>
                      {item.supplierName ? (
                        item.supplierEmail ? (
                          <a
                            href={`mailto:${item.supplierEmail}`}
                            className="inline-flex items-center gap-2 font-medium text-[var(--ink)] underline decoration-[var(--flame)] decoration-2 underline-offset-4"
                          >
                            {item.supplierName}
                          </a>
                        ) : (
                          <span className="font-medium text-[var(--ink)]">{item.supplierName}</span>
                        )
                      ) : (
                        <span className="text-[var(--muted)]">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <Pill tone={priority.tone}>{priority.label}</Pill>
                    </td>
                  </tr>
                );
              })}
              {!purchasingPlan.length ? (
                <tr>
                  <td colSpan={5} className="text-center text-sm text-[var(--muted-strong)]">
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
