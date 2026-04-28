import { Card, SectionHeading, StatPill } from "@/components/ui/surfaces";

type WorkflowStep = {
  title: string;
  description: string;
};

type WorkflowMetric = {
  label: string;
  value: string;
};

export function WorkflowPageShell({
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
  metrics: WorkflowMetric[];
  steps: WorkflowStep[];
  nextStep: string;
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow)]">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-5 flex flex-wrap gap-3">
          {metrics.map((metric) => (
            <StatPill key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Step {index + 1}</p>
              <p className="mt-2 font-medium text-[var(--text)]">{step.title}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{step.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {children}

      <Card className="rounded-[2rem] border border-[var(--line)] bg-white/70 p-5">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Next step</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{nextStep}</p>
      </Card>
    </div>
  );
}
