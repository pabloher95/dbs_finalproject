import Link from "next/link";
import type { Route } from "next";
import { AnalyticsOverview } from "@/components/layout/analytics-overview";
import { Reveal } from "@/components/ui/surfaces";
import { getRequestLanguage } from "@/lib/i18n-server";
import { dashboardCopy } from "@/lib/i18n";
import type { BusinessSnapshot } from "@/lib/domain/types";
import { buildPurchasingPlan } from "@/lib/domain/purchasing-plan";

export async function HomePageContent({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const language = await getRequestLanguage();
  const copy = dashboardCopy(language);
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
  const today = new Intl.DateTimeFormat(language === "es" ? "es-ES" : "en-US", {
    month: "long",
    day: "numeric"
  }).format(new Date());

  return (
    <div className="space-y-10 md:space-y-14">
      {/* HERO — editorial plate */}
      <Reveal>
        <section className="plate p-6 md:p-10">
          <div className="flex items-baseline justify-between border-b border-[var(--ink)] pb-4">
            <p className="marginalia">
              {copy.today} &nbsp;·&nbsp; {today}
            </p>
            <p className="marginalia">
              {sourcingGaps > 0 ? (
                <span className="text-[var(--vermilion)]">
                  {sourcingGaps} {sourcingGaps === 1 ? copy.sourcingGap : copy.sourcingGaps}
                </span>
              ) : (
                <span className="text-[var(--data-moss)]">{copy.sourcingComplete}</span>
              )}
            </p>
          </div>

          <div className="pt-8">
            <p className="eyebrow text-[var(--vermilion)]">{snapshot.business.name}</p>
            <h1 className="editorial mt-4 text-[clamp(2.6rem,6vw,5.4rem)]">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-[1.02rem] leading-7 text-[var(--ink-soft)]">
              {copy.body}
            </p>

            <div className="mt-10 grid gap-px bg-[var(--ink)] md:grid-cols-4">
              {[
                { label: copy.products, value: snapshot.products.length },
                { label: copy.openOrders, value: openOrders.length },
                { label: copy.unitsDue, value: totalUnits },
                { label: copy.suppliers, value: snapshot.suppliers.length }
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
                {copy.beginIntake} →
              </Link>
              <Link href={"/orders" as Route} className="link-rule">
                {copy.reviewOrders}
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
                <p className="eyebrow text-[var(--vermilion)]">{copy.priorityQueue}</p>
                <h2 className="font-display mt-2 text-3xl leading-none tracking-tight text-[var(--ink)] md:text-4xl">
                  {copy.activeOrders}
                </h2>
              </div>
              <p className="marginalia">
                {openOrders.length} {copy.open} · {totalUnits} {copy.units}
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
                      {order.clientName} &nbsp;·&nbsp; {copy.due} {order.dueDate}
                    </p>
                  </div>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} {copy.units}
                  </span>
                </div>
              ))}
              {!nextOrders.length ? (
                <p className="bg-[var(--paper-bright)] p-6 text-sm text-[var(--ink-soft)]">
                  {copy.noOpenOrders}
                </p>
              ) : null}
            </div>
          </section>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={120}>
          <section>
            <header className="border-b border-[var(--ink)] pb-3">
              <p className="eyebrow text-[var(--vermilion)]">{copy.method}</p>
              <h2 className="font-display mt-2 text-3xl leading-none tracking-tight text-[var(--ink)] md:text-4xl">
                {copy.threeMoves}
              </h2>
            </header>
            <div className="mt-2">
              {copy.shortcuts.map((item) => (
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

      <Reveal delay={220}>
        <AnalyticsOverview snapshot={snapshot} />
      </Reveal>
    </div>
  );
}
