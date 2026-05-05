import { ImportPageContent } from "@/components/layout/import-page-content";
import { WorkflowPageShell } from "@/components/layout/workflow-page-shell";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export default async function ImportPage() {
  const { snapshot } = await getWorkspaceOverview();
  return (
    <WorkflowPageShell
      eyebrow="Data intake"
      title="Bring in your products, formulas, and orders"
      description="Use guided CSV templates to catch row-level issues and duplicate lines before anything is saved, then move from incoming demand to material planning in one place."
      metrics={[
        { label: "Catalog items", value: String(snapshot.products.length) },
        { label: "Open orders", value: String(snapshot.orders.length) },
        { label: "Suppliers", value: String(snapshot.suppliers.length) }
      ]}
      steps={[
        {
          title: "Choose a template",
          description: "Use the versioned CSV format for products/formulas or for orders."
        },
        {
          title: "Paste and preview",
          description: "Check row-level validation before anything is committed."
        },
        {
          title: "Move to operations",
          description: "Review products, orders, and purchasing once the catalog is in shape."
        }
      ]}
      nextStep="Once the intake looks right, review products first so the purchasing plan has a clean source of truth."
    >
      <ImportPageContent />
    </WorkflowPageShell>
  );
}
