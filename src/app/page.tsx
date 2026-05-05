import { Fragment } from "react";
import Link from "next/link";
import type { Route } from "next";

export const metadata = {
  title: "SmallBiz IQ — A practical operating studio for the hands-on business."
};

export default function LandingPage() {
  return (
    <div className="relative z-[1] min-h-screen">
      <TopBar />

      <main className="px-6 md:px-10">
        <Hero />
        <Marquee />
        <Method />
        <StudioPreview />
      </main>

      <Footer />
    </div>
  );
}

/* —————————————————————————————————————————————————————— */

function TopBar() {
  return (
    <header className="px-6 pt-6 md:px-10 md:pt-8">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between">
        <Link href={"/" as Route} className="brand-mark brand-mark-lg shrink-0">
          smallbiz<em className="not-italic font-normal text-[var(--vermilion)]">·</em>iq
        </Link>
        <nav className="hidden items-center gap-8 text-[0.85rem] tracking-wide text-[var(--ink-soft)] md:flex">
          <a href="#method" className="transition-colors hover:text-[var(--vermilion)]">
            How it works
          </a>
          <a href="#studio" className="transition-colors hover:text-[var(--vermilion)]">
            What it measures
          </a>
        </nav>
        <Link href={"/dashboard" as Route} className="btn btn-vermilion">
          Open studio →
        </Link>
      </div>
    </header>
  );
}

/* —————————————————————————————————————————————————————— */

function Hero() {
  return (
    <section className="mx-auto max-w-[1320px] pt-16 pb-20 md:pt-28 md:pb-24">
      <p className="eyebrow text-[var(--vermilion)]">Inventory · Orders · Purchasing</p>
      <h1 className="editorial mt-6 text-[clamp(3.4rem,9vw,8.4rem)]">
        A practical operating studio
        <br />
        for the <em>hands-on</em> business.
      </h1>

      <p className="mt-12 max-w-2xl text-[1.05rem] leading-7 text-[var(--ink-soft)]">
        SmallBiz IQ keeps the catalog, the open orders, and the material plan in a single
        measured surface. Import a CSV, capture an order, get a supplier-ready buy list.
      </p>

      <div className="rule-thick mt-12" />
      <a href="#method" className="link-rule mt-5 inline-flex">
        How it works
      </a>
    </section>
  );
}

/* —————————————————————————————————————————————————————— */

