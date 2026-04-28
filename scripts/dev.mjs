import { existsSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const nextBin = path.resolve(scriptDir, "../node_modules/next/dist/bin/next");

function nodeMajor(nodePath) {
  const result = spawnSync(nodePath, ["-p", "process.versions.node"], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    return null;
  }

  const version = result.stdout.trim();
  const [major] = version.split(".");
  return Number(major);
}

function candidateNodes() {
  const candidates = [
    process.env.NODE_22_BIN,
    "/opt/homebrew/opt/node@22/bin/node",
    "/usr/local/opt/node@22/bin/node",
    process.execPath,
  ].filter(Boolean);

  const seen = new Set();
  return candidates.filter((candidate) => {
    if (seen.has(candidate)) {
      return false;
    }
    seen.add(candidate);
    return existsSync(candidate);
  });
}

function resolveNode() {
  for (const candidate of candidateNodes()) {
    const major = nodeMajor(candidate);
    if (major === 22) {
      return candidate;
    }
  }

  return null;
}

const nodeBin = resolveNode();

if (!nodeBin) {
  console.error(
    "Unable to find a Node 22 runtime. Install node@22 or set NODE_22_BIN to the Node 22 binary, then rerun npm run dev."
  );
  process.exit(1);
}

const child = spawn(nodeBin, [nextBin, "dev", "-H", "127.0.0.1"], {
  stdio: "inherit",
  env: {
    ...process.env,
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
