import { NextResponse } from "next/server";
import { deleteContact, getWorkspaceOwner, saveContact } from "@/lib/server/workspace";

export async function POST(request: Request) {
  try {
    const ownerId = getWorkspaceOwner();
    const body = await request.json();

    if (body.action === "delete") {
      const result = await deleteContact(ownerId, {
        kind: String(body.kind) === "supplier" ? "supplier" : "client",
        id: String(body.id)
      });
      return NextResponse.json(result);
    }

    const result = await saveContact(ownerId, {
      id: body.id ? String(body.id) : undefined,
      name: String(body.name ?? ""),
      email: String(body.email ?? ""),
      category: String(body.category ?? body.channel ?? ""),
      kind: String(body.kind) === "supplier" ? "supplier" : "client"
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save contact." }, { status: 400 });
  }
}
