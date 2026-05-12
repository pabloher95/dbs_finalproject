"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { Card, Pill, SectionHeading, Toast } from "@/components/ui/surfaces";
import type { BusinessSnapshot, Order } from "@/lib/domain/types";
import { importExperienceCopy, orderStudioCopy, productStudioCopy } from "@/lib/i18n";

type Tone = "info" | "success" | "warn" | "error";

type FormulaDraft = {
  id: string;
  materialName: string;
  unit: string;
  quantity: string;
};

type ProductDraft = {
  id?: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  unitPrice: string;
  formula: FormulaDraft[];
};

type OrderDraft = {
  id?: string;
  orderNumber: string;
  clientName: string;
  dueDate: string;
  status: Order["status"];
  productId: string;
  quantity: string;
};

function createFormulaRow(): FormulaDraft {
  return {
    id: crypto.randomUUID(),
    materialName: "",
    unit: "g",
    quantity: ""
  };
}

function createProductDraft(): ProductDraft {
  return {
    sku: "",
    name: "",
    category: "general",
    unit: "each",
    unitPrice: "0",
    formula: [createFormulaRow()]
  };
}

function formatDueDate(offsetDays = 7) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function createOrderDraft(snapshot: BusinessSnapshot): OrderDraft {
  return {
    orderNumber: `ORD-${2000 + snapshot.orders.length + 1}`,
    clientName: "",
    dueDate: formatDueDate(),
    status: "open",
    productId: snapshot.products[0]?.id ?? "",
    quantity: "24"
  };
}

function toNumber(value: string) {
  return Number(value.trim());
}

function FormulaRowField({
  row,
  index,
  onChange,
  onRemove,
  canRemove,
  language
}: Readonly<{
  row: FormulaDraft;
  index: number;
  onChange: (next: FormulaDraft) => void;
  onRemove: () => void;
  canRemove: boolean;
  language: "en" | "es";
}>) {
  return (
    <div className="grid gap-2 rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,0.66)] p-3 md:grid-cols-[1.4fr_0.7fr_0.8fr_auto] md:items-end">
      <label className="grid gap-1">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
          {language === "es" ? "Material" : "Material"}
        </span>
        <input
          value={row.materialName}
          onChange={(event) => onChange({ ...row, materialName: event.target.value })}
          placeholder={language === "es" ? `Material ${index + 1}` : `Material ${index + 1}`}
          className="field"
        />
      </label>
      <label className="grid gap-1">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
          {language === "es" ? "Unidad" : "Unit"}
        </span>
        <input
          value={row.unit}
          onChange={(event) => onChange({ ...row, unit: event.target.value })}
          placeholder={language === "es" ? "g" : "g"}
          className="field"
        />
      </label>
      <label className="grid gap-1">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
          {language === "es" ? "Cantidad" : "Quantity"}
        </span>
        <input
          value={row.quantity}
          onChange={(event) => onChange({ ...row, quantity: event.target.value })}
          placeholder="100"
          className="field font-mono text-sm"
          inputMode="decimal"
        />
      </label>
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        className="btn btn-ghost md:justify-self-end"
      >
        {language === "es" ? "Quitar" : "Remove"}
      </button>
    </div>
  );
}

function IntakeSummary({
  label,
  value,
  tone
}: Readonly<{ label: string; value: string; tone: "moss" | "amber" | "flame" }>) {
  const toneClass: Record<typeof tone, string> = {
    moss: "border-[rgba(47,69,32,0.3)] bg-[rgba(90,122,60,0.10)] text-[var(--moss-deep)]",
    amber: "border-[rgba(106,71,8,0.3)] bg-[rgba(224,165,47,0.12)] text-[#5a3a06]",
    flame: "border-[rgba(183,51,18,0.45)] bg-[rgba(255,79,31,0.10)] text-[var(--flame-deep)]"
  };
  return (
    <div className={`rounded-2xl border ${toneClass[tone]} px-4 py-3`}>
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.32em]">{label}</p>
      <p className="mt-1 font-display text-3xl text-[var(--ink)]">{value}</p>
    </div>
  );
}

