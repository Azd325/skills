---
name: quiet-mode
description: >
  Work in quiet mode: keep every write off the machine local and hold it for
  the developer. Use when the developer asks for quiet mode, or asks that the
  agents reach no coworker while they are away.
license: MIT
metadata:
  author: Tim Kleinschmidt (Azd325)
---

# quiet-mode

This skill enforces nothing.
The quiet-mode guard will enforce quiet mode in the harness, and it is not built yet.
Until it ships, quiet mode is a request from the developer that you follow by choice.
Do not tell the developer that a guard protects the session.

## When the developer asks for quiet mode

- Do not push, open or change a PR, comment, update a ticket, send a message or publish.
- Do local work: edit, commit, create worktrees, run tests and local servers.
- Reads stay open. Read PRs, tickets and docs as usual.
- Do not do a held write in another form, such as a script or a different tool.
- List each write you held back in your final reply, so the developer can release it.
- If the task cannot continue without a write, stop and tell the developer.

## The switch

- There is no switch yet. Do not create a flag or edit settings to imitate one.
- Never edit a quiet-mode flag, rule file, schedule or hook configuration.
