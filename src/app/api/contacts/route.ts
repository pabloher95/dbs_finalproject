import { NextResponse } from "next/server";
import { deleteContact, getWorkspaceOwner, saveContact } from "@/lib/server/workspace";

function nonEmpty(value: unknown) {
  return String(value ?? "").trim();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const ownerId = getWorkspaceOwner();
    const body = await request.json();
    const kind = String(body.kind) === "supplier" ? "supplier" : "client";

    if (body.action === "delete") {
      const id = nonEmpty(body.id);
      if (!id) {
        return NextResponse.json({ error: "Contact id is required for delete." }, { status: 400 });
      }

      const result = await deleteContact(ownerId, {
        kind,
        id
      });
      return NextResponse.json(result);
    }

    const name = nonEmpty(body.name);
    const email = nonEmpty(body.email);
    const category = nonEmpty(body.category ?? body.channel);

    if (!name || !email || !category) {
      return NextResponse.json(
        { error: "Name, email, and category/channel are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const result = await saveContact(ownerId, {
      id: body.id ? nonEmpty(body.id) : undefined,
      name,
      email,
      category,
      kind
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save contact." }, { status: 400 });
  }
}
