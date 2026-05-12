# smallbiz-iq

SmallBiz IQ is a small-business inventory and sales intelligence app for product-based micro-businesses.

It is built around a practical operating workflow:
- create products with unit-level formulas
- maintain a readable catalog of products and recipe math
- manage customers and suppliers
- capture multi-line orders and mark them fulfilled
- generate a purchasing plan from open demand, stock on hand, and supplier links
- review descriptive analytics for demand, revenue, margin, and operating load

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

### Purchasing
- `/purchasing` combines open-order demand, product formulas, stock on hand, preferred suppliers, and unit costs
- material unit cost is maintained here and feeds margin/cost analytics

### Dashboard
- `/dashboard` separates operating-base metrics from sales-pressure metrics
- analytics surfaces include demand rollups plus descriptive revenue/margin/trend views

## Architecture Notes

- `src/lib/server/workspace.ts` is the main server-side workspace data layer.
- It supports Supabase read/write helpers and a demo/memory mode.
- If Supabase is configured and runtime access fails, production will not silently degrade to memory.
- The app uses Clerk-authenticated workspace routes and API mutations.
- User-facing copy is localized through the i18n helpers in `src/lib/i18n.ts` and `src/lib/i18n-server.ts`.
- Dashboard analytics live in `src/components/layout/analytics-overview.tsx`.
- Trend chart behavior lives in `src/components/layout/trend-chart.tsx`.
- Purchasing-plan logic lives in `src/lib/domain/purchasing-plan.ts`.
- Analytics logic lives in `src/lib/domain/analytics.ts`.
- Import parsing lives in `src/lib/import/parser.ts`.

## Security Notes

- Workspace routes and mutating API routes are protected by Clerk middleware and server-side `auth()` checks.
- Supabase access is performed with the signed-in user’s Clerk token plus the publishable key.
- Baseline response headers are defined in `next.config.ts`.
- Schema changes and RLS assumptions live in `supabase/migrations/`.

## Database

Schema changes live in `supabase/migrations/`.

If the app shape changes, update the relevant migration and keep this README in sync with the actual runtime behavior.

## Maintenance

This README should be updated whenever the app shape, commands, environment variables, routes, or persistence model changes.
