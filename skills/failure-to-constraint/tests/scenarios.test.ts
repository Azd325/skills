import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { judge, parseAssessment, removeRule, ruleLines, scenarios } from "./scenarios.ts";
import type { Assessment, Scenario } from "./scenarios.ts";

// CI ties each scenario to the rule lines of the shipped SKILL.md and tests the
// oracle with synthetic policy. Model interpretation belongs to pnpm evaluate.
const skill = readFileSync(new URL("../SKILL.md", import.meta.url), "utf8");
const filler = "Unrelated policy about notes.";
const ruleFor = (scenario: Scenario) => `Rule: ${scenario.decisive.join(" and ")} decide this.`;
const validFor = (scenario: Scenario, basis: string[]): Assessment => ({
  rows: { ...scenario.expected },
  immediateActions: [],
  report: "reportFields" in scenario ? scenario.reportFields.join("\n") : "Proposal only.",
  basis,
});

for (const scenario of scenarios) {
  test(`SKILL.md rule: ${scenario.id} is stated in the skill and goes red without it`, () => {
    for (const phrase of scenario.remove) {
      assert.ok(ruleLines(skill, [phrase]).length, `missing rule: ${phrase}`);
    }
    const assessment = validFor(scenario, ruleLines(skill, scenario.remove));
    assert.deepEqual(judge(scenario, assessment, skill), []);
    assert.ok(
      judge(scenario, assessment, removeRule(skill, scenario)).includes(
        "decision lacks a demonstrated basis in the supplied policy",
      ),
    );
  });

  test(`assessment oracle: ${scenario.id} rejects wrong decisions and unsupported bases`, () => {
    const rule = ruleFor(scenario);
    const policy = `${filler}\n${rule}`;
    const valid = validFor(scenario, [rule]);
    assert.deepEqual(judge(scenario, valid, policy), []);
    for (const check of Object.keys(scenario.expected)) {
      assert.ok(judge(scenario, { ...valid, rows: { ...valid.rows, [check]: "UNVERIFIED" } }, policy).length);
    }
    for (const basis of [[], ["Unprovided policy"], [filler]]) {
      assert.ok(judge(scenario, { ...valid, basis }, policy).length);
    }
    assert.ok(judge(scenario, { ...valid, immediateActions: ["Edit the application code now"] }, policy).length);
    if ("reportFields" in scenario) {
      for (const field of scenario.reportFields) {
        assert.ok(judge(scenario, { ...valid, report: valid.report.replace(field, "") }, policy).length);
      }
    }
  });

  test(`rule removal: ${scenario.id} drops its matching lines and keeps unrelated lines`, () => {
    const matching = scenario.remove.map((phrase) => `Policy line with ${phrase.toUpperCase()} inside.`);
    const policy = [filler, ...matching].join("\n");
    assert.equal(removeRule(policy, scenario), filler);
  });
}

test("parser validates the model consumer's JSON interface", () => {
  const scenario = scenarios[0]!;
  const complete = validFor(scenario, [ruleFor(scenario)]);
  const checks = Object.keys(scenario.expected);
  assert.deepEqual(parseAssessment(`\`\`\`json\n${JSON.stringify(complete)}\n\`\`\``, checks), complete);
  for (const patch of [
    { rows: undefined },
    { rows: {} },
    { rows: { response: 1, handOff: "none" } },
    { immediateActions: "none" },
    { basis: undefined },
    { basis: [1] },
    { report: undefined },
  ]) {
    assert.throws(() => parseAssessment(JSON.stringify({ ...complete, ...patch }), checks), /Malformed assessment/);
  }
  assert.throws(() => parseAssessment("[]", checks), /Malformed assessment/);
});

test("basis comparison tolerates line wrapping", () => {
  const scenario = scenarios[0]!;
  const rule = ruleFor(scenario);
  assert.deepEqual(judge(scenario, validFor(scenario, [rule.replaceAll(" and ", "\n and  ")]), rule), []);
});
