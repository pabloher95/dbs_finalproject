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
    { id: "ing_flour", name: "Soy Wax", unit: "g", preferredSupplierId: "sup_mill" },
    { id: "ing_butter", name: "Fragrance Oil", unit: "g", preferredSupplierId: "sup_dairy" },
    { id: "ing_sugar", name: "Label Stock", unit: "sheet", preferredSupplierId: "sup_pantry" },
    { id: "ing_jam", name: "Gift Box Insert", unit: "each", preferredSupplierId: "sup_pantry" },
    { id: "ing_milk", name: "Cotton Wick", unit: "each", preferredSupplierId: "sup_dairy" }
  ],
  products: [
    {
      id: "prd_croissant",
      sku: "CROISSANT",
      name: "Signature Candle",
      category: "home goods",
      unit: "each",
      yieldQuantity: 12,
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
    { id: "cl_studio", name: "North Studio Events", email: "events@northstudio.test", channel: "event gifting" }
  ],
  orders: [
    {
      id: "ord_2001",
      orderNumber: "ORD-2001",
      clientId: "cl_river",
      clientName: "Common Goods Market",
      dueDate: "2026-04-29",
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
      dueDate: "2026-04-30",
      status: "open",
      items: [{ productId: "prd_croissant", productName: "Signature Candle", quantity: 36 }]
    }
  ]
};

export function getDemoBusinessSnapshot(): BusinessSnapshot {
  return structuredClone(snapshot);
}
