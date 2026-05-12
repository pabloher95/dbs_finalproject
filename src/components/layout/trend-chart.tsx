"use client";

import { useMemo, useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeRow = activeIndex === null ? null : rows[activeIndex] ?? null;
  const activeSummary = useMemo(() => {
    if (!activeRow) return null;
    return [
      { label: copy.revenue, value: formatMoney(activeRow.revenue) },
      { label: copy.grossMargin, value: formatMoney(activeRow.margin) },
      { label: copy.orders, value: String(activeRow.orders) }
    ];
  }, [activeRow, copy]);

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

      <div className="mt-4 rounded-[20px] border border-[var(--line)] bg-[var(--paper-bright)] p-4 transition-colors">
        {activeSummary ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
                {activeRow?.label}
              </p>
              <p className="mt-1 font-display text-xl leading-none tracking-tight text-[var(--ink)]">
                {activeRow ? `${activeRow.label} · ${activeRow.orders} ${copy.orders.toLowerCase()}` : null}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeSummary.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted-strong)]"
                >
                  {item.label} <strong className="font-display text-sm tracking-normal text-[var(--ink)]">{item.value}</strong>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
            {copy.hoverHint}
          </p>
        )}
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
            <g
              key={row.label}
              className="trend-series"
              tabIndex={0}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex((current) => (current === index ? null : current))}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex((current) => (current === index ? null : current))}
            >
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
