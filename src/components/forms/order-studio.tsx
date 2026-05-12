"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { OrdersBoard } from "@/components/layout/orders-board";
import { Card, Eyebrow, Pill, Toast } from "@/components/ui/surfaces";
import type { BusinessSnapshot, Order } from "@/lib/domain/types";
import { orderStudioCopy } from "@/lib/i18n";

type Tone = "info" | "success" | "warn" | "error";

type OrderLineDraft = {
  id: string;
  productId: string;
  quantity: string;
};

type OrderDraft = {
  id?: string;
  orderNumber: string;
  clientName: string;
  dueDate: string;
  status: Order["status"];
  items: OrderLineDraft[];
};

function statusTone(status: Order["status"]): "moss" | "amber" | "flame" {
  if (status === "open") return "flame";
  return "moss";
}

function isBacklogOrder(order: Pick<Order, "dueDate" | "status">) {
  return order.status === "open" && order.dueDate <= new Date().toISOString().slice(0, 10);
}

function createLine(snapshot: BusinessSnapshot, productId = snapshot.products[0]?.id ?? ""): OrderLineDraft {
  return {
    id: crypto.randomUUID(),
    productId,
    quantity: "24"
  };
}

function createDraft(snapshot: BusinessSnapshot): OrderDraft {
  return {
    orderNumber: `ORD-${2000 + snapshot.orders.length + 1}`,
    clientName: "",
    dueDate: "2026-05-01",
    status: "open",
    items: [createLine(snapshot)]
  };
}

function toNumber(value: string) {
  return Number(value.trim());
}

