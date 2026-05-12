import { Card, Pill, SectionHeading, StatPill } from "@/components/ui/surfaces";
import { buildBusinessInsights, type RevenueTrendPoint } from "@/lib/domain/analytics";
import { getRequestLanguage } from "@/lib/i18n-server";
import { analyticsCopy } from "@/lib/i18n";
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

export async function AnalyticsOverview({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const language = await getRequestLanguage();
  const copy = analyticsCopy(language);
  const insights = buildBusinessInsights(snapshot);
  const topProduct = insights.productRows[0];
  const topClient = insights.clientRows[0];
  const topMonth = insights.trendRows.reduce((best, current) => (current.revenue > best.revenue ? current : best), insights.trendRows[0]);

  return (
    <Card className="rounded-[28px] p-6 md:p-8">
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
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
                    {copy.noTrend}
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
              {copy.workingNote}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-strong)]">
              {insights.totalRevenue > 0
                ? copy.checks
                : copy.addPrices}
            </p>
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

function TrendChart({
  rows,
  copy
}: Readonly<{ rows: RevenueTrendPoint[]; copy: ReturnType<typeof analyticsCopy> }>) {
  const width = 720;
  const height = 260;
  const paddingX = 48;
  const paddingTop = 28;
  const paddingBottom = 40;
  const plotHeight = height - paddingTop - paddingBottom;
  const barGap = 14;
  const barsPerGroup = 2;
  const groupWidth = rows.length ? (width - paddingX * 2 - barGap * (rows.length - 1)) / rows.length : 0;
  const barWidth = Math.max((groupWidth - 14) / barsPerGroup, 8);
  const maxValue = Math.max(
    1,
    ...rows.flatMap((row) => [row.revenue, row.margin]).map((value) => Math.max(value, 0))
  );

  return (
    <div className="trend-chart overflow-hidden rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">{copy.trendChart}</p>
          <p className="mt-2 font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
            {copy.chartTitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted-strong)]">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--vermilion)]" />
            {copy.revenue}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--data-moss)]" />
            {copy.grossMargin}
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-auto w-full" role="img" aria-label="Monthly revenue and margin chart">
        {[0, 0.5, 1].map((fraction) => {
          const y = paddingTop + plotHeight * fraction;
          return (
            <g key={fraction}>
              <line x1={paddingX} x2={width - paddingX} y1={y} y2={y} stroke="var(--line-soft)" strokeWidth="1" />
              <text x={10} y={y + 4} className="fill-[var(--muted)] font-mono text-[10px]">
                {formatMoney(maxValue * (1 - fraction))}
              </text>
            </g>
          );
        })}

        {rows.map((row, index) => {
          const groupX = paddingX + index * (groupWidth + barGap);
          const revenueHeight = (row.revenue / maxValue) * plotHeight;
          const marginHeight = (row.margin / maxValue) * plotHeight;
          const revenueX = groupX;
          const marginX = groupX + barWidth + 10;
          const revenueY = paddingTop + (plotHeight - revenueHeight);
          const marginY = paddingTop + (plotHeight - marginHeight);

          return (
            <g key={row.label} className="trend-series">
              <title>
                {row.label}: {formatMoney(row.revenue)} revenue, {formatMoney(row.margin)} margin, {row.orders} orders
              </title>
              <rect
                x={revenueX}
                y={revenueY}
                width={barWidth}
                height={revenueHeight}
                rx="8"
                className="trend-bar trend-bar--revenue"
              />
              <rect
                x={marginX}
                y={marginY}
                width={barWidth}
                height={marginHeight}
                rx="8"
                className="trend-bar trend-bar--margin"
              />
              <text x={groupX + groupWidth / 2} y={height - 14} textAnchor="middle" className="fill-[var(--muted-strong)] font-mono text-[10px]">
                {row.label}
              </text>
            </g>
          );
        })}
      </svg>
      {!rows.length ? (
        <p className="mt-2 text-sm text-[var(--muted-strong)]">{copy.addPrices}</p>
      ) : null}
    </div>
  );
}
