# Changelog

All notable changes to prove-it are recorded in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `SKILL.md`: the prove-it skill. It runs the real thing, captures artifacts into a bundle under the git common dir and writes a one-page proof report with a claim matrix, a "Not proven" list, the files to read and the gates.
- `VISION.md`: the acceptance policy for the package.
- `SKILL.md`: a `git cherry` check for a change that main already holds, a "Not proven" finding for a bug that does not reproduce on "before", a browser-parsed check for "nothing else changed" on a transform, mutation red only from a failed assertion on old code, consent-overlay dismissal before screenshots, one line to reuse the running stack's backing services, and a "Clean up" step before "Report back".
- `SKILL.md`: an optional Lavish mode. When `lavish-axi` is installed, the agent reviews the same `index.html` in Lavish and answers comments there. Without Lavish nothing changes.
- Scenario oracle, rule-removal tests and an `evaluate` development script for the new rules.
- Installation, frontmatter and code-fence tests.
