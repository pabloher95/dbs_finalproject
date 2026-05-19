# Security status — SmallBiz IQ

Living snapshot for developers. **Re-run checks** (especially `npm audit` and hosted DB policy review) when dependencies or auth/data paths change.

---

## At a glance

| Area | Status | Notes |
|------|--------|--------|
| Auth on workspace + mutating APIs | **OK** | Clerk middleware + per-route `auth()`; see [API routes](#api-routes). |
| Supabase client key in app | **OK** | Only `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is used for REST `apikey`; no service-role key in code. |
| RLS (in repo) | **OK (SQL)** | Policies on core tables use `auth.jwt() ->> 'sub'`; must be applied on the real project. |
| Public / unauthenticated endpoints | **By design** | CSV template downloads only; see below. |
| AI / LLM usage | **None** | No model calls in app code today. |
| CI / pre-commit | **Gap** | No `.github/workflows` or Husky in repo. |
| Error tracking | **Gap** | No Sentry (or similar) wired in code. |
| Dependency audit | **Action needed** | `npm audit` currently reports **high** (Next) + **moderate** (PostCSS via Next); see [Supply chain](#supply-chain). |

---

## Secrets and environment

- **Git:** `.gitignore` excludes `.env`, `.env.local`, and `.env.*` (with `!.env.example`).
- **Templates:** Use `.env.example` as the reference; never commit real secrets.
- **Supabase:** Configure `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`) and **`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`** only. Service-role keys belong in backend jobs or Supabase dashboard—not in this Next.js app.
- **Clerk:** Standard split: publishable key is public; `CLERK_SECRET_KEY` stays server-only (see `.env.example`).

---

## API routes

| Route | Methods | Middleware | Handler `auth()` | Purpose |
|-------|---------|------------|------------------|---------|
| `/api/products` | POST | Protected | Yes | Products CRUD via body `action` |
| `/api/contacts` | POST | Protected | Yes | Contacts |
| `/api/orders` | POST | Protected | Yes | Orders |
| `/api/import` | POST | Protected | Yes | CSV import |
| `/api/materials` | POST | Protected | Yes | Stock adjustment |
| `/api/business` | POST | Protected | Yes | Rename business |
| `/api/templates/products` | GET | **Not** protected | No | Static CSV template |
| `/api/templates/orders` | GET | **Not** protected | No | Static CSV template |

**Notes**

- There is **no role model** beyond “signed-in Clerk user”; `userId` is the workspace owner id for mutations.
- API handlers often return `error.message` to clients—consider sanitizing for production (avoid leaking internals).
- There is **no built-in rate limiting** on these routes; rely on platform limits or add edge/app limits if needed.

---

## Middleware

- **File:** `src/middleware.ts`
- **Behavior:** `auth.protect()` for workspace pages (`/dashboard`, `/import`, `/products`, `/contacts`, `/orders`, `/purchasing`) and the six mutating API prefixes above.
- **Matcher:** Covers normal pages and `/(api|trpc)(.*)`; static assets excluded by pattern.

Template routes under `/api/templates/*` are intentionally outside the protected matcher.

---

## Supabase and RLS

- **Migrations:** `supabase/migrations/` — notably `20260505_clerk_rls_policies_v2.sql` enables RLS and policies on `business`, `suppliers`, `materials`, `products`, `product_materials`, `clients`, `orders`, `order_items`.
- **Identity in policies:** `coalesce(auth.jwt() ->> 'sub', '')` matched to `owner_user_id` or business ownership—aligned with Clerk JWTs when Supabase third-party auth is configured correctly.
- **Runtime:** Server code uses the user’s Clerk token as `Authorization: Bearer` and the publishable key as `apikey` when talking to PostgREST.

**Cannot confirm from the repo alone:** that production Supabase has these migrations applied, JWT verification matches Clerk, and no extra tables exist without RLS. Validate in the Supabase dashboard or SQL.

---

## Data layer fallback

`src/lib/server/workspace.ts` can fall back to an **in-memory** store if Supabase is not configured or token exchange fails. Workspace UI routes are middleware-protected, but new server entry points should keep calling the same auth assumptions so data never attaches to the wrong owner.

---

## Supply chain

- **Lockfile:** `package-lock.json` is committed (good for reproducible installs).
- **Audit:** As of last check, `npm audit` reported **2** issues tied to the pinned **Next.js** line (high) and nested **PostCSS** (moderate). Advisory details and fixes change over time—run:

  ```bash
  npm audit
  ```

  and upgrade Next (and transitive PostCSS) per your release policy.

- **Dependency set:** Small direct footprint (`@clerk/nextjs`, `next`, `react`, etc.); no obvious typosquat names in `package.json`.

---

## Monitoring

- No application-level error tracking (e.g. Sentry) is integrated in source.
- Failures in the workspace layer may log via `console.warn` when falling back to memory or on Supabase errors.

---

## AI and prompt injection

- **Not applicable** today—no LLM SDKs or API calls in application `src/`. Revisit this section if you add imports, copilots, or document parsing through models.

---

## Recommended next steps (priority ideas)

1. **Patch Next.js** (and thus PostCSS) to clear known `npm audit` findings, test, then ship.
2. **Add CI** (lint, `tsc --noEmit` if you add a script, test, build) and optionally secret scanning.
3. **Sanitize API error responses** for production.
4. **Rate-limit** `POST /api/import` (and optionally other mutations).
5. **Confirm** production Supabase RLS and Clerk JWT integration match the migration assumptions.

---

## MCP / local tooling (developers)

If Cursor or other agents use **Supabase** or **Figma** MCP servers, treat **`execute_sql`**, **`apply_migration`**, and similar tools as **production-dangerous** unless scoped to a dev project. Do not paste real `.env` into agent context; use `.env.example` and docs only.

---

## Document history

| Change | Summary |
|--------|---------|
| Supabase app config | Removed use of secret key as fallback for the publishable key; app uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` only. |

Update this file when auth routes, env vars, or RLS migrations change materially.
