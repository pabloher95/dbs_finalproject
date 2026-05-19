import type { BusinessSnapshot } from "@/lib/domain/types";

const snapshot: BusinessSnapshot = {
  business: {
    id: "biz_sunday_crumb",
    name: "Your Business",
    ownerUserId: "owner_demo"
  },
  suppliers: [
    { id: "sup_mill", name: "Northline Materials", email: "orders@northline.test", category: "base materials" },
    { id: "sup_dairy", name: "Foundry Supply Co.", email: "sales@foundrysupply.test", category: "specialty inputs" },
    { id: "sup_pantry", name: "Atlas Packaging", email: "hello@atlaspackaging.test", category: "packaging" }
  ],
  materials: [
    {
      id: "ing_flour",
      name: "Soy Wax",
      unit: "g",
      onHandQuantity: 900,
      unitCost: 0.012,
      preferredSupplierId: "sup_mill"
    },
    {
      id: "ing_butter",
      name: "Fragrance Oil",
      unit: "g",
      onHandQuantity: 40,
      unitCost: 0.08,
      preferredSupplierId: "sup_dairy"
    },
    {
      id: "ing_sugar",
      name: "Label Stock",
      unit: "sheet",
      onHandQuantity: 3,
      unitCost: 0.35,
      preferredSupplierId: "sup_pantry"
    },
    {
      id: "ing_jam",
      name: "Gift Box Insert",
      unit: "each",
      onHandQuantity: 6,
      unitCost: 0.6,
      preferredSupplierId: "sup_pantry"
    },
    {
      id: "ing_milk",
      name: "Cotton Wick",
      unit: "each",
      onHandQuantity: 10,
      unitCost: 0.12,
      preferredSupplierId: "sup_dairy"
    }
  ],
  products: [
    {
      id: "prd_croissant",
      sku: "CROISSANT",
      name: "Signature Candle",
      category: "home goods",
      unit: "each",
      yieldQuantity: 12,
      unitPrice: 34,
      materials: [
        { materialId: "ing_flour", materialName: "Soy Wax", quantity: 1200, unit: "g" },
        { materialId: "ing_butter", materialName: "Fragrance Oil", quantity: 120, unit: "g" },
        { materialId: "ing_milk", materialName: "Cotton Wick", quantity: 12, unit: "each" }
      ]
    },
    {
      id: "prd_scone",
      sku: "JAM-SCONE",
      name: "Gift Set",
      category: "bundles",
      unit: "each",
      yieldQuantity: 8,
      unitPrice: 48,
      materials: [
        { materialId: "ing_flour", materialName: "Soy Wax", quantity: 950, unit: "g" },
        { materialId: "ing_butter", materialName: "Fragrance Oil", quantity: 80, unit: "g" },
        { materialId: "ing_sugar", materialName: "Label Stock", quantity: 8, unit: "sheet" },
        { materialId: "ing_jam", materialName: "Gift Box Insert", quantity: 8, unit: "each" }
      ]
    }
  ],
  clients: [
    { id: "cl_river", name: "Common Goods Market", email: "orders@commongoods.test", channel: "wholesale retail" },
    { id: "cl_studio", name: "North Studio Events", email: "events@northstudio.test", channel: "event gifting" },
    { id: "cl_harbor", name: "Harbor House Mercantile", email: "buying@harborhouse.test", channel: "seasonal retail" }
  ],
  orders: [
    {
      id: "ord_1901",
      orderNumber: "ORD-1901",
      clientId: "cl_river",
      clientName: "Common Goods Market",
      destination: "Winter Pop-Up Table",
      dueDate: "2026-01-16",
      status: "fulfilled",
      items: [
        { productId: "prd_croissant", productName: "Signature Candle", quantity: 18 },
        { productId: "prd_scone", productName: "Gift Set", quantity: 8 }
      ]
    },
    {
      id: "ord_1930",
      orderNumber: "ORD-1930",
      clientId: "cl_studio",
      clientName: "North Studio Events",
      destination: "Client Welcome Kits",
      dueDate: "2026-02-11",
      status: "fulfilled",
      items: [{ productId: "prd_scone", productName: "Gift Set", quantity: 14 }]
    },
    {
      id: "ord_1962",
      orderNumber: "ORD-1962",
      clientId: "cl_harbor",
      clientName: "Harbor House Mercantile",
      destination: "Front Display Wall",
      dueDate: "2026-03-08",
      status: "fulfilled",
      items: [
        { productId: "prd_croissant", productName: "Signature Candle", quantity: 24 },
        { productId: "prd_scone", productName: "Gift Set", quantity: 10 }
      ]
    },
    {
      id: "ord_1988",
      orderNumber: "ORD-1988",
      clientId: "cl_river",
      clientName: "Common Goods Market",
      destination: "Spring Merch Table",
      dueDate: "2026-04-14",
      status: "fulfilled",
      items: [
        { productId: "prd_croissant", productName: "Signature Candle", quantity: 30 },
        { productId: "prd_scone", productName: "Gift Set", quantity: 12 }
      ]
    },
    {
      id: "ord_2001",
      orderNumber: "ORD-2001",
      clientId: "cl_river",
      clientName: "Common Goods Market",
      destination: "River Market Cafe",
      dueDate: "2026-05-20",
      status: "open",
      items: [
        { productId: "prd_croissant", productName: "Signature Candle", quantity: 48 },
        { productId: "prd_scone", productName: "Gift Set", quantity: 24 }
      ]
    },
    {
      id: "ord_2002",
      orderNumber: "ORD-2002",
      clientId: "cl_studio",
      clientName: "North Studio Events",
      destination: "North Studio Loading Dock",
      dueDate: "2026-05-22",
      status: "open",
      items: [{ productId: "prd_croissant", productName: "Signature Candle", quantity: 36 }]
    },
    {
      id: "ord_2013",
      orderNumber: "ORD-2013",
      clientId: "cl_harbor",
      clientName: "Harbor House Mercantile",
      destination: "Window Gift Tower",
      dueDate: "2026-05-28",
      status: "open",
      items: [
        { productId: "prd_croissant", productName: "Signature Candle", quantity: 20 },
        { productId: "prd_scone", productName: "Gift Set", quantity: 16 }
      ]
    }
  ]
};

export function getDemoBusinessSnapshot(): BusinessSnapshot {
  return structuredClone(snapshot);
}
