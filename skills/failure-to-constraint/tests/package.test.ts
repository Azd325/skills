import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdtemp, readFile, realpath, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

async function consumeInstalledSkill(directory: string) {
  const text = await readFile(join(directory, "SKILL.md"), "utf8");
  const resources = new Map<string, string>();
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    const path = await realpath(resolve(directory, match[1]!));
    assert.ok(path.startsWith(`${await realpath(directory)}${sep}`), "resource escapes installed package");
    resources.set(match[1]!, await readFile(path, "utf8"));
  }
  return { text, resources };
}

test("a copied package resolves its entrypoint and resources in a fresh agent home", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "failure-to-constraint-install-"));
  try {
    const installed = join(scratch, ".agents/skills/failure-to-constraint");
    await cp(new URL("../", import.meta.url), installed, {
      recursive: true,
      filter: (path) => !path.split(sep).includes("node_modules"),
    });
    const { resources, text } = await consumeInstalledSkill(installed);
    assert.match(text, /^---\nname: failure-to-constraint\n/);
    assert.deepEqual([...resources.keys()], []);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("development evaluation refuses to write run evidence inside the repository", () => {
  const result = spawnSync(
    process.execPath,
    [
      fileURLToPath(new URL("./evaluate.ts", import.meta.url)),
      fileURLToPath(new URL("../", import.meta.url)),
      "a-model-runner-that-must-never-be-invoked",
    ],
    { encoding: "utf8" },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Evaluation output must be outside the repository/);
});
