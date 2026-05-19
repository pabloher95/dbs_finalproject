import type { BusinessSnapshot, Material, Order, Product, Supplier } from "./types";

export type PurchasingPlanLine = {
  materialId: string;
  materialName: string;
  onHandQuantity: number;
  requiredQuantity: number;
  netToBuyQuantity: number;
  shortageQuantity: number;
  coverageRatio: number;
  unit: string;
  supplierName?: string;
  supplierEmail?: string;
  supplierPhone?: string;
  nextDueDate?: string;
  openOrderCount: number;
};

export type ReorderAlert = {
  materialId: string;
  materialName: string;
  unit: string;
  severity: "critical" | "warning";
  shortageQuantity: number;
  coverageRatio: number;
  supplierName?: string;
  supplierEmail?: string;
  supplierPhone?: string;
  nextDueDate?: string;
  daysUntilNextDue?: number;
  openOrderCount: number;
};

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

function roundQuantity(value: number) {
  return Math.round(value * 100) / 100;
}

function clampRatio(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function buildPurchasingPlan(
  orders: Order[],
  products: Product[],
  materials: Material[],
  suppliers: Supplier[]
): PurchasingPlanLine[] {
  const productLookup = new Map(products.map((product) => [product.id, product]));
  const materialLookup = new Map(materials.map((material) => [material.id, material]));
  const supplierLookup = new Map(suppliers.map((supplier) => [supplier.id, supplier]));
  const aggregated = new Map<
    string,
    {
      materialId: string;
      materialName: string;
      onHandQuantity: number;
      requiredQuantity: number;
      netToBuyQuantity: number;
      shortageQuantity: number;
      coverageRatio: number;
      unit: string;
      supplierName?: string;
      supplierEmail?: string;
      supplierPhone?: string;
      nextDueDate?: string;
      orderIds: Set<string>;
    }
  >();

  for (const order of orders) {
    if (order.status !== "open") continue;
    for (const item of order.items) {
      const product = productLookup.get(item.productId);
      if (!product) continue;
      const expansion = expandFormulaRequirements(product, item.quantity);

      for (const materialNeed of expansion) {
        const entry = aggregated.get(materialNeed.materialId) ?? {
          materialId: materialNeed.materialId,
          materialName: materialNeed.materialName,
          onHandQuantity: 0,
          requiredQuantity: 0,
          netToBuyQuantity: 0,
          shortageQuantity: 0,
          coverageRatio: 0,
          unit: materialNeed.unit,
          supplierName: undefined,
          orderIds: new Set<string>()
        };
        entry.requiredQuantity += materialNeed.requiredQuantity;
        entry.orderIds.add(order.id);
        if (!entry.nextDueDate || order.dueDate < entry.nextDueDate) {
          entry.nextDueDate = order.dueDate;
        }
        aggregated.set(materialNeed.materialId, entry);
      }
    }
  }

  for (const item of aggregated.values()) {
    const material = materialLookup.get(item.materialId);
    const preferredSupplierId = material?.preferredSupplierId;
    const onHandQuantity = Number(material?.onHandQuantity ?? 0);
    if (preferredSupplierId) {
      const supplier = supplierLookup.get(preferredSupplierId);
      item.supplierName = supplier?.name;
      item.supplierEmail = supplier?.email;
      item.supplierPhone = supplier?.phone;
    }
    item.onHandQuantity = onHandQuantity;
    item.shortageQuantity = roundQuantity(Math.max(item.requiredQuantity - onHandQuantity, 0));
    item.netToBuyQuantity = item.shortageQuantity;
    item.coverageRatio =
      item.requiredQuantity > 0 ? clampRatio(roundQuantity(onHandQuantity / item.requiredQuantity)) : 1;
  }

  return Array.from(aggregated.values())
    .map((item) => ({
      materialId: item.materialId,
      materialName: item.materialName,
      onHandQuantity: roundQuantity(item.onHandQuantity),
      requiredQuantity: roundQuantity(item.requiredQuantity),
      netToBuyQuantity: item.netToBuyQuantity,
      shortageQuantity: item.shortageQuantity,
      coverageRatio: item.coverageRatio,
      unit: item.unit,
      supplierName: item.supplierName,
      supplierEmail: item.supplierEmail,
      supplierPhone: item.supplierPhone,
      nextDueDate: item.nextDueDate,
      openOrderCount: item.orderIds.size
    }))
    .sort((left, right) => left.materialName.localeCompare(right.materialName));
}

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function diffInDays(from: Date, to: Date) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((startOfDay(to).getTime() - startOfDay(from).getTime()) / millisecondsPerDay);
}

export function buildReorderAlerts(snapshot: BusinessSnapshot, today = new Date()): ReorderAlert[] {
  const purchasingPlan = buildPurchasingPlan(
    snapshot.orders,
    snapshot.products,
    snapshot.materials,
    snapshot.suppliers
  );

  return purchasingPlan
    .filter((line) => line.netToBuyQuantity > 0 || !line.supplierName)
    .map((line) => {
      const nextDueDate = line.nextDueDate;
      const nextDue = nextDueDate ? new Date(`${nextDueDate}T00:00:00`) : undefined;
      const daysUntilNextDue =
        nextDue && !Number.isNaN(nextDue.getTime()) ? diffInDays(today, nextDue) : undefined;
      const severity: ReorderAlert["severity"] =
        line.netToBuyQuantity > 0 &&
        (
          line.coverageRatio < 0.5 ||
          (typeof daysUntilNextDue === "number" && daysUntilNextDue <= 7) ||
          (!line.supplierName && typeof daysUntilNextDue === "number" && daysUntilNextDue <= 14)
        )
          ? "critical"
          : "warning";

      return {
        materialId: line.materialId,
        materialName: line.materialName,
        unit: line.unit,
        severity,
        shortageQuantity: line.shortageQuantity,
        coverageRatio: line.coverageRatio,
        supplierName: line.supplierName,
        supplierEmail: line.supplierEmail,
        supplierPhone: line.supplierPhone,
        nextDueDate: line.nextDueDate,
        daysUntilNextDue,
        openOrderCount: line.openOrderCount
      };
    })
    .sort((left, right) => {
      const severityRank = { critical: 0, warning: 1 };
      const severityDiff = severityRank[left.severity] - severityRank[right.severity];
      if (severityDiff !== 0) return severityDiff;
      if (left.nextDueDate && right.nextDueDate && left.nextDueDate !== right.nextDueDate) {
        return left.nextDueDate.localeCompare(right.nextDueDate);
      }
      return right.shortageQuantity - left.shortageQuantity;
    });
}
