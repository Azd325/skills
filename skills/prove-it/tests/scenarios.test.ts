import assert from "node:assert/strict";
import { test } from "node:test";
import { judge, parseAssessment, removeRule, scenarios } from "./scenarios.ts";
import type { Assessment, Scenario } from "./scenarios.ts";

// CI tests the oracle, parser and rule-removal helper with synthetic policy.
// Model interpretation belongs to pnpm evaluate.
const filler = "Unrelated policy about notes.";
const ruleFor = (scenario: Scenario) => `Rule: ${scenario.decisive.join(" and ")} decide this.`;
const validFor = (scenario: Scenario, basis: string[]): Assessment => ({
  rows: { ...scenario.expected },
  immediateActions: [],
  report: "Report.",
  basis,
});

for (const scenario of scenarios) {
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
