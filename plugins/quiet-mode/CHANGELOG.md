# Changelog

All notable changes to quiet-mode are recorded in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- The minimum Node version is now 26 (`engines.node` is `>=26`), and CI runs on Node 26.

### Added

- `VISION.md`: the acceptance policy for the package.
- `docs/research.md`: the harness research behind the design.
- Plugin scaffold: `.claude-plugin/plugin.json`, `skills/quiet-mode/SKILL.md`, `rules.json` stub, empty `guard/` and `adapters/`, and a shape test for `rules.json`. The guard blocks nothing yet.
