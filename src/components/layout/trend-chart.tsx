"use client";

import { useState } from "react";
import type { RevenueTrendPoint } from "@/lib/domain/analytics";
import { analyticsCopy } from "@/lib/i18n";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

type TrendChartCopy = ReturnType<typeof analyticsCopy>;
type ActiveSegment = {
  rowIndex: number;
  series: "cost" | "margin";
};

export function TrendChart({
  rows,
  copy
}: Readonly<{ rows: RevenueTrendPoint[]; copy: TrendChartCopy }>) {
  const width = 720;
  const height = 260;
  const paddingX = 48;
  const paddingTop = 28;
  const paddingBottom = 40;
  const plotHeight = height - paddingTop - paddingBottom;
  const barGap = 14;
  const groupWidth = rows.length ? (width - paddingX * 2 - barGap * (rows.length - 1)) / rows.length : 0;
  const barWidth = Math.max(groupWidth - 8, 14);
  const maxValue = Math.max(1, ...rows.map((row) => Math.max(row.revenue, 0)));
  const [activeSegment, setActiveSegment] = useState<ActiveSegment | null>(null);

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
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--sand-ink)]" />
            {copy.cost}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--vermilion)]" />
            {copy.grossMargin}
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-auto w-full" role="img" aria-label="Monthly revenue composition chart">
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
          const costHeight = (row.cost / maxValue) * plotHeight;
          const marginHeight = (row.margin / maxValue) * plotHeight;
          const barX = groupX + (groupWidth - barWidth) / 2;
          const barY = paddingTop + (plotHeight - revenueHeight);
          const costY = paddingTop + (plotHeight - costHeight);
          const marginY = barY;
          const activeRow = activeSegment?.rowIndex === index ? row : null;
          const activeSeriesLabel = activeSegment?.series === "cost" ? copy.cost : copy.grossMargin;
          const activeValue = activeRow ? (activeSegment?.series === "cost" ? row.cost : row.margin) : null;
          const activeValueText = activeValue === null ? null : formatMoney(activeValue);
          const tooltipHeight = 66;
          const activeTooltipWidth = 172;
          const tooltipX = Math.min(Math.max(barX + barWidth / 2 - activeTooltipWidth / 2, 8), width - activeTooltipWidth - 8);
          const tooltipAnchorY = activeSegment?.series === "cost" ? costY : marginY;
          const tooltipY = Math.max(8, tooltipAnchorY - tooltipHeight - 10);

          return (
            <g
              key={row.label}
              className="trend-series"
            >
              <rect
                x={barX}
                y={costY}
                width={barWidth}
                height={costHeight}
                rx="8"
                fill="var(--sand-ink)"
                opacity="0.75"
                tabIndex={0}
                onFocus={() => setActiveSegment({ rowIndex: index, series: "cost" })}
                onBlur={() => setActiveSegment((current) => (current?.rowIndex === index && current.series === "cost" ? null : current))}
                onMouseEnter={() => setActiveSegment({ rowIndex: index, series: "cost" })}
                onMouseLeave={() => setActiveSegment((current) => (current?.rowIndex === index && current.series === "cost" ? null : current))}
              />
              <rect
                x={barX}
                y={marginY}
                width={barWidth}
                height={marginHeight}
                rx="8"
                className="trend-bar trend-bar--revenue"
                tabIndex={0}
                onFocus={() => setActiveSegment({ rowIndex: index, series: "margin" })}
                onBlur={() => setActiveSegment((current) => (current?.rowIndex === index && current.series === "margin" ? null : current))}
                onMouseEnter={() => setActiveSegment({ rowIndex: index, series: "margin" })}
                onMouseLeave={() => setActiveSegment((current) => (current?.rowIndex === index && current.series === "margin" ? null : current))}
              />
              <text x={groupX + groupWidth / 2} y={height - 14} textAnchor="middle" className="fill-[var(--muted-strong)] font-mono text-[10px]">
                {row.label}
              </text>

              {activeRow ? (
                <g className="trend-tooltip" pointerEvents="none">
                  <rect
                    x={tooltipX}
                    y={tooltipY}
                    width={activeTooltipWidth}
                    height={tooltipHeight}
                    rx="12"
                    fill="var(--paper-bright)"
                    stroke="var(--ink)"
                    strokeWidth="1"
                  />
                  <path
                    d={`M ${barX + barWidth / 2 - 6} ${tooltipY + tooltipHeight} L ${barX + barWidth / 2} ${tooltipY + tooltipHeight + 8} L ${barX + barWidth / 2 + 6} ${tooltipY + tooltipHeight} Z`}
                    fill="var(--paper-bright)"
                    stroke="var(--ink)"
                    strokeWidth="1"
                  />
                  <text x={tooltipX + 12} y={tooltipY + 18} className="fill-[var(--muted)] font-mono text-[10px] uppercase tracking-[0.22em]">
                    {row.label}
                  </text>
                  <text x={tooltipX + 12} y={tooltipY + 36} className="fill-[var(--ink)] font-display text-[12px]">
                    {activeValueText} {activeSeriesLabel}
                  </text>
                  <text x={tooltipX + 12} y={tooltipY + 49} className="fill-[var(--muted-strong)] font-mono text-[9px] uppercase tracking-[0.18em]">
                    {copy.revenue}: {formatMoney(row.revenue)}
                  </text>
                  <text x={tooltipX + 12} y={tooltipY + 61} className="fill-[var(--muted-strong)] font-mono text-[9px] uppercase tracking-[0.18em]">
                    {copy.orders}: {row.orders}
                  </text>
                </g>
              ) : null}
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
