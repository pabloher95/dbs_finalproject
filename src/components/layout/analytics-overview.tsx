import { Card, SectionHeading, StatPill } from "@/components/ui/surfaces";
import { buildBusinessInsights, buildPurchaseInsights } from "@/lib/domain/analytics";
import { buildReorderAlerts } from "@/lib/domain/purchasing-plan";
import { getRequestLanguage } from "@/lib/i18n-server";
import { analyticsCopy } from "@/lib/i18n";
import type { BusinessSnapshot } from "@/lib/domain/types";
import { TrendChart } from "@/components/layout/trend-chart";
import { PurchaseGraphs } from "@/components/layout/purchase-graphs";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function formatUnitCost(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 3
  }).format(value);
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatSignedPercent(value: number) {
  const rounded = Math.round(value * 100);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

export async function AnalyticsOverview({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const language = await getRequestLanguage();
  const copy = analyticsCopy(language);
  const es = language === "es";

  function productDetail(revenue: string, margin: string) {
    return es ? `${revenue} ingresos · ${margin} margen` : `${revenue} revenue · ${margin} margin`;
  }
  function clientDetail(revenue: string, orderCount: number) {
    return es
      ? `${revenue} ingresos en ${orderCount} ${orderCount === 1 ? "pedido" : "pedidos"}.`
      : `${revenue} revenue across ${orderCount} ${orderCount === 1 ? "order" : "orders"}.`;
  }
  function monthDetail(revenue: string, marginRate: string) {
    return es
      ? `${revenue} en ingresos y ${marginRate} de tasa de margen.`
      : `${revenue} in revenue and ${marginRate} margin rate.`;
  }
  function costMovement(from: string, to: string, change: string) {
    return es ? `${from} a ${to} · ${change}` : `${from} to ${to} · ${change}`;
  }
  const insights = buildBusinessInsights(snapshot);
  const purchaseInsights = buildPurchaseInsights(snapshot);
  const reorderAlerts = buildReorderAlerts(snapshot);
  const topProduct = insights.productRows[0];
  const topClient = insights.clientRows[0];
  const topMonth = insights.trendRows.reduce((best, current) => (current.revenue > best.revenue ? current : best), insights.trendRows[0]);
  const largestIncrease = purchaseInsights.materialRows
    .filter((row) => row.absoluteChange > 0)
    .sort((left, right) => right.absoluteChange - left.absoluteChange)[0];
  const largestDecrease = purchaseInsights.materialRows
    .filter((row) => row.absoluteChange < 0)
    .sort((left, right) => left.absoluteChange - right.absoluteChange)[0];

  return (
    <Card className="rounded-[28px] p-6 md:p-8">
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <StatPill label={copy.revenue} value={formatMoney(insights.totalRevenue)} />
        <StatPill label={copy.grossMargin} value={formatMoney(insights.grossMargin)} />
        <StatPill label={copy.marginRate} value={formatPercent(insights.grossMarginRate)} />
        <StatPill label={copy.avgOrder} value={formatMoney(insights.averageOrderRevenue)} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <TrendChart rows={insights.trendRows} copy={copy} />
          <table className="console-table">
            <thead>
              <tr>
                <th>{copy.month}</th>
                <th>{copy.revenue}</th>
                <th>{copy.grossMargin}</th>
                <th>{copy.orders}</th>
              </tr>
            </thead>
            <tbody>
              {insights.trendRows.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td className="font-mono text-[0.8rem]">{formatMoney(row.revenue)}</td>
                  <td className="font-mono text-[0.8rem]">{formatMoney(row.margin)}</td>
                  <td className="font-mono text-[0.8rem]">{row.orders}</td>
                </tr>
              ))}
              {!insights.trendRows.length ? (
                <tr>
                  <td colSpan={4} className="text-center text-sm text-[var(--muted-strong)]">
                    {copy.addPrices}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="space-y-3">
          <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
              {copy.leadingProduct}
            </p>
            <p className="mt-2 font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
              {topProduct?.productName ?? copy.noProduct}
            </p>
            <p className="mt-2 text-sm text-[var(--muted-strong)]">
              {topProduct ? productDetail(formatMoney(topProduct.revenue), formatMoney(topProduct.margin)) : copy.setPricing}
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
              {copy.leadingClient}
            </p>
            <p className="mt-2 font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
              {topClient?.clientName ?? copy.noClient}
            </p>
            <p className="mt-2 text-sm text-[var(--muted-strong)]">
              {topClient ? clientDetail(formatMoney(topClient.revenue), topClient.orders) : copy.openOrdersFallback}
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
              {copy.strongestMonth}
            </p>
            <p className="mt-2 font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
              {topMonth?.label ?? copy.noMonth}
            </p>
            <p className="mt-2 text-sm text-[var(--muted-strong)]">
              {topMonth ? monthDetail(formatMoney(topMonth.revenue), formatPercent(topMonth.margin / Math.max(topMonth.revenue, 1))) : copy.monthReadings}
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
              {copy.lowStockTitle}
            </p>
            {reorderAlerts.length ? (
              <div className="mt-3 space-y-3">
                {reorderAlerts.map((alert) => (
                  <div
                    key={alert.materialId}
                    className="flex items-start justify-between rounded-lg border border-[var(--line)] bg-[var(--background-secondary)] p-3"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-[var(--ink)]">{alert.materialName}</p>
                      <p className="mt-1 text-xs text-[var(--muted-strong)]">
                        {copy.shortage}: {alert.shortageQuantity.toFixed(2)} {alert.unit}
                        {alert.supplierName && alert.supplierName !== copy.supplierGap ? (
                          <> · {alert.supplierName}</>
                        ) : null}
                      </p>
                    </div>
                    {alert.supplierEmail ? (
                      <a
                        href={`mailto:${alert.supplierEmail}?subject=Purchase%20Order%20-%20${encodeURIComponent(alert.materialName)}`}
                        className="ml-2 inline-flex items-center gap-1 rounded-md bg-[var(--accent-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)] transition-colors"
                      >
                        {copy.orderMore}
                      </a>
                    ) : (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-md bg-[var(--line)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] opacity-50">
                        {copy.contactSupplier}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-[var(--muted-strong)]">{copy.noAlerts}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-[var(--line)] pt-6">
        <SectionHeading eyebrow={copy.purchaseEyebrow} title={copy.purchaseTitle} />

        <div className="mt-5 flex flex-wrap gap-2">
          <StatPill label={copy.inventoryValue} value={formatMoney(purchaseInsights.totalInventoryValue)} />
          <StatPill label={copy.repricedMaterials} value={String(purchaseInsights.repricedMaterials)} />
          <StatPill label={copy.avgInputChange} value={formatSignedPercent(purchaseInsights.averageChangeRate)} />
          <StatPill label={copy.trackedInputs} value={String(purchaseInsights.trackedMaterials)} />
        </div>

        <div className="mt-6 space-y-4">
          <PurchaseGraphs insights={purchaseInsights} copy={copy} />

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <table className="console-table">
              <thead>
                <tr>
                  <th>{copy.purchaseMonth}</th>
                  <th>{copy.priceUpdates}</th>
                  <th>{copy.averageCost}</th>
                  <th>{copy.averageChange}</th>
                </tr>
              </thead>
              <tbody>
                {purchaseInsights.trendRows.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td className="font-mono text-[0.8rem]">{row.updates}</td>
                    <td className="font-mono text-[0.8rem]">{formatUnitCost(row.averageUnitCost)}</td>
                    <td className="font-mono text-[0.8rem]">{formatSignedPercent(row.averageChangeRate)}</td>
                  </tr>
                ))}
                {!purchaseInsights.trendRows.length ? (
                  <tr>
                    <td colSpan={4} className="text-center text-sm text-[var(--muted-strong)]">
                      {copy.captureCosts}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>

            <table className="console-table">
              <thead>
                <tr>
                  <th>{copy.material}</th>
                  <th>{copy.startingCost}</th>
                  <th>{copy.currentCost}</th>
                  <th>{copy.change}</th>
                  <th>{copy.inventoryExposure}</th>
                </tr>
              </thead>
              <tbody>
                {purchaseInsights.materialRows.slice(0, 5).map((row) => (
                  <tr key={row.materialId}>
                    <td>{row.materialName}</td>
                    <td className="font-mono text-[0.8rem]">{formatUnitCost(row.startingUnitCost)}</td>
                    <td className="font-mono text-[0.8rem]">{formatUnitCost(row.latestUnitCost)}</td>
                    <td className="font-mono text-[0.8rem]">{formatSignedPercent(row.changeRate)}</td>
                    <td className="font-mono text-[0.8rem]">{formatMoney(row.inventoryValue)}</td>
                  </tr>
                ))}
                {!purchaseInsights.materialRows.length ? (
                  <tr>
                    <td colSpan={5} className="text-center text-sm text-[var(--muted-strong)]">
                      {copy.noPurchaseData}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="space-y-3">
            <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
                {copy.biggestIncrease}
              </p>
              <p className="mt-2 font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
                {largestIncrease?.materialName ?? copy.noPurchaseData}
              </p>
              <p className="mt-2 text-sm text-[var(--muted-strong)]">
                {largestIncrease
                  ? costMovement(formatUnitCost(largestIncrease.startingUnitCost), formatUnitCost(largestIncrease.latestUnitCost), formatSignedPercent(largestIncrease.changeRate))
                  : copy.captureCosts}
              </p>
            </div>

            <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
                {copy.biggestDecrease}
              </p>
              <p className="mt-2 font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
                {largestDecrease?.materialName ?? copy.noPurchaseData}
              </p>
              <p className="mt-2 text-sm text-[var(--muted-strong)]">
                {largestDecrease
                  ? costMovement(formatUnitCost(largestDecrease.startingUnitCost), formatUnitCost(largestDecrease.latestUnitCost), formatSignedPercent(largestDecrease.changeRate))
                  : copy.captureCosts}
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </Card>
  );
}
