# smallbiz-iq

SmallBiz IQ is a small-business inventory and sales intelligence app for product-based micro-businesses.

It is built around a practical operating workflow:
- create products with unit-level formulas
- maintain a readable catalog of products and recipe math
- manage customers and suppliers
- capture multi-line orders and mark them fulfilled
- generate a purchasing plan from open demand, stock on hand, and supplier links
- review descriptive analytics for demand, revenue, margin, operating load, and reorder pressure
- track purchasing analytics for input-cost changes and inventory exposure
- switch between a seeded demo workspace and a separate live workspace for real user data

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase for persistence and migrations
- Clerk for authentication

## Local Development

Prerequisites:
- Node.js 22.x

Install and run:

```bash
npm install
npm run dev
```

Useful commands:

- `npm run dev` - start the local dev server
- `npm run lint` - run linting
- `npm test` - run tests
- `npm run build` - build the app

## Environment

Use `.env.local` for local development. Common values:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SMALLBIZ_ALLOW_MEMORY_FALLBACK=true` only for local/dev fallback testing

Notes:
- The app uses only the Supabase publishable key in Next.js. Do not add service-role credentials to this app.
- In production, memory fallback is blocked when Supabase is configured and then fails. `SMALLBIZ_ALLOW_MEMORY_FALLBACK` is for intentional local/dev fallback behavior.
- Do not commit real `.env` files, secret keys, or service-role credentials.

## App Surface

Public routes:
- `/` landing page
- `/sign-in`
- `/sign-up`

Workspace routes:
- `/dashboard`
- `/import`
- `/products`
- `/contacts`
- `/orders`
- `/purchasing`

API routes:
- `/api/business`
- `/api/products`
- `/api/contacts`
- `/api/orders`
- `/api/materials`
- `/api/import`
- `/api/templates/products`
- `/api/templates/orders`

## Current Workflow

### Intake
- `/import` is product-first intake
- users create products with SKU, category, price, and material formula rows
- intake is no longer the main place for order entry

### Catalog
- `/products` is the catalog review surface
- it is focused on browsing items, formula math, and edit handoff back to intake

### Orders
- `/orders` supports multi-line manual orders
- typing a new customer name will create the customer on save
- orders now include a free-form `destination`
- orders can be marked fulfilled or reopened
- backlog means open orders with due dates before today
- duplicate order numbers are rejected instead of silently overwriting another order

### Purchasing
- `/purchasing` combines open-order demand, product formulas, stock on hand, preferred suppliers, and unit costs
- material unit cost is maintained here and feeds margin/cost analytics
- material cost edits append to a cost-history ledger for purchasing analytics
- reorder alerts rank shortages by coverage, next due date, and missing supplier linkage

### Demo controls
- the workspace header includes a `Demo mode` toggle
- when demo mode is on, the app reads and writes against the seeded fake workspace
- when demo mode is off, the app reads and writes against the user’s separate live workspace
- a first-time live workspace can be completely empty
- `Restore demo` is still available while demo mode is on and reseeds the fake workspace without touching the live workspace

### Dashboard
- `/dashboard` separates operating-base metrics from sales-pressure metrics
- analytics surfaces include demand rollups plus descriptive revenue/margin/trend views
- analytics now also surface purchasing readings for inventory value and input-cost movement over time
- dashboard analytics now surface the highest-priority reorder alerts

## Architecture Notes

- `src/lib/server/workspace.ts` is the main server-side workspace data layer.
- It supports Supabase read/write helpers and separate `demo`/`live` workspace modes.
- If Supabase is configured and runtime access fails, production will not silently degrade to memory.
- The app uses Clerk-authenticated workspace routes and API mutations.
- User-facing copy is localized through the i18n helpers in `src/lib/i18n.ts` and `src/lib/i18n-server.ts`.
- Dashboard analytics live in `src/components/layout/analytics-overview.tsx`.
- Trend chart behavior lives in `src/components/layout/trend-chart.tsx`.
- Purchasing-plan logic lives in `src/lib/domain/purchasing-plan.ts`.
- Analytics logic lives in `src/lib/domain/analytics.ts`.
- Historical input costs live in `snapshot.materialCostHistory` and the `material_cost_history` table.
- Duplicate-protection helpers live in `src/lib/domain/workspace-validation.ts`.
- Import parsing lives in `src/lib/import/parser.ts`.

## Security Notes

- Workspace routes and mutating API routes are protected by Clerk middleware and server-side `auth()` checks.
- Supabase access is performed with the signed-in user’s Clerk token plus the publishable key.
- Baseline response headers are defined in `next.config.ts`.
- Schema changes and RLS assumptions live in `supabase/migrations/`.

## Database

Schema changes live in `supabase/migrations/`.

The `business` table now uses `workspace_mode` so each signed-in user can have both:
- one `demo` workspace
- one `live` workspace

If the app shape changes, update the relevant migration and keep this README in sync with the actual runtime behavior.

## Maintenance

This README should be updated whenever the app shape, commands, environment variables, routes, or persistence model changes.
