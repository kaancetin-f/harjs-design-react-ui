import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveGanttLanguage, toLocaleTag } from "./helpers.ts";

test("toLocaleTag maps short language codes", () => {
  assert.equal(toLocaleTag(), "tr-TR");
  assert.equal(toLocaleTag("tr"), "tr-TR");
  assert.equal(toLocaleTag("TR"), "tr-TR");
  assert.equal(toLocaleTag("tr-TR"), "tr-TR");
  assert.equal(toLocaleTag("tr_TR"), "tr-TR");
  assert.equal(toLocaleTag("en"), "en-US");
  assert.equal(toLocaleTag("en-GB"), "en-GB");
});

test("resolveGanttLanguage keeps Turkish tags on the tr dictionary", () => {
  assert.equal(resolveGanttLanguage(), "tr");
  assert.equal(resolveGanttLanguage("tr"), "tr");
  assert.equal(resolveGanttLanguage("tr-TR"), "tr");
  assert.equal(resolveGanttLanguage("TR"), "tr");
  assert.equal(resolveGanttLanguage("en"), "en");
  assert.equal(resolveGanttLanguage("en-US"), "en");
});
