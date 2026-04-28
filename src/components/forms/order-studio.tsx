"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { OrdersBoard } from "@/components/layout/orders-board";
import { Card } from "@/components/ui/surfaces";
import type { BusinessSnapshot, Order } from "@/lib/domain/types";

export function OrderStudio({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const router = useRouter();
  const [orders, setOrders] = useState(snapshot.orders);
  const [draft, setDraft] = useState({
    id: "",
    orderNumber: `ORD-${2000 + snapshot.orders.length + 1}`,
    clientId: snapshot.clients[0]?.id ?? "",
    dueDate: "2026-05-01",
    status: "open" as Order["status"],
    productId: snapshot.products[0]?.id ?? "",
    quantity: "24"
  });
  const [status, setStatus] = useState<string | null>(null);

  const displaySnapshot = useMemo(() => ({ ...snapshot, orders }), [orders, snapshot]);

  useEffect(() => {
    setOrders(snapshot.orders);
  }, [snapshot.orders]);

  async function saveOrder() {
    setStatus("Saving order...");
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: draft.id || undefined,
        orderNumber: draft.orderNumber,
        clientId: draft.clientId,
        dueDate: draft.dueDate,
        status: draft.status,
        productId: draft.productId,
        quantity: Number(draft.quantity)
      })
    });
    const data = (await response.json()) as { snapshot?: BusinessSnapshot; error?: string };
    if (!response.ok || !data.snapshot) {
      setStatus(data.error ?? "Unable to save order.");
      return;
    }

    setOrders(data.snapshot.orders);
    setStatus("Order saved.");
    setDraft((current) => ({
      ...current,
      id: "",
      orderNumber: `ORD-${Number(current.orderNumber.slice(4)) + 1}`
    }));
    router.refresh();
  }

  async function deleteOrder(order: Order) {
    setStatus(`Deleting ${order.orderNumber}...`);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", orderId: order.id })
    });
    const data = (await response.json()) as { snapshot?: BusinessSnapshot; error?: string };
    if (!response.ok || !data.snapshot) {
      setStatus(data.error ?? "Unable to delete order.");
      return;
    }

    setOrders(data.snapshot.orders);
    if (draft.id === order.id) {
      setDraft({
        id: "",
        orderNumber: `ORD-${2000 + data.snapshot.orders.length + 1}`,
        clientId: data.snapshot.clients[0]?.id ?? "",
        dueDate: "2026-05-01",
        status: "open",
        productId: data.snapshot.products[0]?.id ?? "",
        quantity: "24"
      });
    }
    setStatus("Order deleted.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-5">
        <form
          className="grid gap-4 xl:grid-cols-6"
          onSubmit={(event) => {
            event.preventDefault();
            void saveOrder();
          }}
        >
          <div className="xl:col-span-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Order entry</p>
            <h3 className="mt-2 font-[var(--font-display)] text-2xl">Add the next job to the queue</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Start with the customer, choose the product, and set a due date so purchasing and production can react
              early.
            </p>
          </div>
          <input
            value={draft.orderNumber}
            onChange={(event) => setDraft((current) => ({ ...current, orderNumber: event.target.value }))}
            placeholder="Order number"
            className="rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
          />
          <select
            value={draft.clientId}
            onChange={(event) => setDraft((current) => ({ ...current, clientId: event.target.value }))}
            className="rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
          >
            {snapshot.clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          <input
            value={draft.dueDate}
            onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))}
            type="date"
            className="rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
          />
          <select
            value={draft.productId}
            onChange={(event) => setDraft((current) => ({ ...current, productId: event.target.value }))}
            className="rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
          >
            {snapshot.products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <input
            value={draft.quantity}
            onChange={(event) => setDraft((current) => ({ ...current, quantity: event.target.value }))}
            type="number"
            min="1"
            className="rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
          />
          <select
            value={draft.status}
            onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as Order["status"] }))}
            className="rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
          >
            <option value="draft">draft</option>
            <option value="open">open</option>
            <option value="fulfilled">fulfilled</option>
          </select>
          <button className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white" type="submit">
            {draft.id ? "Update order" : "Save order"}
          </button>
        </form>
        {status ? <p className="mt-4 text-sm text-[var(--muted)]">{status}</p> : null}
      </Card>
      <OrdersBoard snapshot={displaySnapshot} />
      <Card className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-5">
        <h3 className="font-[var(--font-display)] text-2xl">Manage orders</h3>
        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <article key={order.id} className="rounded-[1.25rem] border border-[var(--line)] bg-[#fffdf9] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {order.clientName} · due {order.dueDate} · {order.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-[var(--line)] px-3 py-2 text-xs"
                    onClick={() =>
                      setDraft({
                        id: order.id,
                        orderNumber: order.orderNumber,
                        clientId: order.clientId,
                        dueDate: order.dueDate,
                        status: order.status,
                        productId: order.items[0]?.productId ?? snapshot.products[0]?.id ?? "",
                        quantity: String(order.items[0]?.quantity ?? 1)
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-[var(--line)] px-3 py-2 text-xs text-[var(--accent-deep)]"
                    onClick={() => void deleteOrder(order)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
