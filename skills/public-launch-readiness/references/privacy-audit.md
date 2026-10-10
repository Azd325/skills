# Privacy audit for a first public launch

Read this before inspecting repository data. This is an assessment method, not a scanner or guarantee.
Use the project's privacy categories and record the candidate commit before checking any surfaces.
Keep findings and temporary exports outside the repository; do not retain raw private output in the report.

## Define coverage

List tracked paths at the candidate and any separately checked working-tree changes.
Enumerate available local branches, tags and remote-tracking refs; record missing or stale remote access.
Check whether the clone is shallow, partial or missing objects before describing reachable-history coverage.
`git rev-list --objects --all` can enumerate objects reachable from local refs; it does not prove server coverage.
Read relevant text blobs through an installed tool or `git cat-file`; count what was actually inspected.
Review commit messages, author/committer metadata and tag messages for identifying or confidential material.
Record binary, large, unreadable and skipped objects separately. A path sample is not an all-history audit.
Report aliases/renames honestly when one locator stands for a blob appearing at multiple historical paths.

Unreachable objects, reflogs, deleted server refs/caches and objects absent locally are separate limits.
Untracked/ignored files are not automatically distributed; inspect them only if the chosen artifact includes them.
Submodules and Git LFS pointers do not inspect their target content. Record access and target coverage separately.
Encoded/encrypted material and archives require an understood local inspection method or stay UNVERIFIED.
If history is unread or incomplete, keep its row UNVERIFIED even if the tracked tree looks clean.

## Categories to inspect

Credentials: tokens, passwords, private keys, signing material, connection strings and credential-bearing URLs.
Personal/organizational data: emails, home paths, names, internal domains, private endpoints and customer records.
Device/network data: IPs, MACs, serial numbers, hostnames, SSIDs and captured protocol responses.
Financial/account data: wallet/payout addresses, pool users, account identifiers and private service logs.
Project-specific data: add categories from RELEASING.md, threat model, fixtures and actual integration inputs.
Inspect examples, configuration, fixtures, snapshots, logs, screenshots, datasets and generated artifacts.
Review filenames and metadata too, without assuming a suspicious filename proves exposure.
Do not print content merely to search it. Prefer local tools with verified redaction and telemetry settings.

## Choose and bound tools

Inspect an available scanner's help/configuration before running it; note tool version and detection settings.
Use local/offline scanning without network credential verification unless that exact action is authorized.
Ensure the tool can avoid disclosing matches through stdout, stderr, debug logs, telemetry and result files.
If it cannot, do not run it on private data; name the missing safe tool as an evidence limitation.
Pattern searches can complement a scanner for project-specific values; neither proves absence of all secrets.
Read and sanitize command arguments and diagnostics before including a command/result in evidence.
Record scope, exit result, counts and categories instead of raw scanner output.
No matches means no matches from those detectors in that scope; never infer universal absence.
Do not install tools, upload blobs or invoke a remote verifier as an implicit part of assessment.

## Resolve matches by provenance

Classify matches as confirmed private exposure, confirmed synthetic/authorized data, false positive or unknown.
Test-directory placement and placeholder-like shape alone do not establish synthetic origin.
Ask the owner whether a fixture was generated, copied from a real capture or approved for redistribution.
Record the attestation source/date and locator, without reproducing the value or its prefix.
Confirmed synthetic data can PASS its provenance check; it is distinct from a real leak.
Authorized real data needs evidence that this public disclosure is within that authorization.
Unknown provenance stays UNVERIFIED. A confirmed exposed private value is FAIL.
Keep per-finding provenance separate from the completeness of the scan; one resolved match does not pass history.
Generic fields named token, hashes or documentation syntax may be false positives; record the reason.
Do not “fix” evidence by replacing matched strings automatically: useful tests may depend on realistic shapes.

For a confirmed credential exposure, advise the owner about revocation/rotation and reachable copies.
Deleting it in HEAD does not remove prior public exposure or the history that contains it.
History rewriting, a fresh-repository migration, archiving or deletion require a separate owner decision and approval.
No cleanup or migration is performed by this reference.

## Hosted surfaces before visibility changes

Identify the remote host and what becomes public when repository visibility changes.
Review accessible issue/PR bodies and comments, discussions, wiki, CI logs/artifacts, releases/assets and pages.
Check public profiles or metadata only to the extent relevant to the planned launch; do not collect unnecessary data.
Avoid bulk artifact downloads without reviewing access, size, content risks and local handling first.
Repository settings prove configuration, not the privacy of every hosted body or artifact.
Unavailable surfaces stay UNVERIFIED with the access owner and required follow-up.
A local-only repository can mark nonexistent hosted surfaces N/A with a reason; recheck if hosting is introduced.

## Report without values

Use file:line, object/commit or an approved hosted locator, category, status, reason and owner action.
If a filename, URL or locator itself contains private data, replace that segment with a category placeholder.
Exclude private values, secret prefixes, captured responses and unsanitized errors from reports and outbound requests.
Report outside the repository or print a sanitized result; never commit audit evidence or raw scanner output.
State refs/surfaces, counts, tools, categories and exclusions so another reviewer can understand the limits.
Recheck affected scope after an authorized fix or candidate change; previous PASS is not transferable.
End with remaining privacy blockers and evidence gaps, never a “safe to publish” certificate.
