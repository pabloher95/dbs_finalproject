import type { Client, Order, Product, Supplier } from "./types";

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

export function hasProductSkuConflict(products: Product[], sku: string, currentId?: string) {
  const key = normalizeKey(sku);
  return products.some((product) => normalizeKey(product.sku) === key && product.id !== currentId);
}

export function hasOrderNumberConflict(orders: Order[], orderNumber: string, currentId?: string) {
  const key = normalizeKey(orderNumber);
  return orders.some((order) => normalizeKey(order.orderNumber) === key && order.id !== currentId);
}

export function getContactConflict(
  records: Array<Client | Supplier>,
  input: { id?: string; name: string; email: string }
) {
  const nameKey = normalizeKey(input.name);
  const emailKey = normalizeKey(input.email);

  const conflictingName = records.find((record) => normalizeKey(record.name) === nameKey && record.id !== input.id);
  if (conflictingName) {
    return { field: "name" as const, id: conflictingName.id };
  }

  const conflictingEmail = records.find((record) => normalizeKey(record.email) === emailKey && record.id !== input.id);
  if (conflictingEmail) {
    return { field: "email" as const, id: conflictingEmail.id };
  }

  return null;
}
