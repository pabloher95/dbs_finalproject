# AGENTS.md

Minimal handoff for future Codex sessions in this repo.

## Project
- Name: `smallbiz-iq`
- Goal: a small-business inventory and sales intelligence app for product-based micro-businesses.
- Core flow: import data, manage products and contacts, capture orders, generate a purchasing plan.

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
- Clerk auth is wired through `src/app/layout.tsx`, `middleware.ts`, and the dedicated `src/app/sign-in/` and `src/app/sign-up/` routes.
- Workspace API routes validate Clerk auth server-side, and Supabase access now uses the Clerk session token plus the publishable key.
- Supabase RLS policies live in `supabase/migrations/20260505_clerk_rls_policies_v2.sql` and key off `auth.jwt()->>'sub'`.
- Local Supabase persistence uses `SUPABASE_URL` plus `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the root `.env.local`; `SUPABASE_SECRET_KEY` is only kept as a fallback during the transition.
- `src/app/page.tsx` is the public home page.
- `src/app/(workspace)/layout.tsx` wraps workspace routes in `WorkspaceShell`.
- `src/app/api/products/route.ts`, `src/app/api/contacts/route.ts`, `src/app/api/orders/route.ts`, and `src/app/api/import/route.ts` handle workspace mutations.
- `src/lib/domain/purchasing-plan.ts` contains the production purchasing-plan logic.
- `src/lib/domain/orders.ts` summarizes open-order demand.
- `src/lib/data/navigation.ts` defines the workspace nav items.
- `src/tests/purchasing-plan.test.js` is a lightweight Node test file that mirrors the domain logic contract.

## What Not To Commit
- `node_modules/`
- `.next/`
- `.env` files
- log files
- local editor and OS files

## Working Rules
- Do not revert user changes unless explicitly asked.
- Use `apply_patch` for file edits.
- Quote paths that contain parentheses in zsh, for example: `"src/app/(workspace)/layout.tsx"`.
- Keep changes focused on the current task and avoid broad refactors.
- Prefer updating existing domain logic and route components instead of introducing new abstractions unless needed.

## Repo Context
- Existing project docs: `IMPLEMENTATION_PLAN.md` and `PROJECT_PROPOSAL.md`
- If the app shape changes, update this file so the next session has an accurate handoff.
