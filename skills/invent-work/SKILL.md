---
name: invent-work
description: >
  Chooses what to build next when no roadmap is given. Ranks candidate work
  on evidence and returns at most five candidates with the reason for the
  order. Use when a project ends and the next one is open, when a backlog feels
  driven by the latest incident, or on "what should I work on next", "what
  should the team build next", "invent work", "pick the next project", "is this
  backlog right". Not for scoping a task that is already chosen, and not for
  auditing a ticket that is already written.
license: MIT
metadata:
  author: Tim Kleinschmidt (Azd325)
---

# Invent Work

On an engineer-led team, work exists only when an engineer invents it. Signals are never scarce.
The failure mode is a backlog built from the loudest signal: usually the latest crash, sometimes
the skip-level. This skill makes the choice explicit and defensible.

Default scope is **recommend**. Do not create tickets or start work unless asked.

## 1. Collect candidates

For each source, look for real evidence with the tools you have (issue tracker, error tracker,
`git log`, cloud cost data, postmortems, chat, agent memory if any). Record where each item came from.
Skip a source you cannot reach, and name it in the report. Do not invent evidence.

| Source   | Signal                          | Where to look                                             | Argument      | Timing                                               |
| -------- | ------------------------------- | --------------------------------------------------------- | ------------- | ---------------------------------------------------- |
| System   | Postmortems, repeated incidents | Error tracker, incident tickets, `fix:`/revert commits    | pre-argued    | lagging                                              |
| System   | Cost                            | Cloud bill, vendor contracts, CI minutes                  | pre-argued    | lagging                                              |
| System   | Your own toil                   | Repeated manual steps, agent memory or friction logs      | partial       | lagging                                              |
| Users    | Continuous discovery            | Recent user conversations, support requests               | must be built | leading                                              |
| Users    | Overloaded use-cases            | Features used for a job they were not built for           | partial       | leading                                              |
| Users    | Partner-to-prototype            | A team willing to build a prototype with you              | partial       | leading                                              |
| Org      | OKRs                            | Team and company goals                                    | pre-argued    | lagging                                              |
| Org      | Leader repeats a topic          | Same topic raised twice in one week                       | must be built | either                                               |
| Org      | Migration debris                | Teams still on the old system after a migration           | partial       | lagging for the last migration, leading for the next |
| Industry | Descriptive → prescriptive      | Describe a system today, compare with current practice    | must be built | leading                                              |
| Industry | Lag arbitrage                   | Bundling/unbundling swings already argued in the industry | must be built | either                                               |

Overloaded use-cases are a strong signal because users already run a prototype in production.
A leader's repeated topic is weak because leaders are far from users. These notes do not decide the rank;
the two measures below do. Your toil is not your users' toil. In discovery, record the problem, not the
requested solution; a pain with no workaround may not be acute. Partnering is exploration, not a promise.
Revisit cost's buy-or-build choice. Incidents favor loud, recent damage; OKRs supply an existing argument.
Migration debris exposes platform gaps. Describing a system surfaces stale decisions; industry evidence
can be borrowed, but waiting too long makes you a straggler.

## 2. Rank

Place each candidate on two measures: **Argument** (pre-argued, partial, must be built) and
**Timing** (leading: a need before it hurts; lagging: damage already done). Use the table's values.
For either timing, state which applies and why; for migration debris, name the last or next migration.

Rank in this fixed order:

1. Leading with a partial argument.
2. Lagging with a pre-argued argument.
3. Leading with an argument that must be built.
4. Lagging without a pre-argued argument.

Down-rank a candidate supported only by one recent incident or one leader's remark until corroborated.
A second source means a signal from a different group: System, Users, Org or Industry.
Merge signals supporting the same work into one candidate. Corroboration can move it up; explain any
placement that differs from the fixed order. Corroboration counts more than volume.

## 3. Report

Before reporting, self-check:

1. Each ranked candidate has evidence the reader can open; otherwise remove it from the list.
2. The order follows the four-step rule, or states why corroboration changes a candidate's placement.
3. Every source not reached is named.

If evidence is too thin to rank, say which source to collect next instead of guessing.
Use this template, with at most five candidates (omit the comparison for the last candidate):

```markdown
## Candidates

1. <the work, one line>
   - Signals: <signal> (<group>): <evidence: link, ticket, file:line>
   - Measures: <argument> / <timing>
   - Beats 2 because: <one sentence>
     ...at most five

## Loudest signal not ranked first

<signal>: <why it is not first>

## Sources not reached

<source>: <why>
```

Example — fictional project Moonpickle, fictional ticket keys:

```markdown
## Candidates

1. Give the Wobblefolk team a batch import path.
   - Signals: Overloaded use-cases (Users): MOON-12, users run a script around single imports.
   - Measures: partial / leading

## Loudest signal not ranked first

The director's import rewrite topic (Org), MOON-19: raised twice this week, but its argument must be built.

## Sources not reached

System cost data: no billing access.
```
