# Vision

`manage-up` exists so that a person can hand their own boss a message that is ready to read or forward.
It serves someone who must report a result, brief a boss before a meeting, draft an escalation the boss can send, or answer a deadline without a bare no.
It drafts one of four formats from facts the user supplies or points at.
It owns exactly one thing: that draft.

## Draft, do not send

The default scope is a draft in the reply.
The skill does not send, post or email the message.
It hands the text back.

## Four formats, facts only

The four formats are a win note, a pre-brief, an escalation draft and a Yes, if reply.
When the format is unclear, the skill asks.
It does not guess.
It uses only facts the user gives or points at.
It invents nothing.
The draft leads with the punchline, uses Simplified Technical English and names no internal tool.

## Scope

manage-up is a prompt-only package in the `azd325/skills` collection.
This vision covers the manage-up package only; rules shared across the collection's packages live in the collection's AGENTS.md.
It is not for framing one task; that belongs to `frame-task`.
It is not for writing an engineering strategy; that belongs to `write-strategy`.

A change aligns when it makes one of the four drafts clearer, shorter or easier to forward.
A change should be resisted when it makes the skill send a message, invent a fact, name an internal tool, add a fifth format, or add career advice such as a new-boss intake or a stakeholder list.
