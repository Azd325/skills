# Vision

`property-tests` exists so that a test checks the contract of the code, not the examples that its author already thought about.
It serves developers and agents who write code with a clear contract, refactor or optimize code that must keep behavior, or replace a system that still runs.
It states properties in plain language, lets a seeded generator try to break them, and uses the old system as the oracle in a rewrite or a migration.
It owns exactly one thing: property-based and differential tests, and the proof that each one can fail.

## Properties, not examples

An example that the author picks passes by the author's own logic.
The skill asks for properties: round-trip, invariant, idempotency and equivalence with a simple version.
Each property comes from the contract, never from the implementation under test.
When the contract is not clear, the skill asks the developer and does not invent one.

## A test that can fail

A test that passes either way is not coverage.
Each property goes red on a plausible wrong implementation, and green again when the code is restored.
Only a failed assertion counts as red.
A property that survives every plausible mutation is too weak, and the skill makes it stronger or drops it.

## Counterexamples are results

A shrunk counterexample becomes a regression example and goes into the report.
The skill never weakens a property, narrows a generator or filters an input to get a green run.
Runs are seeded and deterministic, so anyone can replay a failure.

## Differences need a reason

In a differential test, every mismatch is a bug or an intended change.
Fields that carry no meaning are normalized by named rules, and no rule hides a mismatch.
Each intended change goes on a list with its reason, and the developer approves each entry.
Inputs are generated or replayed from a sample, never hand-picked, and the old system runs against isolated data.

## Scope

property-tests is a prompt-only package in the `azd325/skills` collection.
This vision covers the property-tests package only; rules shared across the collection's packages live in the collection's AGENTS.md.
It writes test files and changes nothing else; a new dependency needs the developer's consent.
It is not for a UI flow, one confirmed failure (`failure-to-constraint`), a formal model or an end-to-end gate.

A change aligns when it makes a property easier to state from the contract, makes a test easier to prove able to fail, or makes a mismatch easier to explain.
A change should be resisted when it accepts hand-picked examples in place of properties, takes a property from the implementation, accepts a test without its mutation proof, hides a counterexample or a mismatch to get a green run, changes the code under test by default, or widens the skill to UI flows, formal models or end-to-end gates.
