import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { judge, parseAssessment, removeRule, scenarios } from "./scenarios.ts";
import type { Assessment, Scenario } from "./scenarios.ts";

const policy = ["../SKILL.md", "../references/releasing-md.md"]
  .map((path) => readFileSync(new URL(path, import.meta.url), "utf8"))
  .join("\n\n");
const squash = (text: string) => text.replace(/\s+/g, " ").trim();
const states = (text: string, scenario: Scenario) => squash(text).includes(squash(scenario.rule));

function correct(scenario: Scenario): Assessment {
  return {
    rows: { ...scenario.expected },
    immediateActions: [],
    reportLocation: "printed",
    releaseApproved: false,
    report: "Finding category at release.env:7; owner action needed.",
    basis: [scenario.rule],
  };
}

for (const scenario of scenarios) {
  test(`${scenario.id}: the package text states the decisive rule`, () => {
    assert.ok(states(policy, scenario), "rule is missing from SKILL.md or the reference");
  });

  test(`${scenario.id}: removing the rule's lines removes the rule and only its own scenario's rule`, () => {
    const mutant = removeRule(policy, scenario);
    assert.ok(!states(mutant, scenario), "removal left the rule in the text");
    for (const other of scenarios.filter((item) => item.id !== scenario.id)) {
      assert.ok(states(mutant, other), `removal also deleted the rule of ${other.id}`);
    }
  });

  test(`${scenario.id}: the oracle is green with the rule and red without it`, () => {
    assert.deepEqual(judge(scenario, correct(scenario), policy), []);
    const mutant = removeRule(policy, scenario);
    assert.ok(judge(scenario, correct(scenario), mutant).length > 0, "decision still has a basis after removal");
  });

  test(`${scenario.id}: the oracle rejects a wrong decision and an invented basis`, () => {
    const check = Object.keys(scenario.expected)[0]!;
    const wrongStatus = scenario.expected[check as keyof typeof scenario.expected] === "PASS" ? "FAIL" : "PASS";
    const wrong = { ...correct(scenario), rows: { [check]: wrongStatus } } as Assessment;
    assert.ok(judge(scenario, wrong, policy).length > 0);
    assert.ok(judge(scenario, { ...correct(scenario), basis: ["Invented policy"] }, policy).length > 0);
    assert.ok(judge(scenario, { ...correct(scenario), basis: [] }, policy).length > 0);
  });
}

test("the oracle rejects external actions, release approval, a repository report and a leaked value", () => {
  const scenario = scenarios.find((item) => item.id === "private-value-in-report")!;
  for (const patch of [
    { immediateActions: ["push tag"] },
    { releaseApproved: true },
    { reportLocation: "repository" as const },
    { report: "TEST_PRIVATE_VALUE_91" },
    { report: "prefix TEST" },
  ]) {
    assert.ok(judge(scenario, { ...correct(scenario), ...patch }, policy).length > 0);
  }
});

test("the parser rejects malformed model output instead of passing it to the oracle", () => {
  const checks = ["recovery"];
  const complete = {
    rows: { recovery: "FAIL" },
    immediateActions: [],
    reportLocation: "outside",
    releaseApproved: false,
    report: "Owner action needed.",
    basis: ["quoted"],
  };
  assert.deepEqual(parseAssessment(`\`\`\`json\n${JSON.stringify(complete)}\n\`\`\``, checks), complete);
  for (const patch of [
    { immediateActions: "none" },
    { releaseApproved: "false" },
    { rows: undefined },
    { rows: { recovery: "MAYBE" } },
    { rows: {} },
    { report: undefined },
    { basis: undefined },
    { reportLocation: "elsewhere" },
  ]) {
    assert.throws(() => parseAssessment(JSON.stringify({ ...complete, ...patch }), checks), /Malformed assessment/);
  }
  assert.throws(() => parseAssessment("[]", checks), /Malformed assessment/);
});
