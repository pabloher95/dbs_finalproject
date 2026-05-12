export function applyStockDelta(currentQuantity: number, delta: number) {
  const nextQuantity = Number(currentQuantity ?? 0) + Number(delta ?? 0);
  return Math.max(nextQuantity, 0);
}
