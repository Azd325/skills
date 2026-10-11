# releasing

Create or review `RELEASING.md` so a maintainer can prepare, verify and recover a release without private
setup knowledge, and check a candidate commit for a later release against that file.
The package owns that one file. It links SECURITY, CONTRIBUTING and the changelog and does not own them.

## Decided

Two modes. Mode 1 drafts or reviews `RELEASING.md` from the project's existing policy and history.
It records distribution, version source, checked commit, safe validation, privacy categories, tag and signature
policy, notes, external approval, clean-install verification and broken-release recovery.
Mode 2 checks candidate COMMIT for release VERSION using the project's procedure. The skill decides candidate
identity, evidence for the difference and compatibility, agreement of notes and version, proof of the exact
install, tag and signature evidence, and recovery gaps.

The owner or project decides distribution, supported platforms, release scope, version and compatibility
promises, the signing identity, changelog policy, risk acceptance, release approval and every external action.

Policy the file must require: explicit signed tags (`git tag -s`, then `git verify-tag`) that do not depend on
personal git settings such as `tag.gpgsign`; a recovery section; and the rule that a published version or tag is
never replaced. For a broken release a human chooses between guidance to the previous version, a corrective
patch release, and a withdrawal or deprecation that the ecosystem supports.

Evidence rule: a check writes its report outside the repository or prints it, tied to the inspected commit.
It never commits a report, scanner output or a certificate. A check that cannot be shown is UNVERIFIED, never
PASS. Statuses are PASS / FAIL / UNVERIFIED / N/A, as in `public-launch-readiness`. The skill never says that a
release is approved.

Limits: the skill pushes no tag, creates no release, publishes no package and posts nothing without explicit
approval that names the action, the repository, the commit or version and the destination. A check request is
not that approval. Private values never enter a report: name the file, the line and the kind of value only.
These are prompt instructions, not enforcement.

Version one leaves out publishing implementations, registry credentials, CI rewrites, release campaigns, a
mandatory board interface and a standalone privacy audit. A first public launch belongs to
`public-launch-readiness`. Any extension of this scope is a proposal, not an accepted requirement.

## Accept / resist

Accept a change when it helps a maintainer prepare, verify and recover a release from `RELEASING.md`, keeps
every owner decision and external action with the owner, and keeps run evidence and private values out of the
repository.
Resist a change that claims approval or enforcement, hides missing evidence, performs an external action,
replaces a published version, or adds work that version one leaves out.
