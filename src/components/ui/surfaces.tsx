"use client";

import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";

type CardVariant = "paper" | "ink" | "flame" | "ghost";

const cardVariantClass: Record<CardVariant, string> = {
  paper: "paper-card",
  ink: "ink-card",
  flame: "flame-card",
  ghost: ""
};

export function Card({
  className,
  children,
  variant = "paper"
}: Readonly<{
  className?: string;
  children: ReactNode;
  variant?: CardVariant;
}>) {
  return (
    <div
      className={clsx(
        "relative rounded-[20px]",
        cardVariantClass[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  tone = "ink",
  className
}: Readonly<{ children: ReactNode; tone?: "ink" | "flame" | "paper"; className?: string }>) {
  return (
    <span
      className={clsx(
        "eyebrow",
        tone === "flame" && "text-[var(--flame)]",
        tone === "paper" && "text-[var(--paper-soft)]",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Display({
  children,
  size = "lg",
  className
}: Readonly<{ children: ReactNode; size?: "sm" | "md" | "lg" | "xl" | "hero"; className?: string }>) {
  const sizeClass: Record<string, string> = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
    xl: "text-5xl md:text-6xl leading-[0.95]",
    hero: "text-5xl md:text-7xl leading-[0.92]"
  };
  return (
    <h1 className={clsx("font-display tracking-tight", sizeClass[size], className)}>{children}</h1>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: Readonly<{
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}>) {
  return (
    <div className={clsx(align === "center" && "text-center mx-auto")}>
      <Eyebrow tone="flame">{eyebrow}</Eyebrow>
      <Display size="md" className="mt-3">
        {title}
      </Display>
      {description ? (
        <p className="mt-3 max-w-2xl text-[0.95rem] leading-7 text-[var(--muted-strong)]">{description}</p>
      ) : null}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className
}: Readonly<{
  children: ReactNode;
  delay?: number;
  className?: string;
}>) {
  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties;
  return (
    <div className={clsx("reveal", className)} style={style}>
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  variant = "paper"
}: Readonly<{ label: string; value: string; hint?: string; variant?: "paper" | "ink" | "flame" }>) {
  const tones: Record<string, string> = {
    paper: "paper-card",
    ink: "ink-card",
    flame: "flame-card"
  };
  return (
    <div className={clsx("relative rounded-[18px] px-4 py-3", tones[variant])}>
      <Eyebrow tone={variant === "paper" ? "ink" : "paper"}>{label}</Eyebrow>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-3xl md:text-4xl tracking-tight">{value}</span>
      </div>
      {hint ? (
        <p
          className={clsx(
            "mt-1 text-xs",
            variant === "paper" ? "text-[var(--muted)]" : "text-[var(--paper-soft)]/80"
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function StatPill({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-[var(--line-strong)] bg-[var(--paper-bright)] px-4 py-2">
      <span className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-[var(--muted-strong)]">{label}</span>
      <span className="font-display text-xl">{value}</span>
    </div>
  );
}

type PillTone = "default" | "ink" | "flame" | "moss" | "amber";

export function Pill({
  children,
  tone = "default",
  className
}: Readonly<{ children: ReactNode; tone?: PillTone; className?: string }>) {
  const toneClass: Record<PillTone, string> = {
    default: "pill",
    ink: "pill pill-ink",
    flame: "pill pill-flame",
    moss: "pill pill-moss",
    amber: "pill pill-amber"
  };
  return <span className={clsx(toneClass[tone], className)}>{children}</span>;
}

export function DottedRule({ className }: Readonly<{ className?: string }>) {
  return <div className={clsx("dotted-rule w-full", className)} />;
}

type ToastTone = "info" | "success" | "warn" | "error";

export function Toast({
  message,
  tone = "info",
  onDismiss
}: Readonly<{ message: string; tone?: ToastTone; onDismiss?: () => void }>) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 4200);
    return () => window.clearTimeout(timeout);
  }, [message, onDismiss]);

  if (!visible) return null;

  const toneClass: Record<ToastTone, string> = {
    info: "border-[var(--line-strong)] bg-[var(--paper-bright)] text-[var(--text)]",
    success: "border-[rgba(47,69,32,0.4)] bg-[rgba(90,122,60,0.16)] text-[var(--moss-deep)]",
    warn: "border-[rgba(106,71,8,0.4)] bg-[rgba(224,165,47,0.18)] text-[#5a3a06]",
    error: "border-[var(--flame)] bg-[var(--flame)] text-[var(--paper-bright)]"
  };

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 max-w-sm">
      <div
        className={clsx(
          "toast-in pointer-events-auto rounded-2xl border px-4 py-3 shadow-[0_20px_50px_-20px_rgba(20,16,8,0.45)]",
          toneClass[tone]
        )}
      >
        <p className="text-sm leading-5">{message}</p>
      </div>
    </div>
  );
}
