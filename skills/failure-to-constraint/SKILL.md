---
name: failure-to-constraint
description: >
  Turns one confirmed failure into the smallest control that makes it
  impossible or detectable, such as a regression test, a lint rule, a schema
  constraint or a type change. Proves that the control rejects the failure,
  accepts valid cases, goes red when disabled and runs on the real path. A
  check that never ran or a guard that fails open qualifies on first sight.
  Use on "turn this failure into a guardrail", "make this mistake impossible",
  "this check never ran", "this guard fails open", "failure-to-constraint".
  Not for an unexplained error, ordinary bug repair or a style preference, and
  not for a whole-repository audit, a test-suite audit, an agent-configuration
  audit or an edit to a skill text.
license: MIT
metadata:
  author: Tim Kleinschmidt (Azd325)
---

# Failure to Constraint

A correction in chat does not constrain the next session, and code in the repository can teach the same mistake again.
This skill turns one confirmed failure into the smallest control that rejects it, and proves that the control works and runs.
The control rejects the original failure and keeps valid behavior.
Do not claim that a control prevents every possible recurrence.

Default scope is **propose**: do not edit application code until the user approves the proposal.
"Make this mistake impossible" states what the user wants; it is not evidence that a control can do it.

## 1. Check that the failure qualifies

A confirmed cause has a reproducer or a cause check.
A cause check is a command that exits 0 when the cause is present and non-zero when the cause is absent.
A guess that ended the incident because the symptom went away is not a confirmed cause.
If the cause is not confirmed, stop and return the missing evidence: a reproducer, or a cause check with its exit semantics.
Then do not propose a control, do not investigate the cause in this skill, and do not pass the task to another skill.
A one-off environmental fault that cannot happen again does not qualify.

A confirmed silent-control failure or asymmetric protection failure qualifies on its first observation.
Nothing reports these failures, so nobody sees a second occurrence and a count of occurrences never grows.
Other failures qualify only when a second occurrence is shown or when the user explicitly asks for a control.

**Silent-control failure.** All three conditions hold, each with its evidence:

1. The repository declares a control: a check, guard, flag, hook, alert or job. Evidence: the file and line of the declaration.
2. The control did not take effect: it did not run, its condition did not match, or it evaluated to the permissive value. Evidence: one command that shows the effective state, with its exit semantics.
3. No signal reported the failure between its start and its discovery: no failed test, no failed job, no error-level log line, no alert. Evidence: how the failure was found. A green job that prints a skip line counts as no signal.

**Asymmetric protection failure.** All three conditions hold:

1. The component is a protection: it decides allow or deny, on or off, expose or hide, accept or reject.
2. For an input that it does not recognize (absent, malformed, an unexpected spelling, an evaluation error), it gives the less protected result.
3. One command shows it: the command supplies such an input, and the permissive result appears.

No incident is necessary for an asymmetric protection failure: the demonstration is its first observation.

Show a second occurrence from the history that the repository already keeps:

```sh
git log --oneline -i -n 50 --grep=revert --grep=hotfix --grep=rollback --grep=regression
git log --oneline -i -n 200 --grep=fix
```

Also search the issue tracker and incident write-ups.
A matching subject or symptom text shows the same symptom, not the same cause.
Count an earlier occurrence only when its record names the same cause.

If the repository already has a pattern record for this failure, use its identity and its history.
Do not create a pattern record, a pattern file or a second store.

## 2. Workflow

1. **Confirm the failure.** Run the reproducer or the cause check, and record the observed cause and the exit semantics. Decide from the exit code, not from the output text. A cause check that errors (exit 126 or 127, a missing script, a renamed path) is stale: report it as stale, not as "cause absent".
2. **Define the invariant.** State the forbidden behavior, the valid behavior next to it, and the boundary that can enforce the difference.
3. **Inspect shared paths.** Read the affected callers, existing validators, schemas, types, tests, hooks and CI configuration. Search for every caller of the code that you change.
4. **Select the smallest control.** Reuse an existing enforcement point where you can. Compare detection with structural prevention for this failure; neither one ranks first by default.
5. **Propose before you edit.** Name the target files, the covered paths and callers, the invalid and valid cases, the compatibility costs, the bypasses, the verification commands and the approval that you need.
6. **Implement only when approved.** Keep the change inside the failure boundary. Do not build a framework for one narrow mistake.
7. **Prove the control works.** Show that the original failure is rejected and that representative valid cases are accepted.
8. **Prove failure sensitivity.** Disable only the relevant control, run the verification and see it fail, then restore the exact edit. A check that stays green while the control is disabled is not a control: reject it and select a different one.
9. **Prove enforcement.** Run the check through the claimed caller, hook or CI path, and show that run: a job log, hook output or caller trace. A configured check is not an executed check.
10. **Record provenance.** Name the failure in the commit message and in the name of the check. If the repository already has a pattern record for this failure, add where the control lives, and mark the record guarded only after steps 7 to 9 pass. Never create a pattern record.