function Marquee() {
  const words = [
    "Bakeries",
    "Bookshops",
    "Breweries",
    "Builders",
    "Caterers",
    "Ceramics",
    "Coffee",
    "Co-ops",
    "Contractors",
    "Distributors",
    "Farm stands",
    "Family businesses",
    "Food trucks",
    "Hardware",
    "Import firms",
    "Indie brands",
    "Landscapers",
    "Light assembly",
    "Machine shops",
    "Medical supply",
    "Neighborhood shops",
    "Online brands",
    "Packaging",
    "Pet supply",
    "Pharmacies",
    "Print shops",
    "Repair shops",
    "Retailers",
    "Side projects",
    "Subscription boxes",
    "Textiles",
    "Trades",
    "Wholesale",
    "Woodshops",
    "Auto parts"
  ];
  const repeated = [...words, ...words];

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

function Method() {
  const moves = [
    {
      n: "01",
      title: "Import.",
      body: "Upload a CSV of products, contacts, or orders. Each row is validated before it lands.",
      footnote: "Intake"
    },
    {
      n: "02",
      title: "Define products.",
      body: "Write each product as a formula — materials, yields, and units.",
      footnote: "Catalog"
    },
    {
      n: "03",
      title: "Plan purchasing.",
      body: "Open orders aggregate into demand, which expands into a supplier-ready material list.",
      footnote: "Purchasing"
    }
  ];

  return (
    <section id="method" className="mx-auto max-w-[1320px] pt-24 pb-16 md:pt-32 md:pb-20">
      <header className="mb-16">
        <p className="eyebrow text-[var(--vermilion)]">How it works</p>
        <h2 className="editorial mt-4 text-[clamp(2.4rem,5.5vw,4.8rem)]">
          Three steps.
        </h2>
      </header>

      <div className="border-t border-[var(--ink)] grid gap-px bg-[var(--line)] md:grid-cols-3">
        {moves.map((m) => (
          <article
            key={m.n}
            className="method-tile bg-[var(--paper)] flex flex-col gap-5 p-6 md:p-8"
          >
            <div className="flex items-baseline justify-between">
              <span className="numeral">{m.n}</span>
              <p className="marginalia">{m.footnote}</p>
            </div>
            <h3 className="editorial text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.02]">
              {m.title}
            </h3>
            <p className="text-[1rem] leading-7 text-[var(--ink-soft)]">{m.body}</p>
          </article>
        ))}
      </div>

      <DataFlow />
    </section>
  );
}

function DataFlow() {
  const stages = [
    { label: "CSV", note: "intake" },
    { label: "Catalog", note: "formulas" },
    { label: "Orders", note: "demand" },
    { label: "Buy list", note: "supplier-ready" }
  ];

  return (
    <figure className="mt-20 hidden md:block">
      <p className="marginalia mb-6">— How the data moves</p>
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
              <div
                aria-hidden
                className="data-flow-arrow px-3 text-[var(--vermilion)]"
              >
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
      <figcaption className="sr-only">CSV → Catalog → Orders → Buy list</figcaption>
    </figure>
  );
}

/* —————————————————————————————————————————————————————— */

function StudioPreview() {
  const readings = [
    {
      label: "— Runway",
      title: "Days of stock",
      body: "How long your current materials cover the demand on your books."
    },
    {
      label: "— Buy list",
      title: "Supplier-ready",
      body: "Open demand, expanded into a per-supplier purchase order with quantities."
    },
    {
      label: "— Concentration",
      title: "Where weight sits",
      body: "Which products and suppliers your business actually depends on."
    },
    {
      label: "— Pipeline",
      title: "What ships next",
      body: "Open orders sorted by due date, with material readiness flagged."
    }
  ];

  return (
    <section id="studio" className="mx-auto max-w-[1320px] py-24 md:py-32">
      <header className="mb-12">
        <p className="eyebrow text-[var(--vermilion)]">What the studio measures</p>
        <h2 className="editorial mt-4 text-[clamp(2.4rem,5.5vw,4.8rem)]">
          Four <em>readings</em> of the business.
        </h2>
        <p className="mt-6 max-w-2xl text-[1.02rem] leading-7 text-[var(--ink-soft)]">
          A handful of running figures, each wired to a real question—what to stock, what to buy,
          where the business leans, what goes out the door next.
        </p>
      </header>

      <div className="plate p-6 md:p-10">
        <div className="grid gap-px bg-[var(--ink)] md:grid-cols-2 lg:grid-cols-4">
          {readings.map((r) => (
            <div
              key={r.label}
              className="ledger-cell bg-[var(--paper-bright)] p-6 md:p-8"
            >
              <p className="marginalia">{r.label}</p>
              <p className="font-display mt-4 text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.05] tracking-tight text-[var(--ink)]">
                {r.title}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{r.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link href={"/dashboard" as Route} className="btn btn-vermilion">
            Enter studio →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* —————————————————————————————————————————————————————— */

function Footer() {
  return (
    <footer className="border-t border-[var(--line)] px-6 py-10 md:px-10 md:py-12">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-baseline gap-4">
          <span className="brand-mark">smallbiz·iq</span>
          <p className="marginalia">© {new Date().getFullYear()}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--ink-soft)]">
          <Link href={"/dashboard" as Route} className="hover:text-[var(--vermilion)]">
            Studio
          </Link>
          <Link href={"/products" as Route} className="hover:text-[var(--vermilion)]">
            Catalog
          </Link>
          <Link href={"/orders" as Route} className="hover:text-[var(--vermilion)]">
            Orders
          </Link>
          <Link href={"/purchasing" as Route} className="hover:text-[var(--vermilion)]">
            Purchasing
          </Link>
        </div>
      </div>
    </footer>
  );
}
