# Weekend mode for Claude Code and pi: research report

_Research only. Nothing was installed, published or changed. Researched on 2026-10-04 against the Claude Code docs at code.claude.com and pi 1.0.2 with its bundled docs._

_This report predates the name quiet-mode and its [VISION.md](../VISION.md). It uses the working name "weekend mode". Where the two differ, for example on self-protection, VISION.md wins._

## Verdict

**Nothing ready-made does this.** No Claude Code feature, plugin, skill or community recipe I found gives you a weekend mode that you can toggle and that blocks external writes but allows reads. The same is true for pi. Several tools block `git push` or dangerous commands **all the time**, and none of them cover Jira, Confluence, Teams, Outlook or Artifact writes.

**Recommendation:** build one shared deterministic guard with three parts:

- one flag file
- one guard script holding the deny logic
- one small adapter per agent: a Claude Code `PreToolUse` hook and a pi `tool_call` extension

On top of that, use advisory text and a status indicator for visibility. That's the shared AGENTS.md rule, a context reminder in Claude Code (`SessionStart` and `UserPromptSubmit` hooks) and a status line in both agents.

Package the Claude Code side as a personal plugin, or put it in the user `settings.json`. Both work: hooks from user settings and from plugins run in every session and in every subagent.

**Top gaps:**

1. A Bash guard matches text. A push hidden inside a script file that the agent writes and then runs (`python x.py`, `./do.sh`) gets past the pattern match. You need a layer below the agents for that: git `pushInsteadOf` set through the environment, or a read-only GitHub token.
2. The agent could delete the flag file or edit the hook, unless the guard also blocks tool calls that touch its own files. Even then, a script can get around it.
3. Reads and writes go to the same hosts (github.com, atlassian.net). So no network-level control, whether the sandbox domain allowlist or Codex-style network-off, can allow reads and block writes. Enforcement has to happen per tool and per command.

