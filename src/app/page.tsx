import { Fragment } from "react";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import type { Route } from "next";
import { BrandLogo } from "@/components/ui/brand-logo";
import { LanguageSwitcher } from "@/components/providers/language-switcher";
import { getRequestLanguage } from "@/lib/i18n-server";
import { landingCopy } from "@/lib/i18n";

export const metadata = {
  title: "SmallBiz IQ — A practical operating studio for the hands-on business."
};

export default async function LandingPage() {
  const { userId } = await auth();
  const language = await getRequestLanguage();
  const copy = landingCopy(language);

  return (
    <ClerkProvider
      dynamic
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <div className="relative z-[1] min-h-screen">
        <TopBar isSignedIn={Boolean(userId)} copy={copy} />

        <main className="px-6 md:px-10">
          <Hero copy={copy} />
          <Marquee copy={copy} />
          <Method copy={copy} />
          <StudioPreview copy={copy} />
        </main>

        <Footer copy={copy} />
      </div>
    </ClerkProvider>
  );
}

/* —————————————————————————————————————————————————————— */

function TopBar({
  isSignedIn,
  copy
}: {
  isSignedIn: boolean;
  copy: ReturnType<typeof landingCopy>;
}) {
  return (
    <header className="px-6 pt-6 md:px-10 md:pt-8">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between">
        <Link href="/" className="shrink-0">
          <BrandLogo variant="landing" priority />
        </Link>
        <nav className="hidden items-center gap-8 text-[0.85rem] tracking-wide text-[var(--ink-soft)] md:flex">
          <a href="#method" className="transition-colors hover:text-[var(--vermilion)]">
            {copy.navHowItWorks}
          </a>
          <a href="#studio" className="transition-colors hover:text-[var(--vermilion)]">
            {copy.navWhatItMeasures}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {!isSignedIn ? (
            <>
              <Link href={"/sign-in" as Route} className="link-rule text-sm">
                {copy.signIn}
              </Link>
              <Link href={"/sign-up" as Route} className="btn btn-vermilion">
                {copy.openStudio} →
              </Link>
            </>
          ) : (
            <>
              <Link href={"/dashboard" as Route} className="btn btn-vermilion">
                {copy.openStudio} →
              </Link>
              <UserButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* —————————————————————————————————————————————————————— */

function Hero({ copy }: { copy: ReturnType<typeof landingCopy> }) {
  return (
    <section className="mx-auto max-w-[1320px] pt-16 pb-20 md:pt-28 md:pb-24">
      <p className="eyebrow text-[var(--vermilion)]">{copy.heroEyebrow}</p>
      <h1 className="editorial mt-6 text-[clamp(3.4rem,9vw,8.4rem)]">
        {copy.heroTitleLead}
        <br />
        {copy.heroTitleBeforeEmphasis}
        <em>{copy.heroEmphasis}</em>
        {copy.heroTitleAfterEmphasis}
      </h1>

      <p className="mt-12 max-w-2xl text-[1.05rem] leading-7 text-[var(--ink-soft)]">{copy.heroBody}</p>

      <div className="rule-thick mt-12" />
      <a href="#method" className="link-rule mt-5 inline-flex">
        {copy.heroLink}
      </a>
    </section>
  );
}

/* —————————————————————————————————————————————————————— */

function Marquee({ copy }: { copy: ReturnType<typeof landingCopy> }) {
  const repeated = [...copy.marqueeWords, ...copy.marqueeWords];

  return (
    <section className="border-y border-[var(--ink)] py-5 overflow-hidden">
      <div className="marquee-track gap-12 whitespace-nowrap font-display text-3xl italic text-[var(--ink-soft)] md:text-4xl">
        {repeated.map((w, i) => (
          <span key={`${w}-${i}`} className="flex items-center gap-12">
            {w}
            <span className="text-[var(--vermilion)]">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* —————————————————————————————————————————————————————— */

function Method({ copy }: { copy: ReturnType<typeof landingCopy> }) {
  const moves = [
    {
      n: "01",
      title: copy.importTitle,
      body: copy.importBody,
      footnote: copy.methodFootnotes.intake
    },
    {
      n: "02",
      title: copy.defineTitle,
      body: copy.defineBody,
      footnote: copy.methodFootnotes.catalog
    },
    {
      n: "03",
      title: copy.planTitle,
      body: copy.planBody,
      footnote: copy.methodFootnotes.purchasing
    }
  ];

  return (
    <section id="method" className="mx-auto max-w-[1320px] pt-24 pb-16 md:pt-32 md:pb-20">
      <header className="mb-16">
        <p className="eyebrow text-[var(--vermilion)]">{copy.methodEyebrow}</p>
        <h2 className="editorial mt-4 text-[clamp(2.4rem,5.5vw,4.8rem)]">{copy.methodTitle}</h2>
      </header>

      <div className="border-t border-[var(--ink)] grid gap-px bg-[var(--line)] md:grid-cols-3">
        {moves.map((m) => (
          <article key={m.n} className="method-tile bg-[var(--paper)] flex flex-col gap-5 p-6 md:p-8">
            <div className="flex items-baseline justify-between">
              <span className="numeral">{m.n}</span>
              <p className="marginalia">{m.footnote}</p>
            </div>
            <h3 className="editorial text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.02]">{m.title}</h3>
            <p className="text-[1rem] leading-7 text-[var(--ink-soft)]">{m.body}</p>
          </article>
        ))}
      </div>

      <DataFlow copy={copy} />
    </section>
  );
}

function DataFlow({ copy }: { copy: ReturnType<typeof landingCopy> }) {
  const stages = copy.dataFlowStages;

  return (
    <figure className="mt-20 hidden md:block">
      <p className="marginalia mb-6">{copy.howDataMoves}</p>
      <div className="data-flow-track grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch border-y border-[var(--ink)]">
        {stages.map((s, i) => (
          <Fragment key={s.label}>
            <div className="data-flow-node flex flex-col justify-center px-6 py-7">
              <p className="data-flow-label font-display text-[clamp(1.6rem,2.2vw,2rem)] leading-none text-[var(--ink)]">
                {s.label}
              </p>
              <p className="data-flow-note marginalia mt-3">{s.note}</p>
            </div>
            {i < stages.length - 1 && (
              <div aria-hidden className="data-flow-arrow px-3 text-[var(--vermilion)]">
                <svg width="40" height="14" viewBox="0 0 40 14" fill="none">
                  <path
                    d="M0 7H36M30 2L37 7L30 12"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                </svg>
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <figcaption className="sr-only">{copy.dataFlowCaption}</figcaption>
    </figure>
  );
}

/* —————————————————————————————————————————————————————— */

function StudioPreview({ copy }: { copy: ReturnType<typeof landingCopy> }) {
  const readings = [
    copy.readings.runway,
    copy.readings.buyList,
    copy.readings.concentration,
    copy.readings.pipeline
  ];

  return (
    <section id="studio" className="mx-auto max-w-[1320px] py-24 md:py-32">
      <header className="mb-12">
        <p className="eyebrow text-[var(--vermilion)]">{copy.studioEyebrow}</p>
        <h2 className="editorial mt-4 text-[clamp(2.4rem,5.5vw,4.8rem)]">
          {copy.studioTitle}
        </h2>
        <p className="mt-6 max-w-2xl text-[1.02rem] leading-7 text-[var(--ink-soft)]">
          {copy.studioBody}
        </p>
      </header>

      <div className="plate p-6 md:p-10">
        <div className="grid gap-px bg-[var(--ink)] md:grid-cols-2 lg:grid-cols-4">
          {readings.map((r) => (
            <div key={r.label} className="ledger-cell bg-[var(--paper-bright)] p-6 md:p-8">
              <p className="marginalia">{r.label}</p>
              <p className="font-display mt-4 text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.05] tracking-tight text-[var(--ink)]">
                {r.title}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{r.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <a href="#studio" className="btn btn-vermilion">
            {copy.enterStudio} →
          </a>
        </div>
      </div>
    </section>
  );
}

/* —————————————————————————————————————————————————————— */

function Footer({ copy }: { copy: ReturnType<typeof landingCopy> }) {
  return (
    <footer className="border-t border-[var(--line)] px-6 py-10 md:px-10 md:py-12">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <BrandLogo variant="footer" />
          <p className="marginalia">© {new Date().getFullYear()}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--ink-soft)]">
          <a href="#studio" className="hover:text-[var(--vermilion)]">
            {copy.footerStudio}
          </a>
          <a href="#method" className="hover:text-[var(--vermilion)]">
            {copy.footerHowItWorks}
          </a>
          <a href="#method" className="hover:text-[var(--vermilion)]">
            {copy.footerWhatItMeasures}
          </a>
        </div>
      </div>
    </footer>
  );
}
