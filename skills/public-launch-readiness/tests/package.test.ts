import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdtemp, readFile, realpath, rm, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

async function consumeInstalledSkill(directory: string) {
  const skill = await readFile(join(directory, "SKILL.md"), "utf8");
  const frontmatter = Object.fromEntries(
    skill
      .split("---")[1]!
      .trim()
      .split("\n")
      .map((line) => {
        const colon = line.indexOf(":");
        return [line.slice(0, colon), line.slice(colon + 1).trim()];
      }),
  );
  const resources = new Map<string, string>();
  for (const match of skill.matchAll(/\]\(([^)]+)\)/g)) {
    const path = await realpath(resolve(directory, match[1]!));
    assert.ok(path.startsWith(`${await realpath(directory)}${sep}`), "resource escapes installed package");
    resources.set(match[1]!, await readFile(path, "utf8"));
  }
  return { frontmatter, resources };
}

test("a copied package resolves its entrypoint and resources in a fresh agent home", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "launch-install-"));
  try {
    const installed = join(scratch, ".agents/skills/public-launch-readiness");
    await cp(new URL("../", import.meta.url), installed, {
      recursive: true,
      filter: (path) => !path.split(sep).includes("node_modules"),
    });
    const { frontmatter, resources } = await consumeInstalledSkill(installed);
    assert.equal(frontmatter.name, "public-launch-readiness");
    assert.ok(frontmatter.description);
    assert.deepEqual([...resources.keys()].sort(), ["assets/report.md", "references/privacy-audit.md"]);

    // The installed entrypoint's real resource consumer must reject a broken package.
    await unlink(join(installed, "references/privacy-audit.md"));
    await assert.rejects(consumeInstalledSkill(installed), { code: "ENOENT" });
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("the report template exposes the owner-approved evidence row as an output contract", async () => {
  const template = await readFile(new URL("../assets/report.md", import.meta.url), "utf8");
  const table = template.split("\n").find((line) => line.split("|")[1]?.trim() === "Check");
  assert.ok(table);
  const columns = table
    .split("|")
    .slice(1, -1)
    .map((column) => column.trim());
  assert.deepEqual(columns, [
    "Check",
    "Status and reason (PASS / FAIL / UNVERIFIED / N/A)",
    "Commit or artifact",
    "File:line or command and result",
    "Blocker or optional",
    "Next action and owner",
  ]);
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
