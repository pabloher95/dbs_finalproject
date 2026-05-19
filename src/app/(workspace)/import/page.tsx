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
      guidance={
        editing
          ? language === "es"
            ? "Ajusta el artículo, afina la fórmula y devuelve la ficha al catálogo."
            : "Tweak the item, refine the formula, and send the record back to the catalog."
          : language === "es"
            ? "Captura el producto, arma la fórmula y deja todo listo para compras."
            : "Capture the product, build the formula, and leave it ready for purchasing."
      }
      tips={[
        {
          label: editing ? (language === "es" ? "Abrir" : "Open") : language === "es" ? "Producto" : "Product",
          description:
            language === "es"
              ? editing
                ? "La ficha se abre ya completa para que solo ajustes lo necesario."
                : "Guarda el SKU, el nombre y la unidad vendible."
              : editing
                ? "The item opens filled in so you only change what is needed."
                : "Save the SKU, name, and sellable unit."
        },
        {
          label: language === "es" ? "Fórmula" : "Formula",
          description:
            language === "es"
              ? editing
                ? "Cambia materiales o cantidades sin rehacer todo el artículo."
                : "Agrega materiales una línea a la vez para cerrar la receta."
              : editing
                ? "Change materials or quantities without rebuilding the whole item."
                : "Add materials one line at a time to finish the recipe."
        },
        {
          label: language === "es" ? "Guardar" : "Save",
          description:
            language === "es"
              ? editing
                ? "La versión actualizada vuelve al catálogo con su nueva receta."
                : "El producto actualiza el catálogo y compras al instante."
              : editing
                ? "The updated version returns to the catalog with its new recipe."
                : "The product updates the catalog and purchasing right away."
        }
      ]}
    >
      <ImportPageContent snapshot={snapshot} editingProductId={editingProductId} />
    </WorkflowPageShell>
  );
}
