export function WorkspaceHeader() {
  return (
    <header className="mb-6 rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow)] backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">Operations Hub</p>
          <h2 className="mt-2 font-[var(--font-display)] text-4xl italic">SmallBiz IQ</h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
            Manage formula-based products, keep orders organized, and translate demand into clear purchasing needs.
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 px-4 py-3 text-sm">
          <p className="font-medium text-[var(--text)]">Planning snapshot</p>
          <p className="text-[var(--muted)]">Track what needs to be made, what materials are required, and who it is for.</p>
        </div>
      </div>
    </header>
  );
}
