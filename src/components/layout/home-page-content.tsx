import Link from "next/link";
import type { Route } from "next";
import { Card, Display, Eyebrow, Pill, Reveal } from "@/components/ui/surfaces";
import type { BusinessSnapshot } from "@/lib/domain/types";
import { buildPurchasingPlan } from "@/lib/domain/purchasing-plan";

const shortcuts = [
  {
    href: "/import" as Route,
    eyebrow: "01 · Intake",
    title: "Bring records in",
    description: "Drop a CSV or paste rows. Versioned templates with row-level validation.",
    cta: "Start an intake"
  },
  {
    href: "/products" as Route,
    eyebrow: "02 · Catalog",
    title: "Tune your formulas",
    description: "Yields, units, and material bills are the source of truth for purchasing math.",
    cta: "Open catalog"
  },
  {
    href: "/purchasing" as Route,
    eyebrow: "03 · Purchasing",
    title: "Run the buy list",
    description: "Open orders translate to materials, with supplier links beside every line.",
    cta: "View today\u2019s buy list"
  }
] as const;

export function HomePageContent({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const openOrders = snapshot.orders.filter((order) => order.status === "open");
  const planLines = buildPurchasingPlan(
    snapshot.orders,
    snapshot.products,
    snapshot.materials,
    snapshot.suppliers
  );
  const totalUnits = openOrders.reduce(
    (sum, order) => sum + order.items.reduce((inner, item) => inner + item.quantity, 0),
    0
  );

  return (
    <div className="space-y-6">
      <Reveal>
        <Card className="overflow-hidden p-7 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-stretch">
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-3">
                <Eyebrow tone="flame">
                  Today · {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                </Eyebrow>
                <Pill tone="ink">{snapshot.business.name}</Pill>
              </div>
              <Display size="hero" className="mt-5">
                Run the work
                <br />
                <span className="text-[var(--flame)]">behind every order.</span>
              </Display>
              <p className="mt-5 max-w-xl text-[1.02rem] leading-7 text-[var(--muted-strong)]">
                One console for catalog, demand, and material purchasing. Snap from intake to a
                purchase-ready list in a single sitting — no detours, no context switches.
              </p>
            </div>
            <div className="relative">
              <div className="flame-card flex h-full flex-col gap-5 rounded-[22px] p-6">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-[var(--ink)]/70">
                  Snapshot
                </p>
                <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                  {[
                    {
                      label: "Products",
                      value: snapshot.products.length,
                      hint: `${new Set(snapshot.products.map((p) => p.category)).size} categories`
                    },
                    {
                      label: "Open orders",
                      value: openOrders.length,
                      hint: `${totalUnits} units due`
                    },
                    {
                      label: "Suppliers",
                      value: snapshot.suppliers.length,
                      hint: "Sources linked"
                    },
                    {
                      label: "Plan lines",
                      value: planLines.length,
                      hint: "Materials to buy"
                    }
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="font-mono text-[0.6rem] uppercase tracking-[0.32em] text-[var(--ink)]/65">
                        {stat.label}
                      </p>
                      <p className="mt-1 font-display italic text-4xl leading-none text-[var(--paper-bright)]">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-[0.78rem] text-[var(--ink)]/70">{stat.hint}</p>
                    </div>
                  ))}
                </div>
                <div className="h-px w-full bg-[var(--ink)]/15" />
                <div className="space-y-2">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-[var(--ink)]/70">
                    Next due
                  </p>
                  {openOrders.slice(0, 2).map((order) => (
                    <div key={order.id} className="flex items-center justify-between gap-3">
                      <span className="font-display italic text-base text-[var(--paper-bright)]">{order.orderNumber}</span>
                      <span className="font-mono text-xs text-[var(--ink)]/75">
                        {order.dueDate} · {order.clientName}
                      </span>
                    </div>
                  ))}
                  {!openOrders.length ? (
                    <p className="text-[0.85rem] text-[var(--ink)]/75">
                      No open orders yet. Capture one to start a purchasing run.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-3">
        {shortcuts.map((item, index) => (
          <Reveal key={item.href} delay={120 + index * 90}>
            <div className="flex h-full flex-col rounded-[20px] border border-[var(--line)] bg-[var(--paper-bright)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--ink)]">
              <Eyebrow tone="flame">{item.eyebrow}</Eyebrow>
              <Display size="md" className="mt-3">
                {item.title}
              </Display>
              <p className="mt-3 flex-1 text-[0.92rem] leading-6 text-[var(--muted-strong)]">{item.description}</p>
              <Link href={item.href} className="btn btn-flame mt-6 self-start">
                {item.cta}
                <span aria-hidden className="font-mono text-[0.62rem] tracking-[0.22em] opacity-80">→</span>
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
