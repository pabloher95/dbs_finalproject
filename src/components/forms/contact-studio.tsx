"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ContactBoard } from "@/components/layout/contact-board";
import type { Client, Supplier } from "@/lib/domain/types";

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
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setClients(initialClients);
  }, [initialClients]);

  useEffect(() => {
    setSuppliers(initialSuppliers);
  }, [initialSuppliers]);

  async function persistContact(kind: "client" | "supplier", draft: typeof clientDraft | typeof supplierDraft) {
    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, ...draft })
    });
    const data = (await response.json()) as { snapshot?: { clients: Client[]; suppliers: Supplier[] }; error?: string };
    if (!response.ok || !data.snapshot) {
      setStatus(data.error ?? "Unable to save contact.");
      return;
    }

    setClients(data.snapshot.clients);
    setSuppliers(data.snapshot.suppliers);
    setStatus(`${kind === "client" ? "Customer" : "Supplier"} saved.`);
    router.refresh();
  }

  async function removeContact(kind: "client" | "supplier", id: string) {
    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", kind, id })
    });
    const data = (await response.json()) as { snapshot?: { clients: Client[]; suppliers: Supplier[] }; error?: string };
    if (!response.ok || !data.snapshot) {
      setStatus(data.error ?? "Unable to delete contact.");
      return;
    }

    setClients(data.snapshot.clients);
    setSuppliers(data.snapshot.suppliers);
    if (kind === "client" && clientDraft.id === id) {
      setClientDraft({ id: "", name: "", email: "", channel: "" });
    }
    if (kind === "supplier" && supplierDraft.id === id) {
      setSupplierDraft({ id: "", name: "", email: "", category: "" });
    }
    setStatus(`${kind === "client" ? "Customer" : "Supplier"} deleted.`);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <form
          className="space-y-4 rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-5"
          onSubmit={(event) => {
            event.preventDefault();
            void persistContact("client", clientDraft);
            setClientDraft({ id: "", name: "", email: "", channel: "" });
          }}
        >
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Customer details</p>
          <h3 className="font-[var(--font-display)] text-2xl">Add a customer</h3>
          <p className="text-sm text-[var(--muted)]">
            Create the customer record first so new orders can be assigned without retyping details.
          </p>
          <input
            value={clientDraft.name}
            onChange={(event) => setClientDraft((current) => ({ ...current, name: event.target.value }))}
            placeholder="Client name"
            className="w-full rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
          />
          <input
            value={clientDraft.email}
            onChange={(event) => setClientDraft((current) => ({ ...current, email: event.target.value }))}
            placeholder="Client email"
            className="w-full rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
          />
          <input
            value={clientDraft.channel}
            onChange={(event) => setClientDraft((current) => ({ ...current, channel: event.target.value }))}
            placeholder="Sales channel"
            className="w-full rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
          />
          <button className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white" type="submit">
            Save customer
          </button>
          <div className="space-y-3">
            {clients.map((client) => (
              <article key={client.id} className="rounded-[1.25rem] border border-[var(--line)] bg-[#fffdf9] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{client.channel}</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">{client.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-[var(--line)] px-3 py-2 text-xs"
                      onClick={() => setClientDraft({ id: client.id, name: client.name, email: client.email, channel: client.channel })}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-[var(--line)] px-3 py-2 text-xs text-[var(--accent-deep)]"
                      onClick={() => void removeContact("client", client.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </form>
        <form
          className="space-y-4 rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-5"
          onSubmit={(event) => {
            event.preventDefault();
            void persistContact("supplier", supplierDraft);
            setSupplierDraft({ id: "", name: "", email: "", category: "" });
          }}
        >
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Supplier details</p>
          <h3 className="font-[var(--font-display)] text-2xl">Add a supplier</h3>
          <p className="text-sm text-[var(--muted)]">
            Keep preferred suppliers on hand so the purchasing plan already points to the right source.
          </p>
          <input
            value={supplierDraft.name}
            onChange={(event) => setSupplierDraft((current) => ({ ...current, name: event.target.value }))}
            placeholder="Supplier name"
            className="w-full rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
          />
          <input
            value={supplierDraft.email}
            onChange={(event) => setSupplierDraft((current) => ({ ...current, email: event.target.value }))}
            placeholder="Supplier email"
            className="w-full rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
          />
          <input
            value={supplierDraft.category}
            onChange={(event) => setSupplierDraft((current) => ({ ...current, category: event.target.value }))}
            placeholder="Category"
            className="w-full rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3"
          />
          <button className="rounded-full bg-[var(--sage)] px-5 py-3 text-sm font-medium text-white" type="submit">
            Save supplier
          </button>
          <div className="space-y-3">
            {suppliers.map((supplier) => (
              <article key={supplier.id} className="rounded-[1.25rem] border border-[var(--line)] bg-[#fffdf9] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{supplier.name}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{supplier.email}</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">{supplier.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-[var(--line)] px-3 py-2 text-xs"
                      onClick={() =>
                        setSupplierDraft({ id: supplier.id, name: supplier.name, email: supplier.email, category: supplier.category })
                      }
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-[var(--line)] px-3 py-2 text-xs text-[var(--accent-deep)]"
                      onClick={() => void removeContact("supplier", supplier.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </form>
      </div>
      {status ? <p className="text-sm text-[var(--muted)]">{status}</p> : null}
      <ContactBoard clients={clients} suppliers={suppliers} />
    </div>
  );
}
