import type { Material, Order, Product, Supplier } from "@/lib/domain/types";

export function expandFormulaRequirements(product: Product, quantityOrdered: number) {
  const batchMultiplier = quantityOrdered / product.yieldQuantity;

  return product.materials.map((material) => ({
    materialId: material.materialId,
    materialName: material.materialName,
    batchQuantity: material.quantity,
    quantityPerUnit: material.quantity / product.yieldQuantity,
    requiredQuantity: material.quantity * batchMultiplier,
    unit: material.unit
  }));
}

export function buildPurchasingPlan(
  orders: Order[],
  products: Product[],
  materials: Material[],
  suppliers: Supplier[]
) {
  const productLookup = new Map(products.map((product) => [product.id, product]));
  const materialLookup = new Map(materials.map((material) => [material.id, material]));
  const supplierLookup = new Map(suppliers.map((supplier) => [supplier.id, supplier]));
  const aggregated = new Map<
    string,
    {
      materialId: string;
      materialName: string;
      requiredQuantity: number;
      onHandQuantity: number;
      netToBuyQuantity: number;
      unit: string;
      supplierName?: string;
    }
  >();

  for (const order of orders) {
    if (order.status !== "open") continue;
    for (const item of order.items) {
      const product = productLookup.get(item.productId);
      if (!product) continue;
      const expansion = expandFormulaRequirements(product, item.quantity);

      for (const materialNeed of expansion) {
        const material = materialLookup.get(materialNeed.materialId);
        const entry = aggregated.get(materialNeed.materialId) ?? {
          materialId: materialNeed.materialId,
          materialName: materialNeed.materialName,
          requiredQuantity: 0,
          onHandQuantity: material?.onHandQuantity ?? 0,
          netToBuyQuantity: 0,
          unit: materialNeed.unit,
          supplierName: undefined
        };
        entry.requiredQuantity += materialNeed.requiredQuantity;
        entry.netToBuyQuantity = entry.requiredQuantity;
        aggregated.set(materialNeed.materialId, entry);
      }
    }
  }

  for (const item of aggregated.values()) {
    const material = materialLookup.get(item.materialId);
    if (material?.preferredSupplierId) {
      item.supplierName = supplierLookup.get(material.preferredSupplierId)?.name;
    }
  }

  return Array.from(aggregated.values()).sort((left, right) => left.materialName.localeCompare(right.materialName));
}
