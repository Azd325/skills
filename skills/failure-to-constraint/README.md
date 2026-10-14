# failure-to-constraint

Turns one confirmed failure into the smallest control that rejects it: a regression test, a lint rule, a schema rule or a type change.
The skill proves that the control rejects the failure, accepts valid cases, goes red when disabled and runs on the real caller, hook or CI path.

It is a prompt-only skill: it proposes and enforces nothing by itself.
It edits application code only after you approve the proposal.
It keeps no pattern store.

- [SKILL.md](SKILL.md): the text that the agent loads.
- [VISION.md](VISION.md): what the package accepts and resists.
- [CHANGELOG.md](CHANGELOG.md): changes per release.

## Install

With the [`skills`](https://github.com/vercel-labs/skills) CLI:

```sh
npx skills add Azd325/skills --skill failure-to-constraint
```

Without it, copy `SKILL.md` into a folder named `failure-to-constraint` in the skills directory of your agent, for example `~/.claude/skills/failure-to-constraint/` for Claude Code.

## Use

Ask the agent "turn this failure into a guardrail", "make this mistake impossible", "this check never ran" or "this guard fails open".
Bring a confirmed cause: a reproducer, or a command that exits 0 when the cause is present.
Without one, the skill stops and names the evidence that is missing.

A check that never ran (silent control) and a guard that gives the less protected result for an unknown input (asymmetric protection) qualify on their first observation.
Other failures qualify on a second occurrence that the repository history shows, or when you ask explicitly.

## Tests

Use Node 26 or later. At the repository root, run `pnpm install` and `pnpm run check`.
CI checks installation in a fresh home, the frontmatter, the description limits, code-fence balance, and the scenario oracle, parser and rule-removal helper.
Each scenario test also reads the shipped `SKILL.md`: it finds the rule lines of the scenario and goes red when they are removed.
These deterministic tests do not prove model interpretation and call no live model.

For development-only evaluation with synthetic evidence:

```sh
mkdir -p /tmp/failure-to-constraint-evidence
pnpm --filter failure-to-constraint evaluate /tmp/failure-to-constraint-evidence MODEL_RUNNER [ARGS...]
```

The runner reads a prompt on stdin and emits assessment JSON on stdout, with tools, hooks, skills
and repository discovery disabled. Each scenario runs with the original policy and with its rule
removed. Passing requires the restored assessment to pass and the removed-rule assessment to go red.
Keep evaluation output outside the repository. This checks interpretation; it enforces nothing.
