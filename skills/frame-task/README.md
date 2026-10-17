# frame-task

Turns one fuzzy task into a decision before any code exists.
The skill returns a five-line decision memo, a ranked list of the missing context, the unchecked assumptions in the framing and one next step sized to confidence: ship now, throwaway prototype or proposal first.

It is a prompt-only skill: it recommends and enforces nothing.
It writes no code and starts no work unless you ask.
For a choice between several candidate tasks, use [invent-work](../invent-work/README.md).

- [SKILL.md](SKILL.md): the text that the agent loads.
- [VISION.md](VISION.md): what the package accepts and resists.
- [CHANGELOG.md](CHANGELOG.md): changes per release.

## Install

With the [`skills`](https://github.com/vercel-labs/skills) CLI:

```sh
npx skills add Azd325/skills --skill frame-task
```

Without it, copy `SKILL.md` into a folder named `frame-task` in the skills directory of your agent, for example `~/.claude/skills/frame-task/` for Claude Code.

## Use

Ask the agent to "frame this", "help me scope" or "what am I missing", and paste the ticket.
Inside a repository, the skill searches for prior art, callers, tests and owners before it asks you.
It marks each claim as grounded or assumed.

## Tests

Use Node 26 or later. At the repository root, run `pnpm install` and `pnpm run check`.
CI checks installation in a fresh home and the scenario oracle, parser and rule-removal helper.
These deterministic tests do not prove model interpretation and call no live model.

For development-only evaluation with synthetic evidence:

```sh
mkdir -p /tmp/frame-task-evidence
pnpm --filter frame-task evaluate /tmp/frame-task-evidence MODEL_RUNNER [ARGS...]
```

The runner reads a prompt on stdin and emits assessment JSON on stdout, with tools, hooks, skills
and repository discovery disabled. Each scenario runs with the original policy and with its rule
removed. Passing requires the restored assessment to pass and the removed-rule assessment to go red.
Keep evaluation output outside the repository. This checks interpretation; it enforces nothing.
