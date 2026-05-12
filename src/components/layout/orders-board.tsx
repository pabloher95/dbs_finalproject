"use client";

import { Card, Pill, SectionHeading } from "@/components/ui/surfaces";
import { summarizeOrderDemand } from "@/lib/domain/orders";
import { ordersBoardCopy } from "@/lib/i18n";
import { useLanguage } from "@/components/providers/language-provider";
import type { BusinessSnapshot, Order } from "@/lib/domain/types";

function statusTone(status: Order["status"]): "moss" | "amber" | "flame" {
  if (status === "open") return "flame";
  return "moss";
}

function isBacklogOrder(order: Order) {
  return order.status === "open" && order.dueDate <= new Date().toISOString().slice(0, 10);
}

export function OrdersBoard({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const { language } = useLanguage();
  const copy = ordersBoardCopy(language);
  const demand = summarizeOrderDemand(snapshot.orders, snapshot.products);
  const backlogCount = snapshot.orders.filter(isBacklogOrder).length;
  const orders = [...snapshot.orders].sort((left, right) => {
    const leftRank = left.status === "fulfilled" ? 2 : isBacklogOrder(left) ? 0 : 1;
    const rightRank = right.status === "fulfilled" ? 2 : isBacklogOrder(right) ? 0 : 1;
    if (leftRank !== rightRank) return leftRank - rightRank;
    return left.dueDate.localeCompare(right.dueDate) || left.orderNumber.localeCompare(right.orderNumber);
  });

  return (
    <div className="space-y-4">
      <Card className="rounded-[28px] p-6">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
        />
        {backlogCount ? (
          <p className="mt-3 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
            {backlogCount} {backlogCount === 1 ? copy.backlogOrder : copy.backlogOrders}. {copy.backlogHint}
          </p>
        ) : null}
      </Card>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[28px] p-6">
          <div className="space-y-3">
            {orders.map((order) => (
              <article
                key={order.id}
                className={`rounded-[24px] border p-5 ${
                  isBacklogOrder(order)
                    ? "border-[rgba(223,151,27,0.45)] bg-[rgba(223,151,27,0.08)]"
                    : "border-[var(--line)] bg-[rgba(255,255,255,0.72)]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display text-2xl text-[var(--ink)]">{order.orderNumber}</p>
                      <Pill tone={statusTone(order.status)}>{order.status === "open" ? copy.open : copy.fulfilled}</Pill>
                      {isBacklogOrder(order) ? <Pill tone="amber">{copy.backlog}</Pill> : null}
                    </div>
                    <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                      {order.clientName} · {copy.due} {order.dueDate}
                    </p>
                  </div>
                  <Pill tone="ink">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} {copy.units}
                  </Pill>
                </div>
                <div className="mt-4 divide-rule overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--panel-strong)]">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between px-3 py-2 text-sm">
                      <span>{item.productName}</span>
                      <span className="font-mono text-[var(--muted-strong)]">{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
            {!snapshot.orders.length ? (
              <p className="rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.7)] p-4 text-sm text-[var(--muted-strong)]">
                {copy.noOrders}
              </p>
            ) : null}
          </div>
        </Card>
        <Card className="rounded-[28px] p-6">
          <SectionHeading
            eyebrow={copy.rollup}
            title={copy.demandByProduct}
            description={copy.description}
          />
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
    </div>
  );
}
