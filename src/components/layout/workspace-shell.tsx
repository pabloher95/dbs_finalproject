import Link from "next/link";
import type { Route } from "next";
import { CommandBar } from "@/components/layout/command-bar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { appNav } from "@/lib/data/navigation";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export async function WorkspaceShell({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { snapshot } = await getWorkspaceOverview();
  const businessName = snapshot.business.name;
  const openOrders = snapshot.orders.filter((order) => order.status === "open").length;

  const editionDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date());

  return (
    <div className="shell-outer min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto max-w-[1640px] space-y-5">
        {/* Editorial masthead — quiet, ruled, magazine-style */}
        <header className="flex items-end justify-between border-b border-[var(--ink)] pb-5">
          <div className="flex items-end gap-6">
            <Link href={"/" as Route} className="brand-mark">
              smallbiz<em className="not-italic font-normal text-[var(--vermilion)]">·</em>iq
            </Link>
            <p className="marginalia hidden md:block">
              The Studio
              <br />
              <span className="text-[var(--ink)]">{businessName}</span>
            </p>
          </div>
          <div className="hidden items-center gap-5 md:flex">
            <p className="marginalia">Edition · {editionDate}</p>
            <span className="h-3 w-px bg-[var(--line-strong)]" />
            <p className="marginalia">{openOrders} open</p>
            <Link href={"/" as Route} className="link-rule text-sm">
              ← View site
            </Link>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[15.5rem_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-6 xl:h-fit">
            <div className="flex flex-col gap-4">
              <div className="ink-rail ink-rail--nav">
                <SidebarNav items={appNav} />
              </div>
              <div className="ink-rail">
                <p className="eyebrow text-[var(--vermilion)]">Signal</p>
                <p className="font-display mt-2 text-4xl leading-none tracking-tight text-[var(--ink)]">
                  {String(openOrders).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                  open order{openOrders === 1 ? "" : "s"} driving the current plan.
                </p>
                <div className="rule-thick mt-4" />
                <p className="marginalia mt-3">
                  Read the buy list →
                  <br />
                  <Link href={"/purchasing" as Route} className="link-rule text-[var(--ink)]">
                    Purchasing
                  </Link>
                </p>
              </div>
            </div>
          </aside>
          <main className="min-w-0 space-y-5">
            <CommandBar businessName={businessName} />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
