---
name: prove-it
description: >
  Produces proof that a change works before the reviewer reads it. Runs the real
  thing, captures artifacts (video or step screenshots, before/after pairs,
  render diffs, timings, mutation-proven tests) and writes a one-page proof
  report that the reviewer can judge without reading every line. Use when the
  user says "prove it", "/prove-it", "show me it works", "give me proof", or
  briefs a worker to finish with proof. A personal workflow, not a repo gate.
  Never paste its output into a PR or ticket unless the user asks.
license: MIT
metadata:
  author: Tim Kleinschmidt (Azd325)
---

# prove-it

Goal: the reviewer reads the proof page first and reviews only the load-bearing code.
The page answers four questions: does it work, what did main do, what did you not prove, and which files must a human read.

**An artifact is proof. Your verdict is not.**
Every claim on the page links to something the reviewer can look at: a video, a screenshot pair, a diff, a command with its output.
A claim without an artifact goes under "Not proven".
You wrote the code, so your summary of it is the least reliable evidence on the page.

## 1. Set up the bundle

    BRANCH=$(git branch --show-current)
    BRANCH=${BRANCH:-detached-$(git rev-parse --short HEAD)}
    PROOF="$(git rev-parse --git-common-dir)/agent-tasks/proof/$BRANCH"
    mkdir -p "$PROOF"

Git never tracks files under the common dir, and the bundle survives worktree removal.
Record `git rev-parse HEAD` in the report: proof belongs to one commit.
If HEAD moves later, mark the page stale and re-run the affected rows.

## 2. List the claims

Read the commit log and the diff against the default branch, plus the ticket when one exists.
Write each behaviour the change claims as one line: "X now does Y for user Z".
Add the implicit claim of every change: "nothing else changed".
Each claim becomes one row of the matrix.

## 3. Pick the evidence per claim

| Change shape                        | Evidence                                                                                                                           |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| UI / user flow                      | a video with one chapter per step, plus a before/after screenshot pair at the same URL, user and viewport                          |
| Bug fix                             | reproduce on main first (screenshot, failing request, or a test that is red on main), then the same check green on the branch      |
| Refactor, "no behaviour change"     | a render or response diff of the affected output, main against branch; list every delta and explain it                             |
| Performance                         | same data, same command, at least 5 runs on each side, median and spread in a table; profile or trace output for the claimed cause |
| New guard / validation / permission | the test, plus a mutation proof: remove the guard, show the red output, restore it                                                 |
| Background job / email / signal     | run it locally and capture the side effect: the database row, the rendered email, the log line                                     |

Run against the real local stack, with no mocks on the path you claim.
Use demo or seed data: never capture production data.
When the login form gets in the way, create a local session by the project's own means.

**Getting "before" (main):**

- Server-rendered or API output: run the project's own dump or snapshot test on main and on the branch, and diff the output.
  This is the cheapest option.
- Browser behaviour: create a separate worktree for main and run it on another port.
  Never check out main in the working tree you are proving.
- If you cannot get a baseline, say "no baseline" in the row.
  Do not substitute a description of what main "probably" did.

## 4. Capture

- Browser driver: use `chrome-devtools-axi` for screenshots, before/after pairs, console output, network requests and performance traces.
  Read its current help for the commands.
- Video: `chrome-devtools-axi` does not record video.
  Use a driver that records video, for example `playwright-cli` (start a video, add a chapter per step, show actions so clicks are visible, stop).
  When no video recorder is available, take a numbered screenshot sequence, one per step, and name each step in the report.
  Keep each video under 60 seconds. Make one video per claim, not one for the whole session.
- Screenshots: `before-<claim>.png` and `after-<claim>.png` with identical viewport and data.
- Command evidence: save the exact command and its full output to `$PROOF/<claim>.txt`.
  Do not trim the failing lines.
- Test runs: the test command, the pass count, and the mutation red/green pair when the row needs one.

## 5. Write the report

Write `$PROOF/index.html`: plain HTML, no external assets, files referenced relatively, `<video controls>` for videos.
Then open it in the default browser.
Sections, in this order:

1. **Header**: branch, commit, date, one sentence on what the change does.
2. **Verdict per claim**: a matrix with one row per claim and the columns claim | how it was exercised | main | branch | evidence link.
   Mark each cell ✓, ✗ or "not run".
   The main column is required for a bug fix and a refactor.
3. **Not proven**: everything you did not exercise, and why.
   Examples: a payment provider not available locally, a browser not tested, a user role not tried.
   An empty list is a red flag. Re-check before you leave it empty.
4. **Read these files**: the load-bearing files the reviewer must read line by line.
   These are anything in a high-risk area (permissions, tenant scoping, auth, payments, personal data), migrations, and shared functions with many callers.
   Then the edge files, where the proof stands in for a full read.
5. **Gates**: the project's check and test commands, with pass/fail taken from the output.
   Never use your memory of an earlier run.

## 6. Report back

In chat: the path to `index.html`, the matrix in 3–5 lines, and the "Not proven" list in full.
When a row is ✗, say so first.
A failed proof is the result, not something to fix silently before reporting.
If you then fix the failure, re-run that row and update the page.

## Do not

- Do not test only through unit tests and call it end-to-end.
- Do not mock the path you claim works.
- Do not write a new test in the same breath as the code and count it as proof without the mutation step: a test written by the code's author is green by construction.
- Do not publish the bundle anywhere (PR, ticket, artifact link) unless the user asks.
