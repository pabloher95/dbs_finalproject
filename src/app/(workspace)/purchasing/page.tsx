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
      metrics={[
        { label: language === "es" ? "Materiales registrados" : "Materials tracked", value: String(snapshot.materials.length) },
        {
          label: language === "es" ? "Materiales con stock" : "Stocked materials",
          value: String(snapshot.materials.filter((material) => material.onHandQuantity > 0).length)
        },
        { label: language === "es" ? "Pedidos abiertos" : "Open orders", value: String(snapshot.orders.filter((order) => order.status === "open").length) }
      ]}
      steps={[
        {
          title: language === "es" ? "Revisa las cantidades requeridas" : "Review required quantities",
          description:
            language === "es"
              ? "Comprueba qué materiales están siendo requeridos por los pedidos abiertos."
              : "Check which materials are being pulled in by open orders."
        },
        {
          title: language === "es" ? "Revisa los enlaces de proveedor" : "Check supplier links",
          description:
            language === "es"
              ? "Usa el enlace del proveedor para ver a quién deberías contactar después."
              : "Use the supplier link to see who should hear from you next."
        },
        {
          title: language === "es" ? "Realiza pedidos a proveedores" : "Place supplier orders",
          description:
            language === "es"
              ? "Usa el enlace del proveedor para pasar de la planificación a la compra."
              : "Use the supplier link to move from planning into purchasing."
        }
      ]}
      nextStep={
        language === "es"
          ? "Después de realizar pedidos, vuelve al catálogo o a la página de pedidos si el plan cambia."
          : "After placing orders, return to the catalog or orders page if the plan changes."
      }
    >
      <PurchasingBoard snapshot={snapshot} />
    </WorkflowPageShell>
  );
}
