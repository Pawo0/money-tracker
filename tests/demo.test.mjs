import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

// Exercise the TypeScript fixture module without adding a test runtime dependency.
const moduleExports = {};
const source = fs.readFileSync(
  new URL("../src/lib/demo.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
});
new Function("exports", compiled.outputText)(moduleExports);
const { createDemoExpenses, isDemoExpenses, demoCategories } = moduleExports;

test("demo covers every category and three months with stable unique IDs", () => {
  const data = createDemoExpenses(new Date(2026, 9, 15));
  assert.equal(data.length, 39);
  assert.equal(new Set(data.map((e) => e._id)).size, 39);
  assert.equal(new Set(data.map((e) => e.date.slice(0, 7))).size, 3);
  assert.equal(
    new Set(data.map((e) => e.category._id)).size,
    demoCategories.length,
  );
  assert.ok(data.every((e) => e.amount < 0 && e.description && e.created_at));
  assert.ok(isDemoExpenses(JSON.parse(JSON.stringify(data))));
});

test("first-day and year-boundary demos contain no future or invalid dates", () => {
  for (const now of [
    new Date(2027, 0, 1),
    new Date(2028, 2, 1),
    new Date(2026, 11, 31),
  ]) {
    const data = createDemoExpenses(now);
    const end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
    );
    assert.ok(
      data.every(
        (e) => !Number.isNaN(Date.parse(e.date)) && new Date(e.date) <= end,
      ),
    );
    assert.equal(new Set(data.map((e) => e.date.slice(0, 7))).size, 3);
  }
});

test("reset generates fresh transactions after additions or removals", () => {
  const anchor = new Date(2026, 9, 15);
  const original = createDemoExpenses(anchor);
  const modified = createDemoExpenses(anchor);
  modified.splice(0, 1);
  modified[0].title = "Changed locally";
  assert.deepEqual(createDemoExpenses(anchor), original);
});

test("storage validation accepts an emptied demo but rejects corrupt or real data", () => {
  const example = createDemoExpenses(new Date(2026, 9, 15))[0];
  assert.ok(isDemoExpenses([]));
  for (const value of [
    null,
    {},
    [null],
    [{ ...example, _id: "real-id" }],
    [{ ...example, amount: NaN }],
    [{ ...example, amount: "20" }],
    [{ ...example, date: "invalid" }],
    [{ ...example, category: null }],
    [{ ...example, description: {} }],
  ])
    assert.equal(isDemoExpenses(value), false);
});
