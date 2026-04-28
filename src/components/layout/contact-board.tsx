import { Card, Pill, SectionHeading } from "@/components/ui/surfaces";
import type { Client, Supplier } from "@/lib/domain/types";

export function ContactBoard({
  clients,
  suppliers
}: Readonly<{
  clients: Client[];
  suppliers: Supplier[];
}>) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="p-6">
        <SectionHeading
          eyebrow="Customers"
          title="Order destinations"
          description="Track who orders from you, how they buy, and where upcoming production is headed."
        />
        <div className="mt-5 space-y-3">
          {clients.map((client) => (
            <article
              key={client.id}
              className="rounded-2xl border border-[var(--line)] bg-[var(--paper-bright)] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-display italic text-xl">{client.name}</p>
                <Pill>{client.channel}</Pill>
              </div>
              <p className="mt-2 text-sm text-[var(--muted-strong)]">{client.email}</p>
            </article>
          ))}
          {!clients.length ? (
            <p className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--paper-bright)] p-4 text-sm text-[var(--muted-strong)]">
              No customers yet.
            </p>
          ) : null}
        </div>
      </Card>
      <Card className="p-6">
        <SectionHeading
          eyebrow="Suppliers"
          title="Material sourcing links"
          description="Assign preferred vendors so the purchasing plan can point to the right source on day one."
        />
        <div className="mt-5 space-y-3">
          {suppliers.map((supplier) => (
            <article
              key={supplier.id}
              className="rounded-2xl border border-[var(--line)] bg-[var(--paper-bright)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display italic text-xl">{supplier.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted-strong)]">{supplier.email}</p>
                </div>
                <Pill tone="ink">{supplier.category}</Pill>
              </div>
            </article>
          ))}
          {!suppliers.length ? (
            <p className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--paper-bright)] p-4 text-sm text-[var(--muted-strong)]">
              No suppliers yet.
            </p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
