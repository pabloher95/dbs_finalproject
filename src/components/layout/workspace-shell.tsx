import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import type { Route } from "next";
import { BusinessRenameButton } from "@/components/layout/business-rename-button";
import { CommandBar } from "@/components/layout/command-bar";
import { DemoResetButton } from "@/components/layout/demo-reset-button";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { LanguageSwitcher } from "@/components/providers/language-switcher";
import { BrandLogo } from "@/components/ui/brand-logo";
import { appNav } from "@/lib/data/navigation";
import { getRequestLanguage } from "@/lib/i18n-server";
import { workspaceCopy } from "@/lib/i18n";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export async function WorkspaceShell({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { snapshot, source } = await getWorkspaceOverview();
  const language = await getRequestLanguage();
  const copy = workspaceCopy(language);
  const businessName = snapshot.business.name;
  const openOrdersList = snapshot.orders
    .filter((order) => order.status === "open")
    .slice(0, 4);
  const openOrders = openOrdersList.length;
  const today = new Intl.DateTimeFormat(language === "es" ? "es-ES" : "en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date());

  return (
    <div className="shell-outer min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto max-w-[1640px] space-y-5">
        {/* Editorial masthead — quiet, ruled, magazine-style */}
        <header className="flex flex-col gap-4 border-b border-[var(--ink)] pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-end gap-4 md:gap-6">
            <Link href={"/" as Route} className="shrink-0">
              <BrandLogo variant="masthead" priority />
            </Link>
            <p className="marginalia hidden md:block">
              {copy.studioLabel}
              <br />
              <span className="text-[var(--ink)]">{businessName}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:gap-5">
            <p className="marginalia">{today}</p>
            <span className="h-3 w-px bg-[var(--line-strong)]" aria-hidden />
            <LanguageSwitcher />
            <span className="h-3 w-px bg-[var(--line-strong)]" aria-hidden />
            <BusinessRenameButton businessName={businessName} />
            <span className="h-3 w-px bg-[var(--line-strong)]" aria-hidden />
            <DemoResetButton />
            <span className="h-3 w-px bg-[var(--line-strong)]" aria-hidden />
            <div className="group relative">
              <Link href={"/orders" as Route} className="link-rule text-sm">
                {openOrders} {openOrders === 1 ? copy.openOrder : copy.openOrders}
              </Link>
              <div
                className="pointer-events-none absolute left-1/2 top-full z-20 mt-3 w-[18rem] -translate-x-1/2 translate-y-1 opacity-0 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.45)] transition duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
                role="tooltip"
              >
                <div className="rounded-[20px] border border-[var(--ink)] bg-[var(--paper-bright)] px-4 py-3 text-left">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
                    {copy.openDemand}
                  </p>
                  <div className="mt-2 space-y-2">
                    {openOrdersList.length ? (
                      openOrdersList.map((order) => (
                        <div key={order.id} className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-display text-[1rem] leading-tight text-[var(--ink)]">
                              {order.orderNumber}
                            </p>
                            <p className="mt-1 text-[0.78rem] leading-5 text-[var(--muted-strong)]">
                              {order.clientName}
                            </p>
                          </div>
                          <p className="shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted-strong)]">
                            {copy.due} {order.dueDate}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-[var(--muted-strong)]">{copy.noOpenOrders}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <p className="marginalia">{copy.synced}</p>
            <span className="h-3 w-px bg-[var(--line-strong)]" aria-hidden />
            <UserButton />
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[15.5rem_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-6 xl:h-fit">
            <div className="flex flex-col gap-4">
              <div className="ink-rail ink-rail--nav">
                <SidebarNav
                  items={appNav.map((item, index) => ({
                    ...item,
                    label: copy.nav[index]?.label ?? item.label,
                    description: copy.nav[index]?.description ?? item.description
                  }))}
                />
              </div>
            </div>
          </aside>
          <main className="min-w-0 space-y-5">
            <CommandBar businessName={businessName} source={source} />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