The cause check and the regression check are two different commands.
The cause check exits 0 when the cause is present; the regression check fails when the bad behavior is present.
Do not use one in place of the other.

### Control choices

| Control                      | Suitable scope                                 | Evidence needed                                                    |
| ---------------------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| Regression or property test  | Behavior that a type or static rule cannot say | The known-bad case fails; valid cases pass; the oracle is named    |
| Lint or compiler rule        | A source pattern that a tool can detect        | Coverage includes the affected files; exceptions are explicit      |
| Schema or database rule      | A data invariant at a boundary that you own    | Invalid writes fail through every supported write path             |
| Type, API or state-model fix | Invalid values or transitions                  | Bad cases cannot cross the modeled boundary; compatibility remains |

A behavior-only defect gets a regression test; do not force a type or API redesign for it.
Do not call a test structural prevention.
Do not call a type a security boundary without evidence of enforced coverage.

### Safety and stop

- Read a stored command and its effects before you run it, and name the environment that it needs.
- Never replay a destructive production failure. Use an isolated environment that the user approved.
- Do not remove a mandatory policy, suppress a failure, add a skip or relax a check to get a green result.
- Keep unrelated work. Undo only the edits that you made for the sensitivity check.
- Stop after one approved control and its verification. Report the remaining gaps; do not start a broad refactor.
- If no affordable, reliable control exists, report the limitation and its scope. Do not invent a control.

### Scope

This skill works on one confirmed failure.
A whole-repository readiness audit, an audit of a test suite, an audit of an agent configuration and an edit to a skill text are out of scope.

## 3. Report

Use this template.
Before approval, the Proof section lists the commands to run and no results.

```markdown
## Failure

<one line>

- Cause check: `<command>` (exit 0: cause present)
- Qualifies: <silent-control | asymmetric protection | second occurrence: <evidence> | requested>

## Invariant

- Forbidden: <behavior>
- Valid: <behavior>
- Boundary: <file:line>

## Control

<kind> at <files>

- Covers: <paths and callers>
- Bypasses: <what still gets through>
- Cost: <compatibility cost>

## Proof

- Rejects the failure: `<command>` → <exit code>
- Accepts valid cases: `<command>` → <exit code>
- Red when disabled: <edit> → <exit code>, then restored
- Runs on the real path: <job, hook or caller>: <log line or link>

## Gaps

<what the control does not cover>
```

Example: a fictional workflow with a guard whose condition can never match.
The `schema-guard` job at `.github/workflows/deploy.yml:31` has the condition `if: github.ref == 'main'`.
On a push, `github.ref` holds `refs/heads/main`, so the condition never matches.
The job shows as skipped, and the workflow stays green.
A declared control, a condition that never matched and no signal: this is a silent-control failure, and it qualifies on its first observation.

```markdown
## Failure

Deploys to main ran without the schema check.

- Cause check: `grep -n "github.ref == 'main'" .github/workflows/deploy.yml` (exit 0: cause present)
- Qualifies: silent-control

## Invariant

- Forbidden: a workflow condition that compares `github.ref` with a bare branch name.
- Valid: `github.ref == 'refs/heads/main'` or `github.ref_name == 'main'`.
- Boundary: the `if:` lines in `.github/workflows/`.

## Control

Fix the condition, and add the lint step `ref-conditions-use-full-refs` to the pull-request workflow.

- Covers: every file in `.github/workflows/`.
- Bypasses: a condition built with `format()`, or one in a reusable workflow of another repository.
- Cost: none; the condition always meant the full ref.

## Proof

- Rejects the failure: `! (grep -nE "github\.ref *[!=]= *'" .github/workflows/*.yml | grep -v "'refs/")` → 1 on the old file
- Accepts valid cases: the same command → 0 after the fix
- Red when disabled: put back the old condition → 1, then restored → 0
- Runs on the real path: the `lint` job log of the pull request shows the step; the next push to main shows `schema-guard` as succeeded, not skipped

## Gaps

Conditions in reusable workflows of other repositories.
```
