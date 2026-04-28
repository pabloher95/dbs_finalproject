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

  return (
    <div className="shell-outer min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:flex-row">
        <aside className="md:w-[18.5rem] md:flex-shrink-0">
          <div className="sticky top-5 flex flex-col gap-3">
            <div className="ink-rail">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-[rgba(247,236,214,0.55)]">
                Operations
              </p>
              <p className="mt-1 font-display italic text-3xl leading-[1] text-[var(--paper-bright)]">
                SmallBiz / IQ
              </p>
            </div>
            <div className="ink-rail">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[rgba(247,236,214,0.6)]">
                Workspace
              </p>
              <p className="mt-1 truncate font-display italic text-xl text-[var(--paper-bright)]">{businessName}</p>
              <div className="mt-3 flex items-center gap-2 text-[0.7rem] text-[rgba(247,236,214,0.7)]">
                <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-[var(--flame)]" />
                <span className="font-mono uppercase tracking-[0.24em]">
                  {openOrders} open
                </span>
              </div>
            </div>
            <div className="ink-rail ink-rail--nav">
              <SidebarNav items={appNav} />
            </div>
          </div>
        </aside>
        <main className="min-w-0 flex-1 space-y-6">
          <CommandBar businessName={businessName} />
          {children}
        </main>
      </div>
    </div>
  );
}
