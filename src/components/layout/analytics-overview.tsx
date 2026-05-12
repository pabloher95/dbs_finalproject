import { Card, Pill, SectionHeading, StatPill } from "@/components/ui/surfaces";
import { buildBusinessInsights } from "@/lib/domain/analytics";
import type { BusinessSnapshot } from "@/lib/domain/types";

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

export function AnalyticsOverview({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const insights = buildBusinessInsights(snapshot);
  const topProduct = insights.productRows[0];
  const topClient = insights.clientRows[0];
  const topMonth = insights.trendRows.reduce((best, current) => (current.revenue > best.revenue ? current : best), insights.trendRows[0]);

  return (
    <Card className="rounded-[28px] p-6 md:p-8">
      <SectionHeading
        eyebrow="Readings"
        title="Revenue, margin, and trend signals"
        description="Descriptive analytics built from the current order book, product pricing, and material costs. No forecasts yet, just the shape of the business."
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <StatPill label="Revenue" value={formatMoney(insights.totalRevenue)} />
        <StatPill label="Gross margin" value={formatMoney(insights.grossMargin)} />
        <StatPill label="Margin rate" value={formatPercent(insights.grossMarginRate)} />
        <StatPill label="Avg. order" value={formatMoney(insights.averageOrderRevenue)} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)]">
          <table className="console-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Margin</th>
                <th>Orders</th>
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
                    No revenue trend is available yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="space-y-3">
          <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
              Leading product
            </p>
            <p className="mt-2 font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
              {topProduct?.productName ?? "No product data yet"}
            </p>
            <p className="mt-2 text-sm text-[var(--muted-strong)]">
              {topProduct ? `${formatMoney(topProduct.revenue)} revenue · ${formatMoney(topProduct.margin)} margin` : "Set product prices and material costs to unlock revenue analysis."}
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
              Leading client
            </p>
            <p className="mt-2 font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
              {topClient?.clientName ?? "No client data yet"}
            </p>
            <p className="mt-2 text-sm text-[var(--muted-strong)]">
              {topClient ? `${formatMoney(topClient.revenue)} revenue across ${topClient.orders} order${topClient.orders === 1 ? "" : "s"}.` : "Open orders will appear here once pricing is in place."}
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
              Strongest month
            </p>
            <p className="mt-2 font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
              {topMonth?.label ?? "No month data yet"}
            </p>
            <p className="mt-2 text-sm text-[var(--muted-strong)]">
              {topMonth ? `${formatMoney(topMonth.revenue)} in revenue and ${formatPercent(topMonth.margin / Math.max(topMonth.revenue, 1))} margin rate.` : "Month-over-month readings appear once orders are priced."}
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
              Working note
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-strong)]">
              {insights.totalRevenue > 0
                ? "The business is already showing a priced order mix. Use the product and customer leaders as your first descriptive checks before adding any forecast layer."
                : "Add product prices and material costs to surface revenue, margin, and trend readings in the dashboard."}
            </p>
          </div>
        </div>
      </div>

      {topProduct || topClient ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {topProduct ? <Pill tone="ink">Top product: {topProduct.productName}</Pill> : null}
          {topClient ? <Pill tone="moss">Top client: {topClient.clientName}</Pill> : null}
          {topMonth ? <Pill tone="amber">Top month: {topMonth.label}</Pill> : null}
        </div>
      ) : null}
    </Card>
  );
}
