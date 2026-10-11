# RELEASING.md parts and example

Use this reference when you draft or review the file in mode 1.
Each part is a heading. Each heading answers one question a maintainer would otherwise ask the author.
Fill a part from the project's own scripts, CI and history. If the project has no answer, keep the question.

## Parts

| Part                       | Question it answers                                         |
| -------------------------- | ----------------------------------------------------------- |
| Distribution               | What ships, where, for which platforms?                     |
| Version source             | Which one place holds the version?                          |
| Checked commit             | How is the exact candidate named and checked out?           |
| Safe validation            | Which commands run with no device, credential or live data? |
| Privacy categories         | Which kinds of data must not appear in a release?           |
| Tag and signature          | Which commands sign and verify the tag?                     |
| Notes                      | Where do release notes live, and what must they state?      |
| External approval          | Who approves each external action, and where is it noted?   |
| Clean-install verification | How is a stranger's install of this exact version proven?   |
| Recovery                   | What happens when a published release is broken?            |

Link SECURITY, CONTRIBUTING and the changelog. Do not repeat their rules here.
Keep run evidence out of the file. The file holds policy; each release check holds its own report.

## Example

The values below are for a made-up source-only tool. Replace every one from the project.

```markdown
# Releasing

## Distribution

Source only, as a Git tag `vX.Y.Z` on GitHub. No binaries. Linux and macOS.

## Version source

`VERSION` holds X.Y.Z. The tag is `v` plus that value.

## Checked commit

Release from a commit on `main` with a clean tree. Record `git rev-parse HEAD` in the release notes.

## Safe validation

`make test` and `make lint`. No command here talks to a device or needs a credential.

## Privacy categories

No credentials, home paths, hostnames, device addresses or captured responses in files, history or notes.

## Tag and signature

    git tag -s vX.Y.Z -m "vX.Y.Z"
    git verify-tag vX.Y.Z

Do not rely on `tag.gpgsign`. The signing identity is set up as described in CONTRIBUTING.

## Notes

GitHub release notes. State scope, limits and setup changes. See CHANGELOG.

## External approval

The maintainer approves each push, release and post by name, commit and destination in the release issue.

## Clean-install verification

In a scratch directory with a clean home, install `vX.Y.Z` with the documented command.
Run `tool --version` and check that it prints X.Y.Z.

## Recovery

The maintainer decides. A published version or tag is never replaced or moved.
Choose one: point users to the previous working version, publish a corrective patch release,
or withdraw or deprecate the version where the ecosystem supports it.
Verify the choice with the clean-install steps. Link the decision from the release notes.
```
