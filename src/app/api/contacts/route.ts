import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/server/route-error-response";
import { deleteContact, saveContact } from "@/lib/server/workspace";

function nonEmpty(value: unknown) {
  return String(value ?? "").trim();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerId = userId;
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
    return toErrorResponse(error, { fallback: "Unable to save contact.", logContext: "POST /api/contacts" });
  }
}
