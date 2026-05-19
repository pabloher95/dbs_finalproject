import { Card, Eyebrow, Pill } from "@/components/ui/surfaces";
import { MaterialStockStudio } from "@/components/forms/material-stock-studio";
import { buildPurchasingPlan, buildReorderAlerts } from "@/lib/domain/purchasing-plan";
import { getRequestLanguage } from "@/lib/i18n-server";
import { purchasingBoardCopy } from "@/lib/i18n";
import type { BusinessSnapshot } from "@/lib/domain/types";

function priorityFor(
  line: { netToBuyQuantity: number; supplierName?: string },
  copy: ReturnType<typeof purchasingBoardCopy>
) {
  if (!line.supplierName) return { tone: "amber" as const, label: copy.source };
  if (line.netToBuyQuantity <= 0) return { tone: "moss" as const, label: copy.covered };
  if (line.netToBuyQuantity > 1000) return { tone: "flame" as const, label: copy.heavy };
  return { tone: "moss" as const, label: copy.ready };
}

function formatCoverage(value: number) {
  return `${Math.round(value * 100)}%`;
}

export async function PurchasingBoard({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const copy = purchasingBoardCopy(await getRequestLanguage());
  const purchasingPlan = buildPurchasingPlan(
    snapshot.orders,
    snapshot.products,
    snapshot.materials,
    snapshot.suppliers
  );
  const reorderAlerts = buildReorderAlerts(snapshot).slice(0, 3);

  const totalLines = purchasingPlan.length;
  const linkedLines = purchasingPlan.filter((line) => Boolean(line.supplierName)).length;
  const totalUnits = purchasingPlan.reduce((sum, line) => sum + line.requiredQuantity, 0);
  const uncoveredLines = purchasingPlan.filter((line) => line.netToBuyQuantity > 0).length;
  const stockedMaterials = snapshot.materials.filter((material) => material.onHandQuantity > 0).length;

  return (
    <div className="space-y-4">
      <Card variant="featured" className="rounded-[28px] p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow tone="flame">{copy.todayRun}</Eyebrow>
            <p className="mt-2 font-display text-3xl leading-tight text-[var(--ink)]">
              {totalLines} {copy.readyToSource}
            </p>
            <p className="mt-2 text-[0.92rem] leading-6 text-[var(--muted-strong)]">
              {copy.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill tone="ink">{`${Math.round(totalUnits)} ${copy.requiredUnits}`}</Pill>
            <Pill tone={linkedLines === totalLines && totalLines > 0 ? "moss" : "amber"}>
              {linkedLines}/{totalLines || 0} {copy.sourced}
            </Pill>
            <Pill tone={stockedMaterials > 0 ? "moss" : "amber"}>{stockedMaterials} {copy.stockedMaterials}</Pill>
          </div>
        </div>
        {!snapshot.orders.some((order) => order.status === "open") ? (
          <p className="mt-5 rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
            {copy.noOpenOrders}
          </p>
        ) : null}
        {!snapshot.products.length ? (
          <p className="mt-3 rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
            {copy.emptyCatalog}
          </p>
        ) : null}
        <div className="mt-5">
          <MaterialStockStudio materials={snapshot.materials} suppliers={snapshot.suppliers} />
        </div>
        {uncoveredLines > 0 ? (
          <p className="mt-4 rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
            {uncoveredLines} {copy.uncovered}
          </p>
        ) : null}
        <div className="mt-6 rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Eyebrow tone="flame">{copy.reorderEyebrow}</Eyebrow>
              <p className="mt-2 font-display text-2xl leading-none text-[var(--ink)]">{copy.reorderTitle}</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-strong)]">{copy.reorderDescription}</p>
            </div>
            <Pill tone={reorderAlerts.some((alert) => alert.severity === "critical") ? "flame" : "amber"}>
              {reorderAlerts.length} {copy.reorderEyebrow.toLowerCase()}
            </Pill>
          </div>
          {reorderAlerts.length ? (
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {reorderAlerts.map((alert) => (
                <div key={alert.materialId} className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-xl leading-none text-[var(--ink)]">{alert.materialName}</p>
                      <p className="mt-2 text-sm text-[var(--muted-strong)]">
                        {copy.shortage}: {alert.shortageQuantity.toFixed(2)} {alert.unit}
                      </p>
                    </div>
                    <Pill tone={alert.severity === "critical" ? "flame" : "amber"}>
                      {alert.severity === "critical" ? copy.critical : copy.warning}
                    </Pill>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-[var(--muted-strong)]">
                    <p>{copy.coverage}: {formatCoverage(alert.coverageRatio)}</p>
                    <p>{copy.nextDue}: {alert.nextDueDate ?? "—"}</p>
                    <p>{copy.orderPressure}: {alert.openOrderCount}</p>
                    <p>{copy.supplier}: {alert.supplierName ?? copy.unassigned}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[var(--muted-strong)]">{copy.noReorderAlerts}</p>
          )}
        </div>
        <div className="mt-6 overflow-hidden rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)]">
          <table className="console-table">
            <thead>
              <tr>
                <th>{copy.material}</th>
                <th>{copy.onHand}</th>
                <th>{copy.required}</th>
                <th>{copy.netToBuy}</th>
                <th>{copy.supplier}</th>
                <th>{copy.state}</th>
              </tr>
            </thead>
            <tbody>
              {purchasingPlan.map((item) => {
                const priority = priorityFor(item, copy);
                return (
                  <tr key={item.materialId}>
                    <td>
                      <p className="font-display text-lg text-[var(--ink)]">{item.materialName}</p>
                    </td>
                    <td className="font-mono text-[0.8rem] uppercase tracking-[0.18em]">
                      {item.onHandQuantity.toFixed(2)} {item.unit}
                    </td>
                    <td className="font-mono text-[0.78rem] uppercase tracking-[0.18em]">
                      {item.requiredQuantity.toFixed(2)} {item.unit}
                    </td>
                    <td className="font-mono text-[0.92rem]">
                      <span className="font-display text-2xl text-[var(--ink)]">
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
                        <span className="text-[var(--muted)]">{copy.unassigned}</span>
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
                  <td colSpan={6} className="text-center text-sm text-[var(--muted-strong)]">
                    {copy.emptyPlan}
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
