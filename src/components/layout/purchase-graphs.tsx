import { max, scaleBand, scaleLinear } from "d3";
import type { PurchaseInsights } from "@/lib/domain/analytics";
import { analyticsCopy } from "@/lib/i18n";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 3
  }).format(value);
}

function formatPercent(value: number) {
  const rounded = Math.round(value * 100);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

type AnalyticsCopy = ReturnType<typeof analyticsCopy>;

export function PurchaseGraphs({
  insights,
  copy
}: Readonly<{
  insights: PurchaseInsights;
  copy: AnalyticsCopy;
}>) {
  const monthlyWidth = 640;
  const monthlyHeight = 250;
  const monthlyMargin = { top: 18, right: 18, bottom: 42, left: 58 };
  const monthlyInnerWidth = monthlyWidth - monthlyMargin.left - monthlyMargin.right;
  const monthlyInnerHeight = monthlyHeight - monthlyMargin.top - monthlyMargin.bottom;
  const monthlyLabels = insights.trendRows.map((row) => row.label);
  const monthScale = scaleBand<string>()
    .domain(monthlyLabels)
    .range([0, monthlyInnerWidth])
    .paddingInner(0.28)
    .paddingOuter(0.08);
  const monthBandwidth = monthScale.bandwidth();
  const monthlyMax = max(insights.trendRows, (row) => Math.max(row.averageUnitCost, row.updates)) ?? 1;
  const costScale = scaleLinear()
    .domain([0, monthlyMax])
    .nice(4)
    .range([monthlyInnerHeight, 0]);
  const costPath = insights.trendRows
    .map((row, index) => {
      const x = (monthScale(row.label) ?? 0) + monthBandwidth / 2;
      const y = costScale(row.averageUnitCost);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const materialWidth = 640;
  const materialHeight = 250;
  const materialMargin = { top: 18, right: 18, bottom: 28, left: 164 };
  const materialInnerWidth = materialWidth - materialMargin.left - materialMargin.right;
  const materialInnerHeight = materialHeight - materialMargin.top - materialMargin.bottom;
  const materialRows = insights.materialRows.slice(0, 6);
  const changeScale = scaleLinear()
    .domain([0, max(materialRows, (row) => Math.abs(row.absoluteChange)) ?? 1])
    .nice(4)
    .range([0, materialInnerWidth]);
  const rowScale = scaleBand<string>()
    .domain(materialRows.map((row) => row.materialId))
    .range([0, materialInnerHeight])
    .paddingInner(0.28)
    .paddingOuter(0.1);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
          {copy.purchaseGraphEyebrow}
        </p>
        <p className="mt-2 font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
          {copy.purchaseGraphTitle}
        </p>
        <p className="mt-2 text-sm text-[var(--muted-strong)]">{copy.purchaseGraphSubtitle}</p>

        <svg viewBox={`0 0 ${monthlyWidth} ${monthlyHeight}`} className="mt-4 h-auto w-full" role="img" aria-label={copy.purchaseGraphTitle}>
          <g transform={`translate(${monthlyMargin.left}, ${monthlyMargin.top})`}>
            {costScale.ticks(4).map((tick) => (
              <g key={tick}>
                <line x1={0} x2={monthlyInnerWidth} y1={costScale(tick)} y2={costScale(tick)} stroke="var(--line-soft)" strokeWidth="1" />
                <text x={-10} y={costScale(tick) + 4} textAnchor="end" className="fill-[var(--muted)] font-mono text-[10px]">
                  {formatMoney(tick)}
                </text>
              </g>
            ))}

            {insights.trendRows.map((row) => {
              const x = monthScale(row.label) ?? 0;
              const lineY = costScale(row.averageUnitCost);
              const barHeight = Math.max(2, monthlyInnerHeight - lineY);
              return (
                <g key={row.label}>
                  <rect x={x} y={lineY} width={monthBandwidth} height={barHeight} rx="14" fill="rgba(46,83,57,0.10)" />
                  <circle cx={x + monthBandwidth / 2} cy={lineY} r="5" fill="var(--botanical)" />
                  <text x={x + monthBandwidth / 2} y={monthlyInnerHeight + 18} textAnchor="middle" className="fill-[var(--muted-strong)] font-mono text-[10px]">
                    {row.label}
                  </text>
                </g>
              );
            })}

            <path d={costPath} fill="none" stroke="var(--botanical)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          </g>
        </svg>

        <div className="mt-2 flex flex-wrap gap-3 text-[0.66rem] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--botanical)]" />
            {copy.averageCost}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[rgba(46,83,57,0.10)]" />
            {copy.priceUpdates}
          </span>
        </div>
      </article>

      <article className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
          {copy.purchaseMaterialGraphEyebrow}
        </p>
        <p className="mt-2 font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
          {copy.purchaseMaterialGraphTitle}
        </p>
        <p className="mt-2 text-sm text-[var(--muted-strong)]">{copy.purchaseMaterialGraphSubtitle}</p>

        <svg viewBox={`0 0 ${materialWidth} ${materialHeight}`} className="mt-4 h-auto w-full" role="img" aria-label={copy.purchaseMaterialGraphTitle}>
          <g transform={`translate(${materialMargin.left}, ${materialMargin.top})`}>
            {materialRows.map((row) => {
              const y = rowScale(row.materialId) ?? 0;
              const barWidth = changeScale(Math.abs(row.absoluteChange));
              return (
                <g key={row.materialId} transform={`translate(0, ${y})`}>
                  <text x={-10} y={rowScale.bandwidth() / 2 + 4} textAnchor="end" className="fill-[var(--ink)] font-display text-[13px]">
                    {row.materialName}
                  </text>
                  <rect x={0} y={0} width={materialInnerWidth} height={rowScale.bandwidth()} rx="14" fill="rgba(22,22,24,0.04)" />
                  <rect x={0} y={2} width={barWidth} height={rowScale.bandwidth() - 4} rx="12" fill={row.absoluteChange >= 0 ? "var(--botanical)" : "var(--data-amber)"} />
                  <text x={barWidth + 10} y={rowScale.bandwidth() / 2 + 4} className="fill-[var(--ink)] font-mono text-[10px] uppercase tracking-[0.18em]">
                    {formatPercent(row.changeRate)}
                  </text>
                  <text x={materialInnerWidth} y={rowScale.bandwidth() / 2 + 4} textAnchor="end" className="fill-[var(--muted-strong)] font-mono text-[10px] uppercase tracking-[0.18em]">
                    {formatMoney(row.latestUnitCost)}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {!materialRows.length ? <p className="mt-2 text-sm text-[var(--muted-strong)]">{copy.noPurchaseData}</p> : null}
      </article>
    </div>
  );
}
