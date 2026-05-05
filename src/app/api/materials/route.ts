import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { adjustMaterialStock } from "@/lib/server/workspace";

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
    const materialId = nonEmpty(body.materialId);
    const delta = Number(body.delta ?? 0);

    if (!materialId) {
      return NextResponse.json({ error: "Material id is required." }, { status: 400 });
    }

    if (!Number.isFinite(delta) || delta === 0) {
      return NextResponse.json({ error: "Stock adjustment must be a non-zero number." }, { status: 400 });
    }

    const result = await adjustMaterialStock(ownerId, { materialId, delta });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update material stock." },
      { status: 400 }
    );
  }
}
