import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/server/route-error-response";
import { saveProduct } from "@/lib/server/workspace";

function nonEmpty(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerId = userId;
    const body = await request.json();
    if (body.target !== "products") {
      return NextResponse.json({ error: "Intake target must be products." }, { status: 400 });
    }

    if (!body.draft || typeof body.draft !== "object") {
      return NextResponse.json({ error: "Product draft is required." }, { status: 400 });
    }

    const sku = nonEmpty(body.draft.sku);
    const name = nonEmpty(body.draft.name);
    const category = nonEmpty(body.draft.category);
    const unit = nonEmpty(body.draft.unit);
    const unitPrice = Number(body.draft.unitPrice ?? 0);
    const formula = Array.isArray(body.draft.formula) ? body.draft.formula : [];
    const resolvedFormula: Array<{ materialName: string; unit: string; quantity: number }> = formula
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
  } catch (error) {
    return toErrorResponse(error, { fallback: "Unable to import data.", logContext: "POST /api/import" });
  }
}
