# Changelog

All notable changes to invent-work are recorded in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Make all eleven signals' argument and timing explicit, use a fixed four-step order, and define corroboration across signal groups.
- Count a leader's repeated topic at twice in one week; keep strong and weak signal notes separate from ranking.
- Replace report guidance with a fixed template, an evidence/order/source self-check and a short fictional example.

### Added

- Installation and scenario oracle tests, rule-removal checks and a development-only model evaluation command.

- `SKILL.md`: the invent-work skill. It collects candidate work from four signal sources, ranks it on two axes and reports at most five candidates with their evidence.
- `VISION.md`: the acceptance policy for the package.
