# Vision

`write-strategy` exists so that a team can see, and argue with, the strategy its decisions already follow.
It serves engineers who make the same kind of choice again and again without a written policy, and who must explain those choices to the next person.
It reads the most recent design documents and decision records in a repository and writes the decisions that recur as guiding policies, each with its reason and sources.
It owns exactly one thing: a short strategy draft built from recorded decisions, and the evidence behind it.

## Recommend, do not act

The default scope is a draft.
The skill changes no file, ticket or document unless the user asks.
It stops at the draft and hands control back.

## Specific, or nothing

A generic strategy is the failure this package exists to prevent: text that every team could sign creates agreement that decides nothing.
Each policy names a concrete choice, takes a side and fails the test "would a different team write this sentence?".
The skill stops when the next policy would be generic. A short draft with real policies is the goal.

## Evidence and reasoning

Each policy cites the documents it came from and gives its reason, so that a reader can dispute the reason and revise the policy.
A decision that appears in one document only is listed as left out, not promoted to a policy.
Contested decisions come first, because a written policy saves the most argument where people already disagree.
The skill starts with the documents it can reach and does not wait for more context; with fewer than three documents it says so, names what to collect and still writes the policies that recur; with fewer than two it writes none.

## Scope

write-strategy is a prompt-only package in the `azd325/skills` collection.
This vision covers the write-strategy package only; rules shared across the collection's packages live in the collection's AGENTS.md.
It is not for choosing what to build next; that belongs to `invent-work`. It is not for framing one task; that belongs to `frame-task`.

A change aligns when it makes the policies more specific, makes their reasons and sources easier to check, or keeps the draft short.
A change should be resisted when it makes the skill edit files or start work by default, lets a policy stand without sources, fills the draft with text that fits any team, or turns the draft into a plan of work.
