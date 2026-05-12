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
    <div className="space-y-4 md:space-y-5">
      <Reveal>
        <Card className="overflow-hidden rounded-[30px] p-5 md:p-7">
          <div className={`grid gap-6 ${hasMetrics ? "xl:grid-cols-[1.35fr_0.95fr] xl:items-end" : "xl:grid-cols-1"}`}>
            <div>
              <Eyebrow tone="flame">{eyebrow}</Eyebrow>
              <Display size="xl" className="mt-3 max-w-4xl">
                {title}
              </Display>
              <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-[var(--muted-strong)]">{description}</p>
            </div>
            {hasMetrics ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:justify-end xl:grid-cols-2">
                {metrics?.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[22px] border border-[rgba(19,36,58,0.12)] bg-[rgba(255,255,255,0.7)] px-4 py-3 shadow-[0_12px_30px_-26px_rgba(19,36,58,0.28)]"
                  >
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-[var(--muted)]">
                      {metric.label}
                    </p>
                    <p className="mt-2 font-display text-[clamp(1.8rem,2.8vw,2.4rem)] leading-none text-[var(--ink)]">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="mt-7 grid gap-3 lg:grid-cols-3">
              {steps.map((step, index) => (
                <Reveal key={step.title} delay={120 + index * 80}>
                  <div className="paper-card relative h-full rounded-[24px] p-4">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.32em] text-[var(--flame)]">
                        {copy.stepLabel} {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-2xl text-[var(--ink)]/35">{index + 1}</span>
                    </div>
                    <p className="mt-2 font-display text-lg text-[var(--text)]">{step.title}</p>
                  <p className="mt-2 text-[0.85rem] leading-6 text-[var(--muted-strong)]">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Card>
      </Reveal>

      <Reveal delay={120}>{children}</Reveal>

      <Reveal delay={200}>
        <Card className="flex flex-wrap items-center justify-between gap-4 rounded-[26px] px-6 py-5">
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
