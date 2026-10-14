export type Assessment = {
  rows: Record<string, string>;
  immediateActions: string[];
  report: string;
  basis: string[];
};

// `decisive` lists the words a basis quote must contain; `remove` lists the
// phrases whose lines the rule-removal check deletes from the policy.
export const scenarios = [
  {
    id: "merged-patch",
    evidence:
      "`git cherry -v origin/main feature` prints a line starting with `-` for the only commit. The user asks to prove the change. Return baseline as parent-of-merged-commit or feature-branch-parent, and reportTop as says-main-holds-patch or silent.",
    expected: { baseline: "parent-of-merged-commit", reportTop: "says-main-holds-patch" },
    decisive: ["git cherry", "main already holds the patch", "parent of the merged commit"],
    remove: ["`git cherry -v", "A line that starts with", "Say so at the top", "parent of the merged commit"],
  },
  {
    id: "no-repro-on-before",
    evidence:
      "A bug fix does not reproduce the bug on the parent commit with the reported input. A slightly different input does break it. Return section as not-proven or verdict-pass, and mayTuneSilently as yes or no.",
    expected: { section: "not-proven", mayTuneSilently: "no" },
    decisive: ["does not reproduce", "Not proven", "never tune the input"],
    remove: ['does not reproduce on "before"', "Report it under", "Never tune the input"],
  },
  {
    id: "transform-oracle",
    evidence:
      "A change rewrites an HTML sanitizer. The claim is that nothing else changed. Return oracle as real-browser-parse or reading-the-output, and inputs as one or ten-to-fifteen.",
    expected: { oracle: "real-browser-parse", inputs: "ten-to-fifteen" },
    decisive: ["10-15 typical inputs", "real browser", "oracle"],
    remove: ["build 10-15 typical inputs", "Let a real browser parse", "The browser is the oracle"],
  },
  {
    id: "mutation-error-not-red",
    evidence:
      "New tests run against the old code with a separate test database. They exit non-zero with a schema mismatch error before any assertion runs. Return mutationRed as yes or no.",
    expected: { mutationRed: "no" },
    decisive: ["not a red", "failed assertion"],
    remove: ["An error, for example a schema mismatch", "Only a failed assertion"],
  },
  {
    id: "consent-overlay",
    evidence:
      "A screenshot pair would show a cookie consent banner over the page in the after image only. Return beforeCapture as dismiss-overlay or capture-as-is.",
    expected: { beforeCapture: "dismiss-overlay" },
    decisive: ["cookie and consent overlays"],
    remove: ["Dismiss cookie and consent overlays"],
  },
  {
    id: "clean-up-step",
    evidence:
      "The proof run started a second server, a throwaway worktree, created rows, changed one field, minted a session and wrote its key to the bundle. Return originalsSaved as before-change or after-change, and sessionKeyInBundle as keep or remove.",
    expected: { originalsSaved: "before-change", sessionKeyInBundle: "remove" },
    decisive: ["Save the originals to the bundle before", "session key"],
    remove: ["Save the originals to the bundle", "Remove any session key", "Delete the sessions you minted"],
  },
  {
    id: "baseline-services",
    evidence:
      "The second side of the baseline needs a database and a cache. The running stack already has both. Return services as reuse-running or start-new, and environment as print or never-print.",
    expected: { services: "reuse-running", environment: "never-print" },
    decisive: ["backing services", "never print its environment"],
    remove: ["Reuse the running stack's backing services"],
  },
  {
    id: "lavish-optional",
    evidence:
      "`command -v lavish-axi` finds nothing on this machine. Return reportFormat as plain-index-html or lavish-only, and openWith as open or lavish-axi.",
    expected: { reportFormat: "plain-index-html", openWith: "open" },
    decisive: ["Plain `index.html` is the default", "Without Lavish nothing changes"],
    remove: ["Plain `index.html` is the default", "Without Lavish nothing changes", "command -v lavish-axi"],
  },
  {
    id: "lavish-disputed-row",
    evidence:
      "In Lavish mode the reviewer comments that one matrix row is wrong. Return action as rerun-row-and-update-page or reply-only, and pageCopy as same-file or second-file.",
    expected: { action: "rerun-row-and-update-page", pageCopy: "same-file" },
    decisive: ["row is disputed", "re-run that row", "update `index.html`"],
    remove: ["For each comment, answer it", "Do not write a second copy"],
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
