import { NextResponse } from "next/server";
import { deleteOrder, getWorkspaceOwner, saveOrder } from "@/lib/server/workspace";
import type { Order } from "@/lib/domain/types";

function nonEmpty(value: unknown) {
  return String(value ?? "").trim();
}

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

export async function POST(request: Request) {
  try {
    const ownerId = getWorkspaceOwner();
    const body = await request.json();

    if (body.action === "delete") {
      const orderId = nonEmpty(body.orderId);
      if (!orderId) {
        return NextResponse.json({ error: "Order id is required for delete." }, { status: 400 });
      }

      const result = await deleteOrder(ownerId, orderId);
      return NextResponse.json(result);
    }

    const orderNumber = nonEmpty(body.orderNumber);
    const clientId = nonEmpty(body.clientId);
    const productId = nonEmpty(body.productId);
    const dueDate = nonEmpty(body.dueDate);
    const status =
      body.status === "draft" || body.status === "fulfilled" || body.status === "open"
        ? (body.status as Order["status"])
        : null;
    const quantity = Number(body.quantity ?? 0);

    if (!orderNumber || !clientId || !productId || !dueDate) {
      return NextResponse.json(
        { error: "Order number, client, product, and due date are required." },
        { status: 400 }
      );
    }

    if (!isValidDate(dueDate)) {
      return NextResponse.json({ error: "Due date must be a valid date (YYYY-MM-DD)." }, { status: 400 });
    }

    if (!status) {
      return NextResponse.json({ error: "Status must be draft, open, or fulfilled." }, { status: 400 });
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "Quantity must be greater than zero." }, { status: 400 });
    }

    const result = await saveOrder(ownerId, {
      id: body.id ? nonEmpty(body.id) : undefined,
      orderNumber,
      clientId,
      productId,
      dueDate,
      status,
      quantity
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save order." }, { status: 400 });
  }
}
