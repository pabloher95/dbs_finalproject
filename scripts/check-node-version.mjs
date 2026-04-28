const [major] = process.versions.node.split(".").map(Number);

if (major !== 22) {
  console.error(
    `Node ${process.versions.node} is not supported here. Use Node 22.x before running dev, build, or start.`
  );
  process.exit(1);
}
