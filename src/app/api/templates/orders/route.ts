import { NextResponse } from "next/server";
import { orderTemplateCsv } from "@/lib/import/templates";

export async function GET() {
  return new NextResponse(orderTemplateCsv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="orders-v1.csv"'
    }
  });
}
