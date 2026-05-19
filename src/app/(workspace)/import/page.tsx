import { ImportPageContent } from "@/components/layout/import-page-content";
import { WorkflowPageShell } from "@/components/layout/workflow-page-shell";
import { getRequestLanguage } from "@/lib/i18n-server";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export default async function ImportPage({
  searchParams
}: Readonly<{
  searchParams?: Promise<{
    productId?: string;
  }>;
}>) {
  const { snapshot } = await getWorkspaceOverview();
  const language = await getRequestLanguage();
  const resolvedSearchParams = await searchParams;
  const editingProductId = resolvedSearchParams?.productId?.trim() || undefined;
  const editing = Boolean(editingProductId);
  return (
    <WorkflowPageShell
      eyebrow={language === "es" ? "Productos" : "Products"}
      title={
        editing
          ? language === "es"
            ? "Edita las especificaciones del producto"
            : "Edit product specs"
          : language === "es"
            ? "Crea productos con fórmula"
            : "Create products with formulas"
      }
      description={
        editing
          ? language === "es"
            ? "Ajusta el SKU, la unidad, el precio y la fórmula del artículo seleccionado."
            : "Adjust the SKU, unit, price, and formula for the selected item."
          : language === "es"
            ? "Completa el formulario de productos para que el espacio de trabajo se actualice al instante, sin subir archivos. La fórmula del producto se guarda por unidad."
            : "Fill out the product form so the workspace updates instantly, without uploading files. Product formulas are saved at the unit level."
      }
      steps={[
        {
          title: editing ? (language === "es" ? "Carga el artículo" : "Load the item") : language === "es" ? "Escribe el producto" : "Enter the product",
          description:
            language === "es"
              ? editing
                ? "La ficha se abre ya completa para que hagas los ajustes necesarios."
                : "Captura el SKU, el nombre y la unidad vendible."
              : editing
                ? "The item opens filled in so you can make the needed changes."
                : "Capture the SKU, name, and sellable unit."
        },
        {
          title: editing ? (language === "es" ? "Ajusta la fórmula" : "Adjust the formula") : language === "es" ? "Añade la fórmula" : "Add the formula",
          description:
            language === "es"
              ? editing
                ? "Cambia materiales o cantidades sin rehacer el resto del artículo."
                : "Agrega los materiales una línea a la vez para dejar lista la receta."
              : editing
                ? "Change materials or quantities without rebuilding the whole item."
                : "Add materials one line at a time to finish the recipe."
        },
        {
          title: editing ? (language === "es" ? "Guarda los cambios" : "Save the changes") : language === "es" ? "Guarda y sigue" : "Save and move on",
          description:
            language === "es"
              ? editing
                ? "El artículo actualizado vuelve al catálogo con su nueva receta."
                : "El producto actualiza el catálogo y la compra al instante."
              : editing
                ? "The updated item returns to the catalog with its new recipe."
                : "The product updates the catalog and purchasing right away."
        }
      ]}
    >
      <ImportPageContent snapshot={snapshot} editingProductId={editingProductId} />
    </WorkflowPageShell>
  );
}
