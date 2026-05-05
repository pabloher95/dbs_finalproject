"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ContactBoard } from "@/components/layout/contact-board";
import { Card, Eyebrow, Pill, Toast } from "@/components/ui/surfaces";
import type { Client, Supplier } from "@/lib/domain/types";

type Tone = "info" | "success" | "warn" | "error";

export function ContactStudio({
  clients: initialClients,
  suppliers: initialSuppliers
}: Readonly<{
  clients: Client[];
  suppliers: Supplier[];
}>) {
  const router = useRouter();
  const [clients, setClients] = useState(initialClients);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [clientDraft, setClientDraft] = useState({ id: "", name: "", email: "", channel: "" });
  const [supplierDraft, setSupplierDraft] = useState({ id: "", name: "", email: "", category: "" });
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

  async function persistContact(kind: "client" | "supplier", draft: typeof clientDraft | typeof supplierDraft) {
    const name = draft.name.trim();
    const email = draft.email.trim();
    const categoryValue = "channel" in draft ? draft.channel.trim() : draft.category.trim();
    if (!name || !email || !categoryValue) {
      setToast({ message: "Name, email, and category/channel are required.", tone: "warn" });
      return;
    }
    if (!isValidEmail(email)) {
      setToast({ message: "Please enter a valid email address.", tone: "warn" });
      return;
    }

    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, ...draft })
    });
    const data = (await response.json()) as { snapshot?: { clients: Client[]; suppliers: Supplier[] }; error?: string };
    if (!response.ok || !data.snapshot) {
      setToast({ message: data.error ?? "Unable to save contact.", tone: "error" });
      return;
    }

    setClients(data.snapshot.clients);
    setSuppliers(data.snapshot.suppliers);
    setLastDeleted(null);
    setToast({ message: `${kind === "client" ? "Customer" : "Supplier"} saved.`, tone: "success" });
    router.refresh();
  }

  async function removeContact(kind: "client" | "supplier", id: string) {
    const record =
      kind === "client" ? clients.find((item) => item.id === id) : suppliers.find((item) => item.id === id);
    if (!record) return;
    if (!window.confirm(`Delete ${record.name}?`)) return;

    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", kind, id })
    });
    const data = (await response.json()) as { snapshot?: { clients: Client[]; suppliers: Supplier[] }; error?: string };
    if (!response.ok || !data.snapshot) {
      setToast({ message: data.error ?? "Unable to delete contact.", tone: "error" });
      return;
    }

    setClients(data.snapshot.clients);
    setSuppliers(data.snapshot.suppliers);
    setLastDeleted(kind === "client" ? { kind: "client", data: record as Client } : { kind: "supplier", data: record as Supplier });
    if (kind === "client" && clientDraft.id === id) setClientDraft({ id: "", name: "", email: "", channel: "" });
    if (kind === "supplier" && supplierDraft.id === id) setSupplierDraft({ id: "", name: "", email: "", category: "" });
    setToast({
      message: `${kind === "client" ? "Customer" : "Supplier"} deleted. Undo available.`,
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
            channel: lastDeleted.data.channel
          }
        : {
            kind: "supplier",
            id: lastDeleted.data.id,
            name: lastDeleted.data.name,
            email: lastDeleted.data.email,
            category: lastDeleted.data.category
          };
    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = (await response.json()) as { snapshot?: { clients: Client[]; suppliers: Supplier[] }; error?: string };
    if (!response.ok || !data.snapshot) {
      setToast({ message: data.error ?? "Unable to restore contact.", tone: "error" });
      return;
    }
    setClients(data.snapshot.clients);
    setSuppliers(data.snapshot.suppliers);
    setLastDeleted(null);
    setToast({ message: "Contact restored.", tone: "success" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void persistContact("client", clientDraft);
              setClientDraft({ id: "", name: "", email: "", channel: "" });
            }}
          >
            <div>
              <Eyebrow tone="flame">Customer details</Eyebrow>
              <p className="mt-2 font-display text-2xl text-[var(--ink)]">Add a customer</p>
              <p className="mt-2 text-[0.9rem] leading-6 text-[var(--muted-strong)]">
                Capture customer details so new orders can be assigned without retyping.
              </p>
              {!suppliers.length ? (
                <Pill tone="amber" className="mt-3">
                  Tip · add a supplier so purchasing lines link to a source.
                </Pill>
              ) : null}
            </div>
            <input
              value={clientDraft.name}
              onChange={(event) => setClientDraft((current) => ({ ...current, name: event.target.value }))}
              placeholder="Customer name"
              className="field"
            />
            <input
              value={clientDraft.email}
              onChange={(event) => setClientDraft((current) => ({ ...current, email: event.target.value }))}
              placeholder="Customer email"
              className="field"
            />
            <input
              value={clientDraft.channel}
              onChange={(event) => setClientDraft((current) => ({ ...current, channel: event.target.value }))}
              placeholder="Sales channel"
              className="field"
            />
            <button className="btn btn-flame" type="submit">
              Save customer
            </button>
            <input
              value={clientSearch}
              onChange={(event) => setClientSearch(event.target.value)}
              placeholder="Search customers"
              className="field"
            />
            <div className="space-y-2">
              {visibleClients.map((client) => (
                <article
                  key={client.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4"
                >
                  <div className="min-w-0">
                    <p className="font-display text-lg text-[var(--ink)]">{client.name}</p>
                    <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                      {client.channel}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted-strong)]">{client.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() =>
                        setClientDraft({
                          id: client.id,
                          name: client.name,
                          email: client.email,
                          channel: client.channel
                        })
                      }
                    >
                      Edit
                    </button>
                    <button type="button" className="btn btn-soft" onClick={() => void removeContact("client", client.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
              {!clients.length ? (
                <p className="rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
                  No customers yet. Add one to start creating orders.
                </p>
              ) : null}
              {clients.length > 0 && !visibleClients.length ? (
                <p className="rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
                  No customers match your search.
                </p>
              ) : null}
            </div>
          </form>
        </Card>
        <Card className="p-6">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void persistContact("supplier", supplierDraft);
              setSupplierDraft({ id: "", name: "", email: "", category: "" });
            }}
          >
            <div>
              <Eyebrow tone="flame">Supplier details</Eyebrow>
              <p className="mt-2 font-display text-2xl text-[var(--ink)]">Add a supplier</p>
              <p className="mt-2 text-[0.9rem] leading-6 text-[var(--muted-strong)]">
                Keep preferred suppliers on hand so the purchasing plan already points to the right source.
              </p>
            </div>
            <input
              value={supplierDraft.name}
              onChange={(event) => setSupplierDraft((current) => ({ ...current, name: event.target.value }))}
              placeholder="Supplier name"
              className="field"
            />
            <input
              value={supplierDraft.email}
              onChange={(event) => setSupplierDraft((current) => ({ ...current, email: event.target.value }))}
              placeholder="Supplier email"
              className="field"
            />
            <input
              value={supplierDraft.category}
              onChange={(event) => setSupplierDraft((current) => ({ ...current, category: event.target.value }))}
              placeholder="Category"
              className="field"
            />
            <button className="btn btn-flame" type="submit">
              Save supplier
            </button>
            <input
              value={supplierSearch}
              onChange={(event) => setSupplierSearch(event.target.value)}
              placeholder="Search suppliers"
              className="field"
            />
            <div className="space-y-2">
              {visibleSuppliers.map((supplier) => (
                <article
                  key={supplier.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4"
                >
                  <div className="min-w-0">
                    <p className="font-display text-lg text-[var(--ink)]">{supplier.name}</p>
                    <p className="mt-1 text-sm text-[var(--muted-strong)]">{supplier.email}</p>
                    <Pill className="mt-2">{supplier.category}</Pill>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() =>
                        setSupplierDraft({
                          id: supplier.id,
                          name: supplier.name,
                          email: supplier.email,
                          category: supplier.category
                        })
                      }
                    >
                      Edit
                    </button>
                    <button type="button" className="btn btn-soft" onClick={() => void removeContact("supplier", supplier.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
              {!suppliers.length ? (
                <p className="rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
                  No suppliers yet. Add one to link materials in purchasing.
                </p>
              ) : null}
              {suppliers.length > 0 && !visibleSuppliers.length ? (
                <p className="rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
                  No suppliers match your search.
                </p>
              ) : null}
            </div>
          </form>
        </Card>
      </div>
      {lastDeleted ? (
        <button type="button" className="btn btn-soft" onClick={() => void undoDelete()}>
          Undo last delete
        </button>
      ) : null}
      <ContactBoard clients={clients} suppliers={suppliers} />
      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} /> : null}
    </div>
  );
}
