# smallbiz-iq

SmallBiz IQ is a small-business inventory and sales intelligence app for product-based micro-businesses.

It focuses on a practical workflow:
- import data
- manage products and contacts
- capture orders
- generate a purchasing plan
- review basic analytics and pricing signals

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

- `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Clerk public keys required by the app
- `SMALLBIZ_ALLOW_MEMORY_FALLBACK=true` only for local/dev fallback testing

Do not commit secret keys or service-role credentials.

## App Surface

Public routes:
- `/` landing page
- `/sign-in`
- `/sign-up`

Workspace routes:
- `/dashboard`
- `/products`
- `/contacts`
- `/orders`
- `/purchasing`
- `/import`

API routes:
- `/api/business`
- `/api/products`
- `/api/contacts`
- `/api/orders`
- `/api/materials`
- `/api/import`
- `/api/templates/products`
- `/api/templates/orders`

## Architecture Notes

- `src/lib/server/workspace.ts` is the main server-side workspace data layer.
- It supports Supabase read/write helpers and only allows memory fallback in non-production mode unless `SMALLBIZ_ALLOW_MEMORY_FALLBACK=true` is explicitly set.
- The app uses Clerk-authenticated workspace routes and API mutations.
- User-facing copy is localized through the i18n helpers in `src/lib/i18n.ts` and `src/lib/i18n-server.ts`.
- Dashboard analytics live in `src/components/layout/analytics-overview.tsx`.
- Purchasing-plan logic lives in `src/lib/domain/purchasing-plan.ts`.
- Import parsing lives in `src/lib/import/parser.ts`.

## Database

Schema changes live in `supabase/migrations/`.

If the app shape changes, update the relevant migration and keep this README in sync with the actual runtime behavior.

## Maintenance

This README should be updated whenever the app shape, commands, environment variables, routes, or persistence model changes.
