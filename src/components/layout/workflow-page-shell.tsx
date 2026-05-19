import Link from "next/link";
import type { Route } from "next";
import { Display, Eyebrow, Reveal } from "@/components/ui/surfaces";

type WorkflowMetric = {
  label: string;
  value: string;
  href?: string;
};

type WorkflowTip = {
  label: string;
  description: string;
};

export async function WorkflowPageShell({
  eyebrow,
  title,
  description,
  guidance,
  metrics,
  tips,
  children
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  guidance?: string;
  metrics?: WorkflowMetric[];
  tips?: WorkflowTip[];
  children: React.ReactNode;
}>) {
  const hasMetrics = (metrics ?? []).length > 0;
  const hasTips = (tips ?? []).length > 0;
  return (
    <div className="space-y-5 md:space-y-6">
      <Reveal className="relative z-10">
        <section className="plate px-5 py-6 md:px-7 md:py-8">
          <div>
            <Eyebrow tone="flame">{eyebrow}</Eyebrow>
            <Display size="xl" className="editorial mt-3 max-w-4xl">
              {title}
            </Display>
            <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-[var(--muted-strong)]">{description}</p>
            {guidance ? (
              <p className="mt-3 max-w-3xl text-[0.95rem] leading-6 text-[var(--ink)]">{guidance}</p>
            ) : null}
            {hasTips ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {tips?.map((tip, index) => {
                  const tooltipId = `workflow-tip-${index}`;
                  return (
                    <div key={tip.label} className="group relative">
                      <button
                        type="button"
                        className="rounded-full border border-[var(--line)] bg-[var(--paper-bright)] px-3.5 py-2 text-left font-mono text-[0.62rem] uppercase tracking-[0.26em] text-[var(--ink)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--paper)] focus-visible:border-[var(--ink)] focus-visible:bg-[var(--paper)]"
                        aria-describedby={tooltipId}
                        aria-label={`${tip.label}. ${tip.description}`}
                      >
                        {tip.label}
                      </button>
                      <div
                        id={tooltipId}
                        className="pointer-events-none absolute left-0 top-full z-20 w-[17rem] pt-3 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"
                        role="tooltip"
                      >
                        <div className="translate-y-1 rounded-[18px] border border-[var(--ink)] bg-[var(--paper-bright)] px-4 py-3 text-left shadow-[0_20px_50px_-24px_rgba(0,0,0,0.45)] transition duration-150 group-hover:translate-y-0 group-focus-within:translate-y-0">
                          <p className="font-display text-[0.95rem] leading-tight text-[var(--ink)]">{tip.label}</p>
                          <p className="mt-2 text-[0.8rem] leading-5 text-[var(--muted-strong)]">
                            {tip.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
          {hasMetrics ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {metrics?.map((metric) => {
                const inner = (
                  <>
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-[var(--muted)]">
                      {metric.label}
                    </p>
                    <p className="mt-2 font-display text-[clamp(1.6rem,2.4vw,2rem)] leading-none text-[var(--ink)]">
                      {metric.value.padStart?.(2, "0") ?? metric.value}
                    </p>
                  </>
                );
                return metric.href ? (
                  <Link
                    key={metric.label}
                    href={metric.href as Route}
                    className="group rounded-[18px] border border-[var(--line)] bg-[var(--paper-bright)] px-4 py-4 transition-colors hover:border-[var(--ink)] hover:bg-[var(--paper)]"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={metric.label} className="rounded-[18px] border border-[var(--line)] bg-[var(--paper-bright)] px-4 py-4">
                    {inner}
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>
      </Reveal>

      <Reveal delay={120}>{children}</Reveal>
    </div>
  );
}
