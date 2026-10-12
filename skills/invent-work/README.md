# invent-work

Chooses what to build next when nobody hands you a roadmap.
The skill collects candidate work from four signal sources (system, users, org, industry), ranks it on evidence and reports at most five candidates with the reason for the order.

It is a prompt-only skill: it recommends and enforces nothing.
It creates no ticket and starts no work unless you ask.

- [SKILL.md](SKILL.md): the text that the agent loads.
- [VISION.md](VISION.md): what the package accepts and resists.
- [CHANGELOG.md](CHANGELOG.md): changes per release.

## Install

With the [`skills`](https://github.com/vercel-labs/skills) CLI:

```sh
npx skills add Azd325/skills --skill invent-work
```

Without it, copy `SKILL.md` into a folder named `invent-work` in the skills directory of your agent, for example `~/.claude/skills/invent-work/` for Claude Code.

## Use

Ask the agent "what should I work on next", "pick the next project" or "is this backlog right".
The result is as good as the evidence the session can reach: an issue tracker, an error tracker, `git log`, cost data, postmortems.
The skill names each source that it could not reach.

## Tests

Use Node 26 or later. At the repository root, run `pnpm install` and `pnpm run check`.
CI checks installation in a fresh home and the scenario oracle, parser and rule-removal helper.
These deterministic tests do not prove model interpretation and call no live model.

For development-only evaluation with synthetic evidence:

```sh
mkdir -p /tmp/invent-work-evidence
pnpm --filter invent-work evaluate /tmp/invent-work-evidence MODEL_RUNNER [ARGS...]
```

The runner reads a prompt on stdin and emits assessment JSON on stdout, with tools, hooks, skills
and repository discovery disabled. Each scenario runs with the original policy and with its rule
removed. Passing requires the restored assessment to pass and the removed-rule assessment to go red.
Keep evaluation output outside the repository. This checks interpretation; it enforces nothing.
