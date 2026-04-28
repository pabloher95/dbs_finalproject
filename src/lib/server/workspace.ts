import "server-only";

import { getDemoBusinessSnapshot } from "@/lib/data/demo";
import { parseOrderImportRows, parseProductImportRows, type ImportPreview } from "@/lib/import/parser";
import type { Business, BusinessSnapshot, Client, Material, Order, Product } from "@/lib/domain/types";

type BusinessRow = {
  id: string;
  name: string;
  owner_user_id: string;
};

type SupplierRow = {
  id: string;
  name: string;
  email: string;
  category: string;
  business_id: string;
};

type MaterialRow = {
  id: string;
  name: string;
  unit: string;
  preferred_supplier_id: string | null;
  business_id: string;
};

type ProductRow = {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  yield_quantity: number;
  business_id: string;
};

type ClientRow = {
  id: string;
  name: string;
  email: string;
  channel: string;
  business_id: string;
};

type OrderRow = {
  id: string;
  client_id: string;
  order_number: string;
  due_date: string;
  status: Order["status"];
  business_id: string;
};

type ProductMaterialRow = {
  product_id: string;
  material_id: string;
  quantity: number;
  unit: string;
};

type OrderItemRow = {
  order_id: string;
  product_id: string;
  quantity: number;
};

type WorkspaceState = {
  snapshot: BusinessSnapshot;
  initialized: boolean;
  source: "memory" | "supabase";
};

type ProductInput = {
  id?: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  yieldQuantity: number;
  formula: Array<{ materialName: string; unit: string; quantity: number }>;
};

type ContactInput = {
  id?: string;
  name: string;
  email: string;
  category: string;
  kind: "client" | "supplier";
};

type OrderInput = {
  id?: string;
  orderNumber: string;
  clientId: string;
  productId: string;
  dueDate: string;
  status: Order["status"];
  quantity: number;
};

type WorkspaceBackend = {
  read(ownerId: string): Promise<WorkspaceState>;
  write(ownerId: string, snapshot: BusinessSnapshot): Promise<WorkspaceState>;
};

type ImportResult = WorkspaceState & { preview: ImportPreview };

const memoryStore = new Map<string, BusinessSnapshot>();

function cloneSnapshot(snapshot: BusinessSnapshot): BusinessSnapshot {
  return structuredClone(snapshot);
}

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "_")
    .replaceAll(/^_+|_+$/g, "");
}

function createEmptySnapshot(ownerId: string): BusinessSnapshot {
  return {
    business: {
      id: `biz_${slugify(ownerId) || "owner"}`,
      name: ownerId === "owner_demo" ? "Sunday Crumb Bakehouse" : "My Business",
      ownerUserId: ownerId
    },
    suppliers: [],
    materials: [],
    products: [],
    clients: [],
    orders: []
  };
}

function sortSnapshot(snapshot: BusinessSnapshot) {
  snapshot.suppliers.sort((left, right) => left.name.localeCompare(right.name));
  snapshot.materials.sort((left, right) => left.name.localeCompare(right.name));
  snapshot.products.sort((left, right) => left.name.localeCompare(right.name));
  snapshot.clients.sort((left, right) => left.name.localeCompare(right.name));
  snapshot.orders.sort((left, right) => {
    const dueCompare = left.dueDate.localeCompare(right.dueDate);
    if (dueCompare !== 0) return dueCompare;
    return left.orderNumber.localeCompare(right.orderNumber);
  });
}

function isInitialized(snapshot: BusinessSnapshot) {
  return (
    snapshot.suppliers.length > 0 ||
    snapshot.materials.length > 0 ||
    snapshot.products.length > 0 ||
    snapshot.clients.length > 0 ||
    snapshot.orders.length > 0
  );
}

function getOwnerId() {
  return process.env.SMALLBIZ_OWNER_ID ?? "owner_demo";
}

function getBackend(): WorkspaceBackend {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    return createSupabaseBackend(supabaseUrl, serviceKey);
  }

  return createMemoryBackend();
}

