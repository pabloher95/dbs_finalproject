import { PurchasingBoard } from "@/components/layout/purchasing-board";
import { WorkflowPageShell } from "@/components/layout/workflow-page-shell";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export default async function PurchasingPage() {
  const { snapshot } = await getWorkspaceOverview();
  return (
    <WorkflowPageShell
      eyebrow="Purchasing"
      title="Turn open demand into a purchasing run"
      description="Review the total quantity needed for each material, subtract what is already on hand, and prepare your next purchasing run."
      metrics={[
        { label: "Materials tracked", value: String(snapshot.materials.length) },
        {
          label: "Stocked materials",
          value: String(snapshot.materials.filter((material) => material.onHandQuantity > 0).length)
        },
        { label: "Open orders", value: String(snapshot.orders.filter((order) => order.status === "open").length) }
      ]}
      steps={[
        {
          title: "Review required quantities",
          description: "Check which materials are being pulled in by open orders."
        },
        {
          title: "Check supplier links",
          description: "Use the supplier link to see who should hear from you next."
        },
        {
          title: "Place supplier orders",
          description: "Use the supplier link to move from planning into purchasing."
        }
      ]}
      nextStep="After placing orders, return to the catalog or orders page if the plan changes."
    >
      <PurchasingBoard snapshot={snapshot} />
    </WorkflowPageShell>
  );
}
