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
      title={language === "es" ? "Crea productos en línea" : "Create products online"}
      description={
        language === "es"
          ? "Completa el formulario de productos para que el espacio de trabajo se actualice al instante, sin subir archivos. La fórmula del producto se guarda por unidad."
          : "Fill out the product form so the workspace updates instantly, without uploading files. Product formulas are saved at the unit level."
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
              ? "Captura el SKU y la fórmula del producto por unidad."
              : "Capture the SKU and the product's unit-level formula."
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
          ? "Empieza por un producto por unidad; después usa Pedidos para registrar la demanda."
          : "Start with a unit-level product, then use Orders to record demand."
      }
    >
      <ImportPageContent snapshot={snapshot} />
    </WorkflowPageShell>
  );
}
