import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, sep } from "node:path";
import { test } from "node:test";

async function installedSkill() {
  const scratch = await mkdtemp(join(tmpdir(), "prove-it-install-"));
  try {
    const installed = join(scratch, ".agents/skills/prove-it");
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
  assert.match(skill, /^---\nname: prove-it\n/);
  assert.deepEqual([...skill.matchAll(/\]\(([^)]+)\)/g)], []);
});
