# Changelog

All notable changes to frame-task are recorded in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `SKILL.md`: the frame-task skill. It frames one chosen task as a decision memo, a ranked list of missing context, the unchecked assumptions and one next step sized to confidence (ship now, throwaway prototype, proposal first). It tests a merged need as a hypothesis, weighs a recurring problem above a first request and hands a choice between candidate tasks to `invent-work`.
- `VISION.md`: the acceptance policy for the package.
- Installation, frontmatter and code-fence tests, a scenario oracle with rule-removal tests and an `evaluate` development script.

### Changed

- `SKILL.md`: the proposal-first next step now has a threshold. Write a design proposal first only when the work will serve many future projects, changes what users get, or takes more than a month of engineering time. Otherwise the step is ship now or a throwaway prototype. When the threshold is met but the facts are uncertain, the step is a throwaway prototype first.
- `SKILL.md`: the frame now names one check that proves the next step done: an end-to-end flow, a property that must never break, or a differential comparison with the old system. The report carries it in a new `Done when` line. When no runnable check is possible yet, the frame says so and names what is missing.
