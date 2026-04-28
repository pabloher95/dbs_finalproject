export function WorkspaceHeader() {
  return (
    <header className="mb-6 rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow)] backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">Operations Hub</p>
          <h2 className="mt-2 font-[var(--font-display)] text-5xl italic leading-none md:text-6xl">SmallBiz IQ</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Keep your catalog tidy, your orders moving, and your purchasing plan grounded in the work that is
            actually coming in.
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 px-4 py-3 text-sm">
          <p className="font-medium text-[var(--text)]">Planning snapshot</p>
          <p className="text-[var(--muted)]">See what is due, what it consumes, and which supplier needs to hear from you next.</p>
        </div>
      </div>
    </header>
  );
}
