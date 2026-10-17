---
name: write-strategy
description: >
  Writes a short engineering strategy from the decisions a repository already
  made. Reads the five most recent design documents or decision records it can
  reach (ADRs, RFCs, design docs, substantial PR descriptions), finds the
  decisions that recur, contested ones first, and writes each as a guiding
  policy with its reason and sources. Use on "write a strategy", "write our
  engineering strategy", "what are our guiding policies", "turn these ADRs into
  a strategy", "what do our design docs keep deciding". Writes a draft and
  changes nothing else. Not for choosing what to build (invent-work) or framing
  one task (frame-task).
license: MIT
metadata:
  author: Tim Kleinschmidt (Azd325)
---

# Write Strategy

A team already has a strategy. It lives in the decisions the team makes again and again.
This skill writes those decisions down as guiding policies. The next decision can then follow a policy or argue with it in the open.

The failure mode is a generic strategy. "We value quality and ship fast" fits every team.
Everyone agrees with it, and each person keeps deciding as before. The agreement is false, and it hides the real disagreement.

Default scope is **recommend**. Return the draft in your reply and change nothing else.
Edit no file, open no ticket and change no document unless the user asks. When the user names a file for the draft, write only that file.
To choose what to build, use `invent-work`. To frame one task, use `frame-task`.

## Rules

- **Use what you can reach.** Begin with the documents in front of you. Do not stop to ask for more context first; name each gap in the report.
- **Specific or nothing.** Each policy names a concrete choice that a reader in this repository could get wrong. Delete a sentence that would fit any team.
- **Take a side.** A policy says what to do and what not to do. "Consider X" or "where appropriate" is not a policy.
- **Show the reasoning.** Each policy carries its reason, so that a reader can dispute the reason and revise the policy.
- **Cite or drop.** Each policy cites the documents it came from, by path or link. A policy with no source is invented; drop it.

## 1. Collect the documents

Take the five most recent design documents or decision records you can reach. Look for, in this order:

1. Decision records: `docs/adr/`, `docs/decisions/`, `adr/`, files named `NNNN-*.md`.
2. RFCs and design docs: `rfcs/`, `docs/design/`, `design/`, linked wiki pages.
3. Substantial PR descriptions: merged PRs whose body argues a choice against an alternative, not a change list.

Order by date: the merge date, or the commit date of the file. Record the path or link and the date of each document.
Skip a source you cannot reach and name it in the report. Do not invent a document.

When fewer than three documents are reachable, do not write policies.
Report the documents you found, and say what to collect next: for example, short decision records for the next three choices, or the reasoning behind the last large merged changes.

## 2. Find the recurring decisions

For each document, list the decisions it makes: the choice, the alternative it rejected and the reason.
A decision recurs when two or more documents make the same choice or rest on the same reason.

Contested decisions come first. A decision is contested when a document reversed an earlier one, when review comments objected to it, or when a document rejects an alternative that people argued for.
A written policy saves the most argument where people already disagree.

A decision found in one document only does not recur. Put it under "Left out" with its source.

## 3. Write the guiding policies

Write each recurring decision as one guiding policy: one imperative sentence that a reader could follow or break.
Give its reason in the terms the documents use, its sources, and whether it is contested.
Put contested policies first, then order by the number of documents behind each policy.

Test each policy: would a different team write the same sentence? If yes, it is generic.
Make it specific from the sources, or remove it.
Stop when the next policy would be generic. Three specific policies are a better strategy than ten generic ones.
Keep the whole draft to one or two pages.

## 4. Report

Before reporting, self-check:

1. Each policy cites at least two documents that the reader can open.
2. Each policy has a reason and takes a side.
3. Each decision from one document only is under "Left out".
4. Every source not reached is named.

Use this template:

```markdown
## Strategy draft — <repository>

Read <n> documents, <oldest date> to <newest date>. This is a draft: revise any reason you disagree with.

### Guiding policies

1. **<policy, one imperative sentence>**
   - Reason: <why, from the sources>
   - Sources: <path or link>, <path or link>
   - Contested: <no | yes, where and how>

### Left out

- <decision>: one document only (<path or link>)

### Not reached

- <source>: <why>
```

With fewer than three documents, use this template instead:

```markdown
## Strategy draft — <repository>

Too few decisions to write policies: <n> documents reached (<paths or links>).
Collect next: <what to collect, and where>.
```

Example — fictional project Moonpickle, fictional paths:

```markdown
## Strategy draft — moonpickle

Read 5 documents, 2026-03-02 to 2026-09-18. This is a draft: revise any reason you disagree with.

### Guiding policies

1. **Keep import jobs in the Postgres queue; do not add a message broker.**
   - Reason: two broker trials failed on operational cost for a two-person on-call rotation.
   - Sources: docs/adr/0007-job-queue.md, docs/adr/0011-revert-broker.md
   - Contested: yes, ADR 0011 reverted the broker that ADR 0009 introduced.

### Left out

- Use UUIDv7 for new tables: one document only (docs/adr/0010-ids.md)

### Not reached

- Wiki design pages: no access.
```
