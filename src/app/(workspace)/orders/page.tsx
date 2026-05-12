import { OrderStudio } from "@/components/forms/order-studio";
import { WorkflowPageShell } from "@/components/layout/workflow-page-shell";
import { getRequestLanguage } from "@/lib/i18n-server";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export default async function OrdersPage() {
  const { snapshot } = await getWorkspaceOverview();
  const language = await getRequestLanguage();
  const backlogCount = snapshot.orders.filter(
    (order) => order.status === "open" && order.dueDate < new Date().toISOString().slice(0, 10)
  ).length;
  return (
    <WorkflowPageShell
      eyebrow={language === "es" ? "Pedidos" : "Orders"}
      title={
        language === "es"
          ? "Registra la demanda, cumple los pedidos y resalta la cola"
          : "Capture demand, fulfill orders, and highlight the backlog"
      }
      description={
        language === "es"
          ? "Escribe el cliente directamente, registra lo que necesita, marca lo cumplido y deja que solo los pedidos pasados se destaquen."
          : "Type the customer directly, record what they need, mark work as fulfilled, and let only past-due orders stand out."
      }
      metrics={[
        { label: language === "es" ? "Pedidos abiertos" : "Open orders", value: String(snapshot.orders.filter((order) => order.status === "open").length) },
        { label: language === "es" ? "En cola" : "Backlog", value: String(backlogCount) },
        { label: language === "es" ? "Clientes" : "Customers", value: String(snapshot.clients.length) },
        { label: language === "es" ? "Productos" : "Products", value: String(snapshot.products.length) }
      ]}
      steps={[
        {
          title: language === "es" ? "Escribe el cliente" : "Type the customer",
          description:
            language === "es"
              ? "Si todavía no existe, el cliente se crea al guardar el pedido."
              : "If it does not exist yet, the customer is created when you save the order."
        },
        {
          title: language === "es" ? "Agrega los productos y la fecha" : "Add products and the due date",
          description:
            language === "es"
              ? "Cada línea cuenta para el pedido y se suma a la demanda que verá Compras."
              : "Each line adds to the order and feeds the demand Purchasing will see."
        },
        {
          title: language === "es" ? "Marca lo cumplido" : "Mark it fulfilled",
          description:
            language === "es"
              ? "Usa el botón de cumplido cuando el pedido salga o se entregue."
              : "Use the fulfilled button when the order ships or is delivered."
        }
      ]}
      nextStep={
        language === "es"
          ? "Después de guardar un pedido, abre Compras para confirmar qué materiales deben pedirse."
          : "After saving an order, open Purchasing to confirm what materials need to be ordered."
      }
    >
      <OrderStudio snapshot={snapshot} />
    </WorkflowPageShell>
  );
}
