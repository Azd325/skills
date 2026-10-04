# Security Policy

## Reporting a vulnerability

Report a vulnerability privately through [GitHub private vulnerability reporting](https://github.com/azd325/skills/security/advisories/new).
Do not open a public issue for it.

Include the package, the version or commit, the steps to reproduce, and the impact.

## Supported versions

Until a package has its first release, only the latest commit on `main` gets security fixes.
After that, only the latest release of each package gets security fixes.

## What is not a vulnerability

quiet-mode is a courtesy guard, not a security boundary (see its [VISION.md](plugins/quiet-mode/VISION.md)).
It stops an unattended agent from reaching coworkers by accident; it does not stop an agent that tries to escape.
Each known miss, such as a push inside a script the agent wrote, is documented beside the rule that misses it.
A write that gets past the guard and is not documented as a known miss is a bug.
Report it with the [bug form](https://github.com/azd325/skills/issues/new?template=bug.yml).

A vulnerability is a package that harms the machine it runs on: for example, it runs untrusted input as code, leaks a secret, or sends data off the machine.
