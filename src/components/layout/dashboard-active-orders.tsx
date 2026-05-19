"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Toast } from "@/components/ui/surfaces";
import type { BusinessSnapshot, Order } from "@/lib/domain/types";
import { dashboardCopy } from "@/lib/i18n";

type Tone = "info" | "success" | "warn" | "error";

export function DashboardActiveOrders({
  orders,
  copy
}: Readonly<{
  orders: Order[];
  copy: ReturnType<typeof dashboardCopy>;
}>) {
  const router = useRouter();
  const [openOrders, setOpenOrders] = useState(orders);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: Tone } | null>(null);
  const visibleOrders = useMemo(() => openOrders.slice(0, 3), [openOrders]);

  async function markFulfilled(order: Order) {
    setPendingOrderId(order.id);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          orderNumber: order.orderNumber,
          clientId: order.clientId,
          clientName: order.clientName,
          destination: order.destination,
          dueDate: order.dueDate,
          status: "fulfilled",
          items: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        })
      });
      const data = (await response.json()) as { snapshot?: BusinessSnapshot; error?: string };
      if (!response.ok || !data.snapshot) {
        setToast({ message: data.error ?? "Unable to save order.", tone: "error" });
        return;
      }

      setOpenOrders(data.snapshot.orders.filter((item) => item.status === "open"));
      setToast({ message: copy.orderFulfilled, tone: "success" });
      router.refresh();
    } finally {
      setPendingOrderId(null);
    }
  }

  return (
    <>
      <div className="mt-6 space-y-px bg-[var(--line)]">
        {visibleOrders.map((order) => (
          <div
            key={order.id}
            className="flex flex-wrap items-center justify-between gap-4 bg-[rgba(255,255,255,0.72)] px-5 py-5"
          >
            <div className="min-w-0">
              <p className="font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
                {order.orderNumber}
              </p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">
                {order.clientName} &nbsp;·&nbsp; {copy.due} {order.dueDate}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                {order.items.reduce((sum, item) => sum + item.quantity, 0)} {copy.units}
              </span>
              <button
                type="button"
                className="btn btn-soft px-3 py-2 text-[0.72rem]"
                onClick={() => void markFulfilled(order)}
                disabled={pendingOrderId === order.id}
              >
                {pendingOrderId === order.id ? copy.fulfilling : copy.markFulfilled}
              </button>
            </div>
          </div>
        ))}
        {!visibleOrders.length ? (
          <p className="bg-[rgba(255,255,255,0.72)] p-6 text-sm text-[var(--ink-soft)]">
            {copy.noOpenOrders}
          </p>
        ) : null}
      </div>
      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} /> : null}
    </>
  );
}
