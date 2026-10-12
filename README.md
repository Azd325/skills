# skills

[![CI](https://img.shields.io/github/actions/workflow/status/Azd325/skills/ci.yml?branch=main)](https://github.com/Azd325/skills/actions/workflows/ci.yml) [![Licence: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Packages for coding agents by Tim Kleinschmidt (Azd325).

| Package                                                             | What it does                                                                                                                                                        |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [quiet-mode](plugins/quiet-mode/README.md)                          | Stops unattended coding agents from reaching coworkers: no push, PR, comment, ticket update, message or publish while the mode is on. Scaffold: blocks nothing yet. |
| [invent-work](skills/invent-work/README.md)                         | Chooses what to build next when nobody hands you a roadmap: ranks candidate work on evidence and reports at most five candidates. Prompt skill: recommends only.    |
| [public-launch-readiness](skills/public-launch-readiness/README.md) | Assesses a repository's first public launch with bounded evidence, privacy/provenance checks and owner decisions; never approves publication.                       |
| [releasing](skills/releasing/README.md)                             | Creates or reviews `RELEASING.md` and checks a later release against it: signed tags, verified install, recovery, no replaced version; never approves a release.    |
