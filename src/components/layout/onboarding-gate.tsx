"use client";

import { useEffect, useState } from "react";

export function OnboardingGate({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {children}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(34,24,18,0.52)] px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[2rem] border border-[var(--line)] bg-[var(--panel-strong)] p-6 shadow-[0_30px_90px_rgba(39,24,15,0.28)] md:p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">Welcome to SmallBiz IQ</p>
            <h1 className="mt-3 max-w-2xl font-[var(--font-display)] text-4xl leading-tight md:text-5xl">
              One place to move from rough records to clean products, open orders, and the next purchase list.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-[var(--muted)] md:text-base">
              The app is built like an operations desk: the home screen gives you context, data intake cleans up CSVs,
              and the workspace turns demand into decisions. Start with the overview or jump straight into the intake
              flow if you already have data in hand.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                {
                  title: "Home as the map",
                  body: "See the business at a glance before you start changing records."
                },
                {
                  title: "Data intake",
                  body: "Validate CSV templates before anything touches the workspace."
                },
                {
                  title: "Planning follows",
                  body: "Orders roll into purchasing once the catalog is in shape."
                }
              ].map((item) => (
                <div key={item.title} className="rounded-[1.25rem] border border-[var(--line)] bg-white/75 p-4">
                  <p className="font-medium text-[var(--text)]">{item.title}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white"
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
