import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveWizardLocale } from "./helpers.ts";

test("locale: undefined and string", () => {
  assert.equal(resolveWizardLocale(), "tr");
  assert.equal(resolveWizardLocale("en"), "en");
});

test("locale: array uses the first tag", () => {
  assert.equal(resolveWizardLocale(["en-US", "tr"]), "en-US");
  assert.equal(resolveWizardLocale([]), "tr");
});
