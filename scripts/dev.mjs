import { existsSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const nextBin = path.resolve(scriptDir, "../node_modules/next/dist/bin/next");
const host = process.env.HOST?.trim() || "localhost";
const port = process.env.PORT?.trim() || "3000";
const nodeOptions = process.env.NODE_OPTIONS?.trim() || "";
const dnsFlag = "--dns-result-order=ipv4first";

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

const child = spawn(nodeBin, [nextBin, "dev", "-H", host, "-p", port], {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_OPTIONS: nodeOptions.includes(dnsFlag) ? nodeOptions : `${dnsFlag} ${nodeOptions}`.trim(),
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
