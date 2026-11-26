/** Matches Layout’s mobile breakpoint, plus coarse pointers (phones / tablets). */
export const NATIVE_DATE_PICKER_QUERY = "(max-width: 767px), (hover: none) and (pointer: coarse)";

export const CALENDAR_VIEWPORT_PADDING = 8;

export type CalendarDay = {
  year: number;
  /** 0-indexed month (Date.getMonth). */
  month: number;
  day: number;
};

export type ClockTime = {
  hours: number;
  minutes: number;
};

export const isMobileUserAgent = (userAgent: string): boolean =>
  /android/i.test(userAgent) || /iphone|ipad|ipod/i.test(userAgent);

export const shouldUseNativeDatePicker = (userAgent: string, mediaMatches: boolean): boolean =>
  isMobileUserAgent(userAgent) || mediaMatches;

export const clampCalendarPosition = (
  left: number,
  top: number,
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
  scrollX: number,
  scrollY: number,
  padding: number = CALENDAR_VIEWPORT_PADDING,
): { left: number; top: number } => {
  const minLeft = padding + scrollX;
  const maxLeft = scrollX + viewportWidth - width - padding;
  const minTop = padding + scrollY;
  const maxTop = scrollY + viewportHeight - height - padding;

  return {
    left: Math.min(Math.max(left, minLeft), Math.max(minLeft, maxLeft)),
    top: Math.min(Math.max(top, minTop), Math.max(minTop, maxTop)),
  };
};

export const dayTimestamp = ({ year, month, day }: CalendarDay): number => Date.UTC(year, month, day);

export const isDayBefore = (day: CalendarDay, minDay: CalendarDay): boolean =>
  dayTimestamp(day) < dayTimestamp(minDay);

export const isSameCalendarDay = (a: CalendarDay, b: CalendarDay): boolean =>
  a.year === b.year && a.month === b.month && a.day === b.day;

export const timeToMinutes = ({ hours, minutes }: ClockTime): number => hours * 60 + minutes;

export const isTimeBefore = (time: ClockTime, minTime: ClockTime): boolean =>
  timeToMinutes(time) < timeToMinutes(minTime);

/** When end shares the start day (or clock-only), hours before start are disabled. */
export const shouldDisableEndHour = (hour: number, minTime: ClockTime | null): boolean => {
  if (!minTime) return false;
  return hour < minTime.hours;
};

/** When end hour equals start hour (under time constraint), earlier minutes are disabled. */
export const shouldDisableEndMinute = (
  minute: number,
  selectedHours: number,
  minTime: ClockTime | null,
): boolean => {
  if (!minTime) return false;
  if (selectedHours < minTime.hours) return true;
  if (selectedHours > minTime.hours) return false;
  return minute < minTime.minutes;
};

/**
 * End clock is constrained to start time for clock-only ranges,
 * or when end day equals start day on a datetime range.
 */
export const getEndTimeMinConstraint = (options: {
  isOnlyClock: boolean;
  startDay: CalendarDay | null;
  endDay: CalendarDay | null;
  startTime: ClockTime;
}): ClockTime | null => {
  const { isOnlyClock, startDay, endDay, startTime } = options;
  if (isOnlyClock) return startTime;
  if (!startDay || !endDay) return null;
  if (!isSameCalendarDay(startDay, endDay)) return null;
  return startTime;
};

/** Full end datetime must not be strictly before start. */
export const isEndBeforeStart = (
  end: CalendarDay & ClockTime,
  start: CalendarDay & ClockTime,
  withTime: boolean,
): boolean => {
  const dayDiff = dayTimestamp(end) - dayTimestamp(start);
  if (dayDiff !== 0) return dayDiff < 0;
  if (!withTime) return false;
  return isTimeBefore(end, start);
};
