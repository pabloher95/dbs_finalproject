import type { Order, Product } from "@/lib/domain/types";

export function summarizeOrderDemand(orders: Order[], products: Product[]) {
  const lookup = new Map(products.map((product) => [product.id, product]));
  const totals = new Map<string, { productId: string; productName: string; totalQuantity: number; openOrders: number }>();

  for (const order of orders) {
    if (order.status !== "open") continue;
    for (const item of order.items) {
      const product = lookup.get(item.productId);
      if (!product) continue;
      const entry = totals.get(product.id) ?? {
        productId: product.id,
        productName: product.name,
        totalQuantity: 0,
        openOrders: 0
      };
      entry.totalQuantity += item.quantity;
      entry.openOrders += 1;
      totals.set(product.id, entry);
    }
  }

  return Array.from(totals.values()).sort((left, right) => right.totalQuantity - left.totalQuantity);
}

export function getSuggestedOrderNumber(orders: Order[]) {
  const parsedNumbers = orders
    .map((order) => /^ORD-(\d+)$/i.exec(order.orderNumber.trim())?.[1])
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));

  const nextNumber = parsedNumbers.length ? Math.max(...parsedNumbers) + 1 : 2001;
  return `ORD-${nextNumber}`;
}

export function getSuggestedDueDate(today = new Date(), leadDays = 7) {
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  base.setDate(base.getDate() + leadDays);
  return `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(base.getDate()).padStart(2, "0")}`;
}
