"use client";

import { useMemo, useState } from "react";
import { OrdersBoard } from "@/components/layout/orders-board";
import { Card } from "@/components/ui/surfaces";
import type { BusinessSnapshot, Order } from "@/lib/domain/types";

export function OrderStudio({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const [orders, setOrders] = useState(snapshot.orders);
  const [draft, setDraft] = useState({
    orderNumber: `ORD-${2000 + snapshot.orders.length + 1}`,
    clientId: snapshot.clients[0]?.id ?? "",
    dueDate: "2026-05-01",
    status: "open",
    productId: snapshot.products[0]?.id ?? "",
    quantity: "24"
  });

  const displaySnapshot = useMemo(() => ({ ...snapshot, orders }), [orders, snapshot]);

  function createOrder() {
    const client = snapshot.clients.find((item) => item.id === draft.clientId);
    const product = snapshot.products.find((item) => item.id === draft.productId);
    if (!client || !product) return;

    const order: Order = {
      id: `ord_${draft.orderNumber.toLowerCase()}`,
      orderNumber: draft.orderNumber,
      clientId: client.id,
      clientName: client.name,
      dueDate: draft.dueDate,
      status: draft.status as Order["status"],
      items: [{ productId: product.id, productName: product.name, quantity: Number(draft.quantity) }]
    };

    setOrders((current) => [...current, order]);
    setDraft((current) => ({ ...current, orderNumber: `ORD-${Number(current.orderNumber.slice(4)) + 1}` }));
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-5">
        <form
          className="grid gap-4 xl:grid-cols-6"
          onSubmit={(event) => {
            event.preventDefault();
            createOrder();
          }}
        >
          <div className="xl:col-span-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Order entry</p>
            <h3 className="mt-2 font-[var(--font-display)] text-2xl">Add the next job to the queue</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Start with the customer, choose the product, and set a due date so purchasing and production can react early.
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
          <button className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white" type="submit">
            Save order
          </button>
        </form>
      </Card>
      <OrdersBoard snapshot={displaySnapshot} />
    </div>
  );
}
