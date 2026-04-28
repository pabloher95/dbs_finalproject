import Link from "next/link";
import { Card, StatPill } from "@/components/ui/surfaces";
import type { BusinessSnapshot } from "@/lib/domain/types";

const shortcuts = [
  {
    href: "/import",
    title: "Import records",
    description: "Load products and orders with templates that catch issues before they slow you down."
  },
  {
    href: "/products",
    title: "Review catalog",
    description: "Check yields, formulas, and the product structure your team uses to plan work."
  },
  {
    href: "/purchasing",
    title: "Plan purchasing",
    description: "Turn open orders into a clear buy list with supplier context beside each material."
  }
] as const;

export function HomePageContent({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  return (
    <div className="space-y-5">
      <Card className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-0 shadow-[var(--shadow)]">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 md:p-7">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">Home</p>
            <h1 className="mt-3 max-w-2xl font-[var(--font-display)] text-3xl leading-tight md:text-4xl">
              Run products, orders, and purchasing from one place.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)] md:text-base">
              {snapshot.business.name} has one workspace for catalog changes, order capture, and purchasing so the next
              decision stays close to the work.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/import" className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white">
                Import data
              </Link>
              <Link href="/products" className="rounded-full border border-[var(--line)] bg-white/70 px-5 py-3 text-sm">
                Review catalog
              </Link>
            </div>
          </div>
          <div className="border-t border-[var(--line)] bg-white/50 p-6 md:p-7 lg:border-l lg:border-t-0">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Today at a glance</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <StatPill label="Products" value={String(snapshot.products.length)} />
              <StatPill
                label="Open orders"
                value={String(snapshot.orders.filter((order) => order.status === "open").length)}
              />
              <StatPill label="Suppliers" value={String(snapshot.suppliers.length)} />
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-[var(--line)] bg-[#fffdf9] p-4">
              <p className="font-medium text-[var(--text)]">Ready for the next move</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Use this view to confirm the current workload, then jump into the catalog, orders, or purchasing page
                to make the next decision with confidence.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {shortcuts.map((item) => (
          <Card key={item.href} className="rounded-[1.75rem] border border-[var(--line)] bg-white/70 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Next action</p>
            <h2 className="mt-2 font-[var(--font-display)] text-2xl">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
            <Link href={item.href} className="mt-5 inline-flex rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm">
              Open
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
