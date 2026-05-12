import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/server/route-error-response";
import { importWorkspaceData, saveIntakeOrder, saveProduct } from "@/lib/server/workspace";

function nonEmpty(value: unknown) {
  return String(value ?? "").trim();
}

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerId = userId;
    const body = await request.json();
    const target = body.target === "orders" ? "orders" : body.target === "products" ? "products" : null;

    if (!target) {
      return NextResponse.json({ error: "Intake target must be products or orders." }, { status: 400 });
    }

    if (body.draft && typeof body.draft === "object") {
      if (target === "products") {
        const sku = nonEmpty(body.draft.sku);
        const name = nonEmpty(body.draft.name);
        const category = nonEmpty(body.draft.category);
        const unit = nonEmpty(body.draft.unit);
        const unitPrice = Number(body.draft.unitPrice ?? 0);
        const formula = Array.isArray(body.draft.formula) ? body.draft.formula : [];
        const resolvedFormula = formula
          .map((row: { materialName?: unknown; unit?: unknown; quantity?: unknown }) => ({
            materialName: nonEmpty(row.materialName),
            unit: nonEmpty(row.unit),
            quantity: Number(row.quantity)
          }))
          .filter((row: { materialName: string; unit: string; quantity: number }) =>
            row.materialName && row.unit && Number.isFinite(row.quantity) && row.quantity > 0
          );

        if (!sku || !name || !category || !unit) {
          return NextResponse.json({ error: "SKU, name, category, and unit are required." }, { status: 400 });
        }
        if (!Number.isFinite(unitPrice) || unitPrice < 0) {
          return NextResponse.json({ error: "Unit price must be a valid non-negative number." }, { status: 400 });
        }
        if (!resolvedFormula.length) {
          return NextResponse.json({ error: "At least one formula line is required." }, { status: 400 });
        }
        if (resolvedFormula.some((item) => !item.materialName || !item.unit || !Number.isFinite(item.quantity) || item.quantity <= 0)) {
          return NextResponse.json(
            { error: "Each formula line needs material name, unit, and a quantity greater than zero." },
            { status: 400 }
          );
        }

        const result = await saveProduct(ownerId, {
          id: body.draft.id ? nonEmpty(body.draft.id) : undefined,
          sku,
          name,
          category,
          unit,
          yieldQuantity: 1,
          unitPrice,
          formula: resolvedFormula
        });
        return NextResponse.json(result);
      }

      const orderNumber = nonEmpty(body.draft.orderNumber);
      const clientName = nonEmpty(body.draft.clientName);
      const productId = nonEmpty(body.draft.productId);
      const dueDate = nonEmpty(body.draft.dueDate);
      const status =
        body.draft.status === "draft" || body.draft.status === "fulfilled" ? body.draft.status : body.draft.status === "open" ? "open" : null;
      const quantity = Number(body.draft.quantity ?? 0);

      if (!orderNumber || !clientName || !productId || !dueDate) {
        return NextResponse.json(
          { error: "Order number, client, product, and due date are required." },
          { status: 400 }
        );
      }

      if (!isValidDate(dueDate)) {
        return NextResponse.json({ error: "Due date must be a valid date (YYYY-MM-DD)." }, { status: 400 });
      }

      if (!status) {
        return NextResponse.json({ error: "Status must be draft, open, or fulfilled." }, { status: 400 });
      }

      if (!Number.isFinite(quantity) || quantity <= 0) {
        return NextResponse.json({ error: "Quantity must be greater than zero." }, { status: 400 });
      }

      const result = await saveIntakeOrder(ownerId, {
        id: body.draft.id ? nonEmpty(body.draft.id) : undefined,
        orderNumber,
        clientName,
        dueDate,
        status,
        productId,
        productSku: body.draft.productSku ? nonEmpty(body.draft.productSku) : undefined,
        quantity
      });
      return NextResponse.json(result);
    }

    const csv = String(body.csv ?? "").trim();
    if (!csv) {
      return NextResponse.json({ error: "Intake payload cannot be empty." }, { status: 400 });
    }

    const result = await importWorkspaceData(ownerId, target, csv);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error, { fallback: "Unable to import data.", logContext: "POST /api/import" });
  }
}
