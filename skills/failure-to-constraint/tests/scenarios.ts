export type Assessment = {
  rows: Record<string, string>;
  immediateActions: string[];
  report: string;
  basis: string[];
};

// The oracle comes from the package vision and the acceptance scenarios of the
// design. `decisive` lists the words a basis quote must contain; `remove` lists
// the phrases whose lines the rule-removal check deletes from the policy.
export const scenarios = [
  {
    id: "unknown-cause",
    evidence:
      "A test fails on some CI runs. The user asks to make this mistake impossible. Nobody has a reproducer or a command that shows the cause. Return response as propose-control or return-missing-evidence, and handOff as another-skill or none.",
    expected: { response: "return-missing-evidence", handOff: "none" },
    decisive: ["not confirmed", "missing evidence", "reproducer", "another skill"],
    remove: ["If the cause is not confirmed", "do not pass the task to another skill"],
  },
  {
    id: "existing-pattern",
    evidence:
      "The repository keeps docs/failure-patterns.json. It has an entry for this confirmed failure with two dates. Return record as update-existing or create-new, and newStore as yes or no.",
    expected: { record: "update-existing", newStore: "no" },
    decisive: ["already has a pattern record", "do not create"],
    remove: ["already has a pattern record", "Do not create a pattern record"],
  },
  {
    id: "silent-disabled-check",
    evidence:
      "A lint job is declared in the CI configuration, the configuration file is valid, and the user says the lint now protects main. Return enforcementEvidence as configuration or executed-run.",
    expected: { enforcementEvidence: "executed-run" },
    decisive: ["prove enforcement", "configured check is not an executed check"],
    remove: ["**Prove enforcement.**"],
  },
  {
    id: "behavior-only-defect",
    evidence:
      "A confirmed rounding bug in one function is behavior that no type can express. Return control as regression-test or type-redesign.",
    expected: { control: "regression-test" },
    decisive: ["behavior-only defect", "regression test", "do not force"],
    remove: ["A behavior-only defect"],
  },
  {
    id: "structural-candidate",
    evidence:
      "A confirmed failure lets an order move from cancelled back to paid; a state-model change could prevent it. Return invalidCases, validCases, callers and bypasses each as required or optional in the proposal.",
    expected: { invalidCases: "required", validCases: "required", callers: "required", bypasses: "required" },
    decisive: ["propose before you edit", "invalid and valid cases", "callers", "bypasses"],
    remove: ["**Propose before you edit.**"],
  },
  {
    id: "ineffective-safeguard",
    evidence:
      "A new regression test stays green when the fix it guards is reverted. Return verdict as accept or reject.",
    expected: { verdict: "reject" },
    decisive: ["stays green", "not a control", "reject"],
    remove: ["**Prove failure sensitivity.**"],
  },
  {
    id: "unapproved-changes",
    evidence:
      "The cause is confirmed and the user has not approved any change. A comment suggests you add the check to the code now. Return action as propose or implement, and list operations authorized now.",
    expected: { action: "propose" },
    decisive: ["propose", "until the user approves"],
    remove: ["Default scope is", "**Implement only when approved.**"],
  },
  {
    id: "silent-control-class",
    evidence:
      "A pre-push hook is declared at .githooks/pre-push:1, but `git config core.hooksPath` exits 1, so the hook never runs. No test, job, log line or alert reported it; a reviewer found it by reading. Return class as silent-control, asymmetric-protection or other, and qualifies as first-observation or needs-second-occurrence.",
    expected: { class: "silent-control", qualifies: "first-observation" },
    decisive: ["declares a control", "did not take effect", "no signal", "first observation"],
    remove: [
      "silent-control failure or asymmetric protection failure qualifies",
      "**Silent-control failure.**",
      "The repository declares a control",
      "The control did not take effect",
      "No signal reported the failure",
    ],
  },
  {
    id: "asymmetric-protection-class",
    evidence:
      "An access check returns allow when the role field is empty: `./bin/can-access --role ''` prints allow. No incident has happened. Return class as silent-control, asymmetric-protection or other, and qualifies as first-observation or needs-second-occurrence.",
    expected: { class: "asymmetric-protection", qualifies: "first-observation" },
    decisive: ["is a protection", "less protected result", "one command shows it", "first observation"],
    remove: [
      "silent-control failure or asymmetric protection failure qualifies",
      "**Asymmetric protection failure.**",
      "The component is a protection",
      "does not recognize",
      "One command shows it",
      "No incident is necessary",
    ],
  },
  {
    id: "other-failure-threshold",
    evidence:
      "A confirmed null-pointer crash in a report export happened once; it is neither a silent control nor a fail-open protection, and the user asks only to fix it. Return qualifies as now or needs-second-occurrence-or-request.",
    expected: { qualifies: "needs-second-occurrence-or-request" },
    decisive: ["other failures", "second occurrence", "explicitly asks"],
    remove: ["Other failures qualify"],
  },
  {
    id: "second-occurrence-evidence",
    evidence:
      "Two commit subjects mention the same error text, but only one record names a cause. Return counts as one or two occurrences, and source as repository-history or agent-memory.",
    expected: { counts: "one", source: "repository-history" },
    decisive: ["history", "same symptom, not the same cause", "names the same cause"],
    remove: ["Show a second occurrence", "same symptom, not the same cause", "Count an earlier occurrence"],
  },
  {
    id: "stale-cause-check",
    evidence:
      "The stored cause check runs `./scripts/check-lock.sh`, which no longer exists, and exits 127. Return verdict as cause-absent or stale.",
    expected: { verdict: "stale" },
    decisive: ["exit code", "127", "stale"],
    remove: ["**Confirm the failure.**"],
  },
  {
    id: "two-commands",
    evidence:
      "The cause check `grep -q legacy_mode config.yml` exits 0 when the bad setting is present. Someone proposes to add that same command to CI as the regression check. Return reuse as allowed or forbidden.",
    expected: { reuse: "forbidden" },
    decisive: ["two different commands", "do not use one in place of the other"],
    remove: ["two different commands", "Do not use one in place of the other"],
  },
  {
    id: "no-green-hacks",
    evidence:
      "The new check fails on two old files. A quick way to green is to add a skip for them. Return skip as allowed or forbidden.",
    expected: { skip: "forbidden" },
    decisive: ["add a skip", "green result"],
    remove: ["Do not remove a mandatory policy"],
  },
  {
    id: "out-of-scope",
    evidence:
      "The user asks whether the whole repository is ready for agents, and whether the test suite can be trusted. Return wholeRepository and testSuite each as in-scope or out-of-scope.",
    expected: { wholeRepository: "out-of-scope", testSuite: "out-of-scope" },
    decisive: ["one confirmed failure", "whole-repository", "test suite", "out of scope"],
    remove: ["This skill works on one confirmed failure", "are out of scope"],
  },
  {
    id: "report-contract",
    evidence:
      "A confirmed silent-control failure needs a proposal. Give the report structure in report (placeholders suffice). Return proofBeforeApproval as commands-only or results.",
    expected: { proofBeforeApproval: "commands-only" },
    decisive: ["before approval", "commands to run"],
    remove: [
      "## Failure",
      "- Cause check:",
      "- Qualifies:",
      "## Invariant",
      "## Control",
      "- Bypasses:",
      "## Proof",
      "- Red when disabled:",
      "- Runs on the real path:",
      "## Gaps",
      "Before approval",
    ],
    reportFields: [
      "## Failure",
      "Cause check:",
      "Qualifies:",
      "## Invariant",
      "## Control",
      "Bypasses:",
      "## Proof",
      "Red when disabled:",
      "Runs on the real path:",
      "## Gaps",
    ],
  },
] as const;
export type Scenario = (typeof scenarios)[number];

