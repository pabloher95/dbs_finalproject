import { OrderStudio } from "@/components/forms/order-studio";
import { WorkflowPageShell } from "@/components/layout/workflow-page-shell";
import { getRequestLanguage } from "@/lib/i18n-server";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export default async function OrdersPage() {
  const { snapshot } = await getWorkspaceOverview();
  const language = await getRequestLanguage();
  return (
    <WorkflowPageShell
      eyebrow={language === "es" ? "Pedidos" : "Orders"}
      title={language === "es" ? "Registra la demanda y mantén el calendario en movimiento" : "Capture demand and keep the schedule moving"}
      description={
        language === "es"
          ? "Escribe el cliente directamente, registra lo que necesita y deja que la lista de clientes se vaya poblando con la operación."
          : "Type the customer directly, record what they need, and let the customer list populate from live orders."
      }
      metrics={[
        { label: language === "es" ? "Pedidos abiertos" : "Open orders", value: String(snapshot.orders.filter((order) => order.status === "open").length) },
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
          title: language === "es" ? "Define la fecha de entrega" : "Set the due date",
          description:
            language === "es"
              ? "Marca cuándo debe terminarse el trabajo para que la planificación siga siendo realista."
              : "Mark when the work needs to be finished so planning stays realistic."
        },
        {
          title: language === "es" ? "Agrega el producto y la cantidad" : "Add the product and quantity",
          description:
            language === "es"
              ? "El pedido se convierte en demanda que alimenta el plan de compras."
              : "The order becomes demand that feeds the purchasing plan."
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
