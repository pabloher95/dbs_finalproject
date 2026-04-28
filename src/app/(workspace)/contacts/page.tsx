import { ContactStudio } from "@/components/forms/contact-studio";
import { WorkflowPageShell } from "@/components/layout/workflow-page-shell";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export default async function ContactsPage() {
  const { snapshot } = await getWorkspaceOverview();
  return (
    <WorkflowPageShell
      eyebrow="Contacts"
      title="Keep customers and suppliers close to the work"
      description="Add the people and companies your team depends on so order intake and purchasing stay fast and consistent."
      metrics={[
        { label: "Customers", value: String(snapshot.clients.length) },
        { label: "Suppliers", value: String(snapshot.suppliers.length) },
        { label: "Primary action", value: "Save records" }
      ]}
      steps={[
        {
          title: "Add a customer",
          description: "Keep the customer record ready before taking orders."
        },
        {
          title: "Add a supplier",
          description: "Store preferred sourcing details so purchasing has somewhere to go."
        },
        {
          title: "Review contact list",
          description: "Check the saved list when you need to assign a job or place an order."
        }
      ]}
      nextStep="After adding a customer, create an order so the schedule and purchasing plan stay aligned."
    >
      <ContactStudio clients={snapshot.clients} suppliers={snapshot.suppliers} />
    </WorkflowPageShell>
  );
}
