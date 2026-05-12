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
      metrics={[
        { label: language === "es" ? "Productos" : "Products", value: String(snapshot.products.length) },
        { label: language === "es" ? "Categorías" : "Categories", value: String(new Set(snapshot.products.map((product) => product.category)).size) },
        { label: language === "es" ? "Lectura" : "Reading", value: language === "es" ? "Fórmula" : "Formula" }
      ]}
      steps={[
        {
          title: language === "es" ? "Encuentra el artículo" : "Find the item",
          description:
            language === "es"
              ? "Busca por nombre, SKU o categoría para abrir el artículo correcto."
              : "Search by name, SKU, or category to open the right item."
        },
        {
          title: language === "es" ? "Lee la receta" : "Read the recipe",
          description:
            language === "es"
              ? "Mira cómo cada material entra en la fórmula y cómo se reparte por unidad."
              : "See how each material enters the formula and spreads per unit."
        },
        {
          title: language === "es" ? "Cruza con compras" : "Cross-check purchasing",
          description:
            language === "es"
              ? "Compara la receta con el costo y el stock de los materiales."
              : "Compare the recipe against material cost and stock."
        }
      ]}
      nextStep={
        language === "es"
          ? "Usa Ingesta para crear nuevos productos y vuelve aquí para revisar su fórmula y costo."
          : "Use Intake to create new products, then come back here to review their formula and cost."
      }
    >
      <ProductStudio snapshot={snapshot} />
    </WorkflowPageShell>
  );
}
