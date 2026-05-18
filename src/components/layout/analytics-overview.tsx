import { Card, Pill, SectionHeading, StatPill } from "@/components/ui/surfaces";
import { buildBusinessInsights } from "@/lib/domain/analytics";
import { buildReorderAlerts } from "@/lib/domain/purchasing-plan";
import { getRequestLanguage } from "@/lib/i18n-server";
import { analyticsCopy } from "@/lib/i18n";
import type { BusinessSnapshot } from "@/lib/domain/types";
import { TrendChart } from "@/components/layout/trend-chart";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export async function AnalyticsOverview({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const language = await getRequestLanguage();
  const copy = analyticsCopy(language);
  const insights = buildBusinessInsights(snapshot);
  const reorderAlerts = buildReorderAlerts(snapshot).slice(0, 3);
  const topProduct = insights.productRows[0];
  const topClient = insights.clientRows[0];
  const topMonth = insights.trendRows.reduce((best, current) => (current.revenue > best.revenue ? current : best), insights.trendRows[0]);

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
              {topProduct ? `${formatMoney(topProduct.revenue)} revenue · ${formatMoney(topProduct.margin)} margin` : copy.setPricing}
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
              {topClient ? `${formatMoney(topClient.revenue)} revenue across ${topClient.orders} order${topClient.orders === 1 ? "" : "s"}.` : copy.openOrdersFallback}
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
              {topMonth ? `${formatMoney(topMonth.revenue)} in revenue and ${formatPercent(topMonth.margin / Math.max(topMonth.revenue, 1))} margin rate.` : copy.monthReadings}
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
              {copy.reorderEyebrow}
            </p>
            <p className="mt-2 font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
              {reorderAlerts.length ? reorderAlerts[0]?.materialName : copy.noAlerts}
            </p>
            <p className="mt-2 text-sm text-[var(--muted-strong)]">
              {reorderAlerts.length
                ? `${reorderAlerts[0]?.shortageQuantity.toFixed(2)} ${reorderAlerts[0]?.unit} ${copy.uncoveredDemand} · ${reorderAlerts[0]?.supplierName ?? copy.supplierGap}`
                : copy.reorderDescription}
            </p>
            {reorderAlerts.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {reorderAlerts.map((alert) => (
                  <Pill key={alert.materialId} tone={alert.severity === "critical" ? "flame" : "amber"}>
                    {alert.severity === "critical" ? copy.critical : copy.warning}: {alert.materialName}
                  </Pill>
                ))}
              </div>
            ) : null}
          </div>
      </div>
      </div>

      {topProduct || topClient ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {topProduct ? <Pill tone="ink">{copy.leadingProduct}: {topProduct.productName}</Pill> : null}
          {topClient ? <Pill tone="moss">{copy.leadingClient}: {topClient.clientName}</Pill> : null}
          {topMonth ? <Pill tone="amber">{copy.strongestMonth}: {topMonth.label}</Pill> : null}
        </div>
      ) : null}
    </Card>
  );
}
