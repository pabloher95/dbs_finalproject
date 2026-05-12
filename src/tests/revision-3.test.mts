import test from "node:test";
import assert from "node:assert/strict";

import { buildBusinessInsights, getProductUnitCost, summarizeProductEconomics } from "../lib/domain/analytics.ts";
import type { BusinessSnapshot } from "../lib/domain/types.ts";

const snapshot: BusinessSnapshot = {
  business: {
    id: "biz_demo",
    name: "Demo Co",
    ownerUserId: "owner_demo"
  },
  suppliers: [],
  materials: [
    { id: "mat_a", name: "Material A", unit: "g", onHandQuantity: 0, unitCost: 2 },
    { id: "mat_b", name: "Material B", unit: "g", onHandQuantity: 0, unitCost: 1 }
  ],
  products: [
    {
      id: "prd_a",
      sku: "A-1",
      name: "Product A",
      category: "core",
      unit: "each",
      yieldQuantity: 10,
      unitPrice: 20,
      materials: [
        { materialId: "mat_a", materialName: "Material A", quantity: 4, unit: "g" },
        { materialId: "mat_b", materialName: "Material B", quantity: 2, unit: "g" }
      ]
    },
    {
      id: "prd_b",
      sku: "B-1",
      name: "Product B",
      category: "core",
      unit: "each",
      yieldQuantity: 5,
      unitPrice: 30,
      materials: [{ materialId: "mat_a", materialName: "Material A", quantity: 5, unit: "g" }]
    }
  ],
  clients: [
    { id: "cl_a", name: "Alpha Market", email: "alpha@test.local", channel: "wholesale" },
    { id: "cl_b", name: "Beta Studio", email: "beta@test.local", channel: "events" }
  ],
  orders: [
    {
      id: "ord_1",
      orderNumber: "ORD-1",
      clientId: "cl_a",
      clientName: "Alpha Market",
      dueDate: "2026-04-10",
      status: "open",
      items: [{ productId: "prd_a", productName: "Product A", quantity: 10 }]
    },
    {
      id: "ord_2",
      orderNumber: "ORD-2",
      clientId: "cl_b",
      clientName: "Beta Studio",
      dueDate: "2026-05-12",
      status: "fulfilled",
      items: [{ productId: "prd_b", productName: "Product B", quantity: 5 }]
    }
  ]
};

test("product unit cost is derived from material cost and batch yield", () => {
  const product = snapshot.products[0];
  assert.equal(getProductUnitCost(product, snapshot.materials), 1);
  const economics = summarizeProductEconomics(product, snapshot.materials, 10);
  assert.equal(economics.revenue, 200);
  assert.equal(economics.cost, 10);
  assert.equal(economics.margin, 190);
});

test("business insights aggregate revenue, margin, and trends", () => {
  const insights = buildBusinessInsights(snapshot);

  assert.equal(insights.totalOrders, 2);
  assert.equal(insights.totalRevenue, 350);
  assert.equal(insights.totalCost, 20);
  assert.equal(insights.grossMargin, 330);
  assert.equal(insights.averageOrderRevenue, 175);
  assert.equal(insights.productRows[0]?.productName, "Product A");
  assert.equal(insights.productRows[0]?.revenue, 200);
  assert.equal(insights.clientRows[0]?.clientName, "Alpha Market");
  assert.equal(insights.trendRows.length, 2);
  assert.equal(insights.trendRows[0]?.label, "Apr 2026");
  assert.equal(insights.trendRows[1]?.label, "May 2026");
});
