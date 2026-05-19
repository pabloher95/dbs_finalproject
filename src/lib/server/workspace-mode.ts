export const WORKSPACE_MODE_COOKIE = "smallbiz_workspace_mode";

export type WorkspaceMode = "demo" | "live";

export function normalizeWorkspaceMode(value: unknown): WorkspaceMode {
  return value === "live" ? "live" : "demo";
}

export function workspaceBusinessId(ownerId: string, slugify: (value: string) => string, mode: WorkspaceMode) {
  const namespace = slugify(ownerId) || "owner";
  return mode === "live" ? `biz_${namespace}` : `biz_${namespace}_demo`;
}

export function workspaceMemoryKey(ownerId: string, mode: WorkspaceMode) {
  return `${ownerId}::${mode}`;
}
