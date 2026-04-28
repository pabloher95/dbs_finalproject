import { Card, SectionHeading } from "@/components/ui/surfaces";
import { summarizeOrderDemand } from "@/lib/domain/orders";
import type { BusinessSnapshot } from "@/lib/domain/types";

export function OrdersBoard({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const demand = summarizeOrderDemand(snapshot.orders, snapshot.products);

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6">
        <SectionHeading
          eyebrow="Orders"
          title="Open production demand"
          description="See what is due, who it belongs to, and how order volume is building across your product line."
        />
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6">
          <div className="space-y-4">
            {snapshot.orders.map((order) => (
              <article key={order.id} className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">{order.status}</p>
                    <h3 className="mt-2 font-[var(--font-display)] text-2xl">{order.orderNumber}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {order.clientName} · due {order.dueDate}
                    </p>
                  </div>
                  <div className="rounded-full border border-[var(--line)] bg-[var(--bg-strong)] px-3 py-2 text-sm">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} units
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex justify-between rounded-xl border border-[var(--line)] px-3 py-2">
                      <span>{item.productName}</span>
                      <span className="text-[var(--muted)]">{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Card>
        <Card className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6">
        <SectionHeading
          eyebrow="Rollup"
          title="Demand by product"
          description="Use this summary to spot what needs to be made most and where material demand is coming from."
        />
          <div className="mt-5 space-y-3">
            {demand.map((row) => (
              <div key={row.productId} className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{row.productName}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{row.openOrders} open orders</p>
                  </div>
                  <p className="font-[var(--font-display)] text-3xl">{row.totalQuantity}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
