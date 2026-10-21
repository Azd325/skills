import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { globSync, readFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { findDeadPhrases, findLeaks, packageProblems, policyPaths, skillProblems } from "./packages.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);

const packages = globSync("{plugins,skills}/*/package.json")
  .map((manifest) => dirname(manifest))
  .sort();
const skills = globSync("skills/*/SKILL.md")
  .map((file) => dirname(file))
  .sort();
const rootReadme = readFileSync("README.md", "utf8");
const marketplace = JSON.parse(readFileSync(".claude-plugin/marketplace.json", "utf8"));

test("tracked package files name nothing from the author's machine", () => {
  const files = execFileSync("git", ["ls-files", "-z", "--", "plugins", "skills"], { encoding: "utf8" })
    .split("\0")
    .filter(Boolean);
  const leaks = files.flatMap((file) => {
    const text = readFileSync(file, "utf8");
    return text.includes("\0") ? [] : findLeaks(file, text);
  });
  assert.deepEqual(leaks, []);
});

test("the leak check flags each machine-specific name and leaves ~/ alone", () => {
  for (const line of [
    "see /Users/someone/dotfiles",
    "cd /home/someone/skills",
    "from nixpkgs",
    "a home-manager module",
    "owner is TimKleinschmidt",
  ])
    assert.equal(findLeaks("f.md", line).length, 1, line);
  assert.deepEqual(findLeaks("f.md", "copy to ~/.agents/skills and /home/ is a word"), []);
});

for (const directory of globSync("skills/*/tests/scenarios.ts")
  .map((file) => dirname(dirname(file)))
  .sort()) {
  test(`${basename(directory)}: every removal phrase matches a policy line`, async () => {
    const evaluate = readFileSync(resolve(directory, "tests/evaluate.ts"), "utf8");
    const policy = policyPaths(evaluate)
      .map((path) => readFileSync(resolve(directory, "tests", "..", path), "utf8"))
      .join("\n\n");
    assert.ok(policy.length > 0, "evaluate.ts reads no policy file");
    const { scenarios, removeRule } = await import(pathToFileURL(resolve(directory, "tests/scenarios.ts")).href);
    assert.deepEqual(findDeadPhrases(scenarios, policy, removeRule), []);
  });
}

test("the removal check names a phrase that matches nothing and a rule that removes nothing", () => {
  const removeRule = (policy: string, scenario: { remove: readonly string[] }) =>
    policy
      .split("\n")
      .filter((line) => !scenario.remove.some((phrase) => line.includes(phrase)))
      .join("\n");
  const policy = "keep this\ndrop me";
  assert.deepEqual(findDeadPhrases([{ id: "ok", remove: ["drop me"] }], policy, removeRule), []);
  assert.deepEqual(findDeadPhrases([{ id: "dead", remove: ["drop me", "absent"] }], policy, removeRule), [
    'dead: "absent" matches no policy line',
  ]);
  assert.deepEqual(findDeadPhrases([{ id: "none", remove: ["absent"] }], policy, removeRule), [
    'none: "absent" matches no policy line',
    "none: removeRule leaves the policy unchanged",
  ]);
  assert.deepEqual(policyPaths('["../SKILL.md", "../references/a.md"]'), ["SKILL.md", "references/a.md"]);
});

for (const directory of skills) {
  test(`${directory}/SKILL.md meets the skill contract`, () => {
    assert.deepEqual(skillProblems(resolve(directory), readFileSync(resolve(directory, "SKILL.md"), "utf8")), []);
  });
}

test("the skill contract rejects each broken input", () => {
  const dir = resolve("skills/frame-task");
  const good = "---\nname: frame-task\ndescription: Frames a task.\n---\nBody [link](README.md)\n";
  assert.deepEqual(skillProblems(dir, good), []);
  assert.deepEqual(skillProblems(dir, good.replace("name: frame-task", "name: other")), [
    'name is "other", folder is frame-task',
  ]);
  assert.match(skillProblems(dir, good.replace("Frames a task.", ""))[0]!, /description must be/);
  assert.match(skillProblems(dir, good.replace("Frames a task.", "a".repeat(1025)))[0]!, /1025/);
  assert.match(skillProblems(dir, good.replace("Frames a task.", "Use when: x"))[0]!, /does not parse/);
  assert.match(skillProblems(dir, good.replace("Frames a task.", ">\n  Use when: x"))[0]!, /bare colon-space/);
  assert.match(skillProblems(dir, good.replace("\n---\nBody", "\nBody"))[0]!, /not closed/);
  assert.match(skillProblems(dir, `${good}\`\`\`sh\nls\n`)[0]!, /fence/);
  assert.deepEqual(skillProblems(dir, `${good}[x](missing.md)\n`), ["link does not resolve: missing.md"]);
  assert.deepEqual(skillProblems(dir, `${good}\`\`\`md\n[x](missing.md)\n\`\`\`\n`), []);
  assert.deepEqual(skillProblems(dir, `${good}[x](../../README.md)\n`), ["link does not resolve: ../../README.md"]);
});

for (const directory of packages) {
  test(`${directory} is a complete package`, () => {
    assert.deepEqual(packageProblems(directory, { rootReadme, marketplace }), []);
  });
}

test("the completeness check names each missing item", () => {
  const options = { rootReadme, marketplace };
  assert.deepEqual(packageProblems("plugins/quiet-mode", options), []);
  assert.deepEqual(packageProblems("plugins/absent", options), [
    "VISION.md is missing",
    "README.md is missing",
    "CHANGELOG.md is missing",
    "LICENSE is missing",
    "root README.md has no row linking plugins/absent/README.md",
    "marketplace.json has no entry with source ./plugins/absent",
    ".claude-plugin/plugin.json is missing",
  ]);
  assert.deepEqual(
    packageProblems("plugins/quiet-mode", {
      rootReadme: "",
      marketplace: { plugins: [{ name: "x", source: "./plugins/quiet-mode" }] },
    }),
    [
      "root README.md has no row linking plugins/quiet-mode/README.md",
      "marketplace.json name differs from plugin.json name",
    ],
  );
  assert.deepEqual(packageProblems("skills/frame-task", { rootReadme: "", marketplace }), [
    "root README.md has no row linking skills/frame-task/README.md",
  ]);
});
