import Link from "next/link";
import { Card, StatPill } from "@/components/ui/surfaces";
import { getDemoBusinessSnapshot } from "@/lib/data/demo";

const shortcuts = [
  {
    href: "/import",
    title: "Open data intake",
    description: "Validate products, formulas, and orders before they touch the workspace."
  },
  {
    href: "/products",
    title: "Review catalog",
    description: "Check yields, material formulas, and the structure of each product."
  },
  {
    href: "/purchasing",
    title: "Plan purchasing",
    description: "See what needs to be ordered from open demand."
  }
] as const;

export function HomePageContent() {
  const snapshot = getDemoBusinessSnapshot();

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-0 shadow-[var(--shadow)]">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 md:p-7">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">Home</p>
            <h1 className="mt-3 max-w-2xl font-[var(--font-display)] text-3xl leading-tight md:text-4xl">
              A calm overview for makers who need one clean path from records to purchasing.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-[var(--muted)] md:text-base">
              SmallBiz IQ keeps the whole operation legible: start with the home view, load data when you are ready,
              and let open orders roll into the purchasing plan.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/import" className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white">
                Open data intake
              </Link>
              <Link href="/products" className="rounded-full border border-[var(--line)] bg-white/70 px-5 py-3 text-sm">
                Review catalog
              </Link>
            </div>
          </div>
          <div className="border-t border-[var(--line)] bg-white/50 p-6 md:p-7 lg:border-l lg:border-t-0">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Workspace snapshot</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <StatPill label="Products" value={String(snapshot.products.length)} />
              <StatPill
                label="Open orders"
                value={String(snapshot.orders.filter((order) => order.status === "open").length)}
              />
              <StatPill label="Suppliers" value={String(snapshot.suppliers.length)} />
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-[var(--line)] bg-[#fffdf9] p-4">
              <p className="font-medium text-[var(--text)]">What happens here</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                The home screen stays light on purpose. It gives you the current shape of the business without
                crowding out the actual workspaces.
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
            <p className="mt-3 text-sm text-[var(--muted)]">{item.description}</p>
            <Link href={item.href} className="mt-5 inline-flex rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm">
              Open
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
