# quiet-mode

Stops unattended coding agents from reaching coworkers: no push, PR, comment, ticket update, message or publish while the mode is on.

Status: scaffold. The guard is not built yet, so nothing is blocked.

- [VISION.md](VISION.md): what the package accepts and resists.
- [docs/research.md](docs/research.md): the harness research behind the design.
- [CHANGELOG.md](CHANGELOG.md): changes per release.

## Layout

| Path                    | Holds                                                           |
| ----------------------- | --------------------------------------------------------------- |
| `guard/`                | The one shared guard. It makes every decision.                  |
| `adapters/claude-code/` | The PreToolUse hook that calls the guard.                       |
| `adapters/pi/`          | The `tool_call` extension that calls the guard.                 |
| `rules.json`            | The declarative rule file: core rules and optional rules.       |
| `tests/`                | One test per rule. Each test goes red when its rule is removed. |
| `skills/quiet-mode/`    | Agent-facing text. It informs the agent; it enforces nothing.   |
| `AGENTS.md`             | Notes for agents that change this package.                      |
| `.claude-plugin/`       | The Claude Code plugin manifest.                                |

## Develop

Node 26 or later runs the TypeScript sources directly. There is no build step; `tsc` only type-checks.

```sh
pnpm install
pnpm typecheck
pnpm test
```

`pnpm test` fails when it finds no test file.
