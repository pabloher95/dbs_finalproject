import { PurchasingBoard } from "@/components/layout/purchasing-board";
import { WorkflowPageShell } from "@/components/layout/workflow-page-shell";
import { getRequestLanguage } from "@/lib/i18n-server";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export default async function PurchasingPage() {
  const { snapshot } = await getWorkspaceOverview();
  const language = await getRequestLanguage();
  return (
    <WorkflowPageShell
      eyebrow={language === "es" ? "Compras" : "Purchasing"}
      title={language === "es" ? "Convierte la demanda abierta en una corrida de compras" : "Turn open demand into a purchasing run"}
      description={
        language === "es"
          ? "Revisa la cantidad total necesaria para cada material, resta lo que ya tienes en mano y prepara tu siguiente corrida de compras."
          : "Review the total quantity needed for each material, subtract what is already on hand, and prepare your next purchasing run."
      }
      guidance={
        language === "es"
          ? "Mira lo requerido, sigue al proveedor correcto y convierte la lista en compra."
          : "Check what is required, follow the right supplier, and turn the list into an order."
      }
      metrics={[
        { label: language === "es" ? "Materiales registrados" : "Materials tracked", value: String(snapshot.materials.length) },
        {
          label: language === "es" ? "Materiales con stock" : "Stocked materials",
          value: String(snapshot.materials.filter((material) => material.onHandQuantity > 0).length)
        },
        { label: language === "es" ? "Pedidos abiertos" : "Open orders", value: String(snapshot.orders.filter((order) => order.status === "open").length) }
      ]}
      tips={[
        {
          label: language === "es" ? "Cantidad" : "Quantity",
          description:
            language === "es"
              ? "Comprueba qué materiales están siendo arrastrados por pedidos abiertos."
              : "Check which materials are being pulled in by open orders."
        },
        {
          label: language === "es" ? "Proveedor" : "Supplier",
          description:
            language === "es"
              ? "Abre el enlace para saber a quién contactar después."
              : "Open the link to see who should hear from you next."
        },
        {
          label: language === "es" ? "Pedido" : "Order",
          description:
            language === "es"
              ? "Pasa de la planificación a la compra sin salir de la vista."
              : "Move from planning into purchasing without leaving the view."
        }
      ]}
    >
      <PurchasingBoard snapshot={snapshot} />
    </WorkflowPageShell>
  );
}
