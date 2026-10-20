import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, sep } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

async function installedSkill() {
  const scratch = await mkdtemp(join(tmpdir(), "frame-task-install-"));
  try {
    const installed = join(scratch, ".agents/skills/frame-task");
    await cp(new URL("../", import.meta.url), installed, {
      recursive: true,
      filter: (path) => !path.split(sep).includes("node_modules"),
    });
    return await readFile(join(installed, "SKILL.md"), "utf8");
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
}

test("a copied package resolves its entrypoint in a fresh agent home", async () => {
  const skill = await installedSkill();
  assert.match(skill, /^---\nname: frame-task\n/);
  assert.deepEqual([...skill.matchAll(/\]\(([^)]+)\)/g)], []);
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
