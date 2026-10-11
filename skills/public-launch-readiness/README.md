# public-launch-readiness

Check whether a local/private repository is ready for its first public release.
The skill returns bounded evidence and owner decisions; it never approves publication.
For a later version of an already public project, use that project's release procedure.
This is a prompt package: its instructions guide an agent and enforce nothing.

## Install and use

Copy this directory to an agent's supported skill directory, retaining `SKILL.md`, `references/` and `assets/`.
For agents that discover `.agents/skills`, a project-local destination is `.agents/skills/public-launch-readiness/`.
No personal settings, sibling skill, scanner installation or author's dotfiles are required.
Use the request: “Check whether this local/private repository is ready for its first public release.”

Each run prints a report or writes it outside the inspected repository, tied to the candidate commit.
Never commit readiness reports, raw scanner output or publication certificates. Only lasting, owner-approved
policy belongs in `RELEASING.md`, within granted editing scope.

## Layout

| Path                                                       | Purpose                                                                 |
| ---------------------------------------------------------- | ----------------------------------------------------------------------- |
| [SKILL.md](SKILL.md)                                       | First-launch assessment and action boundaries                           |
| [references/privacy-audit.md](references/privacy-audit.md) | Data categories, provenance and history/hosted coverage limits          |
| [assets/report.md](assets/report.md)                       | Compact evidence report template                                        |
| [VISION.md](VISION.md)                                     | Package acceptance policy                                               |
| [CHANGELOG.md](CHANGELOG.md)                               | User-facing changes                                                     |
| `tests/`                                                   | Installation/output contract checks and development scenario evaluation |

## Checks

Use Node 26 or later. At the repository root:

```sh
pnpm install
pnpm run check
```

CI tests consume a copied skill from a scratch home, resolve its resources, check the report's owned output
contract and exercise the scenario oracle with correct and incorrect assessment outputs. They do not claim
that finding prompt phrases proves agent behavior, and do not call a live model.

Development evaluation is explicit and uses synthetic evidence only:

```sh
mkdir -p /tmp/launch-evidence
pnpm --filter public-launch-readiness evaluate /tmp/launch-evidence MODEL_RUNNER [ARGS...]
```

The runner reads a prompt from stdin and emits an assessment JSON object on stdout. Use a model consumer with
tools, hooks, skills and repository discovery disabled. Evaluation runs from a temporary directory; it writes
proof only to the supplied directory outside the repository. It never installs into real agent settings.
The scenarios cover absent earlier tags, unread history, fixture provenance, audit-only authority, migration,
private-value redaction, public installation, portable signing/recovery, rights and inaccessible hosted surfaces.
Each runs with the original policy and again with its matching rules removed from the supplied package text.
An evaluation passes only when the restored scenario passes and the removed-rule scenario goes red.
Review saved decisions and their quoted policy basis: this is a bounded interpretation test, not enforcement
or evidence that arbitrary future agents cannot violate the instructions. A surviving mutation is a failed check.

## Research

The package text is original. These source-read candidates informed the scout; no third-party skill text is copied:

- [Trail of Bits open-sourcing](https://github.com/trailofbits/skills/blob/442fc9d6c89b1e937e6f7a477e7071ea75fcbea4/plugins/open-sourcing/skills/open-sourcing/SKILL.md): first-launch coverage benchmark (CC BY-SA research only).
- [Leochens pre-open-source](https://github.com/Leochens/skill-pre-open-source/blob/d18688bebd4ecb738756dd9f2710472b9db07f9f/SKILL.md): read-only assessment and rights coverage.
- [phatysddev release-check](https://github.com/phatysddev/skills/blob/11b3eeafc27e7cf0fe5feefa53f953e389392c2a/.agents/skills/release-check/SKILL.md): candidate identity, bounded checks and missing-evidence distinctions.

Licensed under [MIT](LICENSE).
