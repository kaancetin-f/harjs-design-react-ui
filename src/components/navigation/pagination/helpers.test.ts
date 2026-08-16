import assert from "node:assert/strict";
import { test } from "node:test";
import {
  clampPage,
  getPaginationRange,
  getRecordRange,
  optionFor,
  parsePageJump,
} from "./helpers.ts";

test("range: empty and single page", () => {
  assert.deepEqual(getPaginationRange(1, 0), []);
  assert.deepEqual(getPaginationRange(1, 1), [1]);
  assert.deepEqual(getPaginationRange(3, 2), [1, 2]);
});

test("range: small page counts have no ellipsis", () => {
  assert.deepEqual(getPaginationRange(1, 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(getPaginationRange(4, 7), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(getPaginationRange(5, 9), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test("range: first pages keep a leading window", () => {
  assert.deepEqual(getPaginationRange(1, 100), [
    1, 2, 3, 4, 5, 6, 7, "ellipsis", 100,
  ]);
  assert.deepEqual(getPaginationRange(3, 100), [
    1, 2, 3, 4, 5, 6, 7, "ellipsis", 100,
  ]);
});

test("range: middle keeps current visible with siblings", () => {
  assert.deepEqual(getPaginationRange(50, 100), [
    1, "ellipsis", 48, 49, 50, 51, 52, "ellipsis", 100,
  ]);
});

test("range: last pages keep a trailing window", () => {
  assert.deepEqual(getPaginationRange(100, 100), [
    1, "ellipsis", 94, 95, 96, 97, 98, 99, 100,
  ]);
  assert.deepEqual(getPaginationRange(98, 100), [
    1, "ellipsis", 94, 95, 96, 97, 98, 99, 100,
  ]);
});

test("range: large page count stays bounded", () => {
  const range = getPaginationRange(5000, 10000);
  assert.ok(range.length <= 9);
  assert.equal(range[0], 1);
  assert.equal(range[range.length - 1], 10000);
  assert.ok(range.includes(5000));
});

test("range: current page is always present", () => {
  for (const page of [1, 2, 10, 50, 99, 100]) {
    assert.ok(getPaginationRange(page, 100).includes(page));
  }
});

test("record range", () => {
  assert.deepEqual(getRecordRange(1, 10, 0), { start: 0, end: 0 });
  assert.deepEqual(getRecordRange(1, 10, 8), { start: 1, end: 8 });
  assert.deepEqual(getRecordRange(1, 10, 250), { start: 1, end: 10 });
  assert.deepEqual(getRecordRange(3, 10, 95), { start: 21, end: 30 });
  assert.deepEqual(getRecordRange(10, 10, 95), { start: 91, end: 95 });
  assert.deepEqual(getRecordRange(1, 95, 95), { start: 1, end: 95 });
  assert.deepEqual(getRecordRange(99, 10, 95), { start: 91, end: 95 });
});

test("parse page jump", () => {
  assert.equal(parsePageJump("25", 100), 25);
  assert.equal(parsePageJump(" 7 ", 10), 7);
  assert.equal(parsePageJump("", 10), null);
  assert.equal(parsePageJump("abc", 10), null);
  assert.equal(parsePageJump("0", 10), null);
  assert.equal(parsePageJump("-1", 10), null);
  assert.equal(parsePageJump("9999", 100), null);
  assert.equal(parsePageJump("10", 10), 10);
});

test("clamp page", () => {
  assert.equal(clampPage(0, 10), 1);
  assert.equal(clampPage(1, 10), 1);
  assert.equal(clampPage(11, 10), 10);
  assert.equal(clampPage(4.8, 10), 4);
  assert.equal(clampPage(Number.NaN, 10), 1);
  assert.equal(clampPage(2, 0), 1);
});

test("optionFor keeps presets and All", () => {
  assert.equal(optionFor(10, "All", 250).text, "10");
  assert.equal(optionFor(250, "All", 250).text, "All");
  assert.equal(optionFor(12, "All", 250).text, "12");
});
