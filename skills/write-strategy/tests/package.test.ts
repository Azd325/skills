import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, sep } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

function parse(skill: string) {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(skill);
  assert.ok(match, "frontmatter is missing or unbalanced");
  const header = match[1]!;
  const description = /^description:[ \t]*(>|\|)?[ \t]*\n?((?:[ \t]+.*\n?)*|.*)/m.exec(header);
  assert.ok(description, "description is missing");
  const folded = description[1] !== undefined;
  const value = folded
    ? description[2]!
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" ")
    : description[2]!.trim();
  return { header, body: skill.slice(match[0].length), value, folded };
}

async function installedSkill() {
  const scratch = await mkdtemp(join(tmpdir(), "write-strategy-install-"));
  try {
    const installed = join(scratch, ".agents/skills/write-strategy");
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
  assert.match(skill, /^---\nname: write-strategy\n/);
  assert.ok(parse(skill).value);
  assert.deepEqual([...skill.matchAll(/\]\(([^)]+)\)/g)], []);
});

test("the description fits 1024 characters and has no bare colon-space", async () => {
  const { value, folded } = parse(await readFile(new URL("../SKILL.md", import.meta.url), "utf8"));
  assert.ok(value.length > 0 && value.length <= 1024, `description is ${value.length} characters`);
  assert.ok(!value.includes(": "), "description holds a bare colon-space");
  assert.ok(folded || !value.startsWith('"'));
});

test("the frontmatter is closed and the code fences balance", async () => {
  const skill = await readFile(new URL("../SKILL.md", import.meta.url), "utf8");
  const { body } = parse(skill);
  assert.equal(skill.split("\n").filter((line) => line === "---").length, 2);
  const fences = body.split("\n").filter((line) => /^\s*(```|~~~)/.test(line));
  assert.equal(fences.length % 2, 0, "unbalanced code fence");
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
