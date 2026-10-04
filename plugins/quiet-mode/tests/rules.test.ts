import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("rules.json holds a core and an optional rule list", async () => {
  const rules = JSON.parse(await readFile(new URL("../rules.json", import.meta.url), "utf8"));
  assert.deepEqual(Object.keys(rules).sort(), ["core", "optional"]);
  assert.ok(Array.isArray(rules.core));
  assert.ok(Array.isArray(rules.optional));
});
