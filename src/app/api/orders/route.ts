import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/server/route-error-response";
import { deleteOrder, saveOrder } from "@/lib/server/workspace";
import type { Order } from "@/lib/domain/types";

function nonEmpty(value: unknown) {
  return String(value ?? "").trim();
}

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerId = userId;
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
    const clientName = nonEmpty(body.clientName);
    const dueDate = nonEmpty(body.dueDate);
    const status =
      body.status === "draft" || body.status === "fulfilled" || body.status === "open"
        ? (body.status as Order["status"])
        : null;
    const items = Array.isArray(body.items)
      ? body.items.map((item: { productId?: unknown; quantity?: unknown }) => ({
          productId: nonEmpty(item.productId),
          quantity: Number(item.quantity ?? 0)
        }))
      : [];
    const fallbackProductId = nonEmpty(body.productId);
    const fallbackQuantity = Number(body.quantity ?? 0);

    if (!orderNumber || (!clientId && !clientName) || !dueDate) {
      return NextResponse.json({ error: "Order number, customer, and due date are required." }, { status: 400 });
    }

    if (!isValidDate(dueDate)) {
      return NextResponse.json({ error: "Due date must be a valid date (YYYY-MM-DD)." }, { status: 400 });
    }

    if (!status) {
      return NextResponse.json({ error: "Status must be draft, open, or fulfilled." }, { status: 400 });
    }

    const normalizedItems =
      items.length > 0
        ? items
        : fallbackProductId
          ? [{ productId: fallbackProductId, quantity: fallbackQuantity }]
          : [];

    if (!normalizedItems.length) {
      return NextResponse.json({ error: "At least one order line is required." }, { status: 400 });
    }

    if (normalizedItems.some((item) => !item.productId || !Number.isFinite(item.quantity) || item.quantity <= 0)) {
      return NextResponse.json(
        { error: "Each order line needs a product and a quantity greater than zero." },
        { status: 400 }
      );
    }

    const result = await saveOrder(ownerId, {
      id: body.id ? nonEmpty(body.id) : undefined,
      orderNumber,
      clientId: clientId || undefined,
      clientName: clientName || undefined,
      dueDate,
      status,
      items: normalizedItems
    });

    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error, { fallback: "Unable to save order.", logContext: "POST /api/orders" });
  }
}
