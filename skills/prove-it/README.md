# prove-it

Produces proof that a change works before the reviewer reads it.
The agent runs the real thing, captures artifacts into a bundle under the git common dir, and writes a one-page HTML report with a claim matrix, a "Not proven" list, the files a human must read, and the gates.

It is a prompt-only skill: it enforces nothing.
It is a personal workflow, not a repo gate, and it never publishes the bundle unless you ask.

- [SKILL.md](SKILL.md): the text that the agent loads.
- [VISION.md](VISION.md): what the package accepts and resists.
- [CHANGELOG.md](CHANGELOG.md): changes per release.

## Install

With the [`skills`](https://github.com/vercel-labs/skills) CLI:

```sh
npx skills add Azd325/skills --skill prove-it
```

Without it, copy `SKILL.md` into a folder named `prove-it` in the skills directory of your agent, for example `~/.claude/skills/prove-it/` for Claude Code.

## Use

Ask the agent "prove it", "show me it works" or "give me proof".
The page lands in `agent-tasks/proof/<branch>/index.html` (`detached-<commit>` on a detached HEAD) under the git common dir.

## Browser tools

Use `chrome-devtools-axi` for screenshots, before/after pairs, console, network and performance evidence.
It does not record video.
For the video row, use a recorder such as `playwright-cli`, or take a numbered screenshot sequence per step.

## Lavish mode

The plain `index.html` is the default and needs no other tool.
When `lavish-axi` is installed, the agent opens the same file in Lavish for review instead of `open`, answers the reviewer's comments there, re-runs a disputed row and updates the page.
Without Lavish nothing changes.

## Tests

Use Node 26 or later. At the repository root, run `pnpm install` and `pnpm run check`.
CI checks installation in a fresh home, the frontmatter, the code fences, and the scenario oracle and rule-removal helper.
`pnpm evaluate` checks interpretation: it runs each scenario with the rule and with the rule removed.
It needs a model runner you supply, and it is a development check, not a CI test.

```sh
pnpm --filter prove-it evaluate /tmp/prove-it-evidence MODEL_RUNNER [ARGS...]
```
