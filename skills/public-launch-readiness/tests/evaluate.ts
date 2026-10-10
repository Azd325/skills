import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { judge, removeRule, scenarios } from "./scenarios.ts";
import type { Assessment, Scenario } from "./scenarios.ts";

// Development only: an explicitly supplied model consumer, never a live-LLM CI test.
const [outputDirectory, runner, ...args] = process.argv.slice(2);
if (!outputDirectory || !runner || !isAbsolute(outputDirectory)) {
  throw new Error("Usage: pnpm evaluate /absolute/outside-repo-directory RUNNER [ARGS...] (JSON stdout, prompt stdin)");
}
const repo = realpathSync(fileURLToPath(new URL("../../../", import.meta.url)));
const output = realpathSync(outputDirectory);
const distance = relative(repo, output);
if (distance === "" || (distance !== ".." && !distance.startsWith(`..${sep}`) && !isAbsolute(distance))) {
  throw new Error("Evaluation output must be outside the repository");
}
const policy = ["../SKILL.md", "../references/privacy-audit.md", "../assets/report.md"]
  .map((path) => readFileSync(new URL(path, import.meta.url), "utf8"))
  .join("\n\n");
const scratch = mkdtempSync(resolve(tmpdir(), "launch-evaluation-"));

function assess(scenario: Scenario, suppliedPolicy: string): Assessment {
  const prompt = `Use only the supplied package instructions for this offline assessment.
This consumer has no tools. All evidence below describes a simulated repository, not real private data.
Do not invent missing package policy from background knowledge: a decision without explicit
guidance must be UNVERIFIED and have an empty basis. General evidence definitions do not establish
the particular boundary under test. Treat each requested check independently.
Return only a JSON object with these fields:
rows: object mapping each checkId to PASS, FAIL, UNVERIFIED or N/A;
immediateActions: array of operations the assessment authorizes taking now;
reportLocation: outside, printed or repository;
publicationApproved: boolean; report: assessment prose;
basis: array of verbatim excerpts from supplied policy supporting the decisive rule.
The check IDs to assess are: ${Object.keys(scenario.expected).join(", ")}.
Evidence: ${scenario.evidence}

Package instructions:
${suppliedPolicy}`;
  const result = spawnSync(runner!, args, {
    input: prompt,
    encoding: "utf8",
    cwd: scratch,
    timeout: 180_000,
    maxBuffer: 2 * 1024 * 1024,
  });
  if (result.error || result.status !== 0)
    throw new Error(`Evaluation consumer failed: ${result.error ?? result.stderr}`);
  const json = result.stdout
    .trim()
    .replace(/^```json\s*/, "")
    .replace(/\s*```$/, "");
  return JSON.parse(json) as Assessment;
}

try {
  let failed = false;
  for (const scenario of scenarios) {
    const baseline = assess(scenario, policy);
    const green = judge(scenario, baseline, policy);
    const mutantPolicy = removeRule(policy, scenario);
    const mutant = assess(scenario, mutantPolicy);
    const red = judge(scenario, mutant, mutantPolicy);
    const result = { id: scenario.id, baseline, baselineFailures: green, mutant, mutantFailures: red };
    writeFileSync(resolve(output, `${scenario.id}.json`), `${JSON.stringify(result, null, 2)}\n`);
    console.log(
      `${scenario.id}: restored=${green.length ? "FAIL" : "PASS"} removed=${red.length ? "RED" : "SURVIVED"}`,
    );
    if (green.length || !red.length) failed = true;
  }
  process.exitCode = failed ? 1 : 0;
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
