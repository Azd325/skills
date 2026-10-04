# Vision

`quiet-mode` exists so that a developer can let coding agents work through a weekend, an evening or a holiday without any coworker hearing about it.
It serves developers who run coding agents unattended on their own machine, often one orchestrator with many workers in terminal panes and git worktrees.
It turns one switch into a refusal that every agent session on the machine applies to every tool call that would reach another person: a push, a PR, a comment, a ticket update, a message or a publish.
It owns exactly one thing: the decision whether an agent tool call may write to a system off the machine while the switch is on, and the outbox of each write it held back.
Weekends are its first use and one schedule among several, not its scope.

## A courtesy guard, not a security boundary

The guard prevents an unattended agent from publishing work by accident; it does not defend against an agent that tries to escape.
It narrows the ways off the machine and does not seal them, and the docs say so.
Each known miss, such as a push inside a script file the agent wrote, is written down beside the rule that misses it.
A heuristic that narrows a known miss is welcome when it has tests like any rule and the docs call it a heuristic.
Egress control, secret protection and host allowlists for reads stay with the sandbox.
The guard does not police edits to its own flag, rule file or hook configuration; an agent that edits them is a bug to report, not an attack to block.

## Enforce in the harness, not in the prompt

The refusal runs as code in each agent's tool pipeline, such as a Claude Code PreToolUse hook or a pi `tool_call` extension.
Every adapter calls one guard that holds all decisions, so agents cannot drift apart.
AGENTS.md text, session reminders and status badges tell an agent that the mode is on; they never count as enforcement.
The mode holds after a context compaction, in subagents and in peer sessions, because the guard reads no conversation context.
When the guard cannot parse a call, misses a dependency or crashes, it refuses the call.
A refusal names the rule that fired, so the agent can keep the work local and continue.

## Block writes, keep reads open

While the mode is on, the guard refuses writes to remote systems: git push, PR and issue changes, ticket and wiki writes, chat and mail messages, artifact and page publish, package publish and infrastructure apply.
Reads stay open, because the unattended work needs them, and local work stays open: commits, worktrees, local servers and local cross-session messages.
For MCP tools the guard allows names that read and refuses all others, so a new connector tool stays blocked until it is known to read.
A shipped read list for common public connectors is welcome when each entry has a test and the developer can replace it.
Where a wide and a narrow rule collide, the guard picks the wide one, because a refused read costs one message and a missed write reaches a coworker; a refused common read is still a bug that gets a fix and a test.

## Rules live in one file, decisions stay testable

All rules, core and optional, live in one declarative rule file that the developer reads and edits.
Command normalization, such as finding the push in `git -C x push` or `sh -c`, stays in tested code, not in the rule language.
The rule language describes writes off the machine and nothing else.
Every shipped rule has a test case, and each case goes red when its rule is removed.
A claim about an agent harness, such as a hook exit code or an extension fail-safe, is checked against the installed version before the guard relies on it.
A call the guard does not need to inspect returns before any parsing, because the guard runs on every tool call of every session.

## The developer controls the switch and the outbox

The developer turns the mode on and off from their own shell, or by a schedule they configure.
An agent may turn the mode on when the developer asks for it.
The project ships no agent command that turns the mode off or edits the schedule.
Each refused write goes to a local outbox with its full call, the session that tried it and the time.
The developer configures how the outbox is released: by manual approval, or automatically when the mode ends, per project or per PR.
A held write that no longer applies, such as a push of a branch that moved, is shown as stale and not replayed.
Each supported agent shows the mode and the next scheduled change in its status line.

## Optional rules

Rules beyond the write block ship off by default, and the developer turns each one on in the rule file.
Blocking phone notifications and blocking destructive local commands are optional rules.
Allowing a push to a branch with no open PR is an optional rule, because a push that reaches nobody is a courtesy question each team answers for itself.
Notifying the developer of each held write is an optional rule, so the outbox does not become an approval queue by default.
An optional rule meets the same test standard as the core and never weakens it.

## Scope

quiet-mode is a public open-source package in the `azd325/skills` collection.
This vision covers the quiet-mode package only; rules shared across the collection's packages live in the collection's AGENTS.md.
Claude Code and pi come first; an adapter for another harness, such as opencode, Codex or Cursor, is welcome when it has its own test suite against that harness.
It is not a general permission system, not a sandbox and not a destructive-command guard by default.
Cloud sessions, scheduled cloud agents and the developer's own shell commands are outside its reach, and the docs say so.

A change aligns when it stops an unattended agent from reaching another person, keeps reads and local work open, leaves the developer in charge of the switch and the outbox, and comes with a test that goes red without it.
A change should be resisted when it moves enforcement into prompt text, gives an agent a way to turn the mode off, blocks a read without a write risk, grows the rule language beyond writes off the machine, makes an optional rule part of the core, or claims a security seal the guard does not provide.