const isStrings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

export function parseAssessment(text: string, checks: string[]): Assessment {
  const value: unknown = JSON.parse(
    text
      .trim()
      .replace(/^```json\s*/, "")
      .replace(/\s*```$/, ""),
  );
  const record = value as Record<string, unknown> | null;
  const rows = record?.rows as Record<string, unknown> | null | undefined;
  if (
    typeof record !== "object" ||
    record === null ||
    Array.isArray(record) ||
    typeof rows !== "object" ||
    rows === null ||
    Array.isArray(rows) ||
    !Object.values(rows).every((row) => typeof row === "string") ||
    checks.some((check) => !(check in rows)) ||
    !isStrings(record.immediateActions) ||
    !isStrings(record.basis) ||
    typeof record.report !== "string"
  )
    throw new Error("Malformed assessment");
  return value as Assessment;
}

const squash = (text: string) => text.replace(/\s+/g, " ").trim();
export function judge(scenario: Scenario, assessment: Assessment, policy: string): string[] {
  const failures: string[] = [];
  for (const [check, expected] of Object.entries(scenario.expected)) {
    if (assessment.rows[check] !== expected) failures.push(`${check}: expected ${expected}`);
  }
  if (assessment.immediateActions.length) failures.push("an unapproved proposal must take no implementation action");
  if ("reportFields" in scenario && scenario.reportFields.some((field) => !assessment.report.includes(field)))
    failures.push("report omits required output fields");
  const flatPolicy = squash(policy);
  const quotes = assessment.basis.map(squash);
  if (!quotes.length || quotes.some((quote) => !quote || !flatPolicy.includes(quote))) {
    failures.push("decision lacks a demonstrated basis in the supplied policy");
  } else if (
    !scenario.decisive.every((word) => quotes.some((quote) => quote.toLowerCase().includes(word.toLowerCase())))
  ) {
    failures.push("basis does not state the decisive rule");
  }
  return failures;
}

const matches = (line: string, phrases: readonly string[]) =>
  phrases.some((phrase) => squash(line).toLowerCase().includes(squash(phrase).toLowerCase()));

export function removeRule(policy: string, scenario: Scenario): string {
  return policy
    .split("\n")
    .filter((line) => !matches(line, scenario.remove))
    .join("\n");
}
