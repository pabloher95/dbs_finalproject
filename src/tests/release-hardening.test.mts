import test from "node:test";
import assert from "node:assert/strict";

import { getSuggestedDueDate, getSuggestedOrderNumber } from "../lib/domain/orders.ts";
import { getContactConflict, hasOrderNumberConflict, hasProductSkuConflict } from "../lib/domain/workspace-validation.ts";
import type { Client, Order, Product, Supplier } from "../lib/domain/types.ts";

test("suggested order helpers stay stable for live entry", () => {
  const orders: Order[] = [
    {
      id: "ord_1",
      orderNumber: "ORD-2004",
      clientId: "cl_1",
      clientName: "Common Goods Market",
      destination: "River Market Cafe",
      dueDate: "2026-05-20",
      status: "open",
      items: [{ productId: "prd_1", productName: "Signature Candle", quantity: 12 }]
    },
    {
      id: "ord_2",
      orderNumber: "custom-demo-order",
      clientId: "cl_1",
      clientName: "Common Goods Market",
      destination: "River Market Cafe",
      dueDate: "2026-05-22",
      status: "open",
      items: [{ productId: "prd_1", productName: "Signature Candle", quantity: 6 }]
    }
  ];

  assert.equal(getSuggestedOrderNumber(orders), "ORD-2005");
  assert.equal(getSuggestedDueDate(new Date("2026-05-17T12:00:00Z")), "2026-05-24");
});

test("workspace validation catches duplicate demo-breaking identifiers", () => {
  const products: Product[] = [
    {
      id: "prd_1",
      sku: "CANDLE-01",
      name: "Signature Candle",
      category: "home goods",
      unit: "each",
      yieldQuantity: 12,
      unitPrice: 34,
      materials: []
    }
  ];
  const orders: Order[] = [
    {
      id: "ord_1",
      orderNumber: "ORD-2001",
      clientId: "cl_1",
      clientName: "Common Goods Market",
      destination: "River Market Cafe",
      dueDate: "2026-05-20",
      status: "open",
      items: []
    }
  ];
  const clients: Client[] = [{ id: "cl_1", name: "Common Goods Market", email: "orders@commongoods.test", channel: "wholesale" }];
  const suppliers: Supplier[] = [{ id: "sup_1", name: "Northline Materials", email: "orders@northline.test", category: "wax" }];

  assert.equal(hasProductSkuConflict(products, "candle-01"), true);
  assert.equal(hasProductSkuConflict(products, "CANDLE-01", "prd_1"), false);
  assert.equal(hasOrderNumberConflict(orders, "ord-2001"), true);
  assert.equal(hasOrderNumberConflict(orders, "ORD-2001", "ord_1"), false);
  assert.deepEqual(getContactConflict(clients, { name: "common goods market", email: "fresh@test.local" }), { field: "name", id: "cl_1" });
  assert.deepEqual(getContactConflict(suppliers, { name: "New Supplier", email: "orders@northline.test" }), { field: "email", id: "sup_1" });
});
