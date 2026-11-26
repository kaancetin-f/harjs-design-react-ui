import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getEndTimeMinConstraint,
  isDayBefore,
  isEndBeforeStart,
  isSameCalendarDay,
  isTimeBefore,
  shouldDisableEndHour,
  shouldDisableEndMinute,
} from "./helpers.ts";

test("isDayBefore: earlier calendar day", () => {
  assert.equal(
    isDayBefore({ year: 2026, month: 0, day: 10 }, { year: 2026, month: 0, day: 11 }),
    true,
  );
  assert.equal(
    isDayBefore({ year: 2026, month: 0, day: 11 }, { year: 2026, month: 0, day: 11 }),
    false,
  );
  assert.equal(
    isDayBefore({ year: 2026, month: 0, day: 12 }, { year: 2026, month: 0, day: 11 }),
    false,
  );
});

test("isSameCalendarDay", () => {
  assert.equal(
    isSameCalendarDay({ year: 2026, month: 5, day: 1 }, { year: 2026, month: 5, day: 1 }),
    true,
  );
  assert.equal(
    isSameCalendarDay({ year: 2026, month: 5, day: 1 }, { year: 2026, month: 5, day: 2 }),
    false,
  );
});

test("isTimeBefore", () => {
  assert.equal(isTimeBefore({ hours: 9, minutes: 0 }, { hours: 9, minutes: 30 }), true);
  assert.equal(isTimeBefore({ hours: 9, minutes: 30 }, { hours: 9, minutes: 30 }), false);
  assert.equal(isTimeBefore({ hours: 10, minutes: 0 }, { hours: 9, minutes: 30 }), false);
});

test("shouldDisableEndHour / shouldDisableEndMinute under constraint", () => {
  const min = { hours: 14, minutes: 15 };
  assert.equal(shouldDisableEndHour(13, min), true);
  assert.equal(shouldDisableEndHour(14, min), false);
  assert.equal(shouldDisableEndHour(15, min), false);
  assert.equal(shouldDisableEndHour(13, null), false);

  assert.equal(shouldDisableEndMinute(10, 14, min), true);
  assert.equal(shouldDisableEndMinute(15, 14, min), false);
  assert.equal(shouldDisableEndMinute(0, 15, min), false);
  assert.equal(shouldDisableEndMinute(0, 13, min), true);
  assert.equal(shouldDisableEndMinute(10, 14, null), false);
});

test("getEndTimeMinConstraint: clock-only and same-day datetime", () => {
  const startTime = { hours: 8, minutes: 0 };
  const startDay = { year: 2026, month: 2, day: 10 };
  const sameEnd = { year: 2026, month: 2, day: 10 };
  const laterEnd = { year: 2026, month: 2, day: 11 };

  assert.deepEqual(
    getEndTimeMinConstraint({ isOnlyClock: true, startDay: null, endDay: null, startTime }),
    startTime,
  );
  assert.deepEqual(
    getEndTimeMinConstraint({ isOnlyClock: false, startDay, endDay: sameEnd, startTime }),
    startTime,
  );
  assert.equal(
    getEndTimeMinConstraint({ isOnlyClock: false, startDay, endDay: laterEnd, startTime }),
    null,
  );
  assert.equal(
    getEndTimeMinConstraint({ isOnlyClock: false, startDay, endDay: null, startTime }),
    null,
  );
});

test("isEndBeforeStart: date-only vs with time", () => {
  const start = { year: 2026, month: 0, day: 10, hours: 12, minutes: 0 };
  const sameDayEarlier = { year: 2026, month: 0, day: 10, hours: 9, minutes: 0 };
  const earlierDay = { year: 2026, month: 0, day: 9, hours: 23, minutes: 0 };
  const laterDay = { year: 2026, month: 0, day: 11, hours: 0, minutes: 0 };

  assert.equal(isEndBeforeStart(earlierDay, start, false), true);
  assert.equal(isEndBeforeStart(sameDayEarlier, start, false), false);
  assert.equal(isEndBeforeStart(sameDayEarlier, start, true), true);
  assert.equal(isEndBeforeStart(laterDay, start, true), false);
  assert.equal(isEndBeforeStart(start, start, true), false);
});
