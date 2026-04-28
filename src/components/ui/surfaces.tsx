import { clsx } from "clsx";

export function Card({
  className,
  children
}: Readonly<{
  className?: string;
  children: React.ReactNode;
}>) {
  return <div className={clsx("shadow-[var(--shadow)]", className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  description
}: Readonly<{
  eyebrow: string;
  title: string;
  description?: string;
}>) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">{eyebrow}</p>
      <h3 className="mt-2 font-[var(--font-display)] text-3xl leading-tight">{title}</h3>
      {description ? <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">{description}</p> : null}
    </div>
  );
}

export function StatPill({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-full border border-[var(--line)] bg-white/60 px-4 py-2 text-sm">
      <span className="mr-2 text-[var(--muted)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
