import assert from "node:assert/strict";
import { test } from "node:test";
import { judge, parseAssessment, removeRule, scenarios } from "./scenarios.ts";
import type { Assessment, Scenario } from "./scenarios.ts";

// CI tests the oracle's observable assessment interface with synthetic policy.
// Interpretation of the installed skill belongs to the development evaluation.
const filler = "Unrelated policy about notes.";
const ruleFor = (scenario: Scenario) => `Rule: ${scenario.decisive.join(" and ")} decide this.`;
const validFor = (scenario: Scenario, rule: string): Assessment => ({
  rows: { ...scenario.expected },
  immediateActions: [],
  report: "reportFields" in scenario ? scenario.reportFields.join("\n") : "Recommendation only.",
  basis: [rule],
});

for (const scenario of scenarios) {
  test(`assessment oracle: ${scenario.id} rejects wrong decisions and unsupported bases`, () => {
    const rule = ruleFor(scenario);
    const policy = `${filler}\n${rule}`;
    const valid = validFor(scenario, rule);
    assert.deepEqual(judge(scenario, valid, policy), []);
    for (const check of Object.keys(scenario.expected)) {
      assert.ok(judge(scenario, { ...valid, rows: { ...valid.rows, [check]: "UNVERIFIED" } }, policy).length);
    }
    for (const basis of [[], ["Unprovided policy"], [filler]]) {
      assert.ok(judge(scenario, { ...valid, basis }, policy).length);
    }
    assert.ok(judge(scenario, { ...valid, immediateActions: ["Create a ticket and implement"] }, policy).length);
    if ("reportFields" in scenario) {
      for (const field of scenario.reportFields) {
        assert.ok(judge(scenario, { ...valid, report: valid.report.replace(field, "") }, policy).length);
      }
    }
  });

  test(`rule removal: ${scenario.id} goes red when its rule is removed and green when restored`, () => {
    const rule = ruleFor(scenario);
    const matching = scenario.remove.map((phrase) => `Policy line with ${phrase.toUpperCase()} inside.`);
    const policy = [filler, ...matching, `${matching[0]} ${rule}`].join("\n");
    const assessment = validFor(scenario, `${matching[0]} ${rule}`);
    assert.deepEqual(judge(scenario, assessment, policy), []);
    const removed = removeRule(policy, scenario);
    assert.equal(removed, filler);
    assert.ok(
      judge(scenario, assessment, removed).includes("decision lacks a demonstrated basis in the supplied policy"),
    );
    assert.deepEqual(judge(scenario, assessment, policy), []);
  });
}

test("parser validates the model consumer's JSON interface", () => {
  const scenario = scenarios[0]!;
  const complete = validFor(scenario, ruleFor(scenario));
  const checks = Object.keys(scenario.expected);
  assert.deepEqual(parseAssessment(`\`\`\`json\n${JSON.stringify(complete)}\n\`\`\``, checks), complete);
  for (const patch of [
    { rows: undefined },
    { rows: {} },
    { rows: { argument: 1, timing: "lagging" } },
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
  assert.deepEqual(judge(scenario, validFor(scenario, rule.replaceAll(" and ", "\n and  ")), rule), []);
});
