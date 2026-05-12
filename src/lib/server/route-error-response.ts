import { NextResponse } from "next/server";
import { isUserFacingError } from "@/lib/user-facing-error.js";

type RouteErrorOptions = {
  fallback: string;
  logContext: string;
};

/**
 * Maps unknown errors to a JSON response: safe messages for {@link UserFacingError},
 * generic fallback for anything else (details only in server logs).
 */
export function toErrorResponse(error: unknown, { fallback, logContext }: RouteErrorOptions): NextResponse {
  if (isUserFacingError(error)) {
    const userFacingError = error as { message: string; status: number };
    return NextResponse.json({ error: userFacingError.message }, { status: userFacingError.status });
  }

  if (error instanceof SyntaxError) {
    console.warn(`[api:${logContext}]`, error);
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  console.error(`[api:${logContext}]`, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}
