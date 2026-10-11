---
name: releasing
description: Create or review RELEASING.md so a maintainer can prepare, verify and recover a release, or check a candidate commit for a later release of an already public project. Not for a first public launch (use public-launch-readiness).
---

# Releasing

This skill owns one file, `RELEASING.md`, and one check of a later release against that file.
Use [references/releasing-md.md](references/releasing-md.md) for the parts of the file and an example.
This prompt guides a review; it does not enforce controls and it never approves a release.

## Choose the mode

- Mode 1, the project file: "Create or review RELEASING.md so a maintainer can prepare, verify and recover a release without private setup knowledge."
- Mode 2, the later-release check: "Check candidate COMMIT for release VERSION using this project's release procedure."
- A repository that was never public needs `public-launch-readiness` first. Say so and stop.
- Read AGENTS.md, VISION.md, RELEASING.md, CONTRIBUTING.md, SECURITY.md and the changelog when present.
- Link SECURITY, CONTRIBUTING and the changelog from RELEASING.md. Do not copy or own their policy.

## Authority and limits

Start read-only. Both modes inspect files, history and hosted metadata first.
A request for a draft, a review or a check is not approval for any external action.
Never push a tag, create a release, publish a package or post a notice without explicit approval.
Approval names the action, the repository, the commit or version, and the destination.
A check request is not approval for a tag, push, release, publication or post.
When no explicit approval exists for an external action, the approval row is UNVERIFIED, never PASS.
Refuse a request to replace, move or delete-and-recreate a published tag or version.
Offer the recovery options in RELEASING.md instead; a human chooses one.
Edit RELEASING.md only when the request grants that editing scope. A review changes nothing.
The owner or project decides:

- distribution and supported platforms
- release scope, version and compatibility promises
- the signing identity and changelog policy
- risk acceptance, release approval and every external action

Ask for a missing decision. Do not make it for the owner.
Inspect a command and its hooks before you run it. Write output to a directory outside the repository.
Do not run live hardware or service tests, deploy hooks or migrations.
Do not install a missing tool or download an artifact without an access review.

## Mode 1: the project file

Derive the draft from the project's existing policy, scripts, CI and release history, not from a template.
Where a section has no source, write a question for the owner. Do not invent a value.
RELEASING.md records:

- distribution: what ships, where, and for which platforms
- version source: the one file or tag that holds the version
- checked commit: how a maintainer names the exact candidate
- safe validation: commands that need no live device, credential or private data
- privacy categories: what must not appear in a release, by category
- tag and signature policy: see the next section
- notes: where release notes live and what they must state
- external approval: who approves each external action, and how that is recorded
- clean-install verification: how a stranger's install of the exact version is proven
- recovery: what happens when a published release is broken

Review a file the same way. Quote the line that meets or misses each part.
Presence of a heading is not coverage: read the instructions and run no command from it.

## Policy that RELEASING.md must require

Tag instructions use explicit signing, then verification: `git tag -s`, then `git verify-tag`.
Tag instructions that depend on `tag.gpgsign` or another personal git setting FAIL the review.
A tag-existence check, such as `gh release create --verify-tag`, is not signature verification.
Signing identity setup is the owner's decision. The file names where it is documented.
A RELEASING.md without a recovery section FAILS the review.
The recovery section says who decides, and how users learn which version works.
A published version or tag is never replaced, moved or re-created. Recovery adds a new version.
For a broken release, a human chooses one of these:

- guidance that sends users to the previous working version
- a corrective patch release
- a withdrawal or deprecation that the ecosystem supports

The file records how the chosen recovery is verified. It does not choose for the maintainer.
Every external step in the file names its approval. A step without one is a gap.

## Mode 2: check a later release

Use this project's RELEASING.md as the procedure. If it is missing or lacks a part, say so.
A missing part is a gap in the project file, not a failure of the candidate.
Decide these items for the named COMMIT and VERSION:

- Candidate identity: the full commit, the clean or dirty tree, the version source and the refs read.
- Difference and compatibility: the changes since the previous release, and the evidence for any promise.
- Notes and version: the release notes, the version file and the intended tag agree.
- Exact install: the install route in RELEASING.md run in a scratch directory with a clean home.
- Tag and signature: the tag object, the commit it points to, and its `git verify-tag` result.
- Recovery: the recovery section exists and covers this release's distribution.

A local checkout test does not prove an install from the published route.
A signature that was not verified with `git verify-tag` stays UNVERIFIED.
A tag that does not exist yet is UNVERIFIED for a candidate, not FAIL.
CI evidence counts only for the same commit. Record the job and its scope.
Do not carry a PASS to another commit. If the candidate changes, repeat the affected checks.

## Evidence and status

Each row names the check, status with reason, commit or artifact, locator or command and result,
blocker or optional, and next action with owner.
PASS means observed evidence meets the requirement in the stated scope.
FAIL means an observed mismatch with a requirement. Describe it without private values.
UNVERIFIED means the check cannot be shown. It is never PASS. A check that was not run is UNVERIFIED.
N/A means the check does not apply and gives the reason. Missing evidence is not an N/A reason.
Name each missing access or decision, and who can supply it.

## Report

Print the report, or write it outside the repository, tied to the inspected commit.
Never commit a report, scanner output or certificate. Say this in the report.
Only lasting policy goes into RELEASING.md, and only with granted editing scope.
Private values never enter a report. Record the file, the line and the kind of value only.
Do not print a prefix of a value or a command argument that holds one.
Report "known blockers", or "insufficient evidence" when required checks are UNVERIFIED,
or "no demonstrated blocker in the checked scope".
Close with the candidate identity and this statement: this check does not approve the release.
