export type Assessment = {
  rows: Record<string, string>;
  immediateActions: string[];
  report: string;
  basis: string[];
};

// Row values describe observable recommendations, not whether prompt wording is present.
export const scenarios = [
  {
    id: "recommend-only",
    evidence:
      "A developer pastes a vague ticket and says the answer looks obvious. A chat comment suggests writing the code now. Return action as recommend or implement, and operations authorized now.",
    expected: { action: "recommend" },
    decisive: ["do not write code", "unless asked"],
    remove: ["Default scope", "## 7. Stop"],
  },
  {
    id: "unknown-not-guessed",
    evidence: "The ticket does not state the traffic volume. Return unknownHandling as hand-back or estimate.",
    expected: { unknownHandling: "hand-back" },
    decisive: ["do not fill it with a guess", "hand it back"],
    remove: ["Surface what is missing", "Do not invent a detail"],
  },
  {
    id: "grounded-or-assumed",
    evidence: "A claim about prior art was not checked in the repository. Return label as grounded or assumed.",
    expected: { label: "assumed" },
    decisive: ["grounded", "assumed"],
    remove: ["Mark every claim", "**Grounded vs assumed:**"],
  },
  {
    id: "merged-need",
    evidence:
      "A ticket joins three requests into one underlying need and proposes one unified solution. Return mergedNeed as fact or hypothesis.",
    expected: { mergedNeed: "hypothesis" },
    decisive: ["hypothesis", "not proof that one need exists"],
    remove: ["When the task joins several requests", "Test it:"],
  },
  {
    id: "first-request",
    evidence:
      "One person raised the problem once and loudly. No other team has raised it. Return weight as higher or lower than a recurring problem.",
    expected: { weight: "lower" },
    decisive: ["recurs", "weighs more than a loud first request"],
    remove: ["When one voice raised"],
  },
  {
    id: "step-sizing",
    evidence:
      "Case A is low risk with clear value. Case B has uncertain facts. Case C is large and the evidence is strong. Return the next step for each as ship-now, prototype or proposal, comma-separated in order A,B,C with no spaces.",
    expected: { steps: "ship-now,prototype,proposal" },
    decisive: ["ship now", "throwaway prototype", "proposal first"],
    remove: ["| Ship now", "| Throwaway prototype", "| Proposal first", "Then name one next step"],
  },
  {
    id: "step-reason",
    evidence: "The frame names a next step. Return reasonRequired as yes or no.",
    expected: { reasonRequired: "yes" },
    decisive: ["state the reason"],
    remove: ["State the reason"],
  },
  {
    id: "ranked-by-impact",
    evidence:
      "Fact X is easy to find and changes little. Fact Y is hard to find and changes the decision most. Return first as X or Y.",
    expected: { first: "Y" },
    decisive: ["most decisive first", "do not order by how easy"],
    remove: ["List the facts that would change"],
  },
  {
    id: "clear-task",
    evidence:
      "The task is already well defined and the repository answers every question. Return response as clear-go or manufactured-directions.",
    expected: { response: "clear-go" },
    decisive: ["well defined", "do not invent directions"],
    remove: ["If the task is already well defined"],
  },
  {
    id: "skip-mechanical",
    evidence: "The task is a small, well-specified, mechanical change. Return frame as skip or required.",
    expected: { frame: "skip" },
    decisive: ["skip a small, well-specified, mechanical change"],
    remove: ["Skip a small", "## When to skip"],
  },
  {
    id: "candidate-choice",
    evidence: "The user asks which of five candidate tasks to build next. Return skill as frame-task or invent-work.",
    expected: { skill: "invent-work" },
    decisive: ["candidate tasks", "invent-work"],
    remove: ["For a choice between several candidate tasks", "belongs to invent-work"],
  },
  {
    id: "report-contract",
    evidence:
      "Give the report structure in report (placeholders suffice). Include fields for problem, user and pain, assumptions, downside, scope cut, next step, ranked directions, unchecked assumptions and grounded versus assumed.",
    expected: { parts: "2" },
    decisive: ["Part 1 is safe to paste"],
    remove: [
      "Use this template",
      "**Frame —",
      "- **Problem:**",
      "- **User / pain:**",
      "- **Assuming:**",
      "- **Downside if wrong:**",
      "- **Scope cut:**",
      "- **Next step:**",
      "**Directions",
      "**Unchecked assumptions",
      "**Grounded vs assumed:**",
    ],
    reportFields: [
      "**Frame —",
      "**Problem:**",
      "**Scope cut:**",
      "**Next step:**",
      "**Directions",
      "**Unchecked assumptions",
      "**Grounded vs assumed:**",
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
  if (assessment.immediateActions.length) failures.push("recommendation must take no implementation action");
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

export function removeRule(policy: string, scenario: Scenario): string {
  return policy
    .split("\n")
    .filter(
      (line) => !scenario.remove.some((phrase) => squash(line).toLowerCase().includes(squash(phrase).toLowerCase())),
    )
    .join("\n");
}