function createMemoryBackend(): WorkspaceBackend {
  return {
    async read(ownerId: string) {
      const existing = memoryStore.get(ownerId);
      if (existing) {
        const snapshot = cloneSnapshot(existing);
        sortSnapshot(snapshot);
        return { snapshot, initialized: isInitialized(snapshot), source: "memory" };
      }

      const seeded = ownerId === "owner_demo" ? getDemoBusinessSnapshot() : createEmptySnapshot(ownerId);
      memoryStore.set(ownerId, cloneSnapshot(seeded));
      const snapshot = cloneSnapshot(seeded);
      sortSnapshot(snapshot);
      return { snapshot, initialized: isInitialized(snapshot), source: "memory" };
    },
    async write(ownerId: string, snapshot: BusinessSnapshot) {
      const next = cloneSnapshot(snapshot);
      sortSnapshot(next);
      memoryStore.set(ownerId, next);
      return { snapshot: cloneSnapshot(next), initialized: isInitialized(next), source: "memory" };
    }
  };
}

function createSupabaseBackend(baseUrl: string, serviceKey: string): WorkspaceBackend {
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json"
  };

  async function request(path: string, init?: RequestInit) {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/rest/v1${path}`, {
      ...init,
      headers: {
        ...headers,
        ...(init?.headers ?? {})
      }
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Supabase request failed (${response.status}): ${body}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async function ensureBusiness(ownerId: string): Promise<Business> {
    const rows = await request(`/business?select=id,name,owner_user_id&owner_user_id=eq.${encodeURIComponent(ownerId)}&limit=1`, {
      method: "GET",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`
      }
    }) as BusinessRow[];

    if (Array.isArray(rows) && rows[0]) {
      return {
        id: rows[0].id,
        name: rows[0].name,
        ownerUserId: rows[0].owner_user_id
      };
    }

    const business = createEmptySnapshot(ownerId).business;
    await request("/business?on_conflict=id", {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "resolution=merge-duplicates,return=representation"
      },
      body: JSON.stringify({
        id: business.id,
        name: business.name,
        owner_user_id: business.ownerUserId
      })
    });

    return business;
  }

  async function readRows<T>(path: string) {
    return request(path, {
      method: "GET",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`
      }
    }) as Promise<T[]>;
  }

  async function read(ownerId: string): Promise<WorkspaceState> {
    const business = await ensureBusiness(ownerId);
    const [suppliers, materials, products, clients, orders] = await Promise.all([
      readRows<SupplierRow>(`/suppliers?select=id,name,email,category,business_id&business_id=eq.${encodeURIComponent(business.id)}`),
      readRows<MaterialRow>(`/materials?select=id,name,unit,preferred_supplier_id,business_id&business_id=eq.${encodeURIComponent(business.id)}`),
      readRows<ProductRow>(`/products?select=id,sku,name,category,unit,yield_quantity,business_id&business_id=eq.${encodeURIComponent(business.id)}`),
      readRows<ClientRow>(`/clients?select=id,name,email,channel,business_id&business_id=eq.${encodeURIComponent(business.id)}`),
      readRows<OrderRow>(
        `/orders?select=id,client_id,order_number,due_date,status,business_id&business_id=eq.${encodeURIComponent(business.id)}`
      )
    ]);

    const productIds = products.map((item) => item.id);
    const orderIds = orders.map((item) => item.id);

    const [productMaterials, orderItems] = await Promise.all([
      productIds.length
        ? readRows<ProductMaterialRow>(
            `/product_materials?select=product_id,material_id,quantity,unit&product_id=in.(${productIds.join(",")})`
          )
        : Promise.resolve([]),
      orderIds.length
        ? readRows<OrderItemRow>(`/order_items?select=order_id,product_id,quantity&order_id=in.(${orderIds.join(",")})`)
        : Promise.resolve([])
    ]);

    const materialsById = new Map<string, Material>();
    for (const row of materials) {
      materialsById.set(row.id, {
        id: row.id,
        name: row.name,
        unit: row.unit,
        preferredSupplierId: row.preferred_supplier_id ?? undefined
      });
    }

    const productsSnapshot: Product[] = products.map((row) => ({
      id: row.id,
      sku: row.sku,
      name: row.name,
      category: row.category,
      unit: row.unit,
      yieldQuantity: Number(row.yield_quantity),
      materials: productMaterials
        .filter((materialRow) => materialRow.product_id === row.id)
        .map((materialRow) => ({
          materialId: materialRow.material_id,
          materialName: materialsById.get(materialRow.material_id)?.name ?? materialRow.material_id,
          quantity: Number(materialRow.quantity),
          unit: materialRow.unit
        }))
    }));

    const productsById = new Map(productsSnapshot.map((product) => [product.id, product]));
    const clientsById = new Map<string, Client>(
      clients.map((row) => [
        row.id,
        {
          id: row.id,
          name: row.name,
          email: row.email,
          channel: row.channel
        }
      ])
    );

    const ordersSnapshot: Order[] = orders.map((row) => ({
      id: row.id,
      orderNumber: row.order_number,
      clientId: row.client_id,
      clientName: clientsById.get(row.client_id)?.name ?? row.client_id,
      dueDate: row.due_date,
      status: row.status,
      items: orderItems
        .filter((item) => item.order_id === row.id)
        .map((item) => ({
          productId: item.product_id,
          productName: productsById.get(item.product_id)?.name ?? item.product_id,
          quantity: Number(item.quantity)
        }))
    }));

    const snapshot: BusinessSnapshot = {
      business,
      suppliers: suppliers.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        category: row.category
      })),
      materials: Array.from(materialsById.values()),
      products: productsSnapshot,
      clients: Array.from(clientsById.values()),
      orders: ordersSnapshot
    };

    sortSnapshot(snapshot);
    return { snapshot, initialized: isInitialized(snapshot), source: "supabase" };
  }

  async function write(ownerId: string, snapshot: BusinessSnapshot): Promise<WorkspaceState> {
    const business = snapshot.business;
    await request("/business?on_conflict=id", {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "resolution=merge-duplicates,return=representation"
      },
      body: JSON.stringify({
        id: business.id,
        name: business.name,
        owner_user_id: ownerId
      })
    });

    const productIds = snapshot.products.map((product) => product.id);
    const orderIds = snapshot.orders.map((order) => order.id);

    if (orderIds.length) {
      await request(`/order_items?order_id=in.(${encodeURIComponent(orderIds.join(","))})`, {
        method: "DELETE",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`
        }
      });
    }
    await request(`/orders?business_id=eq.${encodeURIComponent(business.id)}`, {
      method: "DELETE",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`
      }
    });

    if (productIds.length) {
      await request(`/product_materials?product_id=in.(${encodeURIComponent(productIds.join(","))})`, {
        method: "DELETE",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`
        }
      });
    }
    await request(`/products?business_id=eq.${encodeURIComponent(business.id)}`, {
      method: "DELETE",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`
      }
    });
    await request(`/materials?business_id=eq.${encodeURIComponent(business.id)}`, {
      method: "DELETE",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`
      }
    });
    await request(`/clients?business_id=eq.${encodeURIComponent(business.id)}`, {
      method: "DELETE",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`
      }
    });
    await request(`/suppliers?business_id=eq.${encodeURIComponent(business.id)}`, {
      method: "DELETE",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`
      }
    });

    if (snapshot.suppliers.length) {
      await request("/suppliers", {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: "return=representation"
        },
        body: JSON.stringify(snapshot.suppliers.map((supplier) => ({
          id: supplier.id,
          business_id: business.id,
          name: supplier.name,
          email: supplier.email,
          category: supplier.category
        })))
      });
    }

    if (snapshot.materials.length) {
      await request("/materials", {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: "return=representation"
        },
        body: JSON.stringify(snapshot.materials.map((material) => ({
          id: material.id,
          business_id: business.id,
          name: material.name,
          unit: material.unit,
          preferred_supplier_id: material.preferredSupplierId ?? null
        })))
      });
    }

    if (snapshot.products.length) {
      await request("/products", {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: "return=representation"
        },
        body: JSON.stringify(snapshot.products.map((product) => ({
          id: product.id,
          business_id: business.id,
          sku: product.sku,
          name: product.name,
          category: product.category,
          unit: product.unit,
          yield_quantity: product.yieldQuantity
        })))
      });
    }

    if (snapshot.products.length) {
      await request("/product_materials", {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: "return=representation"
        },
        body: JSON.stringify(
          snapshot.products.flatMap((product) =>
            product.materials.map((material) => ({
              product_id: product.id,
              material_id: material.materialId,
              quantity: material.quantity,
              unit: material.unit
            }))
          )
        )
      });
    }

    if (snapshot.clients.length) {
      await request("/clients", {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: "return=representation"
        },
        body: JSON.stringify(snapshot.clients.map((client) => ({
          id: client.id,
          business_id: business.id,
          name: client.name,
          email: client.email,
          channel: client.channel
        })))
      });
    }

    if (snapshot.orders.length) {
      await request("/orders", {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: "return=representation"
        },
        body: JSON.stringify(
          snapshot.orders.map((order) => ({
            id: order.id,
            business_id: business.id,
            client_id: order.clientId,
            order_number: order.orderNumber,
            due_date: order.dueDate,
            status: order.status
          }))
        )
      });
    }

    if (snapshot.orders.length) {
      await request("/order_items", {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: "return=representation"
        },
        body: JSON.stringify(
          snapshot.orders.flatMap((order) =>
            order.items.map((item) => ({
              order_id: order.id,
              product_id: item.productId,
              quantity: item.quantity
            }))
          )
        )
      });
    }

    return { snapshot: cloneSnapshot(snapshot), initialized: isInitialized(snapshot), source: "supabase" };
  }

  return { read, write };
}

