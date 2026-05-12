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

## Current Architecture Decisions
- Next.js App Router with server-rendered workspace pages and client-side forms/interactions
- Clerk handles authentication; Supabase enforces data isolation through RLS
- `src/lib/server/workspace.ts` remains the central persistence adapter for memory/demo mode and Supabase mode
- Domain logic stays in `src/lib/domain/` rather than being embedded inside route handlers
- User-facing copy is centralized in `src/lib/i18n.ts`

## Remaining Work

### Product and workflow
- Clarify the final role split between Intake and Catalog if product editing needs another pass
- Expand fulfillment beyond open/fulfilled if the team later needs partial shipment or staged production states
- Decide whether destination should be folded into customer records, shipping records, or kept as a free-form order field

### Security and operations
- Add committed CI/security workflow checks for lint, test, build, and dependency audit
- Add rate limiting for mutating APIs, especially `/api/import`
- Add production error monitoring
- Consider a CSP once Clerk requirements are accounted for

### Data and analytics
- Add deeper customer/product performance cuts if needed
- Decide whether forecasting or reorder-alert logic becomes Revision 4 or a separate stream
- Expand test coverage around auth/persistence failure modes and API validation edges

## Delivery Rule
Keep future work aligned with the current app direction:
- form-first operations
- clear page ownership
- operational clarity over generic CRUD
- production-safe auth and persistence behavior
