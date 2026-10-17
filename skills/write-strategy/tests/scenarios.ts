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
      "The draft is done. A reviewer says the policies look right and that CONTRIBUTING.md could link them. The user has not asked for any edit. Return action as recommend or edit, and operations authorized now.",
    expected: { action: "recommend" },
    decisive: ["change nothing else", "unless the user asks"],
    remove: ["Default scope", "Edit no file"],
  },
  {
    id: "start-with-reach",
    evidence:
      "Four design documents are reachable. The roadmap and the team goals are not. The user is away. Return start as proceed or wait-for-context.",
    expected: { start: "proceed" },
    decisive: ["do not stop to ask"],
    remove: ["Use what you can reach"],
  },
  {
    id: "thin-evidence",
    evidence: "One decision record is reachable and no other source is. Return output as policies or collect-next.",
    expected: { output: "collect-next" },
    decisive: ["nothing recurs", "write no policies"],
    remove: ["With fewer than two documents", "When fewer than three documents", "Collect next:"],
  },
  {
    id: "last-five",
    evidence: "Twelve design documents are reachable, from the last three years. Return count as 5 or 12.",
    expected: { count: "5" },
    decisive: ["five most recent"],
    remove: ["five most recent"],
  },
  {
    id: "cite-or-drop",
    evidence: "A draft policy sounds right, but no reachable document states it. Return policy as keep or drop.",
    expected: { policy: "drop" },
    decisive: ["no source", "drop it"],
    remove: ["Cite or drop"],
  },
  {
    id: "single-document",
    evidence: "A decision appears in one document only. Return placement as policy or left-out.",
    expected: { placement: "left-out" },
    decisive: ["one document only", "left out"],
    remove: ["A decision found in one document only", "Each decision from one document only", "one document only ("],
  },
  {
    id: "contested-first",
    evidence:
      "Decision A recurs in four documents and nobody objected. Decision B recurs in two documents, and one of them reversed an earlier choice. Return first as A or B.",
    expected: { first: "B" },
    decisive: ["contested decisions come first"],
    remove: ["Contested decisions come first", "Put contested policies first", "contested ones first"],
  },
  {
    id: "generic-policy",
    evidence:
      "A draft policy reads 'Write maintainable, well-tested code.' A different team would write the same sentence. Return policy as keep or rewrite-or-remove.",
    expected: { policy: "rewrite-or-remove" },
    decisive: ["it is generic", "or remove it"],
    remove: ["Specific or nothing", "Test each policy", "Make it specific from the sources"],
  },
  {
    id: "stop-when-generic",
    evidence:
      "Three specific policies are written. Every remaining candidate would be generic. Return next as stop or continue.",
    expected: { next: "stop" },
    decisive: ["stop when the next policy would be generic"],
    remove: ["Stop when the next policy"],
  },
  {
    id: "take-a-side",
    evidence:
      "A draft policy reads 'Consider a message queue for slow work where appropriate.' Return policy as keep or rewrite.",
    expected: { policy: "rewrite" },
    decisive: ["is not a policy"],
    remove: ["Take a side", "takes a side"],
  },
  {
    id: "reason-required",
    evidence: "A draft policy names a choice and two sources but no reason. Return reasonRequired as yes or no.",
    expected: { reasonRequired: "yes" },
    decisive: ["carries its reason"],
    remove: ["Show the reasoning", "Each policy has a reason"],
  },
  {
    id: "length",
    evidence: "The draft runs to five pages of policies. Return length as cut or keep.",
    expected: { length: "cut" },
    decisive: ["one or two pages"],
    remove: ["one or two pages"],
  },
  {
    id: "choose-work",
    evidence: "The user asks which of four projects to build next. Return skill as write-strategy or invent-work.",
    expected: { skill: "invent-work" },
    decisive: ["invent-work"],
    remove: ["To choose what to build", "(invent-work)"],
  },
  {
    id: "frame-one-task",
    evidence:
      "The user pastes one vague ticket and asks how to scope it. Return skill as write-strategy or frame-task.",
    expected: { skill: "frame-task" },
    decisive: ["frame-task"],
    remove: ["To frame one task", "one task (frame-task)"],
  },
  {
    id: "report-contract",
    evidence:
      "Five documents were read. Give the report structure in report (placeholders suffice). Include the strategy heading, guiding policies with reason, sources and contested, the left-out decisions and the sources not reached. Return sections as the number of level-three sections.",
    expected: { sections: "3" },
    decisive: ["### Guiding policies", "### Left out", "### Not reached"],
    remove: [
      "Use this template",
      "## Strategy draft —",
      "### Guiding policies",
      "- Reason:",
      "- Sources:",
      "- Contested:",
      "### Left out",
      "### Not reached",
    ],
    reportFields: [
      "## Strategy draft —",
      "### Guiding policies",
      "Reason:",
      "Sources:",
      "Contested:",
      "### Left out",
      "### Not reached",
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
