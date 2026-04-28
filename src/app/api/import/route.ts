import { NextResponse } from "next/server";
import { getWorkspaceOwner, importWorkspaceData } from "@/lib/server/workspace";

export async function POST(request: Request) {
  try {
    const ownerId = getWorkspaceOwner();
    const body = await request.json();
    const target = body.target === "orders" ? "orders" : body.target === "products" ? "products" : null;
    const csv = String(body.csv ?? "").trim();

    if (!target) {
      return NextResponse.json({ error: "Import target must be products or orders." }, { status: 400 });
    }

    if (!csv) {
      return NextResponse.json({ error: "CSV payload cannot be empty." }, { status: 400 });
    }

    const result = await importWorkspaceData(ownerId, target, csv);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to import data." }, { status: 400 });
  }
}
