/* eslint-disable @typescript-eslint/no-require-imports */
const test = require("node:test");
const assert = require("node:assert/strict");

function expandFormulaRequirements(product, quantityOrdered) {
  const batchMultiplier = quantityOrdered / product.yieldQuantity;
  return product.materials.map((material) => ({
    materialId: material.materialId,
    requiredQuantity: material.quantity * batchMultiplier
  }));
}

function buildPurchasingPlan(orders, products, materials) {
  const productLookup = new Map(products.map((product) => [product.id, product]));
  const materialLookup = new Map(materials.map((material) => [material.id, material]));
  const aggregated = new Map();

  for (const order of orders) {
    if (order.status !== "open") continue;
    for (const item of order.items) {
      const product = productLookup.get(item.productId);
      for (const materialNeed of expandFormulaRequirements(product, item.quantity)) {
        aggregated.set(
          materialNeed.materialId,
          (aggregated.get(materialNeed.materialId) ?? 0) + materialNeed.requiredQuantity
        );
      }
    }
  }

  return Array.from(aggregated.entries()).map(([materialId, requiredQuantity]) => {
    const onHandQuantity = materialLookup.get(materialId)?.onHandQuantity ?? 0;
    return {
      materialId,
      requiredQuantity,
      onHandQuantity,
      netToBuyQuantity: Math.max(requiredQuantity - onHandQuantity, 0)
    };
  });
}

test("formula expansion scales material quantities by ordered units", () => {
  const product = {
    id: "prd_croissant",
    yieldQuantity: 12,
    materials: [{ materialId: "mat_wax", quantity: 1200 }]
  };

  const [item] = expandFormulaRequirements(product, 24);
  assert.equal(item.requiredQuantity, 2400);
});

test("purchasing plan aggregates across open orders", () => {
  const products = [
    {
      id: "prd_croissant",
      yieldQuantity: 12,
      materials: [{ materialId: "mat_wax", quantity: 1200 }]
    }
  ];
  const orders = [
    { status: "open", items: [{ productId: "prd_croissant", quantity: 24 }] },
    { status: "open", items: [{ productId: "prd_croissant", quantity: 12 }] },
    { status: "fulfilled", items: [{ productId: "prd_croissant", quantity: 120 }] }
  ];
  const materials = [{ id: "mat_wax", onHandQuantity: 0 }];

  const purchasingPlan = buildPurchasingPlan(orders, products, materials);
  assert.equal(purchasingPlan[0].requiredQuantity, 3600);
});

test("purchasing plan subtracts on-hand inventory before buy quantities", () => {
  const product = {
    id: "prd_croissant",
    yieldQuantity: 12,
    materials: [{ materialId: "mat_wax", quantity: 1200 }]
  };
  const orders = [{ status: "open", items: [{ productId: "prd_croissant", quantity: 12 }] }];
  const materials = [{ id: "mat_wax", onHandQuantity: 400 }];

  const purchasingPlan = buildPurchasingPlan(orders, [product], materials);
  assert.equal(purchasingPlan[0].requiredQuantity, 1200);
  assert.equal(purchasingPlan[0].onHandQuantity, 400);
  assert.equal(purchasingPlan[0].netToBuyQuantity, 800);
});
