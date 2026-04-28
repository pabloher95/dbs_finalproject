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
