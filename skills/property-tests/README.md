# property-tests

Writes property-based and differential tests.
A property states in plain language what must never break: a round-trip, an invariant, idempotency or equivalence with a simple version.
A seeded generator then tries many inputs to break it.
In a rewrite or a migration, the old system is the oracle: the old and the new system run on the same generated or replayed inputs, and each mismatch is a bug or an approved difference.

It is a prompt-only skill: it enforces nothing.
It writes test files and changes nothing else.
It adds a property library only with your consent, and it proves that each test goes red on a plausible wrong implementation.

- [SKILL.md](SKILL.md): the text that the agent loads.
- [VISION.md](VISION.md): what the package accepts and resists.
- [CHANGELOG.md](CHANGELOG.md): changes per release.

## Install

With the [`skills`](https://github.com/vercel-labs/skills) CLI:

```sh
npx skills add Azd325/skills --skill property-tests
```

Without it, copy `SKILL.md` into a folder named `property-tests` in the skills directory of your agent, for example `~/.claude/skills/property-tests/` for Claude Code.

## Use

Ask the agent for a "property test", a "differential test" or to "compare old and new".
It fits a parser, a formatter, a serializer, a pricing rule or another pure function with a clear contract, a refactor that must keep behavior, and a rewrite with an old system to compare against.
When a [frame-task](../frame-task/README.md) memo names a property or a differential check in its `Done when` line, the skill starts from that check.

For a UI flow, an end-to-end test fits better.
For one confirmed failure, use [failure-to-constraint](../failure-to-constraint/README.md).

## Tests

Use Node 26 or later. At the repository root, run `pnpm install` and `pnpm run check`.
CI checks installation in a fresh home, the frontmatter, the code fences, the scenario oracle, parser and rule-removal helper.
These deterministic tests do not prove model interpretation and call no live model.

For development-only evaluation with synthetic evidence:

```sh
mkdir -p /tmp/property-tests-evidence
pnpm --filter property-tests evaluate /tmp/property-tests-evidence MODEL_RUNNER [ARGS...]
```

The runner reads a prompt on stdin and emits assessment JSON on stdout, with tools, hooks, skills
and repository discovery disabled. Each scenario runs with the original policy and with its rule
removed. Passing requires the restored assessment to pass and the removed-rule assessment to go red.
Keep evaluation output outside the repository. This checks interpretation; it enforces nothing.
