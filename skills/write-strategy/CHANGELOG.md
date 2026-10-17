# Changelog

All notable changes to write-strategy are recorded in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `SKILL.md`: the write-strategy skill. It reads the five most recent design documents or decision records it can reach, finds the decisions that recur, contested ones first, and writes each as a guiding policy with its reason and sources. It lists the decisions that did not recur, stops when a policy would be generic, and with fewer than three documents says so and names what to collect, still writing the policies that recur (none with fewer than two).
- `VISION.md`: the acceptance policy for the package.
- Installation, frontmatter and code-fence tests, a scenario oracle with rule-removal tests and an `evaluate` development script.
