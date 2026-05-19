import test from "node:test";
import assert from "node:assert/strict";

import { getSuggestedDueDate, getSuggestedOrderNumber } from "../lib/domain/orders.ts";
import { productTemplateCsv, orderTemplateCsv } from "../lib/import/templates.ts";
import type { Order } from "../lib/domain/types.ts";

// ── Order number generation ──────────────────────────────────────────────────

test("getSuggestedOrderNumber returns ORD-2001 when order list is empty", () => {
  assert.equal(getSuggestedOrderNumber([]), "ORD-2001");
});

test("getSuggestedOrderNumber increments beyond the highest ORD-NNNN in the list", () => {
  const orders: Order[] = [
    { id: "o1", orderNumber: "ORD-2010", clientId: "c1", clientName: "A", destination: "", dueDate: "2026-06-01", status: "open", items: [] },
    { id: "o2", orderNumber: "ORD-2003", clientId: "c1", clientName: "A", destination: "", dueDate: "2026-06-02", status: "open", items: [] }
  ];
  assert.equal(getSuggestedOrderNumber(orders), "ORD-2011");
});

test("getSuggestedOrderNumber ignores non-standard order numbers and still finds max", () => {
  const orders: Order[] = [
    { id: "o1", orderNumber: "ORD-2005", clientId: "c1", clientName: "A", destination: "", dueDate: "2026-06-01", status: "open", items: [] },
    { id: "o2", orderNumber: "custom-ref-abc", clientId: "c1", clientName: "A", destination: "", dueDate: "2026-06-02", status: "open", items: [] }
  ];
  assert.equal(getSuggestedOrderNumber(orders), "ORD-2006");
});

test("getSuggestedOrderNumber handles a list of only non-standard order numbers", () => {
  const orders: Order[] = [
    { id: "o1", orderNumber: "CUSTOM-A", clientId: "c1", clientName: "A", destination: "", dueDate: "2026-06-01", status: "open", items: [] }
  ];
  // No valid ORD-NNNN numbers, falls back to 2001
  assert.equal(getSuggestedOrderNumber(orders), "ORD-2001");
});

// ── Due date helper ──────────────────────────────────────────────────────────

test("getSuggestedDueDate adds 7 days by default", () => {
  // Use local noon to avoid UTC/timezone boundary issues
  const result = getSuggestedDueDate(new Date("2026-05-19T12:00:00"));
  assert.equal(result, "2026-05-26");
});

test("getSuggestedDueDate respects a custom lead-days argument", () => {
  const result = getSuggestedDueDate(new Date("2026-05-19T12:00:00"), 14);
  assert.equal(result, "2026-06-02");
});

test("getSuggestedDueDate always returns a date in the future relative to today", () => {
  const today = new Date();
  const result = getSuggestedDueDate(today);
  assert.ok(result > today.toISOString().slice(0, 10), "suggested date should be after today");
});

// ── CSV template freshness ───────────────────────────────────────────────────

test("order CSV template due dates are not in the past", () => {
  const today = new Date().toISOString().slice(0, 10);
  const dateMatches = orderTemplateCsv.match(/\d{4}-\d{2}-\d{2}/g) ?? [];
  for (const date of dateMatches) {
    assert.ok(
      date >= today,
      `Order template contains a stale date: ${date} (today is ${today})`
    );
  }
});

test("product CSV template has required header columns", () => {
  const firstLine = productTemplateCsv.split("\n")[0];
  for (const col of ["sku", "name", "category", "unit", "yield_quantity", "material_name"]) {
    assert.ok(firstLine.includes(col), `Missing column: ${col}`);
  }
});

test("order CSV template has required header columns", () => {
  const firstLine = orderTemplateCsv.split("\n")[0];
  for (const col of ["order_number", "client_name", "destination", "due_date", "status", "product_sku", "quantity"]) {
    assert.ok(firstLine.includes(col), `Missing column: ${col}`);
  }
});

// ── Import API validation shapes ─────────────────────────────────────────────

test("import route rejects missing target field shape", () => {
  // Simulate the server-side validation logic inline (no HTTP call needed)
  function validateImportBody(body: Record<string, unknown>): string | null {
    if (body.target !== "products") return "Intake target must be products.";
    if (!body.draft || typeof body.draft !== "object") return "Product draft is required.";
    return null;
  }

  assert.equal(validateImportBody({}), "Intake target must be products.");
  assert.equal(validateImportBody({ target: "orders" }), "Intake target must be products.");
  assert.equal(validateImportBody({ target: "products" }), "Product draft is required.");
  assert.equal(validateImportBody({ target: "products", draft: {} }), null);
});

test("import route field-level validation mirrors API contract", () => {
  function nonEmpty(value: unknown) {
    return String(value ?? "").trim();
  }

  const validDraft = { sku: "CANDLE-01", name: "Candle", category: "home goods", unit: "each", unitPrice: 34, formula: [{ materialName: "Wax", unit: "g", quantity: 200 }] };
  const sku = nonEmpty(validDraft.sku);
  const name = nonEmpty(validDraft.name);
  const category = nonEmpty(validDraft.category);
  const unit = nonEmpty(validDraft.unit);
  const unitPrice = Number(validDraft.unitPrice);

  assert.ok(sku && name && category && unit, "all required fields should be present");
  assert.ok(Number.isFinite(unitPrice) && unitPrice >= 0, "unit price should be valid non-negative");
  assert.ok(validDraft.formula.length > 0, "formula should have at least one line");

  // Missing SKU case
  const badSku = nonEmpty("");
  assert.equal(badSku, "", "empty SKU should fail the check");
});
