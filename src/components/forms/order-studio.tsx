"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { OrdersBoard } from "@/components/layout/orders-board";
import { Card, Eyebrow, Pill, Toast } from "@/components/ui/surfaces";
import type { BusinessSnapshot, Order } from "@/lib/domain/types";
import { orderStudioCopy } from "@/lib/i18n";

type Tone = "info" | "success" | "warn" | "error";

function statusTone(status: Order["status"]): "moss" | "amber" | "flame" {
  if (status === "open") return "flame";
  if (status === "draft") return "amber";
  return "moss";
}

export function OrderStudio({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = orderStudioCopy(language);
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
  const [toast, setToast] = useState<{ message: string; tone: Tone } | null>(null);
  const [search, setSearch] = useState("");
  const [lastDeleted, setLastDeleted] = useState<Order | null>(null);

  const displaySnapshot = useMemo(() => ({ ...snapshot, orders }), [orders, snapshot]);

  useEffect(() => {
    setOrders(snapshot.orders);
  }, [snapshot.orders]);

  const visibleOrders = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return orders;
    return orders.filter((order) =>
      [order.orderNumber, order.clientName, order.status, order.dueDate].some((value) =>
        value.toLowerCase().includes(key)
      )
    );
  }, [orders, search]);

  const blocked = !snapshot.clients.length || !snapshot.products.length;

  async function saveOrder() {
    if (!snapshot.clients.length) {
      setToast({ message: copy.noCustomers, tone: "warn" });
      return;
    }
    if (!snapshot.products.length) {
      setToast({ message: copy.noProducts, tone: "warn" });
      return;
    }
    if (!draft.orderNumber.trim()) {
      setToast({ message: copy.orderNumberRequired, tone: "warn" });
      return;
    }
    if (Number(draft.quantity) <= 0) {
      setToast({ message: copy.quantityRequired, tone: "warn" });
      return;
    }

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
      setToast({ message: data.error ?? copy.saveError, tone: "error" });
      return;
    }

    setOrders(data.snapshot.orders);
    setLastDeleted(null);
    setToast({ message: copy.saved, tone: "success" });
    setDraft((current) => ({
      ...current,
      id: "",
      orderNumber: `ORD-${Number(current.orderNumber.slice(4)) + 1}`
    }));
    router.refresh();
  }

  async function deleteOrder(order: Order) {
    if (!window.confirm(language === "es" ? `¿Eliminar ${order.orderNumber}?` : `Delete ${order.orderNumber}?`)) return;
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", orderId: order.id })
    });
    const data = (await response.json()) as { snapshot?: BusinessSnapshot; error?: string };
    if (!response.ok || !data.snapshot) {
      setToast({ message: data.error ?? copy.deleteError, tone: "error" });
      return;
    }
    setOrders(data.snapshot.orders);
    setLastDeleted(order);
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
    setToast({ message: copy.deleted, tone: "info" });
    router.refresh();
  }

  async function undoDelete() {
    if (!lastDeleted) return;
    const firstItem = lastDeleted.items[0];
    if (!firstItem) {
      setToast({ message: copy.noItemRestore, tone: "warn" });
      return;
    }
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: lastDeleted.id,
        orderNumber: lastDeleted.orderNumber,
        clientId: lastDeleted.clientId,
        dueDate: lastDeleted.dueDate,
        status: lastDeleted.status,
        productId: firstItem.productId,
        quantity: firstItem.quantity
      })
    });
    const data = (await response.json()) as { snapshot?: BusinessSnapshot; error?: string };
    if (!response.ok || !data.snapshot) {
      setToast({ message: data.error ?? copy.restoreError, tone: "error" });
      return;
    }
    setOrders(data.snapshot.orders);
    setLastDeleted(null);
    setToast({ message: copy.restored, tone: "success" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form
          className="grid gap-4 lg:grid-cols-6"
          onSubmit={(event) => {
            event.preventDefault();
            void saveOrder();
          }}
        >
          <div className="lg:col-span-6">
            <Eyebrow tone="flame">{copy.eyebrow}</Eyebrow>
            <p className="mt-2 font-display text-3xl leading-tight text-[var(--ink)]">{copy.title}</p>
            <p className="mt-2 text-[0.92rem] leading-6 text-[var(--muted-strong)]">
              {copy.description}
            </p>
            {!snapshot.clients.length ? (
              <Pill tone="amber" className="mt-3">
                {copy.noCustomers}
              </Pill>
            ) : null}
            {!snapshot.products.length ? (
              <Pill tone="amber" className="mt-3 ml-2">
                {copy.noProducts}
              </Pill>
            ) : null}
          </div>
          <input
            value={draft.orderNumber}
            onChange={(event) => setDraft((current) => ({ ...current, orderNumber: event.target.value }))}
            placeholder={language === "es" ? "Número de pedido" : "Order number"}
            className="field font-mono text-sm"
          />
            <select
            value={draft.clientId}
            onChange={(event) => setDraft((current) => ({ ...current, clientId: event.target.value }))}
            className="field"
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
            className="field"
          />
          <select
            value={draft.productId}
            onChange={(event) => setDraft((current) => ({ ...current, productId: event.target.value }))}
            className="field"
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
            className="field font-mono text-sm"
          />
          <select
            value={draft.status}
            onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as Order["status"] }))}
            className="field"
          >
            <option value="draft">{copy.draft}</option>
            <option value="open">{copy.open}</option>
            <option value="fulfilled">{copy.fulfilled}</option>
          </select>
          <div className="lg:col-span-6 flex flex-wrap items-center gap-2 pt-2">
            <button className="btn btn-flame" type="submit" disabled={blocked}>
              {draft.id ? copy.updateOrder : copy.saveOrder}
            </button>
            {lastDeleted ? (
              <button type="button" className="btn btn-soft" onClick={() => void undoDelete()}>
                {copy.undoDelete}
              </button>
            ) : null}
            {blocked ? (
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                {copy.blocked}
              </span>
            ) : null}
          </div>
        </form>
      </Card>
      <OrdersBoard snapshot={displaySnapshot} />
      <Card className="p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Eyebrow tone="flame">{copy.manageEyebrow}</Eyebrow>
            <p className="mt-2 font-display text-2xl text-[var(--ink)]">{copy.queueLabel(orders.length)}</p>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={copy.searchPlaceholder}
            className="field max-w-xs"
          />
        </div>
        <div className="mt-4 space-y-3">
          {visibleOrders.map((order) => (
            <article
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display text-lg text-[var(--ink)]">{order.orderNumber}</p>
                  <Pill tone={statusTone(order.status)}>
                    {order.status === "draft" ? copy.draft : order.status === "open" ? copy.open : copy.fulfilled}
                  </Pill>
                </div>
                <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                  {order.clientName} · {copy.due} {order.dueDate}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-ghost"
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
                  {copy.edit}
                </button>
                <button type="button" className="btn btn-soft" onClick={() => void deleteOrder(order)}>
                  {copy.delete}
                </button>
              </div>
            </article>
          ))}
          {!orders.length ? (
            <p className="rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
              {copy.noOrders}
            </p>
          ) : null}
          {orders.length > 0 && !visibleOrders.length ? (
            <p className="rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
              {copy.noOrderMatches}
            </p>
          ) : null}
        </div>
      </Card>
      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} /> : null}
    </div>
  );
}
