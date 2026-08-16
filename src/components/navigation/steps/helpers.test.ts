import assert from "node:assert/strict";
import { test } from "node:test";
import {
  clampStep,
  getStepClickAction,
  getStepStatus,
  getStepsStorageKey,
  getStepsThemeStyle,
  parseStoredStep,
  resolveStepThemeColor,
  resolveStepsOrientation,
} from "./helpers.ts";

test("status: pending, current, completed", () => {
  assert.equal(getStepStatus(1, 2), "pending");
  assert.equal(getStepStatus(1, 1), "in-progress");
  assert.equal(getStepStatus(1, 0), "completed");
});

test("clampStep: bounds and non-finite", () => {
  assert.equal(clampStep(0, 3), 0);
  assert.equal(clampStep(2, 3), 2);
  assert.equal(clampStep(-4, 3), 0);
  assert.equal(clampStep(9, 3), 2);
  assert.equal(clampStep(1.8, 3), 1);
  assert.equal(clampStep(Number.NaN, 3), 0);
  assert.equal(clampStep(1, 0), 0);
});

test("storage key uses pathname and name", () => {
  assert.equal(getStepsStorageKey("onboard", "/app"), "/app::onboard");
  assert.equal(getStepsStorageKey("onboard", ""), "::onboard");
});

test("parseStoredStep: missing, invalid, in-range", () => {
  assert.equal(parseStoredStep(null, 4), null);
  assert.equal(parseStoredStep("abc", 4), null);
  assert.equal(parseStoredStep("2", 4), 2);
  assert.equal(parseStoredStep("9", 4), 3);
});

test("click: automatic blocks every target", () => {
  assert.equal(
    getStepClickAction(0, 1, { isAutomatic: true, hasValidation: false }),
    "blocked",
  );
});

test("click: current is ignore, past is commit", () => {
  assert.equal(getStepClickAction(1, 1, { hasValidation: false }), "ignore");
  assert.equal(getStepClickAction(0, 2, { hasValidation: true }), "commit");
});

test("click: without validation any future step commits", () => {
  assert.equal(getStepClickAction(3, 0, { hasValidation: false }), "commit");
});

test("click: with validation next validates, skip is blocked", () => {
  assert.equal(getStepClickAction(2, 1, { hasValidation: true }), "validate");
  assert.equal(getStepClickAction(3, 1, { hasValidation: true }), "blocked");
});

test("orientation: variant wins over direction", () => {
  assert.equal(resolveStepsOrientation(), "horizontal");
  assert.equal(resolveStepsOrientation("vertical"), "vertical");
  assert.equal(resolveStepsOrientation(undefined, "vertical"), "vertical");
  assert.equal(resolveStepsOrientation("horizontal", "vertical"), "horizontal");
});

test("theme color: tokens become CSS vars, raw values pass through", () => {
  assert.equal(resolveStepThemeColor("purple"), "var(--purple-500)");
  assert.equal(resolveStepThemeColor("teal"), "var(--teal-500)");
  assert.equal(resolveStepThemeColor("var(--cyan-500)"), "var(--cyan-500)");
  assert.equal(resolveStepThemeColor("#7c3aed"), "#7c3aed");
  assert.equal(resolveStepThemeColor(undefined), undefined);
});

test("theme style only sets provided keys", () => {
  assert.deepEqual(getStepsThemeStyle(), {});
  assert.deepEqual(getStepsThemeStyle({ current: "purple", completed: "teal" }), {
    "--steps-current": "var(--purple-500)",
    "--steps-completed": "var(--teal-500)",
  });
});
