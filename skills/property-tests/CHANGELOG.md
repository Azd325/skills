# Changelog

All notable changes to property-tests are recorded in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `SKILL.md`: the property-tests skill. It asks for properties instead of hand-picked examples, takes each property from the contract, and names its kind: round-trip, invariant, idempotency, equivalence or differential. It uses the project's property library, or adds fast-check, Hypothesis or proptest only with the developer's consent. Runs are seeded and deterministic, and each shrunk counterexample becomes a regression example.
- `SKILL.md`: a differential workflow. The old system is the oracle and runs against isolated data. Inputs are generated or replayed, never hand-picked. Fields that carry no meaning are normalized by named rules, and each intended difference goes on an approved list with its reason.
- `SKILL.md`: a mutation proof for each test, and a report with the properties, the generator, the runs and seed, the counterexamples, the differences, the proof and the gaps.
- `VISION.md`: the acceptance policy for the package, as a proposal for the author to review.
- Installation, frontmatter and code-fence tests, a scenario oracle with rule-removal tests, a test that `SKILL.md` states each decisive rule only in the lines that its removal deletes, and an `evaluate` development script.
