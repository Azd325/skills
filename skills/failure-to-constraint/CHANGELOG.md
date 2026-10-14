# Changelog

All notable changes to failure-to-constraint are recorded in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `SKILL.md`: the failure-to-constraint skill. It turns one confirmed failure into the smallest control, proposes before it edits, and proves that the control rejects the failure, goes red when disabled and runs on the real path.
- Checkable definitions of silent-control and asymmetric protection failures, which qualify on their first observation; other failures qualify on a second occurrence or an explicit request.
- `VISION.md`: the acceptance policy for the package.
- Installation, frontmatter, description-limit, code-fence and scenario tests tied to the rule lines of `SKILL.md`, and a development-only model evaluation command.