export function OrderStudio({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = orderStudioCopy(language);
  const [orders, setOrders] = useState(snapshot.orders);
  const [draft, setDraft] = useState<OrderDraft>(() => createDraft(snapshot));
  const [toast, setToast] = useState<{ message: string; tone: Tone } | null>(null);
  const [search, setSearch] = useState("");
  const [lastDeleted, setLastDeleted] = useState<Order | null>(null);

  const displaySnapshot = useMemo(() => ({ ...snapshot, orders }), [orders, snapshot]);

  useEffect(() => {
    setOrders(snapshot.orders);
  }, [snapshot.orders]);

  useEffect(() => {
    if (!snapshot.products.length) {
      setDraft((current) => ({ ...current, items: current.items.map((item) => ({ ...item, productId: "" })) }));
      return;
    }
    setDraft((current) => ({
      ...current,
      items: current.items.map((item) => ({
        ...item,
        productId: item.productId || snapshot.products[0]?.id || ""
      }))
    }));
  }, [snapshot.products]);

  const visibleOrders = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return orders;
    return orders.filter((order) =>
      [order.orderNumber, order.clientName, order.status, order.dueDate].some((value) =>
        value.toLowerCase().includes(key)
      )
    );
  }, [orders, search]);

  const blocked = !snapshot.products.length;

  async function saveOrder() {
    if (!snapshot.products.length) {
      setToast({ message: copy.noProducts, tone: "warn" });
      return;
    }
    if (!draft.clientName.trim()) {
      setToast({ message: copy.customerRequired, tone: "warn" });
      return;
    }
    if (!draft.orderNumber.trim()) {
      setToast({ message: copy.orderNumberRequired, tone: "warn" });
      return;
    }
    if (!draft.items.length) {
      setToast({ message: copy.noOrderLines, tone: "warn" });
      return;
    }
    const normalizedItems = draft.items.map((item) => ({
      productId: item.productId.trim(),
      quantity: toNumber(item.quantity)
    }));
    if (normalizedItems.some((item) => !item.productId || !Number.isFinite(item.quantity) || item.quantity <= 0)) {
      setToast({ message: copy.noOrderLines, tone: "warn" });
      return;
    }

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: draft.id || undefined,
        orderNumber: draft.orderNumber,
        clientName: draft.clientName,
        dueDate: draft.dueDate,
        status: draft.status,
        items: normalizedItems
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
      clientName: current.clientName,
      orderNumber: `ORD-${Number(current.orderNumber.slice(4)) + 1}`
    }));
    router.refresh();
  }

  async function updateOrderStatus(order: Order, nextStatus: Order["status"]) {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: order.id,
        orderNumber: order.orderNumber,
        clientId: order.clientId,
        clientName: order.clientName,
        dueDate: order.dueDate,
        status: nextStatus,
        items: order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      })
    });
    const data = (await response.json()) as { snapshot?: BusinessSnapshot; error?: string };
    if (!response.ok || !data.snapshot) {
      setToast({ message: data.error ?? copy.saveError, tone: "error" });
      return;
    }
    setOrders(data.snapshot.orders);
    if (draft.id === order.id) {
      setDraft((current) => ({ ...current, status: nextStatus }));
    }
    setToast({ message: copy.saved, tone: "success" });
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
        clientName: "",
        dueDate: "2026-05-01",
        status: "open",
        items: [createLine(data.snapshot)]
      });
    }
    setToast({ message: copy.deleted, tone: "info" });
    router.refresh();
  }

  async function undoDelete() {
    if (!lastDeleted) return;
    if (!lastDeleted.items.length) {
      setToast({ message: copy.noItemRestore, tone: "warn" });
      return;
    }
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: lastDeleted.id,
        orderNumber: lastDeleted.orderNumber,
        clientName: lastDeleted.clientName,
        dueDate: lastDeleted.dueDate,
        status: lastDeleted.status,
        items: lastDeleted.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
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

  function addLine() {
    setDraft((current) => ({
      ...current,
      items: [...current.items, createLine(snapshot, snapshot.products[0]?.id ?? "")]
    }));
  }

  function removeLine(lineId: string) {
    setDraft((current) => {
      const next = current.items.filter((item) => item.id !== lineId);
      return {
        ...current,
        items: next.length ? next : [createLine(snapshot, snapshot.products[0]?.id ?? "")]
      };
    });
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void saveOrder();
          }}
        >
          <div>
            <Eyebrow tone="flame">{copy.eyebrow}</Eyebrow>
            <p className="mt-2 font-display text-3xl leading-tight text-[var(--ink)]">{copy.title}</p>
            <p className="mt-2 text-[0.92rem] leading-6 text-[var(--muted-strong)]">
              {copy.description}
            </p>
            {!snapshot.clients.length ? (
              <Pill tone="amber" className="mt-3">
                {copy.customerHint}
              </Pill>
            ) : null}
            {!snapshot.products.length ? (
              <Pill tone="amber" className="mt-3 ml-2">
                {copy.noProducts}
              </Pill>
            ) : null}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={draft.orderNumber}
              onChange={(event) => setDraft((current) => ({ ...current, orderNumber: event.target.value }))}
              placeholder={language === "es" ? "Número de pedido" : "Order number"}
              className="field font-mono text-sm"
            />
            <input
              value={draft.clientName}
              onChange={(event) => setDraft((current) => ({ ...current, clientName: event.target.value }))}
              placeholder={copy.customerNamePlaceholder}
              className="field"
              list="customer-options"
            />
            <datalist id="customer-options">
              {snapshot.clients.map((client) => (
                <option key={client.id} value={client.name} />
              ))}
            </datalist>
            <input
              value={draft.dueDate}
              onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))}
              type="date"
              className="field"
            />
            <div className="rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.65)] px-4 py-3">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                {copy.statusLabel}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Pill tone={statusTone(draft.status)}>
                  {draft.status === "open" ? copy.openStatus : copy.fulfilledStatus}
                </Pill>
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t border-dashed border-[var(--line)] pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                  {language === "es" ? "Líneas de pedido" : "Order lines"}
                </p>
                <p className="mt-1 text-sm text-[var(--muted-strong)]">
                  {language === "es"
                    ? "Agrega más de un producto al mismo pedido."
                    : "Add more than one product to the same order."}
                </p>
              </div>
              <button type="button" className="btn btn-soft" onClick={addLine}>
                {copy.addLine}
              </button>
            </div>
            <div className="space-y-3">
              {draft.items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 md:grid-cols-[minmax(0,1.9fr)_6.5rem_auto] md:items-end"
                >
                  <div className="grid gap-1">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                      {copy.lineProduct} {index + 1}
                    </span>
                    <select
                      value={item.productId}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          items: current.items.map((line) =>
                            line.id === item.id ? { ...line, productId: event.target.value } : line
                          )
                        }))
                      }
                      className="field h-14"
                      disabled={!snapshot.products.length}
                    >
                      <option value="">{language === "es" ? "Elige un producto" : "Choose a product"}</option>
                      {snapshot.products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="grid gap-1">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                      {copy.lineQuantity}
                    </span>
                    <input
                      value={item.quantity}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          items: current.items.map((line) => (line.id === item.id ? { ...line, quantity: event.target.value } : line))
                        }))
                      }
                      type="number"
                      min="1"
                      className="field h-14 font-mono text-sm"
                    />
                  </label>
                  <button type="button" className="btn btn-ghost h-14 md:justify-self-end md:px-4" onClick={() => removeLine(item.id)}>
                    {copy.removeLine}
                  </button>
                </div>
              ))}
            </div>
          </div>

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
              className={`flex flex-wrap items-center justify-between gap-3 rounded-[24px] border p-4 ${
                isBacklogOrder(order)
                  ? "border-[rgba(223,151,27,0.45)] bg-[rgba(223,151,27,0.08)]"
                  : "border-[var(--line)] bg-[rgba(255,255,255,0.72)]"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display text-lg text-[var(--ink)]">{order.orderNumber}</p>
                  <Pill tone={statusTone(order.status)}>
                    {order.status === "open" ? copy.openStatus : copy.fulfilledStatus}
                  </Pill>
                  {isBacklogOrder(order) ? <Pill tone="amber">{copy.backlog}</Pill> : null}
                </div>
                <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                  {order.clientName} · {copy.due} {order.dueDate}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-soft"
                  onClick={() => void updateOrderStatus(order, order.status === "open" ? "fulfilled" : "open")}
                >
                  {order.status === "open" ? copy.markFulfilled : copy.reopenOrder}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    setDraft({
                      id: order.id,
                      orderNumber: order.orderNumber,
                      clientName: order.clientName,
                      dueDate: order.dueDate,
                      status: order.status,
                      items: order.items.length
                        ? order.items.map((line) => ({
                            id: crypto.randomUUID(),
                            productId: line.productId,
                            quantity: String(line.quantity)
                          }))
                        : [createLine(snapshot)]
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
