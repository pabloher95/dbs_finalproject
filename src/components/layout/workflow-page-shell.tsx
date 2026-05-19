import Link from "next/link";
import type { Route } from "next";
import { Card, Display, Eyebrow, Reveal } from "@/components/ui/surfaces";
import { getRequestLanguage } from "@/lib/i18n-server";
import { workflowPageCopy } from "@/lib/i18n";

type WorkflowStep = {
  title: string;
  description: string;
};

type WorkflowMetric = {
  label: string;
  value: string;
  href?: string;
};

export async function WorkflowPageShell({
  eyebrow,
  title,
  description,
  metrics,
  steps,
  nextStep,
  children
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  metrics?: WorkflowMetric[];
  steps: WorkflowStep[];
  nextStep: string;
  children: React.ReactNode;
}>) {
  const language = await getRequestLanguage();
  const copy = workflowPageCopy(language);
  const hasMetrics = (metrics ?? []).length > 0;
  return (
    <div className="space-y-5 md:space-y-6">
      <Reveal>
        <section className="plate overflow-hidden px-5 py-6 md:px-7 md:py-8">
          <div>
            <Eyebrow tone="flame">{eyebrow}</Eyebrow>
            <Display size="xl" className="editorial mt-3 max-w-4xl">
              {title}
            </Display>
            <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-[var(--muted-strong)]">{description}</p>
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
          <div className="mt-8 grid gap-px border-t border-[var(--ink)] bg-[var(--line)] lg:grid-cols-3">
              {steps.map((step, index) => (
                <Reveal key={step.title} delay={120 + index * 80} className="h-full">
                  <div className="method-tile h-full bg-[var(--paper)] p-5 md:p-6">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.32em] text-[var(--flame)]">
                        {copy.stepLabel} {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="numeral text-3xl">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <p className="editorial mt-4 text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.04]">{step.title}</p>
                    <p className="mt-3 text-[0.9rem] leading-6 text-[var(--muted-strong)]">{step.description}</p>
                  </div>
                </Reveal>
              ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={120}>{children}</Reveal>

      <Reveal delay={200}>
        <Card className="flex flex-wrap items-center justify-between gap-4 rounded-[26px] border-t border-b border-[var(--ink)] bg-[var(--paper-bright)] px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-[var(--cyan)]">
              {copy.nextMove}
            </span>
            <span className="hidden h-px w-10 bg-[var(--line-strong)] md:inline-block" />
          </div>
          <p className="flex-1 text-[0.95rem] leading-7 text-[var(--muted-strong)]">{nextStep}</p>
        </Card>
      </Reveal>
    </div>
  );
}
