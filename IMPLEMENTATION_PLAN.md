# SmallBiz IQ Execution Plan

## Summary
Turn the existing 4-revision roadmap into a build-first execution sequence that starts with a complete Revision 1 vertical slice, then layers reliability, analytics, and polish without reopening core architecture decisions.

The execution step is: build Revision 1 end-to-end first, with deployable schema, seeded sample data, first-run import flow, product/formula management, order entry, and purchasing-plan generation. Do not start Revision 2+ work until this workflow is demoable.

## Implementation Changes
- Stack: Next.js App Router, Tailwind, Supabase Postgres, Clerk, Vercel.
- App shape:
  - Server-render data-heavy pages.
  - Use client components only for forms, tables, CSV upload, filters, and charts.
  - Keep business logic in domain services for import parsing, formula expansion, purchasing-plan generation, inventory math, and analytics.
- Revision 1 execution order:
  1. Initialize app shell, auth gate, design system primitives, and seeded demo business.
  2. Define schema for `business`, `products`, `materials`, `product_materials`, `clients`, `suppliers`, `orders`, `order_items`.
  3. Build constrained CSV import with explicit templates, preview, row validation, and row-level error reporting.
  4. Build CRUD flows for products/formulas, contacts, and orders.
  5. Build purchasing-plan generation from open orders and formula quantities.
  6. Ship a first-run dashboard flow: import data, review catalog, create order, generate purchasing plan.
- Revision 2:
  - Add material inventory-on-hand and stock adjustments.
  - Extend purchasing-plan logic to subtract on-hand stock.
  - Improve import duplicate handling, validation recovery, search/filtering, and responsive workspace layout.
- Revision 3:
  - Add cost, margin, revenue, and product/client trend services.
  - Surface descriptive insights before any forecasting.
- Revision 4:
  - Default differentiator is smart reorder alerts based on projected material depletion from open orders and recent sales.
  - Add import history, error logging, correction flows, and regression coverage.
- Frontend requirement:
  - Use the installed `frontend-design` skill as a delivery requirement for all user-facing pages.
  - Visual direction is `soft craft`: warm, handmade, slightly premium, with distinctive typography, textured backgrounds, and polished onboarding/dashboard hierarchy.
  - Avoid generic SaaS styling, default font stacks, and plain CRUD-table aesthetics even when the functionality is operational.

## Public Interfaces
- CSV import contracts must be explicit and versioned in-app for products/formulas and orders.
- Import result shape must include created records, skipped rows, and row-level errors.
- Purchasing-plan output must include material, required quantity, on-hand quantity, net-to-buy quantity, unit, and supplier link when available.
- Analytics outputs must support date-range revenue, bundle/order margin, and material/product usage summaries.
- Auth remains one owner to one business in app behavior, while schema keeps a path open for future multi-business support.

## Test Plan
- Unit tests: formula expansion, purchasing-plan aggregation, inventory subtraction, cost calculation, margin calculation, reorder projection.
- Integration tests: CSV parsing, validation failures, duplicate handling, database writes, purchasing-plan service outputs.
- End-to-end tests:
  - first-run import
  - create/edit formula-backed product
  - create order
  - generate purchasing plan
  - review analytics
  - trigger reorder alert in seeded scenario
- Manual checks each revision: empty states, broken imports, invalid forms, mobile layout, and visual consistency with the `soft craft` direction.

## Assumptions and Defaults
- Single business and single primary owner for the whole project.
- Revision 1 is the implementation starting point and must be fully demoable before Revision 2 begins.
- Clerk stays in scope, but if time pressure appears, auth implementation stays minimal and must not block the core workflow.
- Forecasting is out of scope unless Revisions 1-3 are stable.
- Revision 4 defaults to reorder alerts rather than customer intake forms.
