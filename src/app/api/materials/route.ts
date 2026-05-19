import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/server/route-error-response";
import { receiveMaterial } from "@/lib/server/workspace";

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

    if (!materialId) {
      return NextResponse.json({ error: "Material id is required." }, { status: 400 });
    }

    if (action === "receive") {
      const quantity = Number(body.quantity ?? 0);
      const unitCost = Number(body.unitCost ?? 0);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        return NextResponse.json({ error: "Quantity must be a positive number." }, { status: 400 });
      }
      if (!Number.isFinite(unitCost) || unitCost < 0) {
        return NextResponse.json({ error: "Unit cost must be a valid non-negative number." }, { status: 400 });
      }
      const result = await receiveMaterial(ownerId, { materialId, quantity, unitCost });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return toErrorResponse(error, {
      fallback: "Unable to update material stock.",
      logContext: "POST /api/materials"
    });
  }
}
