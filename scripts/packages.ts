import { existsSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { parse } from "yaml";

export const leakPatterns: [string, RegExp][] = [
  ["/Users/ path", /\/Users\//],
  ["/home/<name>/ path", /\/home\/[A-Za-z][\w.-]*\//],
  ["nixpkgs", /nixpkgs/i],
  ["home-manager", /home-manager/i],
  ["owner's login name", /timkleinschmidt/i],
];

export function findLeaks(file: string, text: string): string[] {
  return text
    .split("\n")
    .flatMap((line, index) =>
      leakPatterns.filter(([, pattern]) => pattern.test(line)).map(([label]) => `${file}:${index + 1}: ${label}`),
    );
}

export function findDeadPhrases<S extends { id: string; remove: readonly string[] }>(
  scenarios: readonly S[],
  policy: string,
  removeRule: (policy: string, scenario: S) => string,
): string[] {
  return scenarios.flatMap((scenario) => [
    ...scenario.remove
      .filter((phrase) => removeRule(policy, { ...scenario, remove: [phrase] }) === policy)
      .map((phrase) => `${scenario.id}: "${phrase}" matches no policy line`),
    ...(removeRule(policy, scenario) === policy ? [`${scenario.id}: removeRule leaves the policy unchanged`] : []),
  ]);
}

export function policyPaths(evaluateSource: string): string[] {
  return [...evaluateSource.matchAll(/"\.\.\/([^"]+\.md)"/g)].map((match) => match[1]!);
}

export function skillProblems(directory: string, skill: string): string[] {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(skill);
  if (!match) return ["frontmatter is missing or not closed by a --- line"];
  const problems: string[] = [];
  let header: unknown;
  try {
    header = parse(match[1]!);
  } catch (error) {
    return [`frontmatter does not parse: ${error instanceof Error ? error.message.split("\n")[0] : error}`];
  }
  const { name, description } = (header ?? {}) as Record<string, unknown>;
  const folder = directory.split("/").pop();
  if (name !== folder) problems.push(`name is ${JSON.stringify(name)}, folder is ${folder}`);
  if (typeof description !== "string" || description.length === 0 || description.length > 1024) {
    problems.push(
      `description must be a string of 1 to 1024 characters, got ${typeof description === "string" ? description.length : typeof description}`,
    );
  } else if (description.includes(": ")) {
    problems.push("description holds a bare colon-space");
  }
  const body = skill.slice(match[0].length);
  const fences = body.split("\n").filter((line) => /^\s*(```|~~~)/.test(line));
  if (fences.length % 2) problems.push(`${fences.length} code-fence lines; one fence is not closed`);
  const prose = body.replace(/^(\s*)(```|~~~)[\s\S]*?^\s*\2.*$/gm, "");
  for (const [, target] of prose.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^([a-z][a-z0-9+.-]*:|#)/i.test(target!)) continue;
    const path = resolve(directory, target!.split("#")[0]!);
    if (relative(directory, path).startsWith("..") || !existsSync(path))
      problems.push(`link does not resolve: ${target}`);
  }
  return problems;
}

type Marketplace = { plugins?: { name?: string; source?: string }[] };

export function packageProblems(
  directory: string,
  options: { rootReadme: string; marketplace: Marketplace },
): string[] {
  const problems: string[] = [];
  for (const file of ["VISION.md", "README.md", "CHANGELOG.md", "LICENSE"]) {
    if (!existsSync(resolve(directory, file))) problems.push(`${file} is missing`);
  }
  const changelog = resolve(directory, "CHANGELOG.md");
  if (existsSync(changelog) && !/^## \[Unreleased\]$/m.test(readFileSync(changelog, "utf8")))
    problems.push("CHANGELOG.md has no `## [Unreleased]` heading");
  if (!options.rootReadme.includes(`](${directory}/README.md)`))
    problems.push(`root README.md has no row linking ${directory}/README.md`);
  if (directory.startsWith("plugins/")) {
    const entry = options.marketplace.plugins?.find((plugin) => plugin.source === `./${directory}`);
    if (!entry) problems.push(`marketplace.json has no entry with source ./${directory}`);
    const manifest = resolve(directory, ".claude-plugin/plugin.json");
    if (!existsSync(manifest)) problems.push(".claude-plugin/plugin.json is missing");
    else if (entry && entry.name !== JSON.parse(readFileSync(manifest, "utf8")).name)
      problems.push("marketplace.json name differs from plugin.json name");
  }
  return problems;
}
