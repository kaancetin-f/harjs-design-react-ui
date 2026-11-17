import assert from "node:assert/strict";
import { test } from "node:test";
import { IsInteractiveRowTarget, IsRowPointerDrag, TABLE_ROW_CLICK_IGNORE_SELECTOR } from "./rowClick.ts";

test("row click ignores targets that opt out", () => {
  const interactive = { closest: () => ({}) };
  const plain = { closest: () => null };

  assert.equal(IsInteractiveRowTarget(interactive as unknown as EventTarget), true);
  assert.equal(IsInteractiveRowTarget(plain as unknown as EventTarget), false);
  assert.equal(IsInteractiveRowTarget(null), false);
  assert.equal(IsInteractiveRowTarget({} as EventTarget), false);
});

test("row click ignores a pointer that moved", () => {
  assert.equal(IsRowPointerDrag(null, { x: 10, y: 10 }), false);
  assert.equal(IsRowPointerDrag({ x: 10, y: 10 }, { x: 12, y: 11 }), false);
  assert.equal(IsRowPointerDrag({ x: 10, y: 10 }, { x: 16, y: 10 }), true);
  assert.equal(IsRowPointerDrag({ x: 10, y: 10 }, { x: 10, y: 20 }), true);
});

test("row click ignore selector covers in-row controls", () => {
  for (const token of [
    "button",
    "input",
    "a",
    "label",
    ".subitem-open-button",
    ".dnd-handle",
    ".har-checkbox-wrapper",
    ".har-input-wrapper",
    ".har-select-wrapper",
    ".har-date-picker",
  ]) {
    assert.equal(TABLE_ROW_CLICK_IGNORE_SELECTOR.split(",").includes(token), true, token);
  }
});
