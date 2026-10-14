# Vision

`prove-it` exists so that a reviewer can judge a change from evidence they can look at, not from the author's summary.
It serves a person who reviews work that an agent wrote, and the agent that must show the work before the review.
It runs the real thing, captures artifacts into a bundle tied to one commit, and writes a one-page report.
It owns exactly one thing: the proof page, and the artifacts behind it.

## An artifact is proof

Every claim on the page links to an artifact the reviewer can open: a video, a screenshot pair, a diff, a command with its full output.
A claim without an artifact goes under "Not proven".
The author's verdict is not evidence.
A failed row is the result, reported first, and never fixed silently.

## Say what main did

A bug fix or a refactor carries a baseline from main, taken in a separate worktree or by a test that is red on main.
When no baseline is available, the row says "no baseline".
The page never describes what main "probably" did.

## The real thing, honestly bounded

The evidence comes from the real local stack with demo data, never production data and never a mock on the claimed path.
A new guard needs a mutation proof: remove it, show red, restore it.
The page lists everything it did not exercise, and an empty list is a red flag.

## A personal workflow

The bundle lives under the git common dir, outside the tracked tree.
It is not a repo gate and never goes into a PR or ticket unless the user asks.
The skill names `chrome-devtools-axi` for browser evidence and a separate recorder for video, and does not claim a tool records what it cannot.

## Scope

prove-it is a prompt-only package in the `azd325/skills` collection.
This vision covers the prove-it package only; rules shared across the collection's packages live in the collection's AGENTS.md.
It is not a code review, not a CI gate, and not a replacement for the project's own tests.

A change aligns when it makes a claim easier to check, makes the baseline or the "Not proven" list more honest, or keeps the page short.
A change should be resisted when it accepts a verdict in place of an artifact, hides a failed row, publishes the bundle by default, ties the skill to one stack or one person, or claims enforcement that only code and tests can give.
