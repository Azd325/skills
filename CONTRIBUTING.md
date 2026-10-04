# Contributing

Thanks for wanting to contribute.

## Workflow

1. Fork the repo and create a branch.
2. Read the `VISION.md` of the package you change. Your change must pass its closing accept/resist test.
3. Run `pnpm install`, make your change, then run `pnpm run check` at the root until it is green. It runs Prettier, the type checks and every package's tests.
4. Add an entry under `## [Unreleased]` in the package's `CHANGELOG.md` for every user-facing change.
5. Open a pull request against `main`. Name the package in the title.

If you are not sure that a change fits the vision, open an issue first.

CI runs `pnpm run check`. `pnpm run format` fixes formatting.

## Repo Conventions

- Each folder in `plugins/` (code: hooks, extensions) or `skills/` (prompt-only `SKILL.md`) is one package that installs on its own. A change touches one package unless it changes a shared rule.
- The rules for every package, including what a new package needs, are in [AGENTS.md](AGENTS.md#rules-for-every-package).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
