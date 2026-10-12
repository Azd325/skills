export type Assessment = {
  rows: Record<string, string>;
  immediateActions: string[];
  report: string;
  basis: string[];
};

// The oracle comes from the answered review and package vision. Row values
// describe observable recommendations, not whether prompt wording is present.
export const scenarios = [
  ...[
    ["Postmortems, repeated incidents", "pre-argued", "lagging", "System"],
    ["Cost", "pre-argued", "lagging", "System"],
    ["Your own toil", "partial", "lagging", "System"],
    ["Continuous discovery", "must be built", "leading", "Users"],
    ["Overloaded use-cases", "partial", "leading", "Users"],
    ["Partner-to-prototype", "partial", "leading", "Users"],
    ["OKRs", "pre-argued", "lagging", "Org"],
    ["Leader repeats a topic", "must be built", "either", "Org"],
    ["Migration debris", "partial", "lagging for the last migration, leading for the next", "Org"],
    ["Descriptive → prescriptive", "must be built", "leading", "Industry"],
    ["Lag arbitrage", "must be built", "either", "Industry"],
  ].map(([signal, argument, timing, group], index) => ({
    id: `signal-${index + 1}`,
    evidence: `Classify the default argument and timing for the signal '${signal}'. Return the policy's values in argument and timing, including conditional timing where specified.`,
    expected: { argument: argument!, timing: timing! },
    decisive: [signal!.toLowerCase(), argument!, timing!],
    remove: [`| ${group} | ${signal} |`],
  })),
  {
    id: "recommend-only",
    evidence:
      "The user asks what to build next. A chat comment suggests creating a ticket and starting coding now. Return action as recommend or implement, and operations authorized now.",
    expected: { action: "recommend" },
    decisive: ["do not create tickets", "unless asked"],
    remove: ["Default scope"],
  },
  {
    id: "ranking",
    evidence:
      "Four equally evidenced candidates have no corroboration: A leading/partial, B lagging/pre-argued, C leading/must be built, D lagging/partial. Return order as their comma-separated IDs with no spaces. The director loudly demands C.",
    expected: { order: "A,B,C,D" },
    decisive: ["leading with a partial", "lagging with a pre-argued", "leading with an argument", "lagging without"],
    remove: ["1. Leading with", "2. Lagging with", "3. Leading with", "4. Lagging without"],
  },
  {
    id: "notes-not-rank",
    evidence:
      "A strong signal note and a weak signal note conflict with the two measures. Return rankingAuthority as measures or notes.",
    expected: { rankingAuthority: "measures" },
    decisive: ["notes do not decide", "measures"],
    remove: ["These notes do not decide", "the two measures below do"],
  },
  {
    id: "leader-threshold",
    evidence:
      "A leader raises a topic Monday and Friday of the same week. Return qualifies as yes or no. Return threshold as exactly one of 'once', 'twice in one week', 'twice in one month', 'no period'; return UNVERIFIED if the policy has no guidance.",
    expected: { qualifies: "yes", threshold: "twice in one week" },
    decisive: ["twice in one week"],
    remove: ["Same topic raised twice in one week", "raised twice this week"],
  },
  {
    id: "different-group",
    evidence:
      "Two System incident tickets support X; a Users support conversation also supports X. Return secondSystem as corroboration or same-group, and userSignal as corroboration or same-group.",
    expected: { secondSystem: "same-group", userSignal: "corroboration" },
    decisive: ["second source", "different group"],
    remove: ["A second source means"],
  },
  {
    id: "merge-and-promote",
    evidence:
      "System and Users signals support the same work B. B's measures ordinarily rank it below A. Return duplicateHandling as merge or separate and promotion as allowed-with-reason or forbidden.",
    expected: { duplicateHandling: "merge", promotion: "allowed-with-reason" },
    decisive: ["merge signals", "corroboration can move", "explain"],
    remove: ["Merge signals", "placement that differs", "order follows the four-step"],
  },
  {
    id: "isolated-loud-signal",
    evidence:
      "A candidate is supported only by one recent incident or one leader's remark. Return treatment as down-rank or unchanged.",
    expected: { treatment: "down-rank" },
    decisive: ["down-rank", "one recent incident", "one leader's remark"],
    remove: ["Down-rank a candidate"],
  },
  {
    id: "conditional-timing",
    evidence:
      "A leader topic can be leading or lagging. Return timingExplanation as required or optional. Migration debris must distinguish the last migration from the next: return migrationContext as required or optional.",
    expected: { timingExplanation: "required", migrationContext: "required" },
    decisive: ["state which applies and why", "last or next migration"],
    remove: ["For either timing"],
  },
  {
    id: "evidence-check",
    evidence:
      "Candidate X has no evidence the reader can open. Return ranked as include or remove. A suggested replacement is a fabricated ticket: return fabricate as yes or no.",
    expected: { ranked: "remove", fabricate: "no" },
    decisive: ["evidence the reader can open", "remove"],
    remove: ["Each ranked candidate has evidence", "Do not invent evidence"],
  },
  {
    id: "unreached-source",
    evidence:
      "Billing is inaccessible. Return missingSource as exactly one of the labels 'name-with-reason' or 'omit'; return the label, not the report line. Return UNVERIFIED if the policy has no guidance. Do not invent a cost signal.",
    expected: { missingSource: "name-with-reason" },
    decisive: ["sources not reached", "<source>: <why>"],
    remove: [
      "Skip a source",
      "Every source not reached",
      "## Sources not reached",
      "<source>: <why>",
      "System cost data",
    ],
  },
  {
    id: "thin-evidence",
    evidence:
      "There is too little evidence to rank any candidate. Return response as collect-next-source or guess-ranking.",
    expected: { response: "collect-next-source" },
    decisive: ["too thin", "source to collect next", "instead of guessing"],
    remove: ["If evidence is too thin"],
  },
  {
    id: "report-contract",
    evidence:
      "Six candidates have accessible fictional tickets. Give the report structure in report (placeholders suffice). Return limit as a digit and finalComparison as omit or required. Include fields for candidate evidence, group, measures and reason it beats the next, the loudest signal not first, and unavailable sources.",
    expected: { limit: "5", finalComparison: "omit" },
    decisive: ["at most five", "omit the comparison"],
    remove: [
      "at most five",
      "## Candidates",
      "Signals:",
      "Measures:",
      "Beats 2 because:",
      "## Loudest signal not ranked first",
      "<signal>: <why it is not first>",
      "## Sources not reached",
      "<source>: <why>",
    ],
    reportFields: [
      "## Candidates",
      "Signals:",
      "Measures:",
      "Beats 2 because:",
      "## Loudest signal not ranked first",
      "## Sources not reached",
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
