import Link from "next/link";
import type { Route } from "next";
import { Card } from "@/components/ui/surfaces";
import { AnalyticsOverview } from "@/components/layout/analytics-overview";
import { DashboardActiveOrders } from "@/components/layout/dashboard-active-orders";
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
  const channels = new Set(
    snapshot.clients
      .map((client) => client.channel.trim())
      .filter((channel) => channel.length > 0)
  ).size;
  const totalUnits = openOrders.reduce(
    (sum, order) => sum + order.items.reduce((inner, item) => inner + item.quantity, 0),
    0
  );
  const lowStockMaterials = planLines.filter((line) => line.netToBuyQuantity > 0).length;
  const sourcingGaps = planLines.filter((line) => !line.supplierName).length;
  return (
    <div className="space-y-10 md:space-y-14">
      {/* HERO — editorial plate */}
      <Reveal>
        <section className="plate p-6 md:p-10">
          <div>
            <p className="eyebrow text-[var(--vermilion)]">{snapshot.business.name}</p>
            <h1 className="editorial mt-4 text-[clamp(2.6rem,6vw,5.4rem)]">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-[1.02rem] leading-7 text-[var(--ink-soft)]">
              {copy.body}
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {[
                {
                  eyebrow: copy.operationsEyebrow,
                  title: copy.operationsTitle,
                  body: copy.operationsBody,
                  badge: copy.products,
                  badgeClass: "inline-flex items-center gap-2 rounded-full border border-[rgba(22,22,24,0.16)] bg-[rgba(250,246,236,0.72)] px-3 py-1 font-mono text-[0.61rem] uppercase tracking-[0.22em] text-[var(--ink)]",
                  titleClass: "text-[var(--ink)]",
                  valueClass: "text-[var(--ink)]",
                  gridClass: "bg-[rgba(22,22,24,0.12)]",
                  cellClass: "bg-[rgba(250,246,236,0.72)]",
                  stats: [
                    { label: copy.products, value: snapshot.products.length },
                    { label: copy.suppliers, value: snapshot.suppliers.length },
                    { label: copy.customers, value: snapshot.clients.length },
                    { label: copy.channels, value: channels }
                  ]
                },
                {
                  eyebrow: copy.salesEyebrow,
                  title: copy.salesTitle,
                  body: copy.salesBody,
                  badge: copy.openOrders,
                  badgeClass: "pill pill-moss",
                  titleClass: "text-[var(--botanical-deep)]",
                  valueClass: "text-[var(--botanical-deep)]",
                  gridClass: "bg-[rgba(46,83,57,0.14)]",
                  cellClass: "bg-[rgba(250,246,236,0.72)]",
                  stats: [
                    { label: copy.openOrders, value: openOrders.length },
                    { label: copy.unitsDue, value: totalUnits },
                    { label: copy.lowStock, value: lowStockMaterials },
                    { label: copy.sourcingGaps, value: sourcingGaps }
                  ]
                }
              ].map((panel) => (
                <Card key={panel.title} className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
                    <div>
                      <p className="eyebrow text-[var(--vermilion)]">{panel.eyebrow}</p>
                      <h2 className={`mt-2 font-display text-3xl leading-none tracking-tight md:text-4xl ${panel.titleClass}`}>
                        {panel.title}
                      </h2>
                    </div>
                    <span className={panel.badgeClass}>{panel.badge}</span>
                  </div>

                  <p className="mt-4 text-[0.95rem] leading-6 text-[var(--muted-strong)]">{panel.body}</p>

                  <div className={`mt-6 grid gap-px md:grid-cols-2 ${panel.gridClass}`}>
                    {panel.stats.map((stat) => (
                      <div key={stat.label} className={`${panel.cellClass} px-5 py-5`}>
                        <p className="marginalia">— {stat.label}</p>
                        <p className={`font-display mt-2 text-4xl leading-none tracking-tight md:text-[2.9rem] ${panel.valueClass}`}>
                          {String(stat.value).padStart(2, "0")}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={"/import" as Route} className="btn btn-vermilion">
                {copy.beginIntake} →
              </Link>
              <Link href={"/orders" as Route} className="btn btn-vermilion">
                {copy.reviewOrders} →
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

            <DashboardActiveOrders orders={openOrders} copy={copy} />
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
