import { NextResponse } from "next/server";
import { deleteProduct, getWorkspaceOwner, saveProduct } from "@/lib/server/workspace";

function nonEmpty(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  try {
    const ownerId = getWorkspaceOwner();
    const body = await request.json();

    if (body.action === "delete") {
      const productId = nonEmpty(body.productId);
      if (!productId) {
        return NextResponse.json({ error: "Product id is required for delete." }, { status: 400 });
      }

      const result = await deleteProduct(ownerId, productId);
      return NextResponse.json(result);
    }

    const sku = nonEmpty(body.sku);
    const name = nonEmpty(body.name);
    const category = nonEmpty(body.category);
    const unit = nonEmpty(body.unit);
    const yieldQuantity = Number(body.yieldQuantity ?? 0);
    type FormulaInput = { materialName: string; unit: string; quantity: number };
    const formula: FormulaInput[] = Array.isArray(body.formula)
      ? body.formula.map((item: { materialName?: unknown; unit?: unknown; quantity?: unknown }) => ({
          materialName: nonEmpty(item.materialName),
          unit: nonEmpty(item.unit),
          quantity: Number(item.quantity ?? 0)
        }))
      : [];

    if (!sku || !name || !category || !unit) {
      return NextResponse.json(
        { error: "SKU, name, category, and unit are required." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(yieldQuantity) || yieldQuantity <= 0) {
      return NextResponse.json({ error: "Yield quantity must be greater than zero." }, { status: 400 });
    }

    if (!formula.length) {
      return NextResponse.json({ error: "At least one formula line is required." }, { status: 400 });
    }

    if (formula.some((item: FormulaInput) => !item.materialName || !item.unit || !Number.isFinite(item.quantity) || item.quantity <= 0)) {
      return NextResponse.json(
        { error: "Each formula line needs material name, unit, and a quantity greater than zero." },
        { status: 400 }
      );
    }

    const result = await saveProduct(ownerId, {
      id: body.id ? nonEmpty(body.id) : undefined,
      sku,
      name,
      category,
      unit,
      yieldQuantity,
      formula
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save product." }, { status: 400 });
  }
}
