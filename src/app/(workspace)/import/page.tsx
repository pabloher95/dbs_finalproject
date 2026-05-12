import { ImportPageContent } from "@/components/layout/import-page-content";
import { WorkflowPageShell } from "@/components/layout/workflow-page-shell";
import { getRequestLanguage } from "@/lib/i18n-server";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export default async function ImportPage() {
  const { snapshot } = await getWorkspaceOverview();
  const language = await getRequestLanguage();
  return (
    <WorkflowPageShell
      eyebrow={language === "es" ? "Entrada directa" : "Direct intake"}
      title={language === "es" ? "Crea productos y pedidos en línea" : "Create products and orders online"}
      description={
        language === "es"
          ? "Completa los formularios de productos y pedidos para que el espacio de trabajo se actualice al instante, sin subir archivos."
          : "Fill out the product and order forms so the workspace updates instantly, without uploading files."
      }
      metrics={[
        { label: language === "es" ? "Elementos del catálogo" : "Catalog items", value: String(snapshot.products.length) },
        { label: language === "es" ? "Pedidos abiertos" : "Open orders", value: String(snapshot.orders.length) },
        { label: language === "es" ? "Proveedores" : "Suppliers", value: String(snapshot.suppliers.length) }
      ]}
      steps={[
        {
          title: language === "es" ? "Escribe un producto" : "Enter a product",
          description:
            language === "es"
              ? "Captura el SKU, el rendimiento y la fórmula en una sola forma."
              : "Capture the SKU, yield, and formula in one form."
        },
        {
          title: language === "es" ? "Registra un pedido" : "Record an order",
          description:
            language === "es"
              ? "Escribe el cliente, el producto y la fecha de entrega."
              : "Enter the customer, product, and due date."
        },
        {
          title: language === "es" ? "Pasa a compras" : "Move to purchasing",
          description:
            language === "es"
              ? "La demanda abierta alimenta la cola de compras sin otro paso."
              : "Open demand feeds purchasing without another handoff."
        }
      ]}
      nextStep={
        language === "es"
          ? "Empieza por un producto; después registra el pedido que lo pone en marcha."
          : "Start with one product, then record the order that puts it to work."
      }
    >
      <ImportPageContent snapshot={snapshot} />
    </WorkflowPageShell>
  );
}