async function mutateWorkspace(
  ownerId: string,
  mutator: (snapshot: BusinessSnapshot) => void | Promise<void>
): Promise<WorkspaceState> {
  const backend = getBackend();
  const current = await backend.read(ownerId);
  const next = cloneSnapshot(current.snapshot);
  await mutator(next);
  sortSnapshot(next);
  return backend.write(ownerId, next);
}

function findProduct(snapshot: BusinessSnapshot, value: string) {
  const key = normalizeKey(value);
  return snapshot.products.find((product) => normalizeKey(product.sku) === key || product.id === value);
}

function findClient(snapshot: BusinessSnapshot, value: string) {
  const key = normalizeKey(value);
  return snapshot.clients.find((client) => normalizeKey(client.name) === key || client.id === value);
}

function findSupplier(snapshot: BusinessSnapshot, value: string) {
  const key = normalizeKey(value);
  return snapshot.suppliers.find((supplier) => normalizeKey(supplier.name) === key || supplier.id === value);
}

function findMaterial(snapshot: BusinessSnapshot, value: string) {
  const key = normalizeKey(value);
  return snapshot.materials.find((material) => normalizeKey(material.name) === key || material.id === value);
}

function ensureMaterial(snapshot: BusinessSnapshot, materialName: string, unit: string) {
  const existing = findMaterial(snapshot, materialName);
  if (existing) {
    if (!existing.unit) {
      existing.unit = unit;
    }
    return existing;
  }

  const material = {
    id: `mat_${slugify(materialName) || crypto.randomUUID()}`,
    name: materialName,
    unit
  };

  snapshot.materials.push(material);
  return material;
}

