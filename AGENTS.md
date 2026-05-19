# AGENTS.md

Minimal handoff for future Codex sessions in this repo.

## Project
- Name: `smallbiz-iq`
- Goal: a small-business inventory and sales intelligence app for product-based micro-businesses.
- Core flow: import data, manage products and contacts, capture orders, generate a purchasing plan, act on reorder alerts, track sales and purchasing analytics, and switch cleanly between seeded demo data and a separate live workspace.

## Stack
- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase migrations for database changes

## Important Commands
- Dev: `npm run dev`
- Lint: `npm run lint`
- Test: `npm test`
- Build: `npm run build`

## Key Paths
- App routes: `src/app/`
- Workspace routes: `src/app/(workspace)/`
- UI components: `src/components/`
- Domain logic: `src/lib/domain/`
- Import logic: `src/lib/import/`
- Demo data: `src/lib/data/`
- Tests: `src/tests/`
- Database migrations: `supabase/migrations/`

## Current Architecture Notes
- `src/lib/server/workspace.ts` is the server-side workspace data layer, with memory fallback plus Supabase read/write helpers.
- The workspace layer now supports two modes per user: `demo` and `live`. The active mode is selected by a cookie and the Supabase `business.workspace_mode` column.
- Clerk auth: `src/middleware.ts` protects workspace routes and mutating API prefixes; `ClerkProvider` is on the landing page (`src/app/page.tsx`) and workspace layout (`src/app/(workspace)/layout.tsx`); sign-in/up live under `src/app/sign-in/` and `src/app/sign-up/`.
- Workspace API routes validate Clerk auth server-side; Supabase REST calls use the Clerk-issued bearer token plus **only** `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as the `apikey` header (never the service-role / secret key).
- Supabase RLS policies live in `supabase/migrations/20260505_clerk_rls_policies_v2.sql` and key off `auth.jwt()->>'sub'`.
- Local Supabase persistence: set `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`) and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`. The app does not read `SUPABASE_SERVICE_ROLE_KEY` or any secret Supabase key for this path—keep service-role keys out of the Next.js app.
- Memory fallback is for local/dev use only; in production the workspace layer will not silently fall back to in-memory storage unless `SMALLBIZ_ALLOW_MEMORY_FALLBACK=true` is explicitly set.
- `src/app/page.tsx` is the public home page.
- `src/app/(workspace)/layout.tsx` wraps workspace routes in `WorkspaceShell`.
- `src/app/api/products/route.ts`, `src/app/api/contacts/route.ts`, `src/app/api/orders/route.ts`, and `src/app/api/import/route.ts` handle workspace mutations.
- `src/lib/domain/purchasing-plan.ts` contains the production purchasing-plan and reorder-alert logic.
- `src/lib/domain/orders.ts` summarizes open-order demand and provides live-entry defaults for new orders.
- Historical material cost changes live in `snapshot.materialCostHistory` and are persisted in the `material_cost_history` table.
- `src/lib/domain/workspace-validation.ts` contains duplicate-protection rules for products, contacts, and orders.
- `src/lib/data/navigation.ts` defines the workspace nav items.
- `src/components/layout/demo-reset-button.tsx` now renders the demo-mode toggle and the demo restore action.
- `src/tests/purchasing-plan.test.js` is a lightweight Node test file that mirrors the domain logic contract.

## What Not To Commit
- `node_modules/`
- `.next/`
- `.env` files (and do not load real `.env` / `.env.local` into agent context—use `.env.example` only)
- log files
- local editor and OS files
- Supabase service-role keys, `CLERK_SECRET_KEY`, or other production secrets in code or docs

## Working Rules
- Do not revert user changes unless explicitly asked.
- Use `apply_patch` for file edits.
- Quote paths that contain parentheses in zsh, for example: `"src/app/(workspace)/layout.tsx"`.
- Keep changes focused on the current task and avoid broad refactors.
- Prefer updating existing domain logic and route components instead of introducing new abstractions unless needed.

## Repo Context
- Existing project docs: `IMPLEMENTATION_PLAN.md` and `PROJECT_PROPOSAL.md`
- Root `README.md` is the maintainer-facing project summary; update it whenever the app shape, commands, environment variables, routes, or persistence model change.
- If the app shape changes, update this file so the next session has an accurate handoff.
