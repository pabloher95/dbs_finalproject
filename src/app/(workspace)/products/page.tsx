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
      title={language === "es" ? "Explora el catálogo y la matemática de recetas" : "Explore the catalog and recipe math"}
      description={
        language === "es"
          ? "Revisa los artículos, sus fórmulas y el costo unitario que alimenta compras y márgenes."
          : "Review items, their formulas, and the unit cost that feeds purchasing and margins."
      }
      guidance={
        language === "es"
          ? "Busca el artículo, revisa la receta y confirma cómo alimenta compras y margen."
          : "Find the item, review the recipe, and confirm how it affects purchasing and margin."
      }
      tips={[
        {
          label: language === "es" ? "Buscar" : "Search",
          description:
            language === "es"
              ? "Usa el nombre, SKU o categoría para abrir el artículo correcto."
              : "Use the name, SKU, or category to open the right item."
        },
        {
          label: language === "es" ? "Fórmula" : "Formula",
          description:
            language === "es"
              ? "Cada material se reparte por unidad para dejar claro el costo real."
              : "Each material is spread per unit so the real cost stays visible."
        },
        {
          label: language === "es" ? "Compras" : "Purchasing",
          description:
            language === "es"
              ? "Compara la receta con el stock y el costo antes de reabastecer."
              : "Compare the recipe with stock and cost before replenishing."
        }
      ]}
    >
      <ProductStudio snapshot={snapshot} />
    </WorkflowPageShell>
  );
}
