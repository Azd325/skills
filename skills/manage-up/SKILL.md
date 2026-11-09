---
name: manage-up
description: >
  Drafts a message to your own boss. Covers a win note the boss can forward,
  a pre-brief before a meeting, an escalation draft the boss can send, and a
  Yes, if reply that names the trade-off. Use on "draft an update for my
  boss", "pre-brief my manager", "escalation email", "push back on a
  deadline" or "manage up". Writes a draft and sends nothing. Not for
  framing one task (frame-task) or writing an engineering strategy
  (write-strategy).
license: MIT
metadata:
  author: Tim Kleinschmidt (Azd325)
---

# Manage up

Draft a message to the user's own boss.
Return the draft in the reply.
It does not send, post or email the draft.
Hand the text back for the user to send.

When the user does not name a format, ask which of the four formats they want.
Do not pick a format for them.

## Facts

Take facts only from what the user gives, or from the local work context they point at.
The context is pull requests, tickets and notes.
Do not invent a result, a date, a name, a link or an impact.
Name each missing fact in the return.
Leave internal tool names out of the draft.
Name the work and the outcome.

## Shape

Put the punchline first.
The result, the ask or the recommendation is the first line.
Context follows.
Write the draft in Simplified Technical English.
Use short sentences, one fact in each, and the active voice.
Say what you need from the reader and by when.
Give a recommendation, the reason, the risk and the first step.
Say how sure you are.
When you raise a problem, say why it matters and name the next action, or say to watch it for now.
Answer the next question the reader will ask in the same message.

## Win note

Write a message the boss can forward upwards unchanged.
Give the note a clear subject.
Lead with the result.
When you know what the next reader cares about, lead with that result.
Keep the note readable on a phone in under three minutes.

## Pre-brief

Write this before the boss meets someone.
Keep it short enough to read between meetings.
State the ask, the impact and a link to the request.

## Escalation

Write this for the boss to send.
Name the recipients.
Use a subject that names the project and the precise ask.
Open with the risk and the date it becomes real.
State what is needed.
Point at the request already filed, with its date and a link.
Say why it is needed, in two lines.
Say why the project matters, in five lines at most.
Name a sponsor only when the user gave one.

## Yes, if

Use this for a deadline or a request.
Do not answer with a bare no.
Name the trade-off.
Say what slips and when you will report the new state.
When the request itself looks wrong, ask for its context before you agree or refuse.

## Return

Use this shape.

```markdown
**Format:** win note | pre-brief | escalation | yes-if

**Missing:** <facts you do not have, or none>

**Draft:**

<the message>
```

Example, fictional:

```markdown
**Format:** yes-if

**Missing:** none

**Draft:**

Yes, if the Thursday review slips one week.
I send the new date on Tuesday.
```
