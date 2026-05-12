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
type ActiveBar = {
  rowIndex: number;
  series: "revenue" | "margin";
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
  const barsPerGroup = 2;
  const groupWidth = rows.length ? (width - paddingX * 2 - barGap * (rows.length - 1)) / rows.length : 0;
  const barWidth = Math.max((groupWidth - 14) / barsPerGroup, 8);
  const maxValue = Math.max(
    1,
    ...rows.flatMap((row) => [row.revenue, row.margin]).map((value) => Math.max(value, 0))
  );
  const [activeBar, setActiveBar] = useState<ActiveBar | null>(null);

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
          const activeRow = activeBar?.rowIndex === index ? row : null;
          const activeSeriesLabel =
            activeRow && activeBar?.series === "revenue" ? copy.revenue : activeRow ? copy.grossMargin : null;
          const activeValue = activeRow ? (activeBar?.series === "revenue" ? row.revenue : row.margin) : null;
          const activeValueText = activeValue === null ? null : formatMoney(activeValue);
          const tooltipHeight = 54;
          const activeTooltipWidth = activeBar?.series === "revenue" ? 164 : 160;
          const revenueTooltipX = Math.min(Math.max(revenueX + barWidth / 2 - 82, 8), width - 164 - 8);
          const marginTooltipX = Math.min(Math.max(marginX + barWidth / 2 - 80, 8), width - 160 - 8);
          const revenueTooltipY = Math.max(8, revenueY - tooltipHeight - 10);
          const marginTooltipY = Math.max(8, marginY - tooltipHeight - 10);

          return (
            <g
              key={row.label}
              className="trend-series"
            >
              <rect
                x={revenueX}
                y={revenueY}
                width={barWidth}
                height={revenueHeight}
                rx="8"
                className="trend-bar trend-bar--revenue"
                tabIndex={0}
                onFocus={() => setActiveBar({ rowIndex: index, series: "revenue" })}
                onBlur={() => setActiveBar((current) => (current?.rowIndex === index && current.series === "revenue" ? null : current))}
                onMouseEnter={() => setActiveBar({ rowIndex: index, series: "revenue" })}
                onMouseLeave={() => setActiveBar((current) => (current?.rowIndex === index && current.series === "revenue" ? null : current))}
              />
              <rect
                x={marginX}
                y={marginY}
                width={barWidth}
                height={marginHeight}
                rx="8"
                className="trend-bar trend-bar--margin"
                tabIndex={0}
                onFocus={() => setActiveBar({ rowIndex: index, series: "margin" })}
                onBlur={() => setActiveBar((current) => (current?.rowIndex === index && current.series === "margin" ? null : current))}
                onMouseEnter={() => setActiveBar({ rowIndex: index, series: "margin" })}
                onMouseLeave={() => setActiveBar((current) => (current?.rowIndex === index && current.series === "margin" ? null : current))}
              />
              <text x={groupX + groupWidth / 2} y={height - 14} textAnchor="middle" className="fill-[var(--muted-strong)] font-mono text-[10px]">
                {row.label}
              </text>

              {activeRow && activeBar?.series === "revenue" ? (
                <g className="trend-tooltip" pointerEvents="none">
                  <rect
                    x={revenueTooltipX}
                    y={revenueTooltipY}
                    width={activeTooltipWidth}
                    height={tooltipHeight}
                    rx="12"
                    fill="var(--paper-bright)"
                    stroke="var(--ink)"
                    strokeWidth="1"
                  />
                  <path
                    d={`M ${revenueX + barWidth / 2 - 6} ${revenueTooltipY + tooltipHeight} L ${revenueX + barWidth / 2} ${revenueTooltipY + tooltipHeight + 8} L ${revenueX + barWidth / 2 + 6} ${revenueTooltipY + tooltipHeight} Z`}
                    fill="var(--paper-bright)"
                    stroke="var(--ink)"
                    strokeWidth="1"
                  />
                  <text x={revenueTooltipX + 12} y={revenueTooltipY + 18} className="fill-[var(--muted)] font-mono text-[10px] uppercase tracking-[0.22em]">
                    {row.label}
                  </text>
                  <text x={revenueTooltipX + 12} y={revenueTooltipY + 36} className="fill-[var(--ink)] font-display text-[12px]">
                    {activeValueText} {activeSeriesLabel}
                  </text>
                  <text x={revenueTooltipX + 12} y={revenueTooltipY + 48} className="fill-[var(--muted-strong)] font-mono text-[9px] uppercase tracking-[0.18em]">
                    {copy.orders}: {row.orders}
                  </text>
                </g>
              ) : null}
              {activeRow && activeBar?.series === "margin" ? (
                <g className="trend-tooltip" pointerEvents="none">
                  <rect
                    x={marginTooltipX}
                    y={marginTooltipY}
                    width={activeTooltipWidth}
                    height={tooltipHeight}
                    rx="12"
                    fill="var(--paper-bright)"
                    stroke="var(--ink)"
                    strokeWidth="1"
                  />
                  <path
                    d={`M ${marginX + barWidth / 2 - 6} ${marginTooltipY + tooltipHeight} L ${marginX + barWidth / 2} ${marginTooltipY + tooltipHeight + 8} L ${marginX + barWidth / 2 + 6} ${marginTooltipY + tooltipHeight} Z`}
                    fill="var(--paper-bright)"
                    stroke="var(--ink)"
                    strokeWidth="1"
                  />
                  <text x={marginTooltipX + 12} y={marginTooltipY + 18} className="fill-[var(--muted)] font-mono text-[10px] uppercase tracking-[0.22em]">
                    {row.label}
                  </text>
                  <text x={marginTooltipX + 12} y={marginTooltipY + 36} className="fill-[var(--ink)] font-display text-[12px]">
                    {formatMoney(row.margin)} {copy.grossMargin}
                  </text>
                  <text x={marginTooltipX + 12} y={marginTooltipY + 48} className="fill-[var(--muted-strong)] font-mono text-[9px] uppercase tracking-[0.18em]">
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
