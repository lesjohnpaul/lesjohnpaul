// Run: node --test src/lib/studio/salvage.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { salvagePrototype } from "./salvage.ts";

const dashboard = { type: "dashboard", title: "Overview", kpis: [{ label: "Orders", value: "128" }, { label: "Revenue", value: "$4.2k" }], chart: { label: "Weekly {a} orders", points: [3, 5, 4, 8, 7, 9] } };
const table = { type: "table", title: "Orders", columns: ["Customer", "Item"], rows: [["Ana", "Cake"], ["Ben", "Pie"], ["Cy", "Tart"]] };
const kanban = { type: "kanban", title: "Jobs", columns: [{ name: "New", cards: ["Quote \"A\" }"] }, { name: "Doing", cards: [] }, { name: "Done", cards: ["B"] }] };
const full = JSON.stringify({ business: "Sample Bakery", spec: "Track orders in one place.", screens: [dashboard, table, kanban] });

test("valid JSON", () => assert.equal(salvagePrototype(full)?.business, "Sample Bakery"));
test("trailing }", () => assert.equal(salvagePrototype(full + "}")?.business, "Sample Bakery"));
test("trailing second object", () => assert.equal(salvagePrototype(full + '\n{"x":1}')?.business, "Sample Bakery"));
test("trailing ]]", () => assert.equal(salvagePrototype(full + "]]")?.business, "Sample Bakery"));
test("braces and escaped quotes in strings", () => assert.equal(salvagePrototype(full + "}")?.screens[2].type, "kanban"));
test("2-screen prefix", () => {
  const two = JSON.stringify({ business: "B", spec: "S", screens: [dashboard, table] });
  assert.equal(salvagePrototype(two.slice(0, -2) + "}"), null);
  assert.equal(salvagePrototype(two + "}"), null);
});
test("cut mid-string is never salvaged", () => assert.equal(salvagePrototype(full.slice(0, full.indexOf("Cake") + 2)), null));
test("non-object / empty", () => { for (const s of ["[]", "42", "", "   "]) assert.equal(salvagePrototype(s), null); });
