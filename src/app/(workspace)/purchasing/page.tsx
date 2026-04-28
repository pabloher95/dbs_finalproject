import { PurchasingBoard } from "@/components/layout/purchasing-board";
import { WorkflowPageShell } from "@/components/layout/workflow-page-shell";
import { getDemoBusinessSnapshot } from "@/lib/data/demo";

export default function PurchasingPage() {
  const snapshot = getDemoBusinessSnapshot();
  return (
    <WorkflowPageShell
      eyebrow="Purchasing"
      title="Turn open demand into a purchasing run"
      description="Review the total quantity needed for each material, compare it with what is already on hand, and prepare your next purchasing run."
      metrics={[
        { label: "Lines to buy", value: String(snapshot.materials.length) },
        {
          label: "Linked suppliers",
          value: String(snapshot.materials.filter((material) => material.preferredSupplierId).length)
        },
        { label: "Open orders", value: String(snapshot.orders.filter((order) => order.status === "open").length) }
      ]}
      steps={[
        {
          title: "Review required quantities",
          description: "Check which materials are being pulled in by open orders."
        },
        {
          title: "Compare with stock",
          description: "Use the on-hand column to see what is already covered."
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
