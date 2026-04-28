export type Business = {
  id: string;
  name: string;
  ownerUserId: string;
};

export type Supplier = {
  id: string;
  name: string;
  email: string;
  category: string;
};

export type Material = {
  id: string;
  name: string;
  unit: string;
  preferredSupplierId?: string;
  onHandQuantity: number;
};

export type ProductMaterial = {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  yieldQuantity: number;
  materials: ProductMaterial[];
};

export type Client = {
  id: string;
  name: string;
  email: string;
  channel: string;
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  dueDate: string;
  status: "open" | "draft" | "fulfilled";
  items: OrderItem[];
};

export type BusinessSnapshot = {
  business: Business;
  suppliers: Supplier[];
  materials: Material[];
  products: Product[];
  clients: Client[];
  orders: Order[];
};
