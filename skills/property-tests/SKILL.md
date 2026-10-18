---
name: property-tests
description: >
  Writes property-based and differential tests. States in plain language what
  must never break (a round-trip, an invariant, idempotency, equivalence with a
  simple version) and lets a seeded generator try many inputs to break it. In a
  rewrite or migration, runs the old and the new system on the same generated
  or replayed inputs and treats each mismatch as a bug or an approved
  difference. Proves that each test goes red on a plausible wrong
  implementation. Use for a parser, formatter, serializer, pricing rule or
  other pure function with a clear contract, a refactor or optimization that
  must keep behavior, a rewrite with an old system to compare against, or on
  "property test", "property-based test", "differential test", "compare old
  and new", "property-tests". Not for a UI flow, where an end-to-end test fits
  better, not for one confirmed failure (failure-to-constraint), and not for a
  formal model.
license: MIT
metadata:
  author: Tim Kleinschmidt (Azd325)
---

# Property Tests

An example that you choose yourself passes by your own logic.
You pick the inputs that you already thought about, and you compute the expected value with the reasoning that wrote the code.
A property states what must never happen. A generator then tries many inputs that nobody picked.
A differential test uses the old system as the oracle: the old and the new system get the same inputs, and each mismatch needs a reason.

Default scope is **tests only**: write test files and change nothing else.
Do not change the code under test, except for the temporary mutation in the proof step, which you restore.
Add no dependency without the developer's consent.

## The one rule

Ask for properties, not examples.
Take each property from the contract: the specification, the documentation, the ticket, the old system or a simple reference version.
Do not derive a property from the implementation under test. A property that repeats the implementation passes by construction.
When the contract is not clear, ask the developer which property must hold. Do not invent the contract.
Keep a hand-picked example only as a saved counterexample or as a case that the contract states.

## 1. Check that the task fits

Use this skill for:

- new code with a clear contract, such as a parser, a formatter, a serializer, a pricing rule or another pure function;
- a refactor or an optimization that must keep behavior;
- a rewrite or a migration with an old system to compare against.

Do not use it for:

- a UI flow: an end-to-end test fits better;
- one confirmed failure: `failure-to-constraint` owns that;
- a formal model, such as Lean or TLA+.

When a `frame-task` memo names a property or a differential check in its `Done when` line, start from that check.

## 2. Name the properties

State each property in plain language before you write code, and name its kind.

| Kind         | Must hold                                      | Example                                                                 |
| ------------ | ---------------------------------------------- | ----------------------------------------------------------------------- |
| Round-trip   | decoding the encoded value gives the start one | a serializer reads back what it wrote                                   |
| Invariant    | a fact that every output keeps                 | sorting keeps the count and the contents; a balance never goes negative |
| Idempotency  | doing it twice equals doing it once            | formatting a formatted file changes nothing                             |
| Equivalence  | the optimized function equals a simple one     | the cached price equals the price computed from scratch                 |
| Differential | the new system equals the old system           | the new report equals the old report for the same orders                |

Write the simple version for an equivalence apart from the code under test.
A simple version that shares code with the optimized function is not an oracle.

## 3. Write the property tests

1. **Pick the library.** Use the property library that the project already has. If it has none, propose the standard one for its language: fast-check for JavaScript and TypeScript, Hypothesis for Python, proptest for Rust. Add it only with the developer's consent. If the developer declines, use a seeded loop over the standard random module, and record in Gaps that it does not shrink.
2. **Build the generator from the contract.** Generate the whole input domain that the contract allows, including empty values, boundaries, Unicode and large sizes. Constrain the generator only where the contract excludes inputs, and cite that part of the contract.
3. **Check what the generator produces.** Print a sample, or count the input classes that it reaches. A generator that never reaches a boundary proves nothing about it.
4. **Keep runs seeded and deterministic.** Fix the seed in CI, or use the derandomized mode of the library. Print the seed on failure, so that anyone can replay the run. Record the run count.
5. **Save each shrunk counterexample.** When a run fails, take the shrunk input from the library and add it as a regression example: `@example` in Hypothesis, the `examples` option in fast-check, the committed `proptest-regressions` file in proptest, or a plain unit test.
6. **Report a counterexample.** A counterexample is the result. Do not change the code under test to pass, and do not weaken the property, narrow the generator or filter out the input to get a green run. If the contract excludes the input, cite the contract in the report.

## 4. Write the differential tests

1. **Name the oracle.** Name the old system, its version and the command that runs it. Run it against isolated data. Never replay writes against production.
2. **Use inputs that nobody picked.** Generate the inputs, or replay a sample of real inputs. Do not hand-pick them. Use real inputs only from a source the developer approved, and remove personal data first.
3. **Normalize fields that carry no meaning.** Before the comparison, normalize timestamps, generated IDs and orderings that carry no meaning. Write each normalization as a named rule with its reason. Never normalize a field to hide a mismatch.
4. **Compare and classify each mismatch.** Each mismatch is a bug or an intended change. An unexplained mismatch is a bug.
5. **Keep a list of approved differences.** Record each intended change next to the test, with its reason and the person who approved it. The developer approves each entry. Do not add an entry to get a green run.

## 5. Prove that each test can fail

A test that passes either way is not coverage.
For each property, write one plausible wrong implementation: an off-by-one, a dropped element, a swapped field, a lost sign or a missed normalization.
Mutate the code, run the test and see it fail, then restore the exact code.
For a differential test, put one meaningful difference into the new system and see the comparison report it.
A property that stays green under every plausible mutation is too weak. Make it stronger or drop it.
Only a failed assertion is a red. An error, such as a compile failure, is not a red.

## 6. Report

Use this template. The Runs section names the seed, so that anyone can replay the run.

```markdown
## Properties

1. <property in plain language> (<round-trip | invariant | idempotency | equivalence | differential>): `<test name>`

## Generator

- Produces: <input domain, bounds and sizes>
- Reaches: <input classes seen in the sample>
- Excludes: <inputs left out, with the part of the contract that excludes them>

## Runs

- `<command>`: <run count> runs, seed <seed>, <pass | fail>

## Counterexamples

- <shrunk input>: expected <value>, got <value>; saved as <regression example>

## Differences

- Normalized: <field>: <reason>
- Approved: <difference>: <reason>, approved by <person>
- Unexplained: <count>, first shrunk input <input>

## Proof

- <property>: <mutation> → red, restored → green

## Gaps

<input classes not generated, properties not stated, limits of the oracle>
```

Leave out the Differences section when no old system exists.

Example: a fictional money formatter. `formatCents` writes an amount in cents as text, and `parseCents` reads it back.

```markdown
## Properties

1. Parsing a formatted amount gives the start amount (round-trip): `formatCents round-trips`
2. A formatted amount has exactly two digits after the point (invariant): `formatCents has two decimals`

## Generator

- Produces: integers from -10^12 to 10^12
- Reaches: 0, -1 to -99, 1 to 99, 100, the bounds
- Excludes: none

## Runs

- `pnpm test money.property.test.ts`: 1000 runs, seed 42, fail

## Counterexamples

- `-5`: expected `-5`, got `5`; `formatCents(-5)` gives `0.05` and loses the sign; saved as an `examples` entry

## Proof

- Round-trip: red on the counterexample `-5` without a mutation
- Two decimals: drop the zero padding → red on `105`, restored → green

## Gaps

Amounts above 10^12 and currencies without two decimals.
```
