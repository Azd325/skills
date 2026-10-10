# Vision

`invent-work` exists so that an engineer can choose the next work from evidence, not from the loudest signal.
It serves engineers and teams that get no roadmap from someone else and must invent their own work.
It turns the signals that a session can reach into a ranked list of at most five candidates, each with the reason it beat the next one.
It owns exactly one thing: the recommendation of what to build next, and the evidence behind it.

## Recommend, do not act

The default scope is a recommendation.
The skill creates no ticket and starts no work unless the user asks.

## Evidence or nothing

Candidates come from four signal sources: system, users, org and industry.
Each signal carries evidence that the reader can check: a link, a ticket key, a file and line, or command output.
The skill records where each item came from.
It names a source that it could not reach and does not fill the gap.
It invents no evidence.
When the evidence is too thin to rank, it says which source to collect next and does not guess.

## Rank against the loudest signal

Each candidate has a position on two axes: how much argument the signal already supplies, and whether the signal leads or lags.
Leading signals with the argument already supplied rank first.
A candidate that rests on one recent incident or one leader's remark ranks lower until a second source confirms it.
Corroboration counts more than volume.
The report names the loudest signal that did not rank first, and says why.

## Scope

invent-work is a prompt-only package in the `azd325/skills` collection.
This vision covers the invent-work package only; rules shared across the collection's packages live in the collection's AGENTS.md.
It is not for scoping a task that is already chosen, and not for auditing a ticket that is already written.

A change aligns when it makes the recommendation rest on evidence the reader can check, makes the reason for the order easier to see, or keeps the report short.
A change should be resisted when it makes the skill create tickets or start work by default, lets a candidate stand without evidence, lets the loudest signal rank first without a stated reason, or widens the skill to scope a chosen task or audit a written ticket.
