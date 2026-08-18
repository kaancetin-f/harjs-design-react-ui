import assert from "node:assert/strict";
import { test } from "node:test";
import { isMobileUserAgent, shouldUseNativeDatePicker } from "./helpers.ts";

test("isMobileUserAgent: Android and iOS", () => {
  assert.equal(
    isMobileUserAgent("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36"),
    true,
  );
  assert.equal(
    isMobileUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"),
    true,
  );
  assert.equal(isMobileUserAgent("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)"), true);
});

test("isMobileUserAgent: desktop browsers stay on the custom calendar", () => {
  assert.equal(
    isMobileUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"),
    false,
  );
  assert.equal(isMobileUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)"), false);
});

test("shouldUseNativeDatePicker: media query covers narrow / coarse pointers", () => {
  assert.equal(shouldUseNativeDatePicker("Mozilla/5.0 (Windows NT 10.0; Win64; x64)", true), true);
  assert.equal(shouldUseNativeDatePicker("Mozilla/5.0 (Windows NT 10.0; Win64; x64)", false), false);
  assert.equal(
    shouldUseNativeDatePicker("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)", false),
    true,
  );
});
