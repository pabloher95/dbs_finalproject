import { ImportPageContent } from "@/components/layout/import-page-content";
import { WorkflowPageShell } from "@/components/layout/workflow-page-shell";
import { getRequestLanguage } from "@/lib/i18n-server";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export default async function ImportPage() {
  const { snapshot } = await getWorkspaceOverview();
  const language = await getRequestLanguage();
  return (
    <WorkflowPageShell
      eyebrow={language === "es" ? "Ingesta de datos" : "Data intake"}
      title={language === "es" ? "Importa tus productos, fórmulas y pedidos" : "Bring in your products, formulas, and orders"}
      description={
        language === "es"
          ? "Usa plantillas CSV guiadas para detectar problemas por fila y líneas duplicadas antes de guardar nada; luego pasa de la demanda entrante a la planificación de materiales en un solo lugar."
          : "Use guided CSV templates to catch row-level issues and duplicate lines before anything is saved, then move from incoming demand to material planning in one place."
      }
      metrics={[
        { label: language === "es" ? "Elementos del catálogo" : "Catalog items", value: String(snapshot.products.length) },
        { label: language === "es" ? "Pedidos abiertos" : "Open orders", value: String(snapshot.orders.length) },
        { label: language === "es" ? "Proveedores" : "Suppliers", value: String(snapshot.suppliers.length) }
      ]}
      steps={[
        {
          title: language === "es" ? "Elige una plantilla" : "Choose a template",
          description:
            language === "es"
              ? "Usa el formato CSV versionado para productos/fórmulas o para pedidos."
              : "Use the versioned CSV format for products/formulas or for orders."
        },
        {
          title: language === "es" ? "Pega y previsualiza" : "Paste and preview",
          description:
            language === "es"
              ? "Revisa la validación por fila antes de confirmar cualquier cosa."
              : "Check row-level validation before anything is committed."
        },
        {
          title: language === "es" ? "Pasar a operaciones" : "Move to operations",
          description:
            language === "es"
              ? "Revisa productos, pedidos y compras cuando el catálogo esté listo."
              : "Review products, orders, and purchasing once the catalog is in shape."
        }
      ]}
      nextStep={
        language === "es"
          ? "Una vez que la ingesta se vea bien, revisa primero los productos para que el plan de compras tenga una fuente de verdad limpia."
          : "Once the intake looks right, review products first so the purchasing plan has a clean source of truth."
      }
    >
      <ImportPageContent />
    </WorkflowPageShell>
  );
}
