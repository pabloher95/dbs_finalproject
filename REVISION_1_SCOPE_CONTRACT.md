# Revision 1 Scope Contract

Revision 1 is the smallest version of SmallBiz IQ that a real small-business owner can use end-to-end without depending on later revision features.

## Revision 1 Must Include

- A working home/dashboard experience that explains the app and leads into the workspace.
- CSV import for products/formulas and orders with templates, preview, and row-level validation.
- CRUD for products, formulas, contacts, and orders.
- Purchasing plan generation from open orders and product formulas.
- Seeded demo data and a real persistence path through the workspace data layer.
- A clear workspace layout that helps the user move between import, catalog, contacts, orders, and purchasing.

## Revision 1 Must Not Include

- Inventory on hand subtraction or stock adjustment workflows.
- Margin, revenue, trend, or forecasting analytics.
- Smart reorder alerts or depletion prediction.
- Import history, correction replay, or audit trails.
- Multi-business support.
- Full advanced auth/productization work beyond the minimal private-workspace boundary needed for v1.

## Revision 1 Definition of Done

- A first-time user can import data, review and edit catalog records, create orders, and generate a purchasing plan in one session.
- The purchasing plan reflects the current catalog and open-order demand correctly.
- The app stays usable with seeded demo data when no Supabase backend is configured.
- The implementation remains focused on the core workflow instead of borrowing capabilities reserved for later revisions.

## Scope Rule

If a feature is useful but belongs to a later revision, keep the underlying data model compatible but defer the user-facing workflow until that revision.

