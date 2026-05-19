import { ContactStudio } from "@/components/forms/contact-studio";
import { WorkflowPageShell } from "@/components/layout/workflow-page-shell";
import { getRequestLanguage } from "@/lib/i18n-server";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export default async function ContactsPage() {
  const { snapshot } = await getWorkspaceOverview();
  const language = await getRequestLanguage();
  return (
    <WorkflowPageShell
      eyebrow={language === "es" ? "Contactos" : "Contacts"}
      title={language === "es" ? "Mantén cerca a clientes y proveedores" : "Keep customers and suppliers close to the work"}
      description={
        language === "es"
          ? "Agrega las personas y empresas de las que depende tu equipo para que la ingesta de pedidos y las compras sigan siendo rápidas y consistentes."
          : "Add the people and companies your team depends on so order intake and purchasing stay fast and consistent."
      }
      metrics={[
        { label: language === "es" ? "Clientes" : "Customers", value: String(snapshot.clients.length), href: "/contacts" },
        { label: language === "es" ? "Proveedores" : "Suppliers", value: String(snapshot.suppliers.length), href: "/contacts" },
        { label: language === "es" ? "Pedidos abiertos" : "Open orders", value: String(snapshot.orders.filter(o => o.status === "open").length), href: "/orders" }
      ]}
      steps={[
        {
          title: language === "es" ? "Agrega un cliente" : "Add a customer",
          description:
            language === "es"
              ? "Mantén el registro del cliente listo antes de tomar pedidos."
              : "Keep the customer record ready before taking orders."
        },
        {
          title: language === "es" ? "Agrega un proveedor" : "Add a supplier",
          description:
            language === "es"
              ? "Guarda los detalles de abastecimiento preferidos para que Compras tenga un destino."
              : "Store preferred sourcing details so purchasing has somewhere to go."
        },
        {
          title: language === "es" ? "Revisa la lista de contactos" : "Review contact list",
          description:
            language === "es"
              ? "Consulta la lista guardada cuando necesites asignar un trabajo o hacer un pedido."
              : "Check the saved list when you need to assign a job or place an order."
        }
      ]}
    >
      <ContactStudio clients={snapshot.clients} suppliers={snapshot.suppliers} orders={snapshot.orders} />
    </WorkflowPageShell>
  );
}
