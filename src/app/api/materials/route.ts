import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/server/route-error-response";
import { adjustMaterialStock, updateMaterialCost } from "@/lib/server/workspace";

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
    const action = String(body.action ?? "adjust");
    const materialId = nonEmpty(body.materialId);
    const delta = Number(body.delta ?? 0);
    const unitCost = Number(body.unitCost ?? 0);

    if (!materialId) {
      return NextResponse.json({ error: "Material id is required." }, { status: 400 });
    }

    if (action === "cost") {
      if (!Number.isFinite(unitCost) || unitCost < 0) {
        return NextResponse.json({ error: "Unit cost must be a valid non-negative number." }, { status: 400 });
      }
      const result = await updateMaterialCost(ownerId, { materialId, unitCost });
      return NextResponse.json(result);
    }

    if (!Number.isFinite(delta) || delta === 0) {
      return NextResponse.json({ error: "Stock adjustment must be a non-zero number." }, { status: 400 });
    }

    const result = await adjustMaterialStock(ownerId, { materialId, delta });
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error, {
      fallback: "Unable to update material stock.",
      logContext: "POST /api/materials"
    });
  }
}