export function ImportExperience({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = importExperienceCopy(language);
  const productCopy = productStudioCopy(language);
  const orderCopy = orderStudioCopy(language);
  const [workspace, setWorkspace] = useState(snapshot);
  const [productDraft, setProductDraft] = useState<ProductDraft>(createProductDraft);
  const [orderDraft, setOrderDraft] = useState<OrderDraft>(() => createOrderDraft(snapshot));
  const [toast, setToast] = useState<{ message: string; tone: Tone } | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => {
    setWorkspace(snapshot);
  }, [snapshot]);

  useEffect(() => {
    if (!workspace.products.length) {
      setOrderDraft((current) => ({ ...current, productId: "" }));
      return;
    }
    setOrderDraft((current) => {
      if (current.productId) return current;
      return { ...current, productId: workspace.products[0].id };
    });
  }, [workspace.products]);

  async function saveProduct() {
    const sku = productDraft.sku.trim();
    const name = productDraft.name.trim();
    const category = productDraft.category.trim();
    const unit = productDraft.unit.trim();
    const unitPrice = toNumber(productDraft.unitPrice);
    const formula = productDraft.formula
      .map((row) => ({
        materialName: row.materialName.trim(),
        unit: row.unit.trim(),
        quantity: toNumber(row.quantity)
      }))
      .filter((row) => row.materialName && row.unit && Number.isFinite(row.quantity) && row.quantity > 0);

    if (!sku || !name || !category || !unit) {
      setToast({ message: productCopy.enterRequired, tone: "warn" });
      return;
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      setToast({ message: productCopy.priceNegative, tone: "warn" });
      return;
    }
    if (!formula.length) {
      setToast({ message: productCopy.formulaRequired, tone: "warn" });
      return;
    }

    setSavingProduct(true);
    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: "products",
          draft: {
            id: productDraft.id,
            sku,
            name,
            category,
            unit,
            unitPrice,
            formula
          }
        })
      });
      const data = (await response.json()) as { snapshot?: BusinessSnapshot; error?: string };
      if (!response.ok || !data.snapshot) {
        setToast({ message: data.error ?? productCopy.saveError, tone: "error" });
        return;
      }

      setWorkspace(data.snapshot);
      setProductDraft(createProductDraft());
      setToast({ message: copy.productSaved, tone: "success" });
      router.refresh();
    } finally {
      setSavingProduct(false);
    }
  }

  async function saveOrder() {
    const orderNumber = orderDraft.orderNumber.trim();
    const clientName = orderDraft.clientName.trim();
    const productId = orderDraft.productId.trim();
    const dueDate = orderDraft.dueDate.trim();
    const quantity = toNumber(orderDraft.quantity);

    if (!orderNumber) {
      setToast({ message: orderCopy.orderNumberRequired, tone: "warn" });
      return;
    }
    if (!clientName) {
      setToast({ message: copy.clientRequired, tone: "warn" });
      return;
    }
    if (!workspace.products.length) {
      setToast({ message: orderCopy.noProducts, tone: "warn" });
      return;
    }
    if (!productId) {
      setToast({ message: copy.productRequired, tone: "warn" });
      return;
    }
    if (!dueDate) {
      setToast({ message: copy.dueDateRequired, tone: "warn" });
      return;
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setToast({ message: orderCopy.quantityRequired, tone: "warn" });
      return;
    }

    setSavingOrder(true);
    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: "orders",
          draft: {
            id: orderDraft.id,
            orderNumber,
            clientName,
            dueDate,
            status: orderDraft.status,
            productId,
            quantity
          }
        })
      });
      const data = (await response.json()) as { snapshot?: BusinessSnapshot; error?: string };
      if (!response.ok || !data.snapshot) {
        setToast({ message: data.error ?? orderCopy.saveError, tone: "error" });
        return;
      }

      setWorkspace(data.snapshot);
      setOrderDraft(createOrderDraft(data.snapshot));
      setToast({ message: copy.orderSaved, tone: "success" });
      router.refresh();
    } finally {
      setSavingOrder(false);
    }
  }

  const productCount = String(workspace.products.length);
  const orderCount = String(workspace.orders.length);
  const clientCount = String(workspace.clients.length);
  const productOptions = workspace.products;

  return (
    <section className="space-y-6">
      <Card className="p-6">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
        />
        <div className="mt-5 grid gap-2 md:grid-cols-3">
          <IntakeSummary
            label={language === "es" ? "Productos" : "Products"}
            value={productCount}
            tone="moss"
          />
          <IntakeSummary
            label={language === "es" ? "Pedidos" : "Orders"}
            value={orderCount}
            tone="amber"
          />
          <IntakeSummary
            label={language === "es" ? "Clientes" : "Customers"}
            value={clientCount}
            tone="flame"
          />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              void saveProduct();
            }}
          >
            <SectionHeading
              eyebrow={copy.productEyebrow}
              title={copy.productTitle}
              description={copy.productDescription}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={productDraft.sku}
                onChange={(event) => setProductDraft((current) => ({ ...current, sku: event.target.value }))}
                placeholder={productCopy.skuPlaceholder}
                className="field font-mono text-sm"
              />
              <input
                value={productDraft.name}
                onChange={(event) => setProductDraft((current) => ({ ...current, name: event.target.value }))}
                placeholder={productCopy.namePlaceholder}
                className="field"
              />
              <input
                value={productDraft.category}
                onChange={(event) => setProductDraft((current) => ({ ...current, category: event.target.value }))}
                placeholder={productCopy.categoryPlaceholder}
                className="field"
              />
              <input
                value={productDraft.unit}
                onChange={(event) => setProductDraft((current) => ({ ...current, unit: event.target.value }))}
                placeholder={productCopy.unitPlaceholder}
                className="field"
              />
              <input
                value={productDraft.unitPrice}
                onChange={(event) => setProductDraft((current) => ({ ...current, unitPrice: event.target.value }))}
                placeholder={productCopy.unitPricePlaceholder}
                className="field font-mono text-sm"
                inputMode="decimal"
              />
            </div>

            <div className="space-y-3 border-t border-dashed border-[var(--line)] pt-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                    {language === "es" ? "Fórmula" : "Formula"}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted-strong)]">
                    {language === "es"
                      ? "Un material por fila. El producto se guarda con esta mezcla."
                      : "One material per row. The product saves with this mix."}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-soft"
                  onClick={() =>
                    setProductDraft((current) => ({
                      ...current,
                      formula: [...current.formula, createFormulaRow()]
                    }))
                  }
                >
                  {copy.addMaterial}
                </button>
              </div>
              <div className="space-y-3">
                {productDraft.formula.map((row, index) => (
                  <FormulaRowField
                    key={row.id}
                    row={row}
                    index={index}
                    language={language}
                    canRemove={productDraft.formula.length > 1}
                    onChange={(next) =>
                      setProductDraft((current) => ({
                        ...current,
                        formula: current.formula.map((item) => (item.id === row.id ? next : item))
                      }))
                    }
                    onRemove={() =>
                      setProductDraft((current) => {
                        const next = current.formula.filter((item) => item.id !== row.id);
                        return {
                          ...current,
                          formula: next.length ? next : [createFormulaRow()]
                        };
                      })
                    }
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button className="btn btn-flame" type="submit" disabled={savingProduct}>
                {productCopy.save}
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => setProductDraft(createProductDraft())}
                disabled={savingProduct}
              >
                {productCopy.reset}
              </button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              void saveOrder();
            }}
          >
            <SectionHeading
              eyebrow={copy.orderEyebrow}
              title={copy.orderTitle}
              description={copy.orderDescription}
            />
            {!workspace.products.length ? (
              <Pill tone="amber">{orderCopy.noProducts}</Pill>
            ) : null}
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={orderDraft.orderNumber}
                onChange={(event) => setOrderDraft((current) => ({ ...current, orderNumber: event.target.value }))}
                placeholder={language === "es" ? "Número de pedido" : "Order number"}
                className="field font-mono text-sm"
              />
              <input
                value={orderDraft.clientName}
                onChange={(event) => setOrderDraft((current) => ({ ...current, clientName: event.target.value }))}
                placeholder={language === "es" ? "Nombre del cliente" : "Customer name"}
                className="field"
              />
              <input
                value={orderDraft.dueDate}
                onChange={(event) => setOrderDraft((current) => ({ ...current, dueDate: event.target.value }))}
                type="date"
                className="field"
              />
              <input
                value={orderDraft.quantity}
                onChange={(event) => setOrderDraft((current) => ({ ...current, quantity: event.target.value }))}
                type="number"
                min="1"
                className="field font-mono text-sm"
              />
              <select
                value={orderDraft.status}
                onChange={(event) =>
                  setOrderDraft((current) => ({ ...current, status: event.target.value as Order["status"] }))
                }
                className="field"
              >
                <option value="draft">{orderCopy.draft}</option>
                <option value="open">{orderCopy.open}</option>
                <option value="fulfilled">{orderCopy.fulfilled}</option>
              </select>
              <select
                value={orderDraft.productId}
                onChange={(event) => setOrderDraft((current) => ({ ...current, productId: event.target.value }))}
                className="field"
                disabled={!workspace.products.length}
              >
                <option value="">{language === "es" ? "Elige un producto" : "Choose a product"}</option>
                {productOptions.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-[24px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-sm text-[var(--muted-strong)]">
              {language === "es"
                ? "El cliente se crea o reutiliza por nombre cuando guardas el pedido."
                : "The customer is created or reused by name when you save the order."}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button className="btn btn-flame" type="submit" disabled={savingOrder || !workspace.products.length}>
                {orderCopy.saveOrder}
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => setOrderDraft(createOrderDraft(workspace))}
                disabled={savingOrder}
              >
                {productCopy.reset}
              </button>
            </div>
          </form>
          <div className="mt-6 space-y-3 border-t border-dashed border-[var(--line)] pt-5">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
              {language === "es" ? "Productos disponibles" : "Available products"}
            </p>
            <div className="space-y-2">
              {workspace.products.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,0.66)] px-4 py-3"
                >
                  <div>
                    <p className="font-display text-lg text-[var(--ink)]">{product.name}</p>
                    <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                      {product.sku}
                    </p>
                  </div>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                    {product.unit}
                  </span>
                </div>
              ))}
              {!workspace.products.length ? (
                <p className="rounded-[20px] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.66)] px-4 py-3 text-sm text-[var(--muted-strong)]">
                  {productCopy.noProducts}
                </p>
              ) : null}
            </div>
          </div>
        </Card>
      </div>

      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} /> : null}
    </section>
  );
}
