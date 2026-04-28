import { NextResponse } from "next/server";
import { deleteOrder, getWorkspaceOwner, saveOrder } from "@/lib/server/workspace";
import type { Order } from "@/lib/domain/types";

export async function POST(request: Request) {
  try {
    const ownerId = getWorkspaceOwner();
    const body = await request.json();

    if (body.action === "delete") {
      const result = await deleteOrder(ownerId, String(body.orderId));
      return NextResponse.json(result);
    }

    const result = await saveOrder(ownerId, {
      id: body.id ? String(body.id) : undefined,
      orderNumber: String(body.orderNumber ?? ""),
      clientId: String(body.clientId ?? ""),
      productId: String(body.productId ?? ""),
      dueDate: String(body.dueDate ?? ""),
      status:
        body.status === "draft" || body.status === "fulfilled" ? (body.status as Order["status"]) : "open",
      quantity: Number(body.quantity ?? 0)
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save order." }, { status: 400 });
  }
}
