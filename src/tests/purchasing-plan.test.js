const test = require("node:test");
const assert = require("node:assert/strict");

function expandFormulaRequirements(product, quantityOrdered) {
  const batchMultiplier = quantityOrdered / product.yieldQuantity;
  return product.materials.map((material) => ({
    materialId: material.materialId,
    requiredQuantity: material.quantity * batchMultiplier
  }));
}

function buildPurchasingPlan(orders, products) {
  const productLookup = new Map(products.map((product) => [product.id, product]));
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

  return aggregated;
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

  const purchasingPlan = buildPurchasingPlan(orders, products);
  assert.equal(purchasingPlan.get("mat_wax"), 3600);
});
