import { ProductStudio } from "@/components/forms/product-studio";
import { WorkflowPageShell } from "@/components/layout/workflow-page-shell";
import { getDemoBusinessSnapshot } from "@/lib/data/demo";

export default function ProductsPage() {
  const snapshot = getDemoBusinessSnapshot();
  return (
    <WorkflowPageShell
      eyebrow="Catalog"
      title="Build products your team can plan around"
      description="Add the product, define its yield, and capture the material formula that drives production and purchasing."
      metrics={[
        { label: "Products", value: String(snapshot.products.length) },
        { label: "Categories", value: String(new Set(snapshot.products.map((product) => product.category)).size) },
        { label: "Primary action", value: "Add item" }
      ]}
      steps={[
        {
          title: "Capture product details",
          description: "Enter the name, SKU, category, and yield so the item is ready for planning."
        },
        {
          title: "Define the material formula",
          description: "List each material per line so purchasing can be calculated from open orders."
        },
        {
          title: "Review the catalog",
          description: "Edit or remove items when the formula changes."
        }
      ]}
      nextStep="After updating products, review the purchasing page to see how demand translates into material needs."
    >
      <ProductStudio snapshot={snapshot} />
    </WorkflowPageShell>
  );
}
