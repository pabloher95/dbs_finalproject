import { OrderStudio } from "@/components/forms/order-studio";
import { WorkflowPageShell } from "@/components/layout/workflow-page-shell";
import { getDemoBusinessSnapshot } from "@/lib/data/demo";

export default function OrdersPage() {
  const snapshot = getDemoBusinessSnapshot();
  return (
    <WorkflowPageShell
      eyebrow="Orders"
      title="Capture demand and keep the schedule moving"
      description="Record what each customer needs, when it is due, and which products are driving the next production run."
      metrics={[
        { label: "Open orders", value: String(snapshot.orders.filter((order) => order.status === "open").length) },
        { label: "Customers", value: String(snapshot.clients.length) },
        { label: "Products", value: String(snapshot.products.length) }
      ]}
      steps={[
        {
          title: "Choose the customer",
          description: "Assign the order to the right account before choosing the product."
        },
        {
          title: "Set the due date",
          description: "Mark when the work needs to be finished so planning stays realistic."
        },
        {
          title: "Add the product and quantity",
          description: "The order becomes demand that feeds the purchasing plan."
        }
      ]}
      nextStep="After saving an order, open Purchasing to confirm what materials need to be ordered."
    >
      <OrderStudio snapshot={snapshot} />
    </WorkflowPageShell>
  );
}
