import { ProductStudio } from "@/components/forms/product-studio";
import { WorkflowPageShell } from "@/components/layout/workflow-page-shell";
import { getRequestLanguage } from "@/lib/i18n-server";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export default async function ProductsPage() {
  const { snapshot } = await getWorkspaceOverview();
  const language = await getRequestLanguage();
  return (
    <WorkflowPageShell
      eyebrow={language === "es" ? "Catálogo" : "Catalog"}
      title={language === "es" ? "Crea productos alrededor de los que tu equipo pueda planificar" : "Build products your team can plan around"}
      description={
        language === "es"
          ? "Agrega el producto, define su rendimiento y captura la fórmula de materiales que impulsa la producción y las compras."
          : "Add the product, define its yield, and capture the material formula that drives production and purchasing."
      }
      metrics={[
        { label: language === "es" ? "Productos" : "Products", value: String(snapshot.products.length) },
        { label: language === "es" ? "Categorías" : "Categories", value: String(new Set(snapshot.products.map((product) => product.category)).size) },
        { label: language === "es" ? "Acción principal" : "Primary action", value: language === "es" ? "Agregar artículo" : "Add item" }
      ]}
      steps={[
        {
          title: language === "es" ? "Registra los detalles del producto" : "Capture product details",
          description:
            language === "es"
              ? "Introduce el nombre, el SKU, la categoría y el rendimiento para que el artículo quede listo para la planificación."
              : "Enter the name, SKU, category, and yield so the item is ready for planning."
        },
        {
          title: language === "es" ? "Define la fórmula de materiales" : "Define the material formula",
          description:
            language === "es"
              ? "Lista cada material en una línea para que las compras puedan calcularse a partir de los pedidos abiertos."
              : "List each material per line so purchasing can be calculated from open orders."
        },
        {
          title: language === "es" ? "Revisa el catálogo" : "Review the catalog",
          description: language === "es" ? "Edita o elimina artículos cuando la fórmula cambie." : "Edit or remove items when the formula changes."
        }
      ]}
      nextStep={
        language === "es"
          ? "Después de actualizar los productos, revisa la página de compras para ver cómo la demanda se traduce en necesidades de material."
          : "After updating products, review the purchasing page to see how demand translates into material needs."
      }
    >
      <ProductStudio snapshot={snapshot} />
    </WorkflowPageShell>
  );
}
