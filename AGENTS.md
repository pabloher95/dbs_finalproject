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
- `src/app/page.tsx` is the home page and now loads live workspace data before wrapping `HomePageContent` in `WorkspaceShell` and `OnboardingGate`.
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
