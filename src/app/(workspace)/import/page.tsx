import { ImportPageContent } from "@/components/layout/import-page-content";
import { WorkflowPageShell } from "@/components/layout/workflow-page-shell";
import { getRequestLanguage } from "@/lib/i18n-server";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export default async function ImportPage() {
  const { snapshot } = await getWorkspaceOverview();
  const language = await getRequestLanguage();
  return (
    <WorkflowPageShell
      eyebrow={language === "es" ? "Productos" : "Products"}
      title={language === "es" ? "Crea productos con fórmula" : "Create products with formulas"}
      description={
        language === "es"
          ? "Completa el formulario de productos para que el espacio de trabajo se actualice al instante, sin subir archivos. La fórmula del producto se guarda por unidad."
          : "Fill out the product form so the workspace updates instantly, without uploading files. Product formulas are saved at the unit level."
      }
      metrics={[
        { label: language === "es" ? "Productos" : "Products", value: String(snapshot.products.length) },
        { label: language === "es" ? "Materiales" : "Materials", value: String(snapshot.materials.length) },
        { label: language === "es" ? "Proveedores" : "Suppliers", value: String(snapshot.suppliers.length) }
      ]}
      steps={[
        {
          title: language === "es" ? "Escribe el producto" : "Enter the product",
          description:
            language === "es"
              ? "Captura el SKU, el nombre y la unidad vendible."
              : "Capture the SKU, name, and sellable unit."
        },
        {
          title: language === "es" ? "Añade la fórmula" : "Add the formula",
          description:
            language === "es"
              ? "Agrega los materiales una línea a la vez para dejar lista la receta."
              : "Add materials one line at a time to finish the recipe."
        },
        {
          title: language === "es" ? "Guarda y sigue" : "Save and move on",
          description:
            language === "es"
              ? "El producto actualiza el catálogo y la compra al instante."
              : "The product updates the catalog and purchasing right away."
        }
      ]}
      nextStep={
        language === "es"
          ? "Empieza por el producto y termina con sus materiales; todo lo demás se actualiza después."
          : "Start with the product and finish with its materials; everything else updates after that."
      }
    >
      <ImportPageContent snapshot={snapshot} />
    </WorkflowPageShell>
  );
}
