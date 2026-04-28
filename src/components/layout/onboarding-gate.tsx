"use client";

import { useState } from "react";

export function OnboardingGate({
  children,
  defaultOpen = true
}: Readonly<{
  children: React.ReactNode;
  defaultOpen?: boolean;
}>) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      {children}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(34,24,18,0.52)] px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[2rem] border border-[var(--line)] bg-[var(--panel-strong)] p-6 shadow-[0_30px_90px_rgba(39,24,15,0.28)] md:p-8">
            <p className="font-[var(--font-display)] text-3xl italic tracking-wide text-[var(--text)] md:text-4xl">
              SmallBiz IQ
            </p>
            <h1 className="mt-4 max-w-2xl font-[var(--font-display)] text-2xl leading-tight md:text-4xl">
              A faster way to run the work behind every order.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)] md:text-base">
              Start with the catalog, load your records when you are ready, and use purchasing to see exactly what
              needs to be bought next.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                {
                  title: "Start with catalog",
                  body: "Review products and formulas before you make changes."
                },
                {
                  title: "Load records",
                  body: "Import products and orders with clear templates."
                },
                {
                  title: "Buy with clarity",
                  body: "See open demand, required materials, and supplier context in one place."
                }
              ].map((item) => (
                <div key={item.title} className="rounded-[1.25rem] border border-[var(--line)] bg-white/75 p-4">
                  <p className="font-medium text-[var(--text)]">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white"
              >
                Open workspace
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
