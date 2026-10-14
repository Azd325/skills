# Vision

`failure-to-constraint` exists so that a confirmed failure becomes a control that the repository runs, not a correction that the next session forgets.
It serves engineers and agents who fixed a failure and want it rejected or detected the next time.
It turns one confirmed failure into the smallest control that rejects it: a test, a lint rule, a schema rule or a type change.
It owns exactly one thing: the selection and the proof of that one control.

## Confirmed cause or nothing

The skill starts only from a confirmed cause: a reproducer, or a cause check whose exit code decides.
When the cause is not confirmed, the skill stops and names the missing evidence.
It does not investigate the cause and does not pass the task to another skill.
A control for a guessed cause gives false confidence.

## Proof, not claims

A control counts only after three proofs.
It rejects the original failure and accepts valid cases.
It goes red when the control is disabled, and green again when the control is restored.
It runs on the path that the repository claims: the caller, the hook or the CI job.
A configured check is not an executed check.
The skill does not claim that a control prevents every recurrence.

## First observation for silent failures

A check that never ran and a guard that fails open report nothing, so nobody sees a second occurrence.
These two classes have checkable definitions and qualify on their first observation.
Other failures qualify on a second occurrence that the repository history shows, or on an explicit request.
Test suites catch recurrences of known failures; they rarely catch a new silent failure.

## Propose, do not act

The default scope is a proposal: target files, covered paths, valid and invalid cases, bypasses, costs and verification commands.
The skill edits application code only after the user approves.
It stops after one control and reports the remaining gaps.

## No store

The package keeps no pattern store and no helper script.
A store that agents must remember to read and write is not exercised, and a tool that is not exercised fails as silently as a document.
Provenance goes in the commit message and in the name of the check.
When a repository already keeps a pattern record, the skill updates it and creates none.

## Scope

failure-to-constraint is a prompt-only package in the `azd325/skills` collection.
This vision covers the failure-to-constraint package only; rules shared across the collection's packages live in the collection's AGENTS.md.
It works on one confirmed failure.
It is not for an unexplained error, a whole-repository audit, a test-suite audit, an agent-configuration audit or an edit to a skill text.

A change aligns when it makes a control easier to prove, makes the proposal smaller or clearer, or makes a qualifying failure easier to recognize from evidence.
A change should be resisted when it lets the skill propose a control without a confirmed cause, accepts a control without the three proofs, edits code before approval, adds a pattern store or helper, takes on investigation of an unknown cause, or widens the skill to audit a repository, a test suite, an agent configuration or a skill text.
