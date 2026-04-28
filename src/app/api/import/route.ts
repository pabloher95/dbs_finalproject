import { NextResponse } from "next/server";
import { getWorkspaceOwner, importWorkspaceData } from "@/lib/server/workspace";

export async function POST(request: Request) {
  try {
    const ownerId = getWorkspaceOwner();
    const body = await request.json();
    const result = await importWorkspaceData(ownerId, body.target === "orders" ? "orders" : "products", String(body.csv ?? ""));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to import data." }, { status: 400 });
  }
}
