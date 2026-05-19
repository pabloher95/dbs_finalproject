"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { Card, Eyebrow, Pill, Toast } from "@/components/ui/surfaces";
import type { Client, Order, Supplier } from "@/lib/domain/types";
import { contactBoardCopy, contactStudioCopy } from "@/lib/i18n";

type Tone = "info" | "success" | "warn" | "error";

export function ContactStudio({
  clients: initialClients,
  suppliers: initialSuppliers,
  orders
}: Readonly<{
  clients: Client[];
  suppliers: Supplier[];
  orders: Order[];
}>) {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = contactStudioCopy(language);
  const boardCopy = contactBoardCopy(language);
  const [clients, setClients] = useState(initialClients);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [clientDraft, setClientDraft] = useState({ id: "", name: "", email: "", channel: "", phone: "", address: "" });
  const [supplierDraft, setSupplierDraft] = useState({ id: "", name: "", email: "", category: "", phone: "", address: "" });
  const [toast, setToast] = useState<{ message: string; tone: Tone } | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [lastDeleted, setLastDeleted] = useState<
    | { kind: "client"; data: Client }
    | { kind: "supplier"; data: Supplier }
    | null
  >(null);

  useEffect(() => {
    setClients(initialClients);
  }, [initialClients]);

  useEffect(() => {
    setSuppliers(initialSuppliers);
  }, [initialSuppliers]);

  const visibleClients = clients.filter((client) =>
    [client.name, client.email, client.channel].some((value) =>
      value.toLowerCase().includes(clientSearch.toLowerCase())
    )
  );
  const visibleSuppliers = suppliers.filter((supplier) =>
    [supplier.name, supplier.email, supplier.category].some((value) =>
      value.toLowerCase().includes(supplierSearch.toLowerCase())
    )
  );

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function resetClientDraft() {
    setClientDraft({ id: "", name: "", email: "", channel: "", phone: "", address: "" });
  }

  function resetSupplierDraft() {
    setSupplierDraft({ id: "", name: "", email: "", category: "", phone: "", address: "" });
  }

  async function persistContact(kind: "client" | "supplier", draft: typeof clientDraft | typeof supplierDraft) {
    const name = draft.name.trim();
    const email = draft.email.trim();
    const categoryValue = "channel" in draft ? draft.channel.trim() : draft.category.trim();
    if (!name || !email || !categoryValue) {
      setToast({ message: copy.required, tone: "warn" });
      return;
    }
    if (!isValidEmail(email)) {
      setToast({ message: copy.emailInvalid, tone: "warn" });
      return;
    }

    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, ...draft })
    });
    const data = (await response.json()) as { snapshot?: { clients: Client[]; suppliers: Supplier[] }; error?: string };
    if (!response.ok || !data.snapshot) {
      setToast({ message: data.error ?? copy.saveError, tone: "error" });
      return;
    }

    setClients(data.snapshot.clients);
    setSuppliers(data.snapshot.suppliers);
    setLastDeleted(null);
    setToast({ message: copy.saved(kind), tone: "success" });
    if (kind === "client") {
      resetClientDraft();
    } else {
      resetSupplierDraft();
    }
    router.refresh();
  }

  async function removeContact(kind: "client" | "supplier", id: string) {
    const record =
      kind === "client" ? clients.find((item) => item.id === id) : suppliers.find((item) => item.id === id);
    if (!record) return;

    if (kind === "client") {
      const clientOrders = orders.filter((o) => o.clientId === id);
      const activeOrders = clientOrders.filter((o) => o.status === "open");
      if (activeOrders.length > 0) {
        setToast({ message: copy.deleteBlockedActiveOrder(record.name), tone: "warn" });
        return;
      }
      if (clientOrders.length > 0 && !window.confirm(copy.deleteWarnFulfilledOrders(record.name))) return;
    } else {
      if (!window.confirm(copy.deleteConfirm(record.name))) return;
    }

    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", kind, id })
    });
    const data = (await response.json()) as { snapshot?: { clients: Client[]; suppliers: Supplier[] }; error?: string };
    if (!response.ok || !data.snapshot) {
      setToast({ message: data.error ?? copy.deleteError, tone: "error" });
      return;
    }

    setClients(data.snapshot.clients);
    setSuppliers(data.snapshot.suppliers);
    setLastDeleted(kind === "client" ? { kind: "client", data: record as Client } : { kind: "supplier", data: record as Supplier });
    if (kind === "client" && clientDraft.id === id) resetClientDraft();
    if (kind === "supplier" && supplierDraft.id === id) resetSupplierDraft();
    setToast({
      message: copy.deleted(kind),
      tone: "info"
    });
    router.refresh();
  }

  async function undoDelete() {
    if (!lastDeleted) return;
    const payload =
      lastDeleted.kind === "client"
        ? {
            kind: "client",
            id: lastDeleted.data.id,
            name: lastDeleted.data.name,
            email: lastDeleted.data.email,
            channel: lastDeleted.data.channel,
            phone: lastDeleted.data.phone ?? "",
            address: lastDeleted.data.address ?? ""
          }
        : {
            kind: "supplier",
            id: lastDeleted.data.id,
            name: lastDeleted.data.name,
            email: lastDeleted.data.email,
            category: lastDeleted.data.category,
            phone: lastDeleted.data.phone ?? "",
            address: lastDeleted.data.address ?? ""
          };
    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = (await response.json()) as { snapshot?: { clients: Client[]; suppliers: Supplier[] }; error?: string };
    if (!response.ok || !data.snapshot) {
      setToast({ message: data.error ?? copy.restoreError, tone: "error" });
      return;
    }
    setClients(data.snapshot.clients);
    setSuppliers(data.snapshot.suppliers);
    setLastDeleted(null);
    setToast({ message: copy.restored, tone: "success" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Add / edit forms */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card variant="featured" className="p-6">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void persistContact("client", clientDraft);
            }}
          >
            <div>
              <Eyebrow tone="flame">{copy.customerEyebrow}</Eyebrow>
              <p className="mt-2 font-display text-2xl text-[var(--ink)]">{copy.customerTitle}</p>
              <p className="mt-2 text-[0.9rem] leading-6 text-[var(--muted-strong)]">{copy.customerDescription}</p>
              {!suppliers.length ? <Pill tone="amber" className="mt-3">{copy.supplierTip}</Pill> : null}
              {clientDraft.id ? <Pill tone="ink" className="mt-3">{copy.editingCustomer}</Pill> : null}
            </div>
            <input
              value={clientDraft.name}
              onChange={(event) => setClientDraft((current) => ({ ...current, name: event.target.value }))}
              placeholder={copy.namePlaceholder}
              className="field"
            />
            <input
              value={clientDraft.email}
              onChange={(event) => setClientDraft((current) => ({ ...current, email: event.target.value }))}
              placeholder={copy.customerEmailPlaceholder}
              className="field"
            />
            <input
              value={clientDraft.channel}
              onChange={(event) => setClientDraft((current) => ({ ...current, channel: event.target.value }))}
              placeholder={copy.channelPlaceholder}
              className="field"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={clientDraft.phone}
                onChange={(event) => setClientDraft((current) => ({ ...current, phone: event.target.value }))}
                placeholder={copy.phonePlaceholder}
                className="field"
                type="tel"
              />
              <input
                value={clientDraft.address}
                onChange={(event) => setClientDraft((current) => ({ ...current, address: event.target.value }))}
                placeholder={copy.addressPlaceholder}
                className="field"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-flame" type="submit">
                {clientDraft.id ? copy.updateCustomer : copy.saveCustomer}
              </button>
              {clientDraft.id ? (
                <button type="button" className="btn btn-ghost" onClick={resetClientDraft}>
                  {copy.reset}
                </button>
              ) : null}
            </div>
          </form>
        </Card>

        <Card variant="featured" className="p-6">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void persistContact("supplier", supplierDraft);
            }}
          >
            <div>
              <Eyebrow tone="flame">{copy.supplierEyebrow}</Eyebrow>
              <p className="mt-2 font-display text-2xl text-[var(--ink)]">{copy.supplierTitle}</p>
              <p className="mt-2 text-[0.9rem] leading-6 text-[var(--muted-strong)]">{copy.supplierDescription}</p>
              {supplierDraft.id ? <Pill tone="ink" className="mt-3">{copy.editingSupplier}</Pill> : null}
            </div>
            <input
              value={supplierDraft.name}
              onChange={(event) => setSupplierDraft((current) => ({ ...current, name: event.target.value }))}
              placeholder={copy.namePlaceholder}
              className="field"
            />
            <input
              value={supplierDraft.email}
              onChange={(event) => setSupplierDraft((current) => ({ ...current, email: event.target.value }))}
              placeholder={copy.supplierEmailPlaceholder}
              className="field"
            />
            <input
              value={supplierDraft.category}
              onChange={(event) => setSupplierDraft((current) => ({ ...current, category: event.target.value }))}
              placeholder={copy.categoryPlaceholder}
              className="field"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={supplierDraft.phone}
                onChange={(event) => setSupplierDraft((current) => ({ ...current, phone: event.target.value }))}
                placeholder={copy.phonePlaceholder}
                className="field"
                type="tel"
              />
              <input
                value={supplierDraft.address}
                onChange={(event) => setSupplierDraft((current) => ({ ...current, address: event.target.value }))}
                placeholder={copy.addressPlaceholder}
                className="field"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-flame" type="submit">
                {supplierDraft.id ? copy.updateSupplier : copy.saveSupplier}
              </button>
              {supplierDraft.id ? (
                <button type="button" className="btn btn-ghost" onClick={resetSupplierDraft}>
                  {copy.reset}
                </button>
              ) : null}
            </div>
          </form>
        </Card>
      </div>

      {/* Unified contact directory */}
      <Card className="overflow-hidden rounded-[28px]">
        <div className="grid xl:grid-cols-2">
          {/* Customers */}
          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Eyebrow tone="flame">{boardCopy.customers}</Eyebrow>
                <p className="mt-1 font-display text-xl text-[var(--ink)]">{boardCopy.orderDestinations}</p>
              </div>
              <input
                value={clientSearch}
                onChange={(event) => setClientSearch(event.target.value)}
                placeholder={copy.searchCustomers}
                className="field max-w-[14rem]"
              />
            </div>
            <div className="mt-4 space-y-2">
              {visibleClients.map((client) => (
                <article
                  key={client.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-lg text-[var(--ink)]">{client.name}</p>
                      <Pill>{client.channel}</Pill>
                    </div>
                    <p className="mt-1 text-sm text-[var(--muted-strong)]">{client.email}</p>
                    {client.phone ? <p className="mt-0.5 text-sm text-[var(--muted-strong)]">{client.phone}</p> : null}
                    {client.address ? <p className="mt-0.5 text-sm text-[var(--muted-strong)]">{client.address}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setClientDraft({ id: client.id, name: client.name, email: client.email, channel: client.channel, phone: client.phone ?? "", address: client.address ?? "" })}
                    >
                      {copy.edit}
                    </button>
                    <button type="button" className="btn btn-soft" onClick={() => void removeContact("client", client.id)}>
                      {copy.delete}
                    </button>
                  </div>
                </article>
              ))}
              {!clients.length ? (
                <p className="rounded-[20px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
                  {boardCopy.noCustomers}
                </p>
              ) : null}
              {clients.length > 0 && !visibleClients.length ? (
                <p className="rounded-[20px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
                  {copy.noCustomerMatches}
                </p>
              ) : null}
            </div>
          </div>

          {/* Suppliers */}
          <div className="border-t border-[var(--line)] p-6 xl:border-l xl:border-t-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Eyebrow tone="flame">{boardCopy.suppliers}</Eyebrow>
                <p className="mt-1 font-display text-xl text-[var(--ink)]">{boardCopy.sourcingLinks}</p>
              </div>
              <input
                value={supplierSearch}
                onChange={(event) => setSupplierSearch(event.target.value)}
                placeholder={copy.searchSuppliers}
                className="field max-w-[14rem]"
              />
            </div>
            <div className="mt-4 space-y-2">
              {visibleSuppliers.map((supplier) => (
                <article
                  key={supplier.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-lg text-[var(--ink)]">{supplier.name}</p>
                      <Pill tone="ink">{supplier.category}</Pill>
                    </div>
                    <p className="mt-1 text-sm text-[var(--muted-strong)]">{supplier.email}</p>
                    {supplier.phone ? <p className="mt-0.5 text-sm text-[var(--muted-strong)]">{supplier.phone}</p> : null}
                    {supplier.address ? <p className="mt-0.5 text-sm text-[var(--muted-strong)]">{supplier.address}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setSupplierDraft({ id: supplier.id, name: supplier.name, email: supplier.email, category: supplier.category, phone: supplier.phone ?? "", address: supplier.address ?? "" })}
                    >
                      {copy.edit}
                    </button>
                    <button type="button" className="btn btn-soft" onClick={() => void removeContact("supplier", supplier.id)}>
                      {copy.delete}
                    </button>
                  </div>
                </article>
              ))}
              {!suppliers.length ? (
                <p className="rounded-[20px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
                  {boardCopy.noSuppliers}
                </p>
              ) : null}
              {suppliers.length > 0 && !visibleSuppliers.length ? (
                <p className="rounded-[20px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
                  {copy.noSupplierMatches}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </Card>

      {lastDeleted ? (
        <button type="button" className="btn btn-soft" onClick={() => void undoDelete()}>
          {copy.undoLastDelete}
        </button>
      ) : null}
      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} /> : null}
    </div>
  );
}
