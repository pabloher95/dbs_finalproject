"use client";

import { Card, SectionHeading } from "@/components/ui/surfaces";
import { summarizeOrderDemand } from "@/lib/domain/orders";
import { ordersBoardCopy } from "@/lib/i18n";
import { useLanguage } from "@/components/providers/language-provider";
import type { BusinessSnapshot } from "@/lib/domain/types";

export function OrdersBoard({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const { language } = useLanguage();
  const copy = ordersBoardCopy(language);
  const demand = summarizeOrderDemand(snapshot.orders, snapshot.products);
  const activeOrdersCount = snapshot.orders.filter((order) => order.status === "open").length;
  const fulfilledOrdersCount = snapshot.orders.filter((order) => order.status === "fulfilled").length;
  const today = new Date().toISOString().slice(0, 10);
  const backlogCount = snapshot.orders.filter((order) => order.status === "open" && order.dueDate < today).length;
  const activeUnits = snapshot.orders
    .filter((order) => order.status === "open")
    .reduce((total, order) => total + order.items.reduce((sum, item) => sum + item.quantity, 0), 0);

  return (
    <div className="space-y-4">
      <Card className="rounded-[28px] p-6">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.snapshotTitle} description={copy.snapshotDescription} />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
              {copy.activeOrders}
            </p>
            <p className="mt-2 font-display text-[2.2rem] leading-none text-[var(--ink)]">{activeOrdersCount}</p>
          </div>
          <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
              {copy.fulfilledOrders}
            </p>
            <p className="mt-2 font-display text-[2.2rem] leading-none text-[var(--ink)]">{fulfilledOrdersCount}</p>
          </div>
          <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
              {copy.backlogSummary}
            </p>
            <p className="mt-2 font-display text-[2.2rem] leading-none text-[var(--ink)]">{backlogCount}</p>
          </div>
          <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
              {copy.activeUnits}
            </p>
            <p className="mt-2 font-display text-[2.2rem] leading-none text-[var(--ink)]">{activeUnits}</p>
          </div>
        </div>
        {backlogCount ? (
          <p className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
            {backlogCount} {backlogCount === 1 ? copy.backlogOrder : copy.backlogOrders}. {copy.backlogHint}
          </p>
        ) : null}
      </Card>
      <Card className="rounded-[28px] p-6">
        <SectionHeading eyebrow={copy.rollup} title={copy.demandByProduct} description={copy.description} />
        <div className="mt-5 space-y-3">
          {demand.map((row) => (
            <div
              key={row.productId}
              className="flex items-center justify-between gap-3 rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4"
            >
              <div className="min-w-0">
                <p className="font-display text-xl text-[var(--ink)]">{row.productName}</p>
                <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                  {row.openOrders} {row.openOrders === 1 ? copy.openOrder : copy.openOrders}
                </p>
              </div>
              <span className="font-display text-3xl text-[var(--ink)]">{row.totalQuantity}</span>
            </div>
          ))}
          {!demand.length ? (
            <p className="rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.7)] p-4 text-sm text-[var(--muted-strong)]">
              {copy.noDemand}
            </p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
