import { NextResponse } from "next/server";
import { productTemplateCsv } from "@/lib/import/templates";

export async function GET() {
  return new NextResponse(productTemplateCsv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="products-formulas-v1.csv"'
    }
  });
}
