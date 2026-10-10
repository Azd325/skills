---
name: invent-work
description: >
  Choose what to build next when nobody hands you a roadmap. Ranks candidate
  work on evidence and returns at most five candidates with the reason for the
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
a remark from your manager's manager. This skill makes the choice explicit and defensible.

Default scope is **recommend**. Do not create tickets or start work unless the user asks.

## 1. Collect candidates

For each source, look for real evidence with the tools you have (issue tracker, error tracker,
`git log`, cloud cost data, postmortems, chat, and notes your agent setup keeps between sessions,
if it keeps any). Record where each item came from.
Skip a source you cannot reach, and name it in the report. Do not invent evidence.

| Source   | Signal                          | Where to look                                                                  | Note                                                                                         |
| -------- | ------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| System   | Postmortems, repeated incidents | Error tracker, incident tickets, `fix:`/revert commits                         | Lagging; biased to loud and recent                                                           |
| System   | Cost                            | Cloud bill, vendor contracts, CI minutes                                       | Revisit buy-vs-build; it is not a one-time decision                                          |
| System   | Your own toil                   | Repeated manual steps, session notes or friction logs if your setup keeps them | Your toil is not your users' toil                                                            |
| Users    | Continuous discovery            | Recent user conversations, support requests                                    | Users ask for solutions; record the problem. A pain with no workaround is probably not acute |
| Users    | Overloaded use-cases            | Tools or features used for a job they were not built for                       | Strongest signal: a prototype users already run in production                                |
| Users    | Partner-to-prototype            | A team willing to build a prototype with you                                   | A joint exploration, not a promise                                                           |
| Org      | OKRs                            | Team and company goals                                                         | Work already invented; cheap to argue                                                        |
| Org      | Leader repeats a topic          | Same topic raised twice in a short period                                      | Weakest; leaders sit far from users (HiPPO: the highest-paid person's opinion)               |
| Org      | Migration debris                | Teams still on the old system after a migration                                | Shows where the platform is incomplete                                                       |
| Industry | Descriptive → prescriptive      | Write down how a system works today, compare with current practice             | Describing it surfaces decisions that no longer hold                                         |
| Industry | Lag arbitrage                   | Bundling/unbundling swings the industry already argued                         | Borrow the evidence; do not lag until you are a straggler                                    |

## 2. Rank

Place each candidate on two axes:

- **Argument supply:** pre-argued (postmortem, cost, OKR), partial (overloaded use-case:
  the argument already runs in production), or must be built (continuous discovery, lag arbitrage,
  leader repeats a topic).
- **Timing:** leading (shows a need before it hurts) or lagging (shows damage already done).

Prefer leading signals with argument already supplied. Down-rank a candidate whose only support
is one recent incident or one leader's remark, unless a second source confirms it. When two
sources support the same work, merge them into one candidate: corroboration counts more than
volume.

## 3. Report

Return at most five candidates, ranked. For each one give:

- the work, in one line;
- the signals behind it, each with its evidence (link, ticket key, file:line, command output);
- its position on the two axes;
- why it beats the next candidate down.

Then name the loudest signal you did **not** rank first, and say why. If the evidence is too
thin to rank, say which source to collect next instead of guessing.
