import type { BusinessSnapshot, Material, Order, Product } from "./types";

export type ProductEconomics = {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
  cost: number;
  margin: number;
  unitPrice: number;
  unitCost: number;
  marginRate: number;
};

export type ClientEconomics = {
  clientId: string;
  clientName: string;
  orders: number;
  revenue: number;
  cost: number;
  margin: number;
};

export type RevenueTrendPoint = {
  label: string;
  orders: number;
  revenue: number;
  cost: number;
  margin: number;
};

export type BusinessInsights = {
  totalOrders: number;
  totalRevenue: number;
  totalCost: number;
  grossMargin: number;
  grossMarginRate: number;
  averageOrderRevenue: number;
  productRows: ProductEconomics[];
  clientRows: ClientEconomics[];
  trendRows: RevenueTrendPoint[];
};

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function monthKey(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toISOString().slice(0, 7);
}

function formatMonth(key: string) {
  const [year, month] = key.split("-");
  const parsedYear = Number(year);
  const parsedMonth = Number(month);
  if (!Number.isFinite(parsedYear) || !Number.isFinite(parsedMonth)) return key;
  const date = new Date(Date.UTC(parsedYear, parsedMonth - 1, 1));
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

export function getProductUnitCost(product: Product, materials: Material[]) {
  const materialLookup = new Map(materials.map((material) => [material.id, material]));
  if (!product.yieldQuantity) return 0;

  const totalCost = product.materials.reduce((sum, material) => {
    const source = materialLookup.get(material.materialId);
    const sourceCost = Number(source?.unitCost ?? 0);
    const unitCost = Number.isFinite(sourceCost) ? sourceCost : 0;
    return sum + unitCost * material.quantity;
  }, 0);

  return roundMoney(totalCost / product.yieldQuantity);
}

export function getProductUnitRevenue(product?: Product) {
  const price = Number(product?.unitPrice ?? 0);
  return Number.isFinite(price) ? roundMoney(price) : 0;
}

export function summarizeProductEconomics(product: Product, materials: Material[], quantity: number): ProductEconomics {
  const unitPrice = getProductUnitRevenue(product);
  const unitCost = getProductUnitCost(product, materials);
  const revenue = roundMoney(unitPrice * quantity);
  const cost = roundMoney(unitCost * quantity);
  const margin = roundMoney(revenue - cost);
  const marginRate = revenue > 0 ? roundMoney(margin / revenue) : 0;

  return {
    productId: product.id,
    productName: product.name,
    quantity,
    revenue,
    cost,
    margin,
    unitPrice,
    unitCost,
    marginRate
  };
}

function summarizeOrderItems(order: Order, products: Product[], materials: Material[]) {
  const lookup = new Map(products.map((product) => [product.id, product]));
  return order.items.map((item) => {
    const product = lookup.get(item.productId);
    if (!product) {
      return {
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        revenue: 0,
        cost: 0,
        margin: 0
      };
    }

    const unitPrice = getProductUnitRevenue(product);
    const unitCost = getProductUnitCost(product, materials);
    const revenue = roundMoney(unitPrice * item.quantity);
    const cost = roundMoney(unitCost * item.quantity);

    return {
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      revenue,
      cost,
      margin: roundMoney(revenue - cost)
    };
  });
}

export function buildBusinessInsights(snapshot: BusinessSnapshot): BusinessInsights {
  const priceOrders = snapshot.orders.filter((order) => order.status === "open" || order.status === "fulfilled");
  const productRows = new Map<string, ProductEconomics>();
  const clientRows = new Map<string, ClientEconomics>();
  const trendRows = new Map<string, RevenueTrendPoint>();

  let totalRevenue = 0;
  let totalCost = 0;
  let totalOrderCount = 0;

  for (const order of priceOrders) {
    const orderItems = summarizeOrderItems(order, snapshot.products, snapshot.materials);
    const orderRevenue = orderItems.reduce((sum, item) => sum + item.revenue, 0);
    const orderCost = orderItems.reduce((sum, item) => sum + item.cost, 0);
    totalRevenue += orderRevenue;
    totalCost += orderCost;
    totalOrderCount += 1;

    for (const item of orderItems) {
      const existing = productRows.get(item.productId) ?? {
        productId: item.productId,
        productName: item.productName,
        quantity: 0,
        revenue: 0,
        cost: 0,
        margin: 0,
        unitPrice: 0,
        unitCost: 0,
        marginRate: 0
      };
      existing.quantity += item.quantity;
      existing.revenue = roundMoney(existing.revenue + item.revenue);
      existing.cost = roundMoney(existing.cost + item.cost);
      existing.margin = roundMoney(existing.revenue - existing.cost);
      existing.marginRate = existing.revenue > 0 ? roundMoney(existing.margin / existing.revenue) : 0;
      const sourceProduct = snapshot.products.find((product) => product.id === item.productId);
      existing.unitPrice = getProductUnitRevenue(sourceProduct);
      existing.unitCost = sourceProduct ? getProductUnitCost(sourceProduct, snapshot.materials) : 0;
      productRows.set(item.productId, existing);
    }

    const client = clientRows.get(order.clientId) ?? {
      clientId: order.clientId,
      clientName: order.clientName,
      orders: 0,
      revenue: 0,
      cost: 0,
      margin: 0
    };
    client.orders += 1;
    client.revenue = roundMoney(client.revenue + orderRevenue);
    client.cost = roundMoney(client.cost + orderCost);
    client.margin = roundMoney(client.revenue - client.cost);
    clientRows.set(order.clientId, client);

    const bucket = monthKey(order.dueDate);
    const trend = trendRows.get(bucket) ?? {
      label: formatMonth(bucket),
      orders: 0,
      revenue: 0,
      cost: 0,
      margin: 0
    };
    trend.orders += 1;
    trend.revenue = roundMoney(trend.revenue + orderRevenue);
    trend.cost = roundMoney(trend.cost + orderCost);
    trend.margin = roundMoney(trend.revenue - trend.cost);
    trendRows.set(bucket, trend);
  }

  const productValues = Array.from(productRows.values()).sort((left, right) => right.revenue - left.revenue || right.quantity - left.quantity);
  const clientValues = Array.from(clientRows.values()).sort((left, right) => right.revenue - left.revenue || right.orders - left.orders);
  const trendValues = Array.from(trendRows.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, value]) => value);
  const grossMargin = roundMoney(totalRevenue - totalCost);
  const grossMarginRate = totalRevenue > 0 ? roundMoney(grossMargin / totalRevenue) : 0;

  return {
    totalOrders: totalOrderCount,
    totalRevenue: roundMoney(totalRevenue),
    totalCost: roundMoney(totalCost),
    grossMargin,
    grossMarginRate,
    averageOrderRevenue: totalOrderCount > 0 ? roundMoney(totalRevenue / totalOrderCount) : 0,
    productRows: productValues,
    clientRows: clientValues,
    trendRows: trendValues
  };
}
