import { NextResponse } from "next/server";
import { deleteProduct, getWorkspaceOwner, saveProduct } from "@/lib/server/workspace";

export async function POST(request: Request) {
  try {
    const ownerId = getWorkspaceOwner();
    const body = await request.json();

    if (body.action === "delete") {
      const result = await deleteProduct(ownerId, String(body.productId));
      return NextResponse.json(result);
    }

    const result = await saveProduct(ownerId, {
      id: body.id ? String(body.id) : undefined,
      sku: String(body.sku ?? ""),
      name: String(body.name ?? ""),
      category: String(body.category ?? ""),
      unit: String(body.unit ?? ""),
      yieldQuantity: Number(body.yieldQuantity ?? 0),
      formula: Array.isArray(body.formula)
        ? body.formula.map((item: { materialName: string; unit: string; quantity: number }) => ({
            materialName: String(item.materialName ?? ""),
            unit: String(item.unit ?? ""),
            quantity: Number(item.quantity ?? 0)
          }))
        : []
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save product." }, { status: 400 });
  }
}
