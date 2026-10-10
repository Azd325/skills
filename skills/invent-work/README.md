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

The package has no tests, because it holds prompt text only and no rule that code enforces.
