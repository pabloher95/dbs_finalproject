import test from "node:test";
import assert from "node:assert/strict";

import { buildPurchasingPlan, buildReorderAlerts } from "../lib/domain/purchasing-plan.ts";
import type { BusinessSnapshot } from "../lib/domain/types.ts";

const snapshot: BusinessSnapshot = {
  business: {
    id: "biz_r4",
    name: "Reorder Demo",
    ownerUserId: "owner_r4"
  },
  suppliers: [{ id: "sup_1", name: "Northline Materials", email: "orders@northline.test", category: "wax" }],
  materials: [
    { id: "mat_wax", name: "Soy Wax", unit: "g", onHandQuantity: 300, preferredSupplierId: "sup_1" },
    { id: "mat_wick", name: "Cotton Wick", unit: "each", onHandQuantity: 6 }
  ],
  materialCostHistory: [],
  products: [
    {
      id: "prd_candle",
      sku: "CANDLE-01",
      name: "Signature Candle",
      category: "home goods",
      unit: "each",
      yieldQuantity: 12,
      materials: [
        { materialId: "mat_wax", materialName: "Soy Wax", quantity: 1200, unit: "g" },
        { materialId: "mat_wick", materialName: "Cotton Wick", quantity: 12, unit: "each" }
      ]
    }
  ],
  clients: [{ id: "cl_1", name: "Common Goods Market", email: "orders@commongoods.test", channel: "wholesale" }],
  orders: [
    {
      id: "ord_1",
      orderNumber: "ORD-2001",
      clientId: "cl_1",
      clientName: "Common Goods Market",
      destination: "River Market Cafe",
      dueDate: "2026-05-20",
      status: "open",
      items: [{ productId: "prd_candle", productName: "Signature Candle", quantity: 12 }]
    },
    {
      id: "ord_2",
      orderNumber: "ORD-2002",
      clientId: "cl_1",
      clientName: "Common Goods Market",
      destination: "River Market Cafe",
      dueDate: "2026-06-04",
      status: "open",
      items: [{ productId: "prd_candle", productName: "Signature Candle", quantity: 12 }]
    }
  ]
};

test("purchasing plan tracks coverage, shortage, due date, and order pressure", () => {
  const plan = buildPurchasingPlan(snapshot.orders, snapshot.products, snapshot.materials, snapshot.suppliers);
  const waxLine = plan.find((line) => line.materialId === "mat_wax");

  assert.ok(waxLine);
  assert.equal(waxLine.requiredQuantity, 2400);
  assert.equal(waxLine.shortageQuantity, 2100);
  assert.equal(waxLine.coverageRatio, 0.13);
  assert.equal(waxLine.nextDueDate, "2026-05-20");
  assert.equal(waxLine.openOrderCount, 2);
});

test("reorder alerts escalate imminent shortages and supplier gaps", () => {
  const alerts = buildReorderAlerts(snapshot, new Date("2026-05-17T00:00:00"));

  assert.equal(alerts.length, 2);
  assert.equal(alerts[0]?.materialId, "mat_wax");
  assert.equal(alerts[0]?.severity, "critical");
  assert.equal(alerts[0]?.daysUntilNextDue, 3);

  const wickAlert = alerts.find((alert) => alert.materialId === "mat_wick");
  assert.ok(wickAlert);
  assert.equal(wickAlert.severity, "critical");
  assert.equal(wickAlert.supplierName, undefined);
});
