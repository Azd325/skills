import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { cp, mkdtemp, readFile, realpath, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const skill = readFileSync(new URL("../SKILL.md", import.meta.url), "utf8");

// Covers the frontmatter shape this package uses: inline scalars, one folded
// block and one nested map. Anything else is reported as a problem.
function readFrontmatter(text: string) {
  const problems: string[] = [];
  const values: Record<string, string> = {};
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!match) return { values, problems: ["frontmatter is not closed by a --- line"] };
  const lines = match[1]!.split("\n");
  for (let index = 0; index < lines.length; index++) {
    const entry = /^( *)([A-Za-z][\w-]*):(?: (.*))?$/.exec(lines[index]!);
    if (!entry) {
      problems.push(`line ${index + 2} is not a key`);
      continue;
    }
    const [, indent, key, value = ""] = entry;
    if (/^[>|][-+]?$/.test(value)) {
      const block: string[] = [];
      while (index + 1 < lines.length && /^ {2,}\S/.test(lines[index + 1]!)) block.push(lines[++index]!.trim());
      values[key!] = block.join(" ");
    } else {
      if (!/^["']/.test(value) && value.includes(": ")) problems.push(`${key}: inline value has a bare ": "`);
      if (!indent) values[key!] = value;
    }
  }
  return { values, problems };
}

function fenceProblems(text: string): string[] {
  const fences = text.split("\n").filter((line) => /^\s*(```|~~~)/.test(line));
  return fences.length % 2 ? [`${fences.length} code-fence lines; one fence is not closed`] : [];
}

test("SKILL.md frontmatter is closed, parses and names the package", () => {
  const { values, problems } = readFrontmatter(skill);
  assert.deepEqual(problems, []);
  assert.equal(values.name, "failure-to-constraint");
  assert.equal(values.license, "MIT");
});

test("the description has at most 1,024 characters and no bare colon in an inline value", () => {
  const { values, problems } = readFrontmatter(skill);
  assert.deepEqual(problems, []);
  assert.ok(values.description, "description is empty");
  assert.ok(values.description.length <= 1024, `description has ${values.description.length} characters`);
});

test("every code fence in SKILL.md is closed", () => {
  assert.deepEqual(fenceProblems(skill), []);
});

test("the checks find the faults that they guard against", () => {
  assert.deepEqual(readFrontmatter("---\nname: x\n").problems, ["frontmatter is not closed by a --- line"]);
  assert.match(readFrontmatter("---\nname: x: y\n---\n").problems[0]!, /bare ": "/);
  assert.deepEqual(readFrontmatter("---\nname: 'x: y'\n---\n").problems, []);
  assert.equal(readFrontmatter(`---\ndescription: >\n  ${"a ".repeat(600)}\n---\n`).values.description!.length, 1199);
  assert.equal(fenceProblems("```sh\nls\n").length, 1);
});

async function consumeInstalledSkill(directory: string) {
  const text = await readFile(join(directory, "SKILL.md"), "utf8");
  const resources = new Map<string, string>();
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    const path = await realpath(resolve(directory, match[1]!));
    assert.ok(path.startsWith(`${await realpath(directory)}${sep}`), "resource escapes installed package");
    resources.set(match[1]!, await readFile(path, "utf8"));
  }
  return { frontmatter: readFrontmatter(text).values, resources, text };
}

test("a copied package resolves its entrypoint and resources in a fresh agent home", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "failure-to-constraint-install-"));
  try {
    const installed = join(scratch, ".agents/skills/failure-to-constraint");
    await cp(new URL("../", import.meta.url), installed, {
      recursive: true,
      filter: (path) => !path.split(sep).includes("node_modules"),
    });
    const { frontmatter, resources, text } = await consumeInstalledSkill(installed);
    assert.equal(frontmatter.name, "failure-to-constraint");
    assert.ok(frontmatter.description);
    assert.deepEqual([...resources.keys()], []);
    assert.doesNotMatch(text, /~\/|\/Users\/|\/home\//, "SKILL.md names a path in someone's home");
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
