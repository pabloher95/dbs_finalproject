import test from "node:test";
import assert from "node:assert/strict";

import { applyStockDelta } from "../lib/domain/inventory.ts";
import { buildPurchasingPlan } from "../lib/domain/purchasing-plan.ts";
import { parseOrderImportRows, parseProductImportRows } from "../lib/import/parser.ts";

test("stock adjustments clamp inventory at zero", () => {
  assert.equal(applyStockDelta(12, 5), 17);
  assert.equal(applyStockDelta(12, -4), 8);
  assert.equal(applyStockDelta(12, -99), 0);
});

test("purchasing plan subtracts on-hand inventory before buy quantity", () => {
  const product = {
    id: "prd_candle",
    sku: "CANDLE-01",
    name: "Signature Candle",
    category: "home goods",
    unit: "each",
    yieldQuantity: 12,
    materials: [{ materialId: "mat_wax", materialName: "Soy Wax", quantity: 1200, unit: "g" }]
  };
  const orders = [
    {
      id: "ord_1",
      orderNumber: "ORD-2001",
      clientId: "cl_1",
      clientName: "Common Goods Market",
      dueDate: "2026-05-01",
      status: "open",
      items: [{ productId: "prd_candle", productName: "Signature Candle", quantity: 12 }]
    }
  ];
  const materials = [{ id: "mat_wax", name: "Soy Wax", unit: "g", onHandQuantity: 400, preferredSupplierId: "sup_1" }];
  const suppliers = [{ id: "sup_1", name: "Northline Materials", email: "orders@northline.test", category: "base materials" }];

  const [line] = buildPurchasingPlan(orders, [product], materials, suppliers);
  assert.ok(line);
  assert.equal(line.requiredQuantity, 1200);
  assert.equal(line.onHandQuantity, 400);
  assert.equal(line.netToBuyQuantity, 800);
  assert.equal(line.supplierName, "Northline Materials");
});

test("product imports skip duplicate formula rows and preserve row-level errors", () => {
  const preview = parseProductImportRows(
    [
      "sku,name,category,unit,yield_quantity,material_name,material_unit,material_quantity",
      "CANDLE-01,Signature Candle,home goods,each,12,Soy Wax,g,1200",
      "CANDLE-01,Signature Candle,home goods,each,12,Soy Wax,g,1200",
      "CANDLE-01,Signature Candle,home goods,each,12,Soy Wax,g,1200,EXTRA"
    ].join("\n")
  ).preview;

  assert.equal(preview.createdRecords, 1);
  assert.deepEqual(preview.skippedRows, [3]);
  assert.equal(preview.errors.length, 1);
  assert.equal(preview.errors[0]?.message, "Expected 8 columns but found 9. Check for missing values or unescaped commas.");
  assert.equal(preview.rowReports[0]?.status, "created");
  assert.equal(preview.rowReports[1]?.status, "skipped");
  assert.equal(preview.rowReports[2]?.status, "error");
  assert.equal(preview.rowReports[2]?.raw, "CANDLE-01,Signature Candle,home goods,each,12,Soy Wax,g,1200,EXTRA");
});

test("order imports skip duplicate lines and reject invalid status values", () => {
  const preview = parseOrderImportRows(
    [
      "order_number,client_name,due_date,status,product_sku,quantity",
      "ORD-2001,Common Goods Market,2026-05-01,open,CANDLE-01,12",
      "ORD-2001,Common Goods Market,2026-05-01,open,CANDLE-01,12",
      "ORD-2002,Common Goods Market,2026-05-01,invalid,CANDLE-01,12"
    ].join("\n")
  ).preview;

  assert.equal(preview.createdRecords, 1);
  assert.deepEqual(preview.skippedRows, [3]);
  assert.equal(preview.errors.length, 1);
  assert.equal(preview.errors[0]?.message, "Status must be open or fulfilled.");
  assert.equal(preview.rowReports[1]?.status, "skipped");
  assert.equal(preview.rowReports[2]?.status, "error");
});
