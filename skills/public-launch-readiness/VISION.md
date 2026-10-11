# public-launch-readiness

Check whether a local or private repository is ready for its first public release.
The skill chooses applicable checks, evidence status, blockers versus optional improvements, and missing access.
The owner decides rights attestation, licence, name-risk acceptance, public or private scope, support promises,
visibility and launch approval.

Assessment starts read-only. A readiness request does not approve licence selection, a visibility change,
a tag push, package publication or any post. Approval names the action, repository, commit or version,
destination and content. The skill never rewrites history by itself; migration to a fresh repository also
requires approval. Private values never enter reports: only file, line and value category are recorded.
These are prompt instructions, not enforcement.

Each run produces evidence rows tied to the inspected commit or artifact: check, PASS / FAIL / UNVERIFIED /
N/A with reason, evidence locator or command and result, blocker or optional, next action and owner.
Missing evidence stays UNVERIFIED. Overall results are “no demonstrated blocker in the checked scope”,
“known blockers” or “insufficient evidence”; none approves publication.

The report is printed or written outside the repository. Reports, raw scanner output and “safe to publish”
certificates are never committed. Only lasting policy belongs in RELEASING.md, within authorized editing scope.

Version one leaves out legal conclusions, automatic licence choice, automatic cleanup, history migration,
promotion, registries beyond the chosen distribution, release automation and a separate privacy skill.
Any extension of that scope is a proposal, not an accepted requirement.

## Accept / resist

Accept a change when it helps the owner assess a first public launch using demonstrated, bounded evidence,
preserves owner decisions and action approvals, and keeps run evidence and private values out of the repository.
Resist a change that claims approval or enforcement, hides missing evidence, publishes or cleans up by default,
or introduces work excluded from version one.