function ensureClientForImport(snapshot: BusinessSnapshot, clientName: string) {
  const existing = findClient(snapshot, clientName);
  if (existing) {
    return existing;
  }

  const client = {
    id: `cl_${slugify(clientName) || crypto.randomUUID()}`,
    name: clientName,
    email: `imported+${slugify(clientName) || "client"}@smallbiz.local`,
    channel: "imported"
  };

  snapshot.clients.push(client);
  return client;
}

function ensureProduct(snapshot: BusinessSnapshot, input: ProductInput) {
  const existing = input.id ? snapshot.products.find((product) => product.id === input.id) : findProduct(snapshot, input.sku);
  if (existing) {
    existing.sku = input.sku;
    existing.name = input.name;
    existing.category = input.category;
    existing.unit = input.unit;
    existing.yieldQuantity = input.yieldQuantity;
    existing.materials = input.formula.map((material) => {
      const resolved = ensureMaterial(snapshot, material.materialName, material.unit);
      return {
        materialId: resolved.id,
        materialName: resolved.name,
        quantity: material.quantity,
        unit: material.unit
      };
    });
    return existing;
  }

  const product: Product = {
    id: input.id ?? `prd_${slugify(input.sku) || crypto.randomUUID()}`,
    sku: input.sku,
    name: input.name,
    category: input.category,
    unit: input.unit,
    yieldQuantity: input.yieldQuantity,
    materials: input.formula.map((material) => {
      const resolved = ensureMaterial(snapshot, material.materialName, material.unit);
      return {
        materialId: resolved.id,
        materialName: resolved.name,
        quantity: material.quantity,
        unit: material.unit
      };
    })
  };

  snapshot.products.push(product);
  return product;
}

