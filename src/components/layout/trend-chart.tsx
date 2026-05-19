"use client";

import { useState, useRef } from "react";
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
type Tooltip = { x: number; y: number; label: string; lines: string[] };

export function TrendChart({
  rows,
  copy
}: Readonly<{ rows: RevenueTrendPoint[]; copy: TrendChartCopy }>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
  const safeActiveIndex = rows.length ? Math.min(activeIndex, rows.length - 1) : 0;

  function show(e: React.MouseEvent, index: number, label: string, lines: string[]) {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    const targetRect = (e.currentTarget as Element).getBoundingClientRect();
    setActiveIndex(index);
    setTooltip({
      x: targetRect.left + targetRect.width / 2 - containerRect.left,
      y: targetRect.top - containerRect.top,
      label,
      lines
    });
  }

  return (
    <div
      ref={containerRef}
      className="relative trend-chart overflow-hidden rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5"
      onMouseLeave={() => setTooltip(null)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">{copy.trendChart}</p>
          <p className="mt-2 font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
            {copy.chartTitle}
          </p>
        </div>
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
                  style={{ cursor: "crosshair" }}
                  tabIndex={0}
                  aria-label={`${row.label}: ${copy.revenue} ${formatMoney(row.revenue)}, ${copy.grossMargin} ${formatMoney(row.margin)}, ${copy.orders} ${row.orders}`}
                  onMouseEnter={(e) =>
                    show(e, index, row.label, [
                      `${copy.revenue}: ${formatMoney(row.revenue)}`,
                      `${copy.grossMargin}: ${formatMoney(row.margin)}`,
                      `${copy.orders}: ${row.orders}`
                    ])
                  }
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

      {tooltip ? (
        <div
          className="pointer-events-none absolute z-10 min-w-[160px] -translate-x-1/2 rounded-[16px] border border-[var(--line)] bg-white/95 p-3 shadow-lg backdrop-blur-sm"
          style={{ left: tooltip.x, top: tooltip.y - 8 }}
        >
          <p className="font-display text-sm text-[var(--ink)]">{tooltip.label}</p>
          {tooltip.lines.map((line) => (
            <p key={line} className="mt-1 font-mono text-[0.7rem] text-[var(--muted-strong)]">
              {line}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
