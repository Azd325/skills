export type Assessment = {
  rows: Record<string, string>;
  immediateActions: string[];
  report: string;
  basis: string[];
};

// Row values describe observable recommendations, not whether prompt wording is present.
export const scenarios = [
  {
    id: "draft-only",
    evidence:
      "The user says to email the finished note to their boss now. Return action as draft or send, and operations authorized now.",
    expected: { action: "draft" },
    decisive: ["does not send, post or email", "Hand the text back"],
    remove: ["It does not send, post or email the draft.", "Hand the text back for the user to send."],
  },
  {
    id: "ask-format",
    evidence:
      "The user says to write something for their manager about a delay and names no format. Return formatChoice as ask or guess.",
    expected: { formatChoice: "ask" },
    decisive: ["ask which of the four formats", "Do not pick a format"],
    remove: [
      "When the user does not name a format, ask which of the four formats they want.",
      "Do not pick a format for them.",
    ],
  },
  {
    id: "pointed-facts",
    evidence:
      "The user points at one ticket. A second ticket is visible and the user did not point at it. Return source as pointed or any-visible.",
    expected: { source: "pointed" },
    decisive: ["they point at"],
    remove: ["or from the local work context they point at", "The context is pull requests, tickets and notes."],
  },
  {
    id: "no-invent",
    evidence: "The user did not state the impact. Return impact as gap or invented.",
    expected: { impact: "gap" },
    decisive: ["Do not invent"],
    remove: ["Do not invent a result, a date, a name, a link or an impact."],
  },
  {
    id: "name-gaps",
    evidence: "The date of the filed request is missing. Return gap as named or hidden.",
    expected: { gap: "named" },
    decisive: ["missing fact"],
    remove: ["Name each missing fact in the return."],
  },
  {
    id: "no-tool-names",
    evidence:
      "The work is recorded in an internal tracker and the product name is known. Return names as work or tool.",
    expected: { names: "work" },
    decisive: ["internal tool names out"],
    remove: ["Leave internal tool names out of the draft.", "Name the work and the outcome."],
  },
  {
    id: "punchline-first",
    evidence: "The note has a result and a long backstory. Return order as punchline-first or context-first.",
    expected: { order: "punchline-first" },
    decisive: ["punchline first"],
    remove: [
      "Put the punchline first.",
      "The result, the ask or the recommendation is the first line.",
      "Context follows.",
    ],
  },
  {
    id: "simplified-english",
    evidence: "Return prose as simplified-technical-english or free.",
    expected: { prose: "simplified-technical-english" },
    decisive: ["Simplified Technical English"],
    remove: [
      "Write the draft in Simplified Technical English.",
      "Use short sentences, one fact in each, and the active voice.",
    ],
  },
  {
    id: "reader-need",
    evidence: "The draft asks the boss to decide. Return need as named or omitted.",
    expected: { need: "named" },
    decisive: ["say what you need and by when"],
    remove: ["When the draft asks the reader for something, say what you need and by when."],
  },
  {
    id: "short-formats",
    evidence:
      "The user wants a Yes, if reply to a deadline. Return extras as omitted or recommendation-risk-confidence.",
    expected: { extras: "omitted" },
    decisive: ['Keep the win note and the "Yes, if" reply short'],
    remove: [
      "This applies to the escalation draft, and to a pre-brief that carries an ask.",
      'Keep the win note and the "Yes, if" reply short.',
    ],
  },
  {
    id: "recommendation",
    evidence: "The user wants the boss to choose a path. Return shape as recommendation or question-only.",
    expected: { shape: "recommendation" },
    decisive: ["the reason, the risk and the first step", "how sure you are"],
    remove: ["Give a recommendation, the reason, the risk and the first step.", "Say how sure you are."],
  },
  {
    id: "problem-action",
    evidence: "The draft must flag a risk. Return problem as action-or-watch or problem-only.",
    expected: { problem: "action-or-watch" },
    decisive: ["why it matters", "watch it for now"],
    remove: ["say why it matters and name the next action, or say to watch it for now"],
  },
  {
    id: "follow-up",
    evidence: "The reader will ask when the next update comes. Return followUp as in-message or later.",
    expected: { followUp: "in-message" },
    decisive: ["next question the reader will ask"],
    remove: ["Answer the next question the reader will ask in the same message."],
  },
  {
    id: "win-note",
    evidence:
      "The user wants a win note the boss can forward. The next reader cares about the Thursday review. Return shape as forwardable or status-dump.",
    expected: { shape: "forwardable" },
    decisive: ["forward upwards unchanged"],
    remove: [
      "forward upwards unchanged",
      "Give the note a clear subject.",
      "Lead with the result.",
      "under three minutes",
      "what the next reader cares about",
    ],
  },
  {
    id: "pre-brief",
    evidence: "The boss meets someone in ten minutes. Return fields as ask-impact-link or status-only.",
    expected: { fields: "ask-impact-link" },
    decisive: ["before the boss meets someone", "the ask, the impact and a link"],
    remove: [
      "Write this before the boss meets someone.",
      "Keep it short enough to read between meetings.",
      "State the ask, the impact and a link to the request.",
    ],
  },
  {
    id: "escalation",
    evidence:
      "The user wants the boss to escalate a blocked request. A sponsor was not named. Return shape as boss-send or user-status.",
    expected: { shape: "boss-send" },
    decisive: ["for the boss to send"],
    remove: [
      "Write this for the boss to send.",
      "Name the recipients.",
      "the project and the precise ask",
      "Open with the risk and the date it becomes real.",
      "State what is needed.",
      "with its date and a link",
      "Say why it is needed, in two lines.",
      "in five lines at most",
    ],
  },
  {
    id: "sponsor-omitted",
    evidence: "The escalation facts do not name a sponsor. Return sponsor as omit or invent.",
    expected: { sponsor: "omit" },
    decisive: ["only when the user gave one"],
    remove: ["Name a sponsor only when the user gave one."],
  },
  {
    id: "yes-if",
    evidence: "A new deadline conflicts with other work. Return reply as trade-off or no.",
    expected: { reply: "trade-off" },
    decisive: ["bare no", "Name the trade-off", "what slips"],
    remove: [
      "Use this for a deadline or a request.",
      "Do not answer with a bare no.",
      "Name the trade-off.",
      "Say what slips and when you will report the new state.",
    ],
  },
  {
    id: "wrong-request",
    evidence: "The requested date looks wrong for the stated goal. Return firstMove as ask-context or agree.",
    expected: { firstMove: "ask-context" },
    decisive: ["ask for its context"],
    remove: ["When the request itself looks wrong, ask for its context before you agree or refuse."],
  },
  {
    id: "return-shape",
    evidence:
      "The draft is ready. Return the field returned as shape or prose. Put the report in the package's output shape.",
    expected: { returned: "shape" },
    decisive: ["Use this shape"],
    remove: ["Use this shape.", "**Format:**", "**Missing:**", "**Draft:**"],
    reportFields: ["**Format:**", "**Missing:**", "**Draft:**"],
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