**Until this is built:** sessions running unattended should get `permissions.deny: ["Bash(git push *)", "Bash(gh pr *)"]` today. The docs back this up: in auto mode, `git push` and `gh pr create` to your own repo are allowed by default. A "don't push" stated in chat can be lost when the session compacts, so it is not durable ([auto-mode-config § Common boundaries](https://code.claude.com/docs/en/auto-mode-config#common-boundaries)). A deny rule misses other spellings of the same command, such as `git -C . push` ([permissions § Bash rule limits](https://code.claude.com/docs/en/permissions)).

---

## Part 1: does it already exist?

### Built into Claude Code (verified against the docs)

| Feature                                                                                                                                                           | What it gives                                                                                                                                                                                                                      | Why it isn't weekend mode                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `permissions.deny` / `ask` ([permissions](https://code.claude.com/docs/en/permissions))                                                                           | A deterministic block before the tool runs, in every mode including auto and `bypassPermissions`. Supports `mcp__server__tool` names and the glob `mcp__*`. Deny rules from any settings scope win.                                | A static list with no toggle. A Bash rule matches the command as written, so `git -C . push`, `git -c … push` and `sh -c` forms get through. The docs say it "isn't a security boundary around the program". An `mcp__` rule with parentheses is skipped. |
| Auto mode classifier ([permission-modes](https://code.claude.com/docs/en/permission-modes), [auto-mode-config](https://code.claude.com/docs/en/auto-mode-config)) | Blocks exfiltration, force pushes and PRs to _other_ repos. You can add rules in prose through `autoMode.soft_deny` and `autoMode.hard_deny` in user settings or `--settings`. A boundary stated in chat counts as a block signal. | By default it **allows** pushes and PRs to your own repo. A boundary stated in chat "can be lost if context compaction removes the message that stated it" (quoted from the docs). It is probabilistic.                                                   |
| Bash sandbox ([sandboxing](https://code.claude.com/docs/en/sandboxing))                                                                                           | OS-enforced network domain allowlist for Bash, PowerShell and Monitor.                                                                                                                                                             | It allows or blocks by domain, and reads and writes use the same domains. "MCP servers and hooks run outside it"; WebFetch doesn't go through it.                                                                                                         |
| `dontAsk` mode                                                                                                                                                    | Denies anything that isn't pre-approved.                                                                                                                                                                                           | You would have to allowlist all the work you want done locally. Too coarse for autonomous coding.                                                                                                                                                         |
| `isolatePeerMachines: true` ([cross-session-messaging](https://code.claude.com/docs/en/cross-session-messaging#require-approval-for-cross-machine-messages))      | Asks for approval before a `SendMessage` leaves the machine, even in bypass mode.                                                                                                                                                  | Covers only SendMessage, and it prompts rather than blocks.                                                                                                                                                                                               |
| Output styles ([output-styles](https://code.claude.com/docs/en/output-styles))                                                                                    | A system prompt instruction.                                                                                                                                                                                                       | The docs say it "doesn't guarantee that something always happens or never happens", and it doesn't apply to non-fork subagents.                                                                                                                           |

### Community, for Claude Code

| Name                                                                                                                                                                                                          | What it enforces                                                              | How                                            | Status                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------- |
| [mattpocock `git-guardrails-claude-code`](https://www.skills.sh/mattpocock/skills/git-guardrails-claude-code) ([write-up](https://www.aihero.dev/this-hook-stops-claude-code-running-dangerous-git-commands)) | Blocks every form of `git push`, plus `reset --hard`, `clean` and `branch -D` | Skill that installs a PreToolUse hook (exit 2) | Several forks exist. Always on, with no toggle. Git only.                     |
| [cc-safe-setup](https://socket.dev/npm/package/cc-safe-setup) ([guide](https://yurukusa.github.io/cc-safe-setup/prevent-force-push.html))                                                                     | 8 hooks: no push to main, `rm -rf /`, secret leaks                            | PreToolUse hooks                               | npm package. Blocks only pushes to protected branches.                        |
| DCG, the destructive command guard ([index](https://openskillindex.com/skills/aiskillstore-marketplace-dcg))                                                                                                  | Destructive shell commands                                                    | Rust PreToolUse hook                           | Active. Covers destruction, not egress.                                       |
| [Claude Code Safety Net](https://korben.info/en/claude-code-safety-net-plugin-stop-ai-destroying-everything.html)                                                                                             | `rm` outside cwd. Strict mode blocks commands it can't parse.                 | Plugin hook                                    | Destruction only.                                                             |
| [code-safely-plugin](https://www.claudepluginhub.com/plugins/stebennett-code-safely-plugin-plugins-code-safely-plugin)                                                                                        | Force push, dotfiles, secrets in git                                          | Plugin hooks                                   | Force push only.                                                              |
| [block-no-verify (credfeto issue #1398)](https://github.com/credfeto/credfeto-orchestrator/issues/1398)                                                                                                       | Blocks `mcp__github__.*` because it skips local git hooks                     | PreToolUse matcher on MCP names                | The closest example of blocking MCP writes by name.                           |
| [`blast-radius` sample mod](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/blast-radius) (Anthropic, unsupported)                                                            | Holds a risky command such as a force push and shows proceed or cancel        | Mod `tool.call` handler                        | Interactive, so not for unattended runs.                                      |
| [anthropics/claude-code #30142](https://github.com/anthropics/claude-code/issues/30142)                                                                                                                       | Feature request for read-only vs read-write MCP tool permissions              | —                                              | Not built as far as the docs show. I didn't check the issue's current status. |

Hacker News threads ([agents that run while I sleep](https://news.ycombinator.com/item?id=47327559), [item 48284978](https://news.ycombinator.com/item?id=48284978)) show the approaches people use: run agents in containers under a separate git identity, or don't give them push credentials. They also show the known bypass, where Claude writes a forbidden command into a script and runs the script.

### Other agent tools

- **Codex CLI:** the `workspace-write` sandbox turns network off by default, so `git push` needs approval ([Codex security](https://developers.openai.com/codex/security), [agent approvals](https://developers.openai.com/codex/agent-approvals-security)). That is close to "nothing leaves the machine", but it also blocks web and Jira reads. There is no split between reads and writes.
- **Cursor, Cline, Aider, opencode:** I searched and found no weekend, offline or no-publish mode. opencode has per-tool and per-bash-pattern allow/ask/deny permissions, but **I didn't verify this against its docs**. My search here was thinner than for Claude Code and pi.

### pi (covered in depth below): also no built-in mode

pi's own docs say it "does not ask for approval before every tool call", and that safety comes from OS or VM isolation (`docs/security.md`). The closest extensions are [pi-permission-system](https://github.com/MasuRii/pi-permission-system) and [pi-sandbox](https://github.com/zheli/pi-sandbox), plus the bundled examples `permission-gate.ts`, `protected-paths.ts` and `sandbox/`. None of them is a weekend toggle.

### What I searched

- **Claude Code docs, fetched and grepped:** hooks, permissions, settings, sandboxing, permission-modes, auto-mode-config, cross-session-messaging, plugins-reference, tools-reference, statusline, output-styles, mods overview.
- **Web searches:** "offline / no-egress / local-only + Claude Code hook", "PreToolUse block git push gh pr create", "read-only mode block MCP write tools Jira Slack", "weekend mode / quiet hours" for Claude Code, Cursor and Codex, GitHub hook repos, Reddit and HN, Codex, Cline and opencode permissions, safety plugin marketplaces, and the pi extension ecosystem.
- **pi:** its local docs and examples.

An empty search doesn't prove nothing exists. The Discord and X communities weren't covered.

---

## Part 2: format comparison

| Format                                               | Enforcement                                                                                                                   | Toggle                                                                                                                          | Reaches spawned and peer sessions                                                                                                      | Survives compaction                                 | Visibility                | Maintenance                                        |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------- | -------------------------------------------------- |
| Skill                                                | Advisory                                                                                                                      | Invoke it, but it can't be "off"                                                                                                | No, each session must load it                                                                                                          | Partly. Skill text can drop out of context          | None                      | Low                                                |
| CLAUDE.md / AGENTS.md rule                           | Advisory, though the auto mode classifier also reads CLAUDE.md                                                                | Edit the file                                                                                                                   | Yes, every session loads it                                                                                                            | Yes, it is reloaded and lives in the system context | None                      | Low                                                |
| Output style                                         | Advisory                                                                                                                      | `/output-style`                                                                                                                 | Main session and forks only                                                                                                            | Yes, sent with every request                        | None                      | Low                                                |
| Settings deny profile via `--settings` or a file     | Deterministic, but matches as written                                                                                         | Per session at launch (`claude --settings weekend.json`). Settings files hot-reload, so editing a file toggles live everywhere. | Only sessions that load it. Hot reload of user settings reaches all of them.                                                           | Yes                                                 | No built-in indicator     | Low, but static lists miss variants                |
| **PreToolUse hook + flag file**                      | **Deterministic, checks the full command text and any MCP tool name.** Exit 2 or JSON deny holds even in `bypassPermissions`. | **The flag file is read on every call, so the toggle is instant and global**                                                    | **Yes.** Hooks from user settings or a plugin "run in subagents", and every local session with the same `CLAUDE_CONFIG_DIR` loads them | **Yes.** It doesn't rely on context.                | Pair with the status line | Medium: one script and pattern list                |
| Plugin bundling hook + `/weekend` command + reminder | Same as the hook                                                                                                              | Same, plus a slash command                                                                                                      | Same                                                                                                                                   | Same                                                | Same                      | Medium. Can be installed for pi too, as a package. |
| Mod (`tool.call`)                                    | Deterministic and in-process; can draw a band                                                                                 | Same                                                                                                                            | Hooks run in every session that loads the plugin                                                                                       | Yes                                                 | Best (band, pane)         | Higher: JS API, newer feature (v2.1.287+)          |

**Pick:** a PreToolUse hook driven by a flag file, shipped as a small personal plugin. The plugin adds a status line segment and a `SessionStart`/`UserPromptSubmit` reminder, and the shared guard script is also used by pi. A mod would give a nicer UI, but it is newer and Claude Code only. Settings hooks are the documented, stable path.

---

## Recommended design (shared by Claude Code and pi)

### Toggle

- **Flag file:** `~/.agents/weekend-mode`. It sits next to the shared `~/.agents/AGENTS.md`, so both agents use one path. If the file exists, weekend mode is on.
- **Turning it on and off:** only the developer does this, from their own shell: `touch ~/.agents/weekend-mode` and `rm ~/.agents/weekend-mode`, or a `weekend on|off` shell alias. Leave out an agent-side `/weekend off` command, because then the agent could turn the mode off itself. A `/weekend` command that only reports the status is fine.
- **Guard self-protection:** the guard denies any tool call whose input mentions `weekend-mode`, `weekend-guard`, the hook config, or `~/.pi/agent/extensions/weekend*`. A peer session runs the same guard, so it can't toggle the mode or push on someone else's behalf either.

### File layout

```
~/.agents/
  AGENTS.md                      # + "Weekend mode" section (advisory; shared by Claude, pi, opencode)
  weekend-mode                   # flag file (present = on)
  bin/weekend-guard              # single source of truth: reads {"tool","input"} JSON on stdin,
                                 # prints {"decision":"deny","reason":...} or nothing; exit 0
~/.claude/plugins/weekend-mode/   (or inline in ~/.claude/settings.json)
  .claude-plugin/plugin.json
  hooks/hooks.json               # PreToolUse matcher ".*" → adapter; SessionStart(startup|resume|compact|clear)
                                 # + UserPromptSubmit → inject "WEEKEND MODE ON: …" when flag exists
  scripts/pretooluse.sh          # calls weekend-guard; maps to permissionDecision deny; FAILS CLOSED
  scripts/statusline-segment.sh  # prints "🔒 WEEKEND" when flag exists (statusLine stays in user settings)
~/.pi/agent/extensions/weekend-mode.ts # pi.on("tool_call") → execFileSync(weekend-guard) → {block,reason};
                                       # session_start/turn_end → ctx.ui.setStatus("weekend", "🔒 WEEKEND")
```

### Deny list (applies only while the flag exists)

**Bash, in both agents:** normalise the command first. Strip wrappers and `env` assignments, split on `&&`, `;`, `|` and `$(…)`. Then deny any segment that matches:

- `git … push` anywhere in the git argument list, so that `git -C x push`, `git -c k=v push` and `git push` all match. Also deny `git send-email` and `git remote add|set-url` (redirecting a remote).
- `gh` write verbs: `pr create|comment|review|edit|merge|close|reopen|ready`, `issue create|comment|edit|close|reopen`, `release create|upload|edit|delete`, `repo create|fork|edit|delete`, `gist create|edit`, `workflow run`, `run rerun|cancel`, `label create|edit|delete`, `secret|variable set|delete`.
- `gh api` with `-X/--method` set to anything other than GET, or with `-f`, `-F` or `--input` (gh switches to POST when fields are present). Allow plain `gh api <path>`.
- `curl`/`wget`/`http` with a non-GET method, or with `-d`, `--data*`, `-F`, `-T` or `--upload-file`.
- `jira`, `acli`, `confluence` or `az`/`m365` CLIs with write verbs, if any of these is installed.
- Package publishing: `npm|pnpm|yarn publish`, `twine upload`, `docker push`, `pulumi up`, `terraform apply`, `kubectl apply|delete`.
- Commands that touch the guard's own files.

**MCP tools: allowlist the reads, deny the rest.** This holds up better as servers add tools. For `mcp__*` tools, allow a tool only when its name matches a read verb after `__`: `get|search|list|read|fetch|lookup|query|find|resolve|atlassianUserInfo|getAccessible…|query-docs|resolve-library-id|chat_message_search|outlook_email_search|outlook_calendar_search|find_meeting_availability|outlook_find_available_time|sharepoint_search|sharepoint_folder_search|search_people|read_resource|get_me|get_granted_scopes|board_preview_read|canvas_read_as_svg|canvas_search`. Deny everything else. With common connectors that blocks, for example:

- **Atlassian:** `createJiraIssue`, `editJiraIssue`, `transitionJiraIssue`, `addCommentToJiraIssue`, `addWorklogToJiraIssue`, `createIssueLink`, `createConfluencePage`, `updateConfluencePage`, `createConfluence*Comment`, `createCompass*`
- **Microsoft 365:** `outlook_send_mail`, `outlook_send_draft`, `outlook_create_draft`, `outlook_forward_mail`, `outlook_*_event`, `outlook_set_vacation`, `outlook_*label*`, `outlook_create_filter`, `outlook_trash_thread`, `teams_send_*`, `teams_reply_*`, `teams_create_chat`, all `sharepoint_*` writes
- **Other connectors:** Miro writes, Sentry `update_issue`, Claude Docs `create|update|batch|delete`

**Built-in Claude Code tools:**

- `Artifact` is denied when `tool_input.action` is missing (missing means publish) or is `publish`, `delete`, `pin` or `unpin`. The `read`, `list` and `quickstart` actions are allowed.
- `ArtifactData` write actions and `ArtifactComments` write actions are denied.
- `RemoteTrigger`, `ShareOnboardingGuide` and `Workflow` publishing (if any) are denied.
- `SendMessage` is denied when `to` names a Remote Control or cloud session. In practice: allow only local `uds:` addresses and in-process agent names. Separately, set `isolatePeerMachines: true` permanently.
- `WebFetch`, `WebSearch`, `PushNotification` and `SendFeedback` are allowed. SendFeedback only queues locally.

**pi tools:**

- `bash` is checked by the same rules.
- `mcp__<server>__<tool>` follows the same MCP allowlist. pi's docs say every MCP call, including codemode, "passes through Pi's tool pipeline", so `tool_call` handlers apply.
- Tools added by extensions, such as `pi-web-access`, are allowed if they are read-only.

### Survives compaction, reaches workers, is visible

- **Enforcement** doesn't depend on context. The hook or extension runs on every tool call.
- **Context:** a `SessionStart` hook with matcher `startup|resume|compact|clear` adds `additionalContext`, so the reminder comes back after every compaction ([hooks § SessionStart](https://code.claude.com/docs/en/hooks)). A `UserPromptSubmit` hook adds a one-line reminder on each turn. In pi, AGENTS.md is part of the system prompt, which pi rebuilds for every request ([how-pi-works](https://github.com/earendil-works/pi), local `docs/how-pi-works.md`), so it survives compaction there.
- **Workers:**
  - terminal panes and worktree sessions use the same Claude Code config directory and so load the same user hooks and plugins.
  - Claude Code subagents run settings and plugin hooks too.
  - pi subagents (`@tintinweb/pi-subagents`) run as separate pi sessions that "load extensions by default".
- **Visibility:**
  - Claude Code: a status line segment from the existing `statusLine` script. Use `refreshInterval` so it updates while the session is idle ([statusline](https://code.claude.com/docs/en/statusline)).
  - pi: `ctx.ui.setStatus()` in the footer (example `status-line.ts`).
- **Questions up front:** this stays advisory, in the AGENTS.md rule: "When weekend mode is on, collect every question in the first turn, then proceed without asking. Commit locally, and leave pushes and PRs in a `WEEKEND-OUTBOX.md` list for Monday."

### Fail closed

- **Claude Code:** the adapter must catch every error and still print a JSON deny. The deny is `hookSpecificOutput.permissionDecision: "deny"` or exit code 2. Exit 2 blocks even in `bypassPermissions`; JSON deny also blocks in that mode ([hooks](https://code.claude.com/docs/en/hooks)). Other non-zero exit codes don't block. That last point comes from my reading of the hooks reference's exit-code section; **re-check it before relying on it.**
- **pi:** this is safe by default. Its docs say "a `tool_call` handler failure blocks the tool as a fail-safe" (`docs/extensions.md`).

### Defence in depth below the agents (optional, recommended for unattended runs)

- **Git transport rewrite:** set `GIT_CONFIG_COUNT`/`GIT_CONFIG_KEY_n`/`GIT_CONFIG_VALUE_n` in the agent shell environment to `url."weekend-blocked:".pushInsteadOf=git@github.com:` and `…=https://github.com/`.
  - Then every push fails at the transport, whatever its spelling and including from scripts, while fetches still work.
  - Claude Code: inject it with a `SessionStart` hook that writes to `CLAUDE_ENV_FILE`.
  - pi: use a bash `spawnHook` env (example `bash-spawn-hook.ts`).
  - The agent can still unset the variables, so this is not a hard boundary. **The git behaviour is documented git behaviour. I didn't test it here.**
- **Read-only credentials:** for weekend sessions, point `GH_TOKEN` at a fine-grained token with read-only scopes. That is the only real boundary for `gh` and HTTPS git. The Claude.ai connectors (Atlassian, M365) use OAuth scopes the developer doesn't control per session, so the hook is the only lever for those.

---

## pi section

### What pi offers (checked against the local pi 1.0.2 docs)

- **No permission system by design.** It "does not ask for approval before every tool call", and the recommended boundary is a container or VM (`docs/security.md`, `docs/containerization.md`).
- **Extensions:** TypeScript in `~/.pi/agent/extensions/` (global) or `.pi/extensions/` (project, needs trust). `pi.on("tool_call", …)` can return `{ block: true, reason }` or mutate the input. A failing handler blocks the call. Extensions can also:
  - add commands with `pi.registerCommand`
  - show footer status with `ctx.ui.setStatus`
  - change the system prompt with `before_agent_start`
- **MCP is built in now** (`~/.pi/agent/mcp.json`). Tools are named `mcp__<server>__<tool>` like Claude Code, and `tool_call` handlers apply to them, including codemode calls. `pi.getAllTools()` exposes MCP `readOnlyHint` and `destructiveHint`, which a guard could use as an extra signal.
- **Subagents:** not built in. `@tintinweb/pi-subagents` runs separate pi sessions that load extensions by default, unless an agent's frontmatter sets `extensions: false` or `exclude_extensions`.
- **Context files:** `<agent-dir>/AGENTS.md` and `APPEND_SYSTEM.md`. These load regardless of project trust.
- **Kill switches:**
  - `pi -ne` / `--no-extensions` turns off all discovered extensions. **That disables the guard.**
  - `--no-sandbox` applies only if `pi-sandbox` is installed.

### Existing pi options

- **[pi-permission-system](https://github.com/MasuRii/pi-permission-system)** (MIT, ~169 stars, 104 commits, active):
  - deny/ask/allow for tools, bash patterns, MCP and skills, configured in `~/.pi/agent/pi-permissions.jsonc`
  - hides denied tools from the prompt
  - forwards `ask` from subagents to the main session
  - has a "yolo" toggle
  - It is the strongest pi option, but it has no weekend profile switch. You would need to swap the config file, or add a flag-file check.
- **[pi-sandbox](https://github.com/zheli/pi-sandbox)** (0 stars): OS sandbox (`sandbox-exec` on macOS) plus a network domain allowlist, toggled with `/sandbox`. It has the same problem as any domain allowlist: reads and writes use the same domains.
- **Bundled examples:** `permission-gate.ts` (confirms `rm -rf`/`sudo`; blocks when there is no UI), `protected-paths.ts`, `sandbox/`, `bash-spawn-hook.ts`, `status-line.ts`.

### One mechanism for both agents?

| Layer                                                                                 | Shared?                         | Notes                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Flag file `~/.agents/weekend-mode`                                                    | **Yes**                         | Both adapters check it on every call                                                                                                                                                        |
| Guard logic `~/.agents/bin/weekend-guard`                                             | **Yes**                         | One pattern list. The Claude hook calls it; the pi extension calls it with `execFileSync`                                                                                                   |
| AGENTS.md "Weekend mode" rule                                                         | **Yes**                         | Read by Claude Code, pi and opencode. Advisory only                                                                                                                                         |
| Git `pushInsteadOf` env, read-only `GH_TOKEN`                                         | **Yes** (env injection differs) | Claude: `CLAUDE_ENV_FILE` from SessionStart. pi: bash `spawnHook`                                                                                                                           |
| Interception point                                                                    | No                              | Claude: `PreToolUse` hook (JSON on stdin). pi: `tool_call` extension (in-process TS)                                                                                                        |
| Static deny rules                                                                     | **Claude only**                 | `permissions.deny`. pi has none without an extension                                                                                                                                        |
| Auto mode classifier and `autoMode.hard_deny` prose rules                             | **Claude only**                 | Optional second net: add `"hard_deny": ["$defaults", "When ~/.agents/weekend-mode exists, never push, open/edit PRs, or write to Jira/Confluence/Teams/Outlook/Artifacts"]`. Probabilistic. |
| Claude.ai connectors (Atlassian, M365, Artifact, Docs)                                | **Claude only**                 | pi only sees its own `mcp.json` servers                                                                                                                                                     |
| Cross-session messaging (`SendMessage`, `isolatePeerMachines`, `crossSessionInbound`) | **Claude only**                 | pi has no equivalent                                                                                                                                                                        |
| Fail-closed by default                                                                | **pi only**                     | Claude hooks must be written to fail closed                                                                                                                                                 |
| Status indicator                                                                      | Separate                        | Claude: `statusLine` script. pi: `ctx.ui.setStatus`                                                                                                                                         |
| Bypass switch                                                                         | Separate                        | Claude: `disableAllHooks`, `--bare`, `--safe-mode`. pi: `-ne`. **Don't launch weekend sessions with these.**                                                                                |

---

## Known gaps

1. **Indirect execution.** A command hidden in a script file (`./x.sh`, `python -c`, `node -e`, `make deploy`) or built from variables gets past text matching. The same goes for pi's bash. Lower-level mitigations: the `pushInsteadOf` env and read-only tokens. Partial mitigation: deny `sh -c`/`bash -c`/`eval` with an embedded push, and scan script files the agent wrote this session for `push`, which is a heuristic.
2. **Self-disablement.** The agent can edit the flag, the hook config or the extension through a script. A guard that blocks direct references reduces the risk but doesn't remove it. Claude Code's protected paths (`.claude/` settings) need approval in most modes, but a custom `CLAUDE_CONFIG_DIR` and `~/.agents` are not covered by default. **I didn't verify whether `CLAUDE_CONFIG_DIR` paths count as protected.**
3. **Reads and writes share hosts.** No network-layer split is possible, so WebFetch GET query strings remain an exfiltration channel. Accepted, because reads are allowed by design.
4. **MCP verb heuristics.** A new connector tool with an odd name might be read-only yet blocked (safe), or a write named like a read, such as `query` with side effects (unsafe). Pin the allowlist per server, and review it when connectors change.
5. **Surfaces the hooks don't reach.**
   - The developer's own `!` shell commands.
   - Cloud sessions and Routines (`RemoteTrigger`), which run off-machine and load what "reaches the cloud session".
   - Sessions started with `--bare`, `--safe-mode`, `disableAllHooks`, or pi `-ne`.
   - pi subagents whose frontmatter sets `extensions: false`.
   - `EndConversation` doesn't fire PreToolUse, which doesn't matter here.
   - Monitors, LSP servers and MCP servers themselves run with full access.
6. **Mods can override hooks.** A user-installed mod's `tool.check` "can approve a call that a deny rule refuses" outside managed or Team environments ([permissions § Extend permissions with hooks](https://code.claude.com/docs/en/permissions)). Avoid installing mods that approve tool calls.
7. **Auto mode interplay.** Unverified: whether hook denials count toward auto mode's "3 in a row / 20 total" fallback to prompting. The docs tie those thresholds to classifier blocks. If they did count, an unattended session could stall on a prompt.
8. **"Ask questions up front"** can't be enforced, only instructed.

## Sources (main)

- Claude Code: [hooks](https://code.claude.com/docs/en/hooks) · [permissions](https://code.claude.com/docs/en/permissions) · [settings](https://code.claude.com/docs/en/settings) · [sandboxing](https://code.claude.com/docs/en/sandboxing) · [permission modes](https://code.claude.com/docs/en/permission-modes) · [auto mode config](https://code.claude.com/docs/en/auto-mode-config) · [cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging) · [plugin manifest](https://code.claude.com/docs/en/plugins-reference) · [tools reference](https://code.claude.com/docs/en/tools-reference) · [status line](https://code.claude.com/docs/en/statusline) · [output styles](https://code.claude.com/docs/en/output-styles) · [mods](https://code.claude.com/docs/en/plugins/mods/overview)
- pi: bundled docs in `docs/` (`security.md`, `extensions.md`, `mcp.md`, `configuration.md`, `cli.md`, `how-pi-works.md`) and `examples/extensions/` · [repo (earendil-works/pi, formerly badlogic/pi-mono)](https://github.com/earendil-works/pi) · [pi-permission-system](https://github.com/MasuRii/pi-permission-system) · [pi-sandbox](https://github.com/zheli/pi-sandbox) · [pi-subagents](https://github.com/tintinweb/pi-subagents)
- Community and other tools: listed in the Part 1 tables, plus [Codex security](https://developers.openai.com/codex/security)