function buildOrderItems(snapshot: BusinessSnapshot, productId: string, quantity: number) {
  const product = snapshot.products.find((item) => item.id === productId);
  if (!product) {
    throw new Error("Product not found for order item.");
  }

  return [
    {
      productId: product.id,
      productName: product.name,
      quantity
    }
  ];
}

export async function readWorkspace(ownerId = getOwnerId()) {
  return getBackend().read(ownerId);
}

export async function getWorkspaceOverview(ownerId = getOwnerId()) {
  const workspace = await readWorkspace(ownerId);
  return {
    ...workspace,
    ownerId
  };
}

export async function saveProduct(ownerId: string, input: ProductInput) {
  return mutateWorkspace(ownerId, (snapshot) => {
    ensureProduct(snapshot, input);
  });
}

export async function deleteProduct(ownerId: string, productId: string) {
  return mutateWorkspace(ownerId, (snapshot) => {
    const linkedOrders = snapshot.orders.filter((order) => order.items.some((item) => item.productId === productId));
    if (linkedOrders.length) {
      throw new Error("Product is used by existing orders and cannot be deleted.");
    }
    snapshot.products = snapshot.products.filter((product) => product.id !== productId);
  });
}

export async function saveContact(ownerId: string, input: ContactInput) {
  return mutateWorkspace(ownerId, (snapshot) => {
    if (input.kind === "client") {
      const existing = input.id
        ? snapshot.clients.find((client) => client.id === input.id)
        : findClient(snapshot, input.name);
      if (existing) {
        existing.name = input.name;
        existing.email = input.email;
        existing.channel = input.category;
        return;
      }

      snapshot.clients.push({
        id: input.id ?? `cl_${slugify(input.name) || crypto.randomUUID()}`,
        name: input.name,
        email: input.email,
        channel: input.category
      });
      return;
    }

    const existing = input.id
      ? snapshot.suppliers.find((supplier) => supplier.id === input.id)
      : findSupplier(snapshot, input.name);
    if (existing) {
      existing.name = input.name;
      existing.email = input.email;
      existing.category = input.category;
      return;
    }

    snapshot.suppliers.push({
      id: input.id ?? `sup_${slugify(input.name) || crypto.randomUUID()}`,
      name: input.name,
      email: input.email,
      category: input.category
    });
  });
}

export async function deleteContact(ownerId: string, input: { kind: "client" | "supplier"; id: string }) {
  return mutateWorkspace(ownerId, (snapshot) => {
    if (input.kind === "client") {
      const referenced = snapshot.orders.some((order) => order.clientId === input.id);
      if (referenced) {
        throw new Error("Client is used by an order and cannot be deleted.");
      }
      snapshot.clients = snapshot.clients.filter((client) => client.id !== input.id);
      return;
    }

    snapshot.suppliers = snapshot.suppliers.filter((supplier) => supplier.id !== input.id);
    for (const material of snapshot.materials) {
      if (material.preferredSupplierId === input.id) {
        delete material.preferredSupplierId;
      }
    }
  });
}

export async function saveOrder(ownerId: string, input: OrderInput) {
  return mutateWorkspace(ownerId, (snapshot) => {
    const client = snapshot.clients.find((item) => item.id === input.clientId);
    if (!client) {
      throw new Error("Client not found for order.");
    }

    const items = buildOrderItems(snapshot, input.productId, input.quantity);
    const existing = input.id ? snapshot.orders.find((order) => order.id === input.id) : snapshot.orders.find((order) => order.orderNumber === input.orderNumber);

    if (existing) {
      existing.orderNumber = input.orderNumber;
      existing.clientId = client.id;
      existing.clientName = client.name;
      existing.dueDate = input.dueDate;
      existing.status = input.status;
      existing.items = items;
      return;
    }

    snapshot.orders.push({
      id: input.id ?? `ord_${slugify(input.orderNumber) || crypto.randomUUID()}`,
      orderNumber: input.orderNumber,
      clientId: client.id,
      clientName: client.name,
      dueDate: input.dueDate,
      status: input.status,
      items
    });
  });
}

