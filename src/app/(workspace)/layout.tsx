import Link from "next/link";
import { WorkspaceHeader } from "@/components/layout/workspace-header";
import { appNav } from "@/lib/data/navigation";

export default function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl gap-6">
        <aside className="hidden w-72 shrink-0 rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow)] backdrop-blur md:block">
          <div className="mb-8">
            <p className="font-[var(--font-display)] text-3xl italic tracking-wide">SmallBiz IQ</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Warm operations tooling for makers who sell by batch, bundle, and order.
            </p>
          </div>
          <nav className="space-y-2">
            {appNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl border border-transparent px-4 py-3 text-sm text-[var(--muted)] transition hover:border-[var(--line)] hover:bg-white/60 hover:text-[var(--text)]"
              >
                <span className="block font-medium text-[var(--text)]">{item.label}</span>
                <span>{item.description}</span>
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">
          <WorkspaceHeader />
          {children}
        </main>
      </div>
    </div>
  );
}
