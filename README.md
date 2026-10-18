# skills

[![CI](https://img.shields.io/github/actions/workflow/status/Azd325/skills/ci.yml?branch=main)](https://github.com/Azd325/skills/actions/workflows/ci.yml) [![Licence: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Packages for coding agents by Tim Kleinschmidt (Azd325).

| Package                                                             | What it does                                                                                                                                                                                   |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [quiet-mode](plugins/quiet-mode/README.md)                          | Stops unattended coding agents from reaching coworkers: no push, PR, comment, ticket update, message or publish while the mode is on. Scaffold: blocks nothing yet.                            |
| [invent-work](skills/invent-work/README.md)                         | Chooses what to build next when nobody hands you a roadmap: ranks candidate work on evidence and reports at most five candidates. Prompt skill: recommends only.                               |
| [public-launch-readiness](skills/public-launch-readiness/README.md) | Assesses a repository's first public launch with bounded evidence, privacy/provenance checks and owner decisions; never approves publication.                                                  |
| [releasing](skills/releasing/README.md)                             | Creates or reviews `RELEASING.md` and checks a later release against it: signed tags, verified install, recovery, no replaced version; never approves a release.                               |
| [prove-it](skills/prove-it/README.md)                               | Produces proof that a change works before review: runs the real thing, captures artifacts into a bundle and writes a one-page report with a "Not proven" list. Prompt skill: enforces nothing. |
| [failure-to-constraint](skills/failure-to-constraint/README.md)     | Turns one confirmed failure into the smallest control that rejects it, with proof that it goes red when disabled and runs on the real path; proposes before it edits.                          |
| [frame-task](skills/frame-task/README.md)                           | Frames one chosen task before any code: a decision memo, ranked missing context, unchecked assumptions and one next step sized to confidence. Prompt skill: recommends only.                   |
| [write-strategy](skills/write-strategy/README.md)                   | Writes the decisions that recur in recent design documents and decision records as guiding policies, each with its reason and sources. Prompt skill: writes a draft only.                      |
| [property-tests](skills/property-tests/README.md)                   | Writes property-based and differential tests from the contract: seeded runs, saved counterexamples and proof that each test can fail. Prompt skill: writes test files only.                    |
