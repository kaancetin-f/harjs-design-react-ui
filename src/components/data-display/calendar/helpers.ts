import type { View } from "../../../libs/infrastructure/types";
import type { CalendarEvent } from "./IProps";

export const CELL_HEIGHT = 60;
export const HOURS_IN_DAY = 24;
export const DAYS_IN_WEEK = 7;
export const MONTH_GRID_CELLS = 42;
export const DEFAULT_WEEK_STARTS_ON = 1;
export const DEFAULT_VIEW: View = "Week";
export const VIEWS: View[] = ["Day", "Week", "Month", "Year"];

export type PositionedEvent<T> = {
  event: T & CalendarEvent;
  originalIndex: number;
  layout: {
    top: number;
    height: number;
    column: number;
    totalColumns: number;
  };
};

export const startOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

export const endOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

export const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

export const isSameMonth = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();

export const getWeekRange = (date: Date, weekStartsOn: number = DEFAULT_WEEK_STARTS_ON) => {
  const current = startOfDay(date);
  const diff = (current.getDay() - weekStartsOn + 7) % 7;
  const start = new Date(current);
  start.setDate(current.getDate() - diff);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

export const getWeekDays = (date: Date, weekStartsOn: number = DEFAULT_WEEK_STARTS_ON) => {
  const { start } = getWeekRange(date, weekStartsOn);
  return Array.from({ length: DAYS_IN_WEEK }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
};

export const getMonthGrid = (date: Date, weekStartsOn: number = DEFAULT_WEEK_STARTS_ON) => {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const { start } = getWeekRange(first, weekStartsOn);
  return Array.from({ length: MONTH_GRID_CELLS }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
};

export const shiftDate = (date: Date, view: View, direction: 1 | -1) => {
  const next = new Date(date);

  if (view === "Day") {
    next.setDate(date.getDate() + direction);
    return next;
  }

  if (view === "Week") {
    next.setDate(date.getDate() + direction * DAYS_IN_WEEK);
    return next;
  }

  if (view === "Month") {
    const day = date.getDate();
    next.setDate(1);
    next.setMonth(date.getMonth() + direction);
    const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    next.setDate(Math.min(day, lastDay));
    return next;
  }

  next.setFullYear(date.getFullYear() + direction);
  return next;
};

export const formatCalendarTitle = (
  date: Date,
  view: View,
  locale: Intl.LocalesArgument = "tr",
  weekStartsOn: number = DEFAULT_WEEK_STARTS_ON,
) => {
  if (view === "Day") {
    return date.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (view === "Week") {
    const { start, end } = getWeekRange(date, weekStartsOn);
    const sameMonth = start.getMonth() === end.getMonth();
    const sameYear = start.getFullYear() === end.getFullYear();
    const startText = start.toLocaleDateString(locale, {
      day: "numeric",
      month: sameMonth ? undefined : "short",
      year: sameYear ? undefined : "numeric",
    });
    const endText = end.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${startText} – ${endText}`;
  }

  if (view === "Month") {
    return date.toLocaleDateString(locale, { month: "long", year: "numeric" });
  }

  return String(date.getFullYear());
};

export const getTimeOffset = (date: Date, cellHeight: number = CELL_HEIGHT) =>
  ((date.getHours() * 60 + date.getMinutes()) / 60) * cellHeight;

export const getTooltipTransform = (x: number, y: number, viewportWidth: number, viewportHeight: number) => {
  const isRightHalf = x > viewportWidth / 2;
  const isBottomHalf = y > viewportHeight / 2;
  return `translate(${isRightHalf ? "-110%" : "10%"}, ${isBottomHalf ? "-110%" : "10%"})`;
};

export const eventsInRange = <T extends CalendarEvent>(data: T[], rangeStart: number, rangeEnd: number) =>
  data
    .map((event, originalIndex) => ({ event, originalIndex }))
    .filter(({ event }) => event.start.getTime() <= rangeEnd && event.end.getTime() >= rangeStart)
    .sort((a, b) => a.event.start.getTime() - b.event.start.getTime());

export const computeEventLayout = <T>(
  items: { event: T & CalendarEvent; originalIndex: number }[],
  dayStart: number,
  dayEnd: number,
  cellHeight: number = CELL_HEIGHT,
): PositionedEvent<T>[] => {
  const results: PositionedEvent<T>[] = [];
  type ClusterItem = {
    event: T & CalendarEvent;
    originalIndex: number;
    start: number;
    end: number;
  };

  const clusters: ClusterItem[][] = [];
  let lastEventEnd = 0;

  items.forEach(({ event, originalIndex }) => {
    const start = Math.max(event.start.getTime(), dayStart);
    const end = Math.min(event.end.getTime(), dayEnd);

    if (start >= lastEventEnd) {
      clusters.push([]);
    }

    clusters[clusters.length - 1].push({ event, originalIndex, start, end });
    lastEventEnd = Math.max(lastEventEnd, end);
  });

  clusters.forEach((cluster) => {
    const columns: ClusterItem[][] = [];

    cluster.forEach((item) => {
      let placed = false;
      for (let index = 0; index < columns.length; index++) {
        const lastInColumn = columns[index][columns[index].length - 1];
        if (item.start >= lastInColumn.end) {
          columns[index].push(item);
          placed = true;
          break;
        }
      }
      if (!placed) columns.push([item]);
    });

    cluster.forEach((item) => {
      const column = columns.findIndex((col) => col.includes(item));
      const startMinutes = new Date(item.start).getHours() * 60 + new Date(item.start).getMinutes();
      const duration = Math.max((item.end - item.start) / 60000, 20);

      results.push({
        event: item.event,
        originalIndex: item.originalIndex,
        layout: {
          top: (startMinutes / 60) * cellHeight,
          height: (duration / 60) * cellHeight,
          column,
          totalColumns: columns.length,
        },
      });
    });
  });

  return results;
};

export const getEventColor = (id: string | number) => {
  const colors = [
    { bg: "var(--blue-500)", border: "var(--blue-600)" },
    { bg: "var(--green-500)", border: "var(--green-600)" },
    { bg: "var(--orange-500)", border: "var(--orange-600)" },
    { bg: "var(--purple-500)", border: "var(--purple-600)" },
    { bg: "var(--pink-500)", border: "var(--pink-600)" },
    { bg: "var(--cyan-500)", border: "var(--cyan-600)" },
  ];

  let hash = 0;
  const identifier = String(id);
  for (let index = 0; index < identifier.length; index++) {
    hash = identifier.charCodeAt(index) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};
