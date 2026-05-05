import Link from "next/link";
import type { Route } from "next";
import { Reveal } from "@/components/ui/surfaces";
import type { BusinessSnapshot } from "@/lib/domain/types";
import { buildPurchasingPlan } from "@/lib/domain/purchasing-plan";

const shortcuts = [
  {
    href: "/import" as Route,
    n: "01",
    title: "Import",
    description: "Upload products, contacts, or orders as CSV."
  },
  {
    href: "/products" as Route,
    n: "02",
    title: "Define products",
    description: "Write each product as a formula of materials, yields, and units."
  },
  {
    href: "/purchasing" as Route,
    n: "03",
    title: "Plan purchasing",
    description: "Expand open demand into a supplier-ready material list."
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
  const sourcingGaps = planLines.filter((line) => !line.supplierName).length;
  const nextOrders = [...openOrders].slice(0, 3);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="space-y-10 md:space-y-14">
      {/* HERO — editorial plate */}
      <Reveal>
        <section className="plate p-6 md:p-10">
          <div className="flex items-baseline justify-between border-b border-[var(--ink)] pb-4">
            <p className="marginalia">Today &nbsp;·&nbsp; {today}</p>
            <p className="marginalia">
              {sourcingGaps > 0 ? (
                <span className="text-[var(--vermilion)]">
                  {sourcingGaps} sourcing gap{sourcingGaps === 1 ? "" : "s"}
                </span>
              ) : (
                <span className="text-[var(--data-moss)]">Sourcing complete</span>
              )}
            </p>
          </div>

          <div className="pt-8">
            <p className="eyebrow text-[var(--vermilion)]">{snapshot.business.name}</p>
              <h1 className="editorial mt-4 text-[clamp(2.6rem,6vw,5.4rem)]">
                The work, <em>written down.</em>
              </h1>
              <p className="mt-6 max-w-2xl text-[1.02rem] leading-7 text-[var(--ink-soft)]">
                A clean intake lane, a readable catalog, and a measured path from open demand to a
                supplier-ready buy list. Begin where it makes sense — the rest follows.
              </p>

              <div className="mt-10 grid gap-px bg-[var(--ink)] md:grid-cols-4">
                {[
                  { label: "Products", value: snapshot.products.length },
                  { label: "Open orders", value: openOrders.length },
                  { label: "Units due", value: totalUnits },
                  { label: "Suppliers", value: snapshot.suppliers.length }
                ].map((stat) => (
                  <div key={stat.label} className="bg-[var(--paper-bright)] px-5 py-5">
                    <p className="marginalia">— {stat.label}</p>
                    <p className="font-display mt-2 text-4xl leading-none tracking-tight text-[var(--ink)] md:text-5xl">
                      {String(stat.value).padStart(2, "0")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href={"/import" as Route} className="btn btn-vermilion">
                  Begin intake →
                </Link>
                <Link href={"/orders" as Route} className="link-rule">
                  Review orders
                </Link>
              </div>
          </div>
        </section>
      </Reveal>

      {/* PRIORITY QUEUE + METHOD */}
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <section>
            <header className="flex items-end justify-between border-b border-[var(--ink)] pb-3">
              <div>
                <p className="eyebrow text-[var(--vermilion)]">Priority queue</p>
                <h2 className="font-display mt-2 text-3xl leading-none tracking-tight text-[var(--ink)] md:text-4xl">
                  Today&rsquo;s active orders
                </h2>
              </div>
              <p className="marginalia">
                {openOrders.length} open · {totalUnits} units
              </p>
            </header>

            <div className="mt-6 space-y-px bg-[var(--line)]">
              {nextOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-4 bg-[var(--paper-bright)] px-5 py-5"
                >
                  <div className="min-w-0">
                    <p className="font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
                      {order.orderNumber}
                    </p>
                    <p className="mt-1 text-sm text-[var(--ink-soft)]">
                      {order.clientName} &nbsp;·&nbsp; due {order.dueDate}
                    </p>
                  </div>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} units
                  </span>
                </div>
              ))}
              {!nextOrders.length ? (
                <p className="bg-[var(--paper-bright)] p-6 text-sm text-[var(--ink-soft)]">
                  No open orders yet. Add one to populate the queue.
                </p>
              ) : null}
            </div>
          </section>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={120}>
          <section>
            <header className="border-b border-[var(--ink)] pb-3">
              <p className="eyebrow text-[var(--vermilion)]">Method</p>
              <h2 className="font-display mt-2 text-3xl leading-none tracking-tight text-[var(--ink)] md:text-4xl">
                Three moves
              </h2>
            </header>
            <div className="mt-2">
              {shortcuts.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group grid grid-cols-[3.2rem_1fr_auto] items-start gap-4 border-b border-[var(--line)] py-5 transition-colors hover:bg-[var(--paper-deep)]"
                >
                  <span className="numeral text-3xl">{item.n}</span>
                  <div>
                    <p className="font-display text-2xl leading-none tracking-tight text-[var(--ink)]">
                      {item.title}
                    </p>
                    <p className="mt-2 text-[0.95rem] leading-6 text-[var(--ink-soft)]">
                      {item.description}
                    </p>
                  </div>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted)] transition-colors group-hover:text-[var(--vermilion)]">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
