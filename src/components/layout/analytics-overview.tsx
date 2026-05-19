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
    <Card variant="featured" className="rounded-[28px] p-6 md:p-8">
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

          <div className={`rounded-[24px] border p-5 ${reorderAlerts.length ? "border-rose-300 bg-rose-50/40" : "border-[var(--line)] bg-[rgba(255,255,255,0.72)]"}`}>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
              {copy.lowStockTitle}
            </p>
            {reorderAlerts.length ? (
              <div className="mt-3 space-y-3">
                {reorderAlerts.map((alert) => (
                  <div
                    key={alert.materialId}
                    className="flex items-start justify-between rounded-lg border border-[var(--line)] bg-white p-3"
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
                    <div className="ml-2 flex shrink-0 gap-1.5">
                      {alert.supplierEmail ? (
                        <a
                          href={`mailto:${alert.supplierEmail}?subject=Purchase%20Order%20-%20${encodeURIComponent(alert.materialName)}`}
                          className="inline-flex items-center gap-1 rounded-md bg-[var(--botanical)] px-2.5 py-1.5 text-xs font-medium transition-opacity hover:opacity-85"
                          style={{ color: "#ffffff" }}
                          title={alert.supplierEmail}
                        >
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M1 5.5l7 4.5 7-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          {copy.emailSupplier}
                        </a>
                      ) : null}
                      {alert.supplierPhone ? (
                        <a
                          href={`tel:${alert.supplierPhone}`}
                          className="inline-flex items-center gap-1 rounded-md border border-[var(--line-strong)] bg-white px-2.5 py-1.5 text-xs font-medium text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
                          title={alert.supplierPhone}
                        >
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path d="M3 2h3l1.5 3.5-1.5 1a8 8 0 003.5 3.5l1-1.5L14 10v3a1 1 0 01-1 1C6.373 14 2 9.627 2 4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {copy.callSupplier}
                        </a>
                      ) : null}
                      {!alert.supplierEmail && !alert.supplierPhone ? (
                        <span className="inline-flex items-center rounded-md bg-[var(--line)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted)] opacity-50">
                          {copy.contactSupplier}
                        </span>
                      ) : null}
                    </div>
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

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {[
            { label: copy.inventoryValue, value: formatMoney(purchaseInsights.totalInventoryValue), sub: null },
            { label: copy.repricedMaterials, value: String(purchaseInsights.repricedMaterials), sub: null },
            { label: copy.avgInputChange, value: formatSignedPercent(purchaseInsights.averageChangeRate), sub: null },
            { label: copy.trackedInputs, value: String(purchaseInsights.trackedMaterials), sub: null },
            {
              label: copy.biggestIncrease,
              value: largestIncrease ? formatSignedPercent(largestIncrease.changeRate) : "—",
              sub: largestIncrease?.materialName ?? null
            },
            {
              label: copy.biggestDecrease,
              value: largestDecrease ? formatSignedPercent(largestDecrease.changeRate) : "—",
              sub: largestDecrease?.materialName ?? null
            }
          ].map(({ label, value, sub }) => (
            <div
              key={label}
              className="flex flex-col justify-center rounded-[20px] border border-[rgba(19,36,58,0.12)] bg-[rgba(255,255,255,0.56)] px-4 py-3 backdrop-blur"
            >
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-[var(--muted)]">{label}</span>
              <span className="mt-1 font-display text-xl leading-none">{value}</span>
              {sub ? (
                <span className="mt-1 truncate font-mono text-[0.6rem] text-[var(--muted-strong)]">{sub}</span>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <PurchaseGraphs insights={purchaseInsights} copy={copy} />

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
      </div>
    </Card>
  );
}
