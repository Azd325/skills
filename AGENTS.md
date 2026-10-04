# AGENTS.md

This repository is the `azd325/skills` collection.
Each folder in `plugins/` (code: hooks, extensions) or `skills/` (prompt-only `SKILL.md`) is one package that installs on its own.

## Orientation

- Each package's `VISION.md` is its acceptance policy and covers only that package.
- Before you change a package, read its `VISION.md`. Run its closing accept/resist test against `VISION.md` alone.
- When a change fails that test, stop and tell the author. Do not edit `VISION.md` to make the change pass.
- A package may have its own `AGENTS.md`. Read it before you change the package.
- `README.md` at the root lists the packages; each package `README.md` holds its layout and commands.

## Rules for every package

- Rules that apply to every package live in this file, not in a package vision.
- A prompt skill never claims enforcement; enforcement is code with tests.
- Every rule has a test that goes red without it. Remove the rule, see the test fail, then restore the rule.
- A package installs without the author's dotfiles.
- Each package keeps its own `CHANGELOG.md`. Add every user-facing change under `## [Unreleased]` in the same commit.
- A new package needs its own `VISION.md`, `README.md`, `CHANGELOG.md` and `LICENSE`, a row in the root `README.md`, and, for a plugin, an entry in `.claude-plugin/marketplace.json`. Its own `AGENTS.md` is optional.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this repository.
Do not repeat what the code already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
