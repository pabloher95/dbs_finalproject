import { Card, Pill, SectionHeading } from "@/components/ui/surfaces";
import { summarizeOrderDemand } from "@/lib/domain/orders";
import type { BusinessSnapshot, Order } from "@/lib/domain/types";

function statusTone(status: Order["status"]): "moss" | "amber" | "flame" {
  if (status === "open") return "flame";
  if (status === "draft") return "amber";
  return "moss";
}

export function OrdersBoard({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const demand = summarizeOrderDemand(snapshot.orders, snapshot.products);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <SectionHeading
          eyebrow="Orders"
          title="Open production demand"
          description="See what is due, who it belongs to, and how order volume is building across the product line."
        />
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="space-y-4">
            {snapshot.orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-[var(--line)] bg-[var(--paper-bright)] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display italic text-2xl">{order.orderNumber}</p>
                      <Pill tone={statusTone(order.status)}>{order.status}</Pill>
                    </div>
                    <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                      {order.clientName} · due {order.dueDate}
                    </p>
                  </div>
                  <Pill tone="ink">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} units
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
              <p className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--paper-bright)] p-4 text-sm text-[var(--muted-strong)]">
                No orders captured yet.
              </p>
            ) : null}
          </div>
        </Card>
        <Card className="p-6">
          <SectionHeading
            eyebrow="Rollup"
            title="Demand by product"
            description="Spot what needs to be made most and where the heaviest material demand will come from."
          />
          <div className="mt-5 space-y-3">
            {demand.map((row) => (
              <div
                key={row.productId}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper-bright)] p-4"
              >
                <div className="min-w-0">
                  <p className="font-display italic text-xl">{row.productName}</p>
                  <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                    {row.openOrders} open order{row.openOrders === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="font-display italic text-3xl">{row.totalQuantity}</span>
              </div>
            ))}
            {!demand.length ? (
              <p className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--paper-bright)] p-4 text-sm text-[var(--muted-strong)]">
                No open demand yet.
              </p>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
