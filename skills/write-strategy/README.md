# write-strategy

Writes a short engineering strategy from the decisions a repository already made.
The skill reads the five most recent design documents or decision records it can reach, finds the decisions that recur, contested ones first, and writes each as a guiding policy with its reason and sources.
It lists the decisions that did not recur and leaves them out.

It is a prompt-only skill: it recommends and enforces nothing.
It returns a draft and changes nothing else unless you ask.
To choose what to build, use [invent-work](../invent-work/README.md). To frame one task, use [frame-task](../frame-task/README.md).

- [SKILL.md](SKILL.md): the text that the agent loads.
- [VISION.md](VISION.md): what the package accepts and resists.
- [CHANGELOG.md](CHANGELOG.md): changes per release.

## Install

With the [`skills`](https://github.com/vercel-labs/skills) CLI:

```sh
npx skills add Azd325/skills --skill write-strategy
```

Without it, copy `SKILL.md` into a folder named `write-strategy` in the skills directory of your agent, for example `~/.claude/skills/write-strategy/` for Claude Code.

## Use

Inside a repository, ask the agent to "write our engineering strategy" or "what do our design docs keep deciding".
The skill looks for decision records, RFCs, design docs and substantial PR descriptions, in that order.
Each policy cites its sources by path or link. With fewer than three documents, the skill says so and names what to collect; with fewer than two, nothing recurs and it writes no policies.

## Tests

Use Node 26 or later. At the repository root, run `pnpm install` and `pnpm run check`.
CI checks installation in a fresh home and the scenario oracle, parser and rule-removal helper.
These deterministic tests do not prove model interpretation and call no live model.

For development-only evaluation with synthetic evidence:

```sh
mkdir -p /tmp/write-strategy-evidence
pnpm --filter write-strategy evaluate /tmp/write-strategy-evidence MODEL_RUNNER [ARGS...]
```

The runner reads a prompt on stdin and emits assessment JSON on stdout, with tools, hooks, skills
and repository discovery disabled. Each scenario runs with the original policy and with its rule
removed. Passing requires the restored assessment to pass and the removed-rule assessment to go red.
Keep evaluation output outside the repository. This checks interpretation; it enforces nothing.
