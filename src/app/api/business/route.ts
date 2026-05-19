import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/server/route-error-response";
import { getWorkspaceOverview, renameBusiness, restoreDemoWorkspace } from "@/lib/server/workspace";
import { normalizeWorkspaceMode, WORKSPACE_MODE_COOKIE } from "@/lib/server/workspace-mode";

function nonEmpty(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (body.action === "set-workspace-mode") {
      const workspaceMode = normalizeWorkspaceMode(body.workspaceMode);
      const result = await getWorkspaceOverview(userId, workspaceMode);
      const cookieStore = await cookies();
      cookieStore.set(WORKSPACE_MODE_COOKIE, workspaceMode, {
        httpOnly: false,
        sameSite: "lax",
        path: "/"
      });
      return NextResponse.json(result);
    }

    if (body.action === "restore-demo") {
      const result = await restoreDemoWorkspace(userId);
      return NextResponse.json(result);
    }

    const name = nonEmpty(body.name);

    if (!name) {
      return NextResponse.json({ error: "Business name is required." }, { status: 400 });
    }

    const result = await renameBusiness(userId, name);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error, {
      fallback: "Unable to update business name.",
      logContext: "POST /api/business"
    });
  }
}
