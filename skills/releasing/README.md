# releasing

Create or review `RELEASING.md`, or check a candidate commit for a later release of an already public project.
The skill returns bounded evidence and owner decisions; it never approves a release.
For a first public launch, use `public-launch-readiness`.
This is a prompt package: its instructions guide an agent and enforce nothing.

## Install and use

Copy this directory to an agent's supported skill directory, retaining `SKILL.md` and `references/`.
For agents that discover `.agents/skills`, a project-local destination is `.agents/skills/releasing/`.
No personal settings, sibling skill, scanner installation or author's dotfiles are required.
Two requests load it:

- "Create or review RELEASING.md so a maintainer can prepare, verify and recover a release without private setup knowledge."
- "Check candidate COMMIT for release VERSION using this project's release procedure."

The file requires explicit signed tags (`git tag -s`, then `git verify-tag`), a recovery section, and the rule
that a published version or tag is never replaced.
A check prints its report or writes it outside the inspected repository, tied to the candidate commit.
Never commit a report, scanner output or a certificate. Only lasting policy belongs in `RELEASING.md`.
The skill pushes no tag, creates no release, publishes nothing and posts nothing without explicit approval
that names the action, the repository, the commit or version and the destination.

## Layout

| Path                                                     | Purpose                                                     |
| -------------------------------------------------------- | ----------------------------------------------------------- |
| [SKILL.md](SKILL.md)                                     | Both modes, required policy, evidence rules and limits      |
| [references/releasing-md.md](references/releasing-md.md) | Parts of `RELEASING.md` with an example                     |
| [VISION.md](VISION.md)                                   | Package acceptance policy                                   |
| [CHANGELOG.md](CHANGELOG.md)                             | User-facing changes                                         |
| `tests/`                                                 | Installation checks, scenario oracle and rule-removal tests |

## Checks

Use Node 26 or later. At the repository root:

```sh
pnpm install
pnpm run check
```

CI tests consume a copied skill from a scratch home, resolve its resources, and check that each scenario's
decisive rule is present and that removing it makes the scenario go red. They do not claim that finding
prompt phrases proves agent behavior, and do not call a live model.

Development evaluation is explicit and uses synthetic evidence only:

```sh
mkdir -p /tmp/releasing-evidence
pnpm --filter releasing evaluate /tmp/releasing-evidence MODEL_RUNNER [ARGS...]
```

The runner reads a prompt from stdin and emits an assessment JSON object on stdout. Use a model consumer with
tools, hooks, skills and repository discovery disabled. Each scenario runs with the original text and again
with its matching rules removed. An evaluation passes only when the restored scenario passes and the
removed-rule scenario goes red. This is a bounded interpretation test, not enforcement.

## Research

The package text is original. It does not use the text of any candidate skill.
The scout that informed it read these candidates; none of their text is copied:

- [phatysddev release-check](https://github.com/phatysddev/skills/blob/11b3eeafc27e7cf0fe5feefa53f953e389392c2a/.agents/skills/release-check/SKILL.md): research only.
- [Trail of Bits open-sourcing](https://github.com/trailofbits/skills/blob/442fc9d6c89b1e937e6f7a477e7071ea75fcbea4/plugins/open-sourcing/skills/open-sourcing/SKILL.md): research only (CC BY-SA).

Licensed under [MIT](LICENSE).
