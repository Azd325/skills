---
name: public-launch-readiness
description: Check whether this local/private repository is ready for its first public release. Use for a first public launch, not a later version of an already public project.
---

# Public launch readiness

Assess one candidate and return evidence the owner can review before deciding to launch.
This prompt guides assessment; it does not enforce controls or approve publication.
Use [assets/report.md](assets/report.md) for the report and read
[references/privacy-audit.md](references/privacy-audit.md) before inspecting private data.

## Authority and working boundaries

Start read-only: inspect policy, files, history and available hosted metadata before proposing changes.
An audit request authorizes no licence choice, visibility change, push, package publication or post.
Explicit approval must name the action, repository, commit or version, destination and reviewable content.
The owner decides rights attestation, licence, name-risk acceptance, public/private scope, support promises,
visibility and launch approval. Ask for missing decisions without making them on the owner's behalf.
Never rewrite history by yourself. Migration to a fresh repository also requires explicit approval.
Describe cleanup options and their consequences; do not delete findings or create a sanitized replacement.
Ordinary local preparation needs granted editing scope. Keep assessment and preparation distinguishable.

Inspect commands and their hooks before executing them; use disposable outputs outside the repository.
Do not run live hardware/service tests, lifecycle commands, deployment hooks or migrations under this request.
Do not install missing tools or download hosted artifacts without an access and execution review.
Do not send private values to a scanner service or remote credential verifier without separate authorization.
Use installed read-only tools where suitable; record unavailable tools and missing access as evidence limits.

## Identify the first launch

Record repository identity, full candidate commit, dirty-tree differences, date and proposed distribution.
Read AGENTS.md, VISION.md, RELEASING.md, CONTRIBUTING.md and SECURITY.md when present.
Use project policy for supported platforms, safe checks, versioning, signatures and release notes.
Determine whether this is the first public launch rather than inferring it from the tag list alone.
For a first launch, no earlier tag is required: mark prior-release/tag checks N/A with that reason.
Do not fail a repository for lacking an earlier release. Future tag/signature evidence may remain UNVERIFIED.
If the project is already public and the request is a later release, explain the mismatch and use its
release procedure; do not expand this skill into a release executor.

Agree the checked scope: source tree, reachable local refs, chosen distribution and accessible hosted surfaces.
Record which remote refs were available locally; do not silently fetch or switch branches to enlarge the scope.
Separate committed evidence from working-tree changes and older CI results; do not transfer PASS across commits.
If the candidate changes, identify which checks need repeating before the assessment applies again.

## Evidence decisions

Every row names the check, status with reason, commit/artifact, file:line or command/result,
blocker or optional, next action and owner. Split a check when only part of its scope is demonstrated.
PASS means observed evidence meets the applicable requirement in the stated scope.
FAIL means an observed mismatch with that requirement; describe the mismatch without private values.
UNVERIFIED means a check cannot be demonstrated, including unread history or unavailable access; never PASS.
N/A means the check does not apply and includes a reason. Missing evidence is not an N/A reason.
Presence of a file is not readiness: inspect its meaning, consistency and usability.

Classify blockers against project requirements and the chosen public scope, not a generic wish list.
Missing ownership or privacy evidence needs owner resolution before a supported launch recommendation.
Mark unresolved required evidence as blocker/UNVERIFIED, without claiming an observed defect.
Keep optional improvements separate; a code of conduct, SBOM or extra registry is not universally mandatory.
Name each missing decision/access and who can supply it. Do not silently lower an evidence threshold.

## Rights, name and documentation

Check owner/contributor authority, employer restrictions where relevant, and the owner's rights attestation.
Compare the chosen licence with README, manifests, headers and distribution metadata for agreement.
Existing licence text proves a stated choice, not authority to license every included item.
Inventory copied code, templates, datasets, captures, fonts, images and bundled dependency notices.
Check provenance, redistribution terms and required notices for the material actually distributed.
Leave legal conclusions to the owner or qualified adviser; list unresolved rights as UNVERIFIED.

Search for confusingly similar project/package names in the chosen distribution and normal discovery route.
Record query, date, conflicting project and practical confusion; no search proves global uniqueness.
Ask the owner to accept a name risk or choose a distinct name. Do not contact another maintainer or reserve names.

