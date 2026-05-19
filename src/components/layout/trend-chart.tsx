"use client";

import { useState } from "react";
import { max, scaleBand, scaleLinear } from "d3";
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

export function TrendChart({
  rows,
  copy
}: Readonly<{ rows: RevenueTrendPoint[]; copy: TrendChartCopy }>) {
  const width = 720;
  const height = 300;
  const margin = { top: 20, right: 18, bottom: 54, left: 56 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const monthLabels = rows.map((row) => row.label);
  const monthScale = scaleBand<string>()
    .domain(monthLabels)
    .range([0, innerWidth])
    .paddingInner(0.18)
    .paddingOuter(0.04);
  const monthWidth = monthScale.bandwidth();
  const barGap = Math.max(8, monthWidth * 0.12);
  const barWidth = Math.max(16, (monthWidth - barGap) / 2);
  const maxValue = max(rows, (row) => Math.max(row.revenue, row.margin)) ?? 1;
  const yScale = scaleLinear()
    .domain([0, maxValue])
    .nice(4)
    .range([innerHeight, 0]);
  const ticks = yScale.ticks(4);
  const [activeIndex, setActiveIndex] = useState(0);
  const safeActiveIndex = rows.length ? Math.min(activeIndex, rows.length - 1) : 0;
  const activeRow = rows[safeActiveIndex];

  return (
    <div className="trend-chart overflow-hidden rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">{copy.trendChart}</p>
          <p className="mt-2 font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
            {copy.chartTitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <div className="flex flex-wrap items-center gap-4 text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted-strong)]">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--sand-ink)]" />
              {copy.revenue}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--vermilion)]" />
              {copy.grossMargin}
            </span>
          </div>

          {activeRow ? (
            <div className="rounded-[18px] border border-[var(--line)] bg-[var(--paper-bright)] px-4 py-3 text-sm shadow-[0_12px_30px_-24px_rgba(0,0,0,0.45)]">
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[var(--muted)]">{activeRow.label}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[var(--ink)]">
                <span>{copy.revenue}: {formatMoney(activeRow.revenue)}</span>
                <span>{copy.grossMargin}: {formatMoney(activeRow.margin)}</span>
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--muted-strong)]">
                  {copy.orders}: {activeRow.orders}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="mt-5 h-auto w-full" role="img" aria-label="Monthly revenue and gross margin chart">
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {ticks.map((tick) => {
            const y = yScale(tick);
            return (
              <g key={tick}>
                <line
                  x1={0}
                  x2={innerWidth}
                  y1={y}
                  y2={y}
                  stroke="var(--line-soft)"
                  strokeWidth="1"
                  strokeDasharray={tick === 0 ? undefined : "4 8"}
                />
                <text x={-12} y={y + 4} textAnchor="end" className="fill-[var(--muted)] font-mono text-[10px]">
                  {formatMoney(tick)}
                </text>
              </g>
            );
          })}

          {rows.map((row, index) => {
            const x = monthScale(row.label) ?? 0;
            const revenueHeight = innerHeight - yScale(row.revenue);
            const marginHeight = innerHeight - yScale(row.margin);
            const isActive = index === safeActiveIndex;

            return (
              <g key={row.label}>
                <rect
                  x={x}
                  y={0}
                  width={monthWidth}
                  height={innerHeight}
                  rx="18"
                  fill={isActive ? "rgba(46,83,57,0.05)" : "transparent"}
                />

                <rect
                  x={x}
                  y={yScale(row.revenue)}
                  width={barWidth}
                  height={Math.max(2, revenueHeight)}
                  rx="16"
                  fill="var(--sand-ink)"
                  opacity={isActive ? 1 : 0.88}
                />
                <rect
                  x={x + barWidth + barGap}
                  y={yScale(row.margin)}
                  width={barWidth}
                  height={Math.max(2, marginHeight)}
                  rx="16"
                  fill="var(--vermilion)"
                  opacity={isActive ? 1 : 0.94}
                />

                <text
                  x={x + monthWidth / 2}
                  y={innerHeight + 20}
                  textAnchor="middle"
                  className="fill-[var(--muted-strong)] font-mono text-[10px]"
                >
                  {row.label}
                </text>

                <rect
                  x={x - 4}
                  y={-4}
                  width={monthWidth + 8}
                  height={innerHeight + 34}
                  rx="18"
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${row.label}: ${copy.revenue} ${formatMoney(row.revenue)}, ${copy.grossMargin} ${formatMoney(row.margin)}, ${copy.orders} ${row.orders}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {!rows.length ? (
        <p className="mt-2 text-sm text-[var(--muted-strong)]">{copy.addPrices}</p>
      ) : null}
    </div>
  );
}
