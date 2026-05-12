"use client";

import { Card, Pill, SectionHeading } from "@/components/ui/surfaces";
import { contactBoardCopy } from "@/lib/i18n";
import { useLanguage } from "@/components/providers/language-provider";
import type { Client, Supplier } from "@/lib/domain/types";

export function ContactBoard({
  clients,
  suppliers
}: Readonly<{
  clients: Client[];
  suppliers: Supplier[];
}>) {
  const { language } = useLanguage();
  const copy = contactBoardCopy(language);
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="rounded-[28px] p-6">
        <SectionHeading
          eyebrow={copy.customers}
          title={copy.orderDestinations}
          description={copy.customerDescription}
        />
        <div className="mt-5 space-y-3">
          {clients.map((client) => (
            <article
              key={client.id}
              className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-xl text-[var(--ink)]">{client.name}</p>
                <Pill>{client.channel}</Pill>
              </div>
              <p className="mt-2 text-sm text-[var(--muted-strong)]">{client.email}</p>
            </article>
          ))}
          {!clients.length ? (
            <p className="rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
              {copy.noCustomers}
            </p>
          ) : null}
        </div>
      </Card>
      <Card className="rounded-[28px] p-6">
        <SectionHeading
          eyebrow={copy.suppliers}
          title={copy.sourcingLinks}
          description={copy.supplierDescription}
        />
        <div className="mt-5 space-y-3">
          {suppliers.map((supplier) => (
            <article
              key={supplier.id}
              className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-xl text-[var(--ink)]">{supplier.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted-strong)]">{supplier.email}</p>
                </div>
                <Pill tone="ink">{supplier.category}</Pill>
              </div>
            </article>
          ))}
          {!suppliers.length ? (
            <p className="rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted-strong)]">
              {copy.noSuppliers}
            </p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
