# SmallBiz IQ Implementation Plan

## Current State
Revision 3 is now a working operations app rather than a CSV-import prototype.

The shipped product shape is:
- Clerk-authenticated workspace with protected routes and mutating APIs
- Supabase-backed persistence with RLS-aware access through the workspace data layer
- Form-first product intake with product formulas
- Read-only catalog for recipe math, unit pricing, and formula review
- Contact management for customers and suppliers
- Multi-line manual order entry with customer auto-creation, destination capture, fulfillment actions, and backlog logic
- Purchasing plan generation from open demand, product formulas, supplier links, on-hand stock, and material unit cost
- Dashboard analytics for operating base, sales pressure, revenue, margin, and trend signals
- Reorder alerts that rank material shortages by stock coverage, due-date pressure, and supplier linkage
- English/Spanish localization across the user-facing app

## Delivered Revisions

### Revision 1
- Established the workspace shell, landing page, auth flow, and core business snapshot model
- Built products, contacts, orders, and purchasing surfaces
- Added the main API routes and server-side workspace mutation path

### Revision 2
- Added inventory-on-hand tracking and stock adjustments
- Extended purchasing logic to subtract available stock before net buy quantities
- Improved import and workspace reliability with additional tests and domain coverage

### Revision 3
- Added descriptive analytics and pricing logic
- Split dashboard operating-base metrics from sales-pressure metrics
- Reworked orders into a more usable queue with fulfillment controls, overdue backlog logic, demand rollups, and line-item breakdowns
- Moved intake toward direct forms instead of CSV-first interactions
- Refocused catalog around product/recipe inspection and edit handoff
- Added branding, company rename flow, localization infrastructure, and broader copy cleanup
- Added the order `destination` field end-to-end
- Hardened runtime behavior so production does not silently fall back from configured Supabase persistence to memory

### Revision 4
- Chose reorder alerts as the next product step; forecasting remains a later stream
- Extended purchasing-plan logic with coverage ratios, next-due pressure, and order-pressure metadata
- Added demand-aware reorder alerts to purchasing and dashboard analytics
- Added focused tests for reorder-alert severity and purchasing coverage behavior

### Demo Convergence Pass
- Refreshed seeded demo dates and order-entry defaults so the app presents current, non-stale operating data
- Added a restore-demo control to recover a clean walkthrough state without touching auth or persistence setup
- Blocked silent overwrites on duplicate SKU, order number, and contact identity collisions
- Fixed contact editing so draft state is only cleared after successful saves
- Added focused tests for duplicate-protection rules and order-entry defaults

## Current Architecture Decisions
- Next.js App Router with server-rendered workspace pages and client-side forms/interactions
- Clerk handles authentication; Supabase enforces data isolation through RLS
- `src/lib/server/workspace.ts` remains the central persistence adapter for memory/demo mode and Supabase mode
- Domain logic stays in `src/lib/domain/` rather than being embedded inside route handlers
- User-facing copy is centralized in `src/lib/i18n.ts`

## Demo QA Checklist

Full walkthrough path to verify before a demo or submission:

1. **Sign in** — land at `/dashboard` with demo mode on; confirm business name appears in header.
2. **Rename business** — click the business name in the header, enter a new name, save; confirm header updates.
3. **Restore demo** — click "Restore demo" in the header; confirm demo data reloads without auth disruption.
4. **Create product** — go to Intake (`/import`); enter SKU, name, category, unit, price, and at least one material formula row; save; confirm the product appears in Catalog.
5. **Edit product** — from Catalog (`/products`), click Edit on a product; update a field; save; confirm catalog reflects the change.
6. **Add contact** — go to Contacts (`/contacts`); add a customer with name, email, and channel; add a supplier with name, email, and category; confirm both appear in their sections.
7. **Create order** — go to Orders (`/orders`); click new order; set order number, customer, destination, due date, and at least one product/quantity line; save; confirm it appears as open.
8. **Fulfill order** — mark the order as fulfilled; confirm it leaves the open queue.
9. **Update stock/cost** — go to Purchasing (`/purchasing`); find a material; update on-hand quantity; update unit cost; confirm the purchasing plan reflects the change.
10. **View purchasing plan** — confirm the material table shows required, on-hand, and net-to-buy quantities; reorder alerts show if stock is short.
11. **Verify analytics** — go to Dashboard (`/dashboard`); confirm revenue, margin, and trend signals update; confirm reorder alerts reflect current state.
12. **Switch to live workspace** — toggle demo mode off; confirm workspace is blank (first-time live) or shows real data; switch back to demo.

## Remaining Work

### Product and workflow
- Expand fulfillment beyond open/fulfilled if partial shipment or staged production states are needed later
- Decide whether destination should be folded into customer records or kept as a free-form order field

### Security and operations
- Add production error monitoring (e.g. Sentry)
- Consider a CSP once Clerk requirements are accounted for
- ~~CI/security workflow~~ — shipped in `.github/workflows/ci.yml`
- ~~Rate limiting docs~~ — documented in `SECURITY_STATUS.md`; platform-level controls are in place

### Data and analytics
- Forecasting remains a future stream after reorder alerts
- Expand test coverage around auth/persistence failure modes and API validation edges

## Delivery Rule
Keep future work aligned with the current app direction:
- form-first operations
- clear page ownership
- operational clarity over generic CRUD
- production-safe auth and persistence behavior
