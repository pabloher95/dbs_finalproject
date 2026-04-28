"use client";

import { useState } from "react";
import { ContactBoard } from "@/components/layout/contact-board";
import type { Client, Supplier } from "@/lib/domain/types";

export function ContactStudio({
  clients: initialClients,
  suppliers: initialSuppliers
}: Readonly<{
  clients: Client[];
  suppliers: Supplier[];
}>) {
  const [clients, setClients] = useState(initialClients);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [clientDraft, setClientDraft] = useState({ name: "", email: "", channel: "" });
  const [supplierDraft, setSupplierDraft] = useState({ name: "", email: "", category: "" });

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <form
          className="space-y-4 rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-5"
          onSubmit={(event) => {
            event.preventDefault();
            setClients((current) => [...current, { id: `cl_${Date.now()}`, ...clientDraft }]);
            setClientDraft({ name: "", email: "", channel: "" });
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
        </form>
        <form
          className="space-y-4 rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-5"
          onSubmit={(event) => {
            event.preventDefault();
            setSuppliers((current) => [...current, { id: `sup_${Date.now()}`, ...supplierDraft }]);
            setSupplierDraft({ name: "", email: "", category: "" });
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
        </form>
      </div>
      <ContactBoard clients={clients} suppliers={suppliers} />
    </div>
  );
}
