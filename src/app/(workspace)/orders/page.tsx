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
      title={
        language === "es"
          ? "Registra la demanda, cumple los pedidos y resalta la cola"
          : "Capture demand, fulfill orders, and highlight the backlog"
      }
      description={
        language === "es"
          ? "Escribe el cliente directamente, registra lo que necesita, marca lo cumplido y deja que el estado del pedido te diga qué viene después."
          : "Type the customer directly, record what they need, mark work as fulfilled, and let order status tell you what comes next."
      }
      guidance={
        language === "es"
          ? "Captura la demanda una vez, sigue su estado y deja visible la cola."
          : "Capture demand once, track its status, and keep the backlog visible."
      }
      tips={[
        {
          label: language === "es" ? "Cliente" : "Customer",
          description:
            language === "es"
              ? "Si no existe aún, se crea al guardar el pedido."
              : "If it does not exist yet, it is created when you save the order."
        },
        {
          label: language === "es" ? "Fecha" : "Due date",
          description:
            language === "es"
              ? "La fecha de vencimiento ayuda a ordenar el trabajo pendiente."
              : "The due date helps sort the work that is waiting."
        },
        {
          label: language === "es" ? "Cumplir" : "Fulfill",
          description:
            language === "es"
              ? "Marca el pedido cuando salga o se entregue."
              : "Mark the order when it ships or is delivered."
        }
      ]}
    >
      <OrderStudio snapshot={snapshot} />
    </WorkflowPageShell>
  );
}