Read documentation as a stranger: problem, intended user, prerequisites, installation, first useful action,
examples, limitations, supported environments, contribution route and maintenance expectations.
Verify links and commands where safely possible; distinguish a future URL from a working route.
Respect source-only distribution and existing release-notes policy; do not impose binaries or a changelog file.
Support promises and response times belong to the owner; do not invent them to fill missing documentation.

## A stranger's first success and checks

Use a scratch directory and clean home/caches to test the documented public install route for this candidate.
Inspect installer behavior first; isolate credentials, agent settings, device access and service side effects.
Record OS/architecture, prerequisite versions, artifact identity, install command and observable first success.
A local checkout test does not prove installation from the chosen public distribution.
If that route is not reachable before launch, leave public-install evidence UNVERIFIED and name the later check.
A safe local rehearsal can have its own PASS row; never relabel it as public-install proof.
Run understood tests/build/lint checks or reuse exact-commit CI evidence with links and job scope.
Record skipped checks and environments; a successful fixture suite does not prove live operation or every platform.
Check the security reporting route is private where promised, reachable and enabled, with an owner to receive it.
A SECURITY.md file or future advisory URL alone cannot demonstrate that route works.

## Privacy and hosted surfaces

Apply the privacy reference to tracked files, reachable history and project-specific data categories.
Record refs, object/file counts, detectors, inspected metadata, excluded surfaces and scanner limitations.
Unread history stays UNVERIFIED even when the current tree has no matches.
A fixture-shaped value is a provenance question: neither a leak nor a PASS merely because it is test data.
Confirmed synthetic fixtures are distinct from real leaks; record the owner's provenance evidence.
Unknown fixture provenance stays UNVERIFIED; a confirmed private exposure is FAIL with an owner action.
Private values never appear in a report: record only file, line, object/commit and kind of value, no prefix.
Review tracked configuration, examples, logs, screenshots, captured responses and generated distribution contents.
Before any later visibility switch, inspect accessible issues/PRs, discussions, wiki, CI logs/artifacts,
releases/assets and other hosted surfaces that the switch would expose; metadata alone is insufficient.
If no remote or hosted surface exists, N/A needs that reason; future hosted checks remain a named follow-up.
Never call a bounded scan a clean-history or “safe to publish” certificate.

## Version, signatures and recovery

Check proposed first version, manifest/source version, candidate identity and release notes agree.
Notes describe scope, limitations and relevant setup changes; first-release notes need no previous-version diff.
Review publication authority and chosen distribution controls without configuring them.
Check signing policy is explicit and portable, including signing identity setup and verification commands.
When signed Git tags are required, instructions must use explicit signing (for example `git tag -s`)
and verification (`git verify-tag`), not personal `tag.gpgsign` defaults or tag-existence checks.
Review those instructions only; do not create a tag to obtain signature evidence under a readiness request.
Actual future tag evidence can remain UNVERIFIED; annotated-only policy needs no invented signing requirement.

Require a recovery rule for a broken public release: who decides, how users get working-version guidance,
and how a corrective version or ecosystem-supported withdrawal/deprecation is verified.
Keep published versions and tags immutable; recovery must not replace or retag an existing version.
For a first launch with no working predecessor, identify a corrective-release or stop-use path.
Record missing recovery policy as a gap; do not perform recovery, publish corrections or post notices.

## Deliver the assessment

Print the report or write it outside the repository, tied to the inspected commit and artifacts.
Never commit a readiness report, scanner output or publication certificate; no raw scanner output in public repos.
Only lasting owner-approved policy belongs in RELEASING.md, and writing it requires granted editing scope.
Include scope/limits, evidence rows, privacy/provenance decisions, known blockers, optional improvements,
missing access, owner decisions and next safe checks. Review locators and prose for private values before output.
Report “known blockers” if demonstrated blockers exist; otherwise “insufficient evidence” if required checks
remain UNVERIFIED; otherwise “no demonstrated blocker in the checked scope”. Preserve optional uncertainty.
Close with the candidate identity and the statement that publication is not approved by this assessment.
