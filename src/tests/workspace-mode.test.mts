import test from "node:test";
import assert from "node:assert/strict";

import { normalizeWorkspaceMode, workspaceBusinessId, workspaceMemoryKey } from "../lib/server/workspace-mode.ts";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "_")
    .replaceAll(/^_+|_+$/g, "");
}

test("workspace mode defaults safely to demo", () => {
  assert.equal(normalizeWorkspaceMode("demo"), "demo");
  assert.equal(normalizeWorkspaceMode("live"), "live");
  assert.equal(normalizeWorkspaceMode("unexpected"), "demo");
  assert.equal(normalizeWorkspaceMode(undefined), "demo");
});

test("workspace identifiers stay isolated per mode", () => {
  assert.equal(workspaceBusinessId("user_123", slugify, "live"), "biz_user_123");
  assert.equal(workspaceBusinessId("user_123", slugify, "demo"), "biz_user_123_demo");
  assert.equal(workspaceMemoryKey("user_123", "live"), "user_123::live");
  assert.equal(workspaceMemoryKey("user_123", "demo"), "user_123::demo");
});
