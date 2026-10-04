import { globSync, readFileSync } from "node:fs";

const missing = globSync("{plugins,skills}/*/package.json").filter(
  (manifest) => !JSON.parse(readFileSync(manifest, "utf8")).scripts?.test,
);

if (missing.length > 0) {
  console.error(`Workspace packages without a test script:\n${missing.join("\n")}`);
  process.exit(1);
}
