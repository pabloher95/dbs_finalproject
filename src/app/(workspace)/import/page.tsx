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
      title={language === "es" ? "Captura productos y pedidos en línea" : "Capture products and orders online"}
      description={
        language === "es"
          ? "Registra productos rápidos y pedidos sin subir archivos. Termina precios, rendimiento y materiales en el catálogo."
          : "Register quick products and orders without uploading files. Finish price, yield, and materials in the catalog."
      }
      metrics={[
        { label: language === "es" ? "Elementos del catálogo" : "Catalog items", value: String(snapshot.products.length) },
        { label: language === "es" ? "Pedidos abiertos" : "Open orders", value: String(snapshot.orders.length) },
        { label: language === "es" ? "Proveedores" : "Suppliers", value: String(snapshot.suppliers.length) }
      ]}
      steps={[
        {
          title: language === "es" ? "Captura un producto rápido" : "Capture a quick product",
          description:
            language === "es"
              ? "Registra la identidad del producto y deja la fórmula para el catálogo."
              : "Record the product identity and leave the formula for the catalog."
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
          ? "Empieza por un producto rápido; después termina su definición en el catálogo cuando lo necesites."
          : "Start with a quick product, then finish its definition in the catalog when needed."
      }
    >
      <ImportPageContent snapshot={snapshot} />
    </WorkflowPageShell>
  );
}
