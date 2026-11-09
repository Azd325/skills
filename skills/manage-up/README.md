# manage-up

Drafts a message to your own boss.
The four formats are a win note the boss can forward, a pre-brief before a meeting, an escalation draft the boss can send, and a Yes, if reply that names the trade-off.

It is a prompt-only skill: it drafts text and enforces nothing.
It does not send, post or email the draft.
To frame one task, use [frame-task](../frame-task/README.md).
To write an engineering strategy, use [write-strategy](../write-strategy/README.md).

- [SKILL.md](SKILL.md): the text that the agent loads.
- [VISION.md](VISION.md): what the package accepts and resists.
- [CHANGELOG.md](CHANGELOG.md): changes per release.

## Install

With the [`skills`](https://github.com/vercel-labs/skills) CLI:

```sh
npx skills add Azd325/skills --skill manage-up
```

Without it, copy `SKILL.md` into a folder named `manage-up` in the skills directory of your agent, for example `~/.claude/skills/manage-up/` for Claude Code.

## Use

Ask for a draft, and name the format when you know it.
"Draft an update for my boss", "pre-brief my manager", "escalation email", "push back on a deadline" or "manage up".
Point at the pull requests, tickets or notes that hold the facts.
The skill puts the punchline first and leaves internal tool names out of the draft.

## Tests

Use Node 26 or later.
At the repository root, run `pnpm install` and `pnpm run check`.
CI checks installation in a fresh home and the scenario oracle, parser and rule-removal helper.
These deterministic tests do not prove model interpretation and call no live model.

For development-only evaluation with synthetic evidence:

```sh
mkdir -p /tmp/manage-up-evidence
pnpm --filter manage-up evaluate /tmp/manage-up-evidence MODEL_RUNNER [ARGS...]
```

The runner reads a prompt on stdin and emits assessment JSON on stdout, with tools, hooks, skills
and repository discovery disabled.
Each scenario runs with the original policy and with its rule removed.
Passing requires the restored assessment to pass and the removed-rule assessment to go red.
Keep evaluation output outside the repository.
This checks interpretation; it enforces nothing.
