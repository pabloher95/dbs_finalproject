import { Card, SectionHeading } from "@/components/ui/surfaces";
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
      <Card className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6">
        <SectionHeading
          eyebrow="Clients"
          title="Order destinations"
          description="Keep track of who orders from you, how they buy, and where upcoming production is headed."
        />
        <div className="mt-5 space-y-4">
          {clients.map((client) => (
            <article key={client.id} className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-4">
              <h3 className="font-medium">{client.name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{client.channel}</p>
              <p className="mt-3 text-sm text-[var(--muted)]">{client.email}</p>
            </article>
          ))}
        </div>
      </Card>
      <Card className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6">
        <SectionHeading
          eyebrow="Suppliers"
          title="Material sourcing links"
          description="Assign preferred vendors so your purchasing plan can point you to the right source right away."
        />
        <div className="mt-5 space-y-4">
          {suppliers.map((supplier) => (
            <article key={supplier.id} className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{supplier.name}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">{supplier.email}</p>
                </div>
                <span className="rounded-full bg-[var(--bg-strong)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                  {supplier.category}
                </span>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
