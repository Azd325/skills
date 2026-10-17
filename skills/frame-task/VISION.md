# Vision

`frame-task` exists so that a developer can decide what a fuzzy task is before any code exists.
It serves developers who receive a vague ticket, chat message or half-formed idea and must choose how to start.
It turns one chosen task into a decision memo, a ranked list of the missing context, the unchecked assumptions in the framing and one next step sized to confidence.
It owns exactly one thing: the frame of one chosen task, and the evidence behind it.

## Recommend, do not act

The default scope is a recommendation.
The skill writes no code, creates no ticket and starts no work unless the user asks.
It stops at the frame and hands control back.

## Missing context, not guesses

The skill surfaces what the developer does not yet know.
It marks every claim as grounded (verified in the input or the repository) or assumed (needs a check).
It invents no detail and hands each unknown back as a direction.
When the task is already clear, it says so and does not manufacture directions.

## Size the step to the confidence

The frame names one next step: ship now for low risk and clear value, a throwaway prototype when the facts are uncertain, a proposal first for a large change that the evidence supports.
It gives the reason.
A merged need is a hypothesis that the frame tests; a tidy single idea is not proof.
A problem raised once by one voice weighs less than one that recurs.

## Scope

frame-task is a prompt-only package in the `azd325/skills` collection.
This vision covers the frame-task package only; rules shared across the collection's packages live in the collection's AGENTS.md.
It is not for choosing between candidate tasks; that belongs to `invent-work`.

A change aligns when it makes the frame show more clearly what is missing, makes the sized step easier to defend, or keeps the memo short.
A change should be resisted when it makes the skill write code or start work by default, lets a guess stand as a fact, ranks candidate tasks against each other, or turns a clear task into ceremony.