export async function deleteOrder(ownerId: string, orderId: string) {
  return mutateWorkspace(ownerId, (snapshot) => {
    snapshot.orders = snapshot.orders.filter((order) => order.id !== orderId);
  });
}

export async function importWorkspaceData(ownerId: string, target: "products" | "orders", csv: string): Promise<ImportResult> {
  if (target === "products") {
    const parsed = parseProductImportRows(csv);
    const workspace = await mutateWorkspace(ownerId, (snapshot) => {
      const grouped = new Map<string, ProductInput>();
      for (const row of parsed.rows) {
        const current = grouped.get(row.sku) ?? {
          sku: row.sku,
          name: row.name,
          category: row.category,
          unit: row.unit,
          yieldQuantity: row.yieldQuantity,
          formula: []
        };
        current.formula.push({
          materialName: row.materialName,
          unit: row.materialUnit,
          quantity: row.materialQuantity
        });
        grouped.set(row.sku, current);
      }

      for (const product of grouped.values()) {
        ensureProduct(snapshot, product);
      }
    });

    return { ...workspace, preview: parsed.preview };
  }

  const parsed = parseOrderImportRows(csv);
  let preview: ImportPreview = parsed.preview;
  const workspace = await mutateWorkspace(ownerId, (snapshot) => {
    const reports = new Map<number, ImportPreview["rowReports"][number]>();
    for (const row of parsed.preview.rowReports) {
      reports.set(row.rowNumber, row);
    }

    const grouped = new Map<string, ParsedOrderGroup>();
    for (const row of parsed.rows) {
      const product = findProduct(snapshot, row.productSku);
      if (!product) {
        reports.set(row.rowNumber, {
          rowNumber: row.rowNumber,
          status: "error",
          message: `Product SKU ${row.productSku} was not found.`
        });
        continue;
      }

      const current = grouped.get(row.orderNumber) ?? {
        orderNumber: row.orderNumber,
        clientName: row.clientName,
        dueDate: row.dueDate,
        status: row.status,
        items: []
      };
      current.items.push({
        productId: product.id,
        quantity: row.quantity
      });
      grouped.set(row.orderNumber, current);
    }

    for (const order of grouped.values()) {
      const client = ensureClientForImport(snapshot, order.clientName);
      const existing = snapshot.orders.find((item) => item.orderNumber === order.orderNumber);
      const nextItems = order.items.map((item) => {
        const product = snapshot.products.find((product) => product.id === item.productId);
        return {
          productId: item.productId,
          productName: product?.name ?? item.productId,
          quantity: item.quantity
        };
      });

      if (existing) {
        existing.clientId = client.id;
        existing.clientName = client.name;
        existing.dueDate = order.dueDate;
        existing.status = order.status;
        existing.items = nextItems;
        continue;
      }

      snapshot.orders.push({
        id: `ord_${slugify(order.orderNumber) || crypto.randomUUID()}`,
        orderNumber: order.orderNumber,
        clientId: client.id,
        clientName: client.name,
        dueDate: order.dueDate,
        status: order.status,
        items: nextItems
      });
    }

    const nextPreview: ImportPreview = {
      createdRecords: parsed.rows.filter((row) => reports.get(row.rowNumber)?.status === "created").length,
      skippedRows: parsed.preview.skippedRows,
      errors: parsed.preview.errors.concat(
        Array.from(reports.values())
          .filter((report) => report.status === "error" && !parsed.preview.errors.some((error) => error.rowNumber === report.rowNumber))
          .map((report) => ({ rowNumber: report.rowNumber, message: report.message }))
      ),
      rowReports: parsed.rows
        .map(
          (row): ImportPreview["rowReports"][number] =>
            reports.get(row.rowNumber) ?? {
              rowNumber: row.rowNumber,
              status: "created",
              message: `Imported order line ${row.orderNumber}.`
            }
        )
        .concat(parsed.preview.rowReports.filter((row) => row.rowNumber === 1))
    };

    preview = nextPreview;
  });

  return { ...workspace, preview };
}

type ParsedOrderGroup = {
  orderNumber: string;
  clientName: string;
  dueDate: string;
  status: Order["status"];
  items: Array<{ productId: string; quantity: number }>;
};

export function getWorkspaceOwner() {
  return getOwnerId();
}
