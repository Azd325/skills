---
name: frame-task
description: >
  Turns one fuzzy task into a decision before any code exists. Returns a
  five-line decision memo, a ranked list of the context that is missing, the
  unchecked assumptions in the framing, and one next step sized to confidence.
  Grounds the memo in the current repository when there is one. Use before a
  vague or half-day task, before a non-trivial PR, before an abstraction, or on
  "frame", "frame this", "help me scope", "decision memo", "what am I
  missing", "before I build this", or a pasted vague ticket. Does not write
  code. A choice between several candidate tasks belongs to invent-work.
license: MIT
metadata:
  author: Tim Kleinschmidt (Azd325)
---

# Frame Task

Judgment depends on context. On a fuzzy task, the best first move is to find the context that is missing.
This skill returns a decision and the directions that sharpen it. It does not solve the task.

Default scope is **recommend**. Do not write code, create tickets or start the work unless asked.
For a choice between several candidate tasks, use `invent-work`. This skill frames one task that is already chosen.

## The one rule

Surface what is missing. Do not fill it with a guess.
A summary restates the ticket. A frame tells the developer what they do not yet know.
Do not invent a detail such as traffic volume, the real user or the existence of prior art. Hand it back as a direction.
Mark every claim **grounded** (you verified it in the input or the repository) or **assumed** (it needs a check).

## 1. Read the task

Read the task as given: ticket, chat paste or one line. Do not expand it into a spec.
A request is not the problem. Look for the problem behind it.

## 2. Ground in the repository

Skip this step when the current directory is not a git repository with source code, or when the task is not about code.
Otherwise search before you ask:

- **Prior art:** existing code that does this or something close.
- **Blast radius:** what calls the area, and which tests cover it.
- **Owners and conventions:** `CODEOWNERS`, nearby patterns, `CONTRIBUTING`.

Report what you could not determine as plainly as what you found.

## 3. Answer four questions

Answer each as far as the input and the repository allow. Leave an unknown blank. Do not guess it.

1. What is the problem behind the request?
2. Who is the user, and what hurts?
3. What does the framing assume that may be wrong?
4. What is the downside if the framing is wrong?

When the task joins several requests into one need, treat the join as a hypothesis. A tidy single idea is not proof that one need exists.
Test it: name the requests, and check whether one solution serves all of them or two separate solutions serve one each.
When one voice raised the problem once, say so. A problem that recurs, or that arrives from several teams, weighs more than a loud first request.

## 4. Rank the missing context

List the facts that would change the decision most, most decisive first. Do not order by how easy they are to find.
For each fact, name where or who likely has it, and what it would change.

## 5. Name the unchecked assumptions

State each assumption that the framing hides, with the cheapest way to test it.

## 6. Cut the scope and size the step

Name the smallest version that solves the actual problem, and the signal that would justify more later.
Then name one next step, sized to your confidence and to the cost of being wrong:

| Next step           | When                                 |
| ------------------- | ------------------------------------ |
| Ship now            | Low risk and clear value             |
| Throwaway prototype | The facts are uncertain              |
| Proposal first      | The threshold below is met and the facts are known |

Write a design proposal first only when the work will serve many future projects, changes what users get, or takes more than a month of engineering time.
When none of the three holds, the step is ship now or a throwaway prototype.
When the threshold is met but the facts are uncertain, the step is a throwaway prototype first.
State the reason in one sentence. Do not pick a bigger step than the evidence supports.

## 7. Stop

Do not implement, even when the answer looks obvious. Hand back the frame. The developer decides.

## Report

Use this template. Part 1 is safe to paste into a PR or ticket. Part 2 is coaching for the developer.

```markdown
**Frame — <task in one line>**

- **Problem:** <the problem behind the request>
- **User / pain:** <who, and what hurts>
- **Assuming:** <assumptions that could be wrong>
- **Downside if wrong:** <blast radius>
- **Scope cut:** not doing <X> now; signal that would change this: <Y>
- **Next step:** <ship now | throwaway prototype | proposal first>, because <reason>

**Directions (ranked by effect on the decision):**

1. <fact to find> — likely with <where or who>. Changes: <what>

**Unchecked assumptions in the framing:**

- <assumption> → <cheapest test>

**Grounded vs assumed:** <which parts you verified, which are guesses>
```

If the task is already well defined, say so: "No ambiguity worth a memo. Confirm only X." A frame that says "you are clear, go" is a valid result. Do not invent directions.

## When to skip

Skip a small, well-specified, mechanical change. A frame there is ceremony.
