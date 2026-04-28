"use client";

import { useState } from "react";
import Link from "next/link";

export function OnboardingGate({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(true);

  return (
    <>
      {children}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(34,24,18,0.52)] px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] border border-[var(--line)] bg-[var(--panel-strong)] p-6 shadow-[0_30px_90px_rgba(39,24,15,0.28)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">Welcome</p>
            <h1 className="mt-3 font-[var(--font-display)] text-4xl leading-tight">
              A simple place to track products, orders, and what needs to be purchased next.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-[var(--muted)]">
              Start by importing your catalog or create a few items manually. Once the products and customers are in
              place, orders flow into the purchasing page automatically.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                "Import products and formulas",
                "Add customers and orders",
                "Review the purchasing plan"
              ].map((item) => (
                <div key={item} className="rounded-[1.25rem] border border-[var(--line)] bg-white/75 p-4 text-sm">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white"
              >
                Get started
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[var(--line)] bg-white/70 px-5 py-3 text-sm"
              >
                Dismiss
              </button>
              <Link
                href="/import"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[var(--line)] bg-white/70 px-5 py-3 text-sm"
              >
                Go to import
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
