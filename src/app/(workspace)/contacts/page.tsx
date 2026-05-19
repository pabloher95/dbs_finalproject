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
      guidance={
        language === "es"
          ? "Ten clientes y proveedores listos para que el siguiente pedido no se frene."
          : "Keep customers and suppliers ready so the next order never stalls."
      }
      metrics={[
        { label: language === "es" ? "Clientes" : "Customers", value: String(snapshot.clients.length), href: "/contacts" },
        { label: language === "es" ? "Proveedores" : "Suppliers", value: String(snapshot.suppliers.length), href: "/contacts" },
        { label: language === "es" ? "Pedidos abiertos" : "Open orders", value: String(snapshot.orders.filter(o => o.status === "open").length), href: "/orders" }
      ]}
      tips={[
        {
          label: language === "es" ? "Cliente" : "Customer",
          description:
            language === "es"
              ? "Guárdalo antes de tomar pedidos para que el flujo siga limpio."
              : "Save it before taking orders so the flow stays clean."
        },
        {
          label: language === "es" ? "Proveedor" : "Supplier",
          description:
            language === "es"
              ? "Deja listo el destino de compras para no improvisar después."
              : "Set the purchasing destination before you need it."
        },
        {
          label: language === "es" ? "Lista" : "List",
          description:
            language === "es"
              ? "Vuelve aquí cuando necesites asignar un trabajo o emitir un pedido."
              : "Come back here when you need to assign work or place an order."
        }
      ]}
    >
      <ContactStudio clients={snapshot.clients} suppliers={snapshot.suppliers} orders={snapshot.orders} />
    </WorkflowPageShell>
  );
}
