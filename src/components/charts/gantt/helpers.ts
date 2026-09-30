import type {
  FlatRow,
  GanttDateInput,
  GanttDependency,
  GanttDependencyType,
  GanttResource,
  GanttSnapUnit,
  GanttTaskStatus,
  GanttTheme,
  GanttTimeline,
  GanttWorkingCalendar,
  GanttZoomLevel,
  Task,
  TaskBarLayout,
  TimelineDay,
  TimelineMonth,
  TimelineUnit,
  DependencyPath,
  GanttDensity,
  GanttFilterState,
  GanttCommand,
  GanttHistorySnapshot,
  GanttHistoryState,
} from "./IProps";

export const MS_MINUTE = 60_000;
export const MS_HOUR = 60 * MS_MINUTE;
export const MS_DAY = 24 * MS_HOUR;

export const DEFAULT_ZOOM: GanttZoomLevel = "day";

export const ZOOM_UNIT_MS: Record<GanttZoomLevel, number> = {
  hour: MS_HOUR,
  "4hour": 4 * MS_HOUR,
  day: MS_DAY,
  week: 7 * MS_DAY,
  month: 30 * MS_DAY,
  quarter: 90 * MS_DAY,
};

export const ZOOM_UNIT_WIDTH: Record<GanttZoomLevel, number> = {
  hour: 72,
  "4hour": 88,
  day: 60,
  week: 80,
  month: 100,
  quarter: 120,
};

export const SNAP_MS: Record<Exclude<GanttSnapUnit, "none">, number> = {
  "15min": 15 * MS_MINUTE,
  "30min": 30 * MS_MINUTE,
  "1hour": MS_HOUR,
  day: MS_DAY,
};

export const DENSITY_ROW_HEIGHT: Record<GanttDensity, number> = {
  compact: 32,
  comfortable: 44,
  spacious: 56,
};

export const DEFAULT_STATUS_COLORS: Record<GanttTaskStatus | "default" | "critical" | "milestone", string> = {
  default: "var(--blue-500)",
  planned: "var(--gray-500)",
  released: "var(--cyan-500)",
  "in-progress": "var(--blue-500)",
  completed: "var(--green-500)",
  paused: "var(--orange-500)",
  cancelled: "var(--gray-400)",
  delayed: "var(--red-500)",
  critical: "var(--red-600)",
  milestone: "var(--purple-500)",
};

export const DEFAULT_WORKING_DAYS = [1, 2, 3, 4, 5];

export const DEFAULT_SHIFTS = [{ start: "08:00", end: "17:00" }];

const FALLBACK_COLORS = [
  "var(--blue-500)",
  "var(--green-500)",
  "var(--orange-500)",
  "var(--purple-500)",
  "var(--cyan-500)",
  "var(--teal-500)",
];


export const parseGanttDate = (value: GanttDateInput | undefined | null): Date | null => {
  if (value === undefined || value === null || value === "") return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
  }
  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const toLocaleTag = (locale?: Intl.LocalesArgument): string => {
  if (!locale) return "tr-TR";
  if (typeof locale === "string") {
    if (locale === "tr") return "tr-TR";
    if (locale === "en") return "en-US";
    return locale;
  }
  if (Array.isArray(locale) && locale[0]) return String(locale[0]);
  return "tr-TR";
};

export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const endOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

export const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

export const endOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

export const addMs = (date: Date, ms: number): Date => new Date(date.getTime() + ms);

export const clampDate = (date: Date, min: Date, max: Date): Date => {
  const t = date.getTime();
  if (t < min.getTime()) return new Date(min.getTime());
  if (t > max.getTime()) return new Date(max.getTime());
  return new Date(t);
};

export const formatGanttDate = (
  date: Date,
  locale?: Intl.LocalesArgument,
  options?: Intl.DateTimeFormatOptions,
  timeZone?: string,
): string => {
  return date.toLocaleDateString(toLocaleTag(locale), {
    ...options,
    ...(timeZone ? { timeZone } : {}),
  });
};

export const formatGanttDateTime = (
  date: Date,
  locale?: Intl.LocalesArgument,
  timeZone?: string,
): string => {
  return date.toLocaleString(toLocaleTag(locale), {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...(timeZone ? { timeZone } : {}),
  });
};


export const parseShiftMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map((part) => Number(part));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
  return h * 60 + m;
};

export const resolveCalendar = (
  calendar: GanttWorkingCalendar | undefined,
  resourceId?: string | number,
): GanttWorkingCalendar => {
  const base: GanttWorkingCalendar = {
    workingDays: calendar?.workingDays ?? DEFAULT_WORKING_DAYS,
    shifts: calendar?.shifts ?? DEFAULT_SHIFTS,
    holidays: calendar?.holidays ?? [],
  };
  if (resourceId === undefined || !calendar?.resourceCalendars) return base;
  const override = calendar.resourceCalendars[String(resourceId)];
  if (!override) return base;
  return {
    workingDays: override.workingDays ?? base.workingDays,
    shifts: override.shifts ?? base.shifts,
    holidays: override.holidays ?? base.holidays,
  };
};

export const toHolidayKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const isWorkingDay = (date: Date, calendar?: GanttWorkingCalendar, resourceId?: string | number): boolean => {
  const cal = resolveCalendar(calendar, resourceId);
  const workingDays = cal.workingDays ?? DEFAULT_WORKING_DAYS;
  if (!workingDays.includes(date.getDay())) return false;
  const holidays = cal.holidays ?? [];
  if (holidays.includes(toHolidayKey(date))) return false;
  return true;
};

export const isWorkingTime = (
  date: Date,
  calendar?: GanttWorkingCalendar,
  resourceId?: string | number,
): boolean => {
  if (!isWorkingDay(date, calendar, resourceId)) return false;
  const cal = resolveCalendar(calendar, resourceId);
  const shifts = cal.shifts ?? DEFAULT_SHIFTS;
  if (shifts.length === 0) return true;
  const minutes = date.getHours() * 60 + date.getMinutes();
  return shifts.some((shift) => {
    const start = parseShiftMinutes(shift.start);
    const end = parseShiftMinutes(shift.end);
    if (end >= start) return minutes >= start && minutes < end;
    return minutes >= start || minutes < end;
  });
};

export interface NonWorkingRange {
  start: Date;
  end: Date;
}

/** Collect non-working day ranges (full days) within [from, to]. */
export const getNonWorkingDayRanges = (
  from: Date,
  to: Date,
  calendar?: GanttWorkingCalendar,
  resourceId?: string | number,
): NonWorkingRange[] => {
  const ranges: NonWorkingRange[] = [];
  const cursor = startOfDay(from);
  const end = startOfDay(to);

  while (cursor.getTime() <= end.getTime()) {
    if (!isWorkingDay(cursor, calendar, resourceId)) {
      const dayStart = new Date(cursor);
      const dayEnd = endOfDay(cursor);
      const last = ranges[ranges.length - 1];
      if (last && last.end.getTime() + 1 >= dayStart.getTime()) {
        last.end = dayEnd;
      } else {
        ranges.push({ start: dayStart, end: dayEnd });
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return ranges;
};

/** Snap a date onto the nearest working moment (forward or nearest). */
export const snapToWorkingTime = (
  date: Date,
  calendar: GanttWorkingCalendar | undefined,
  direction: "forward" | "backward" | "nearest" = "forward",
  resourceId?: string | number,
  maxSteps = 14 * 24 * 4,
): Date => {
  if (isWorkingTime(date, calendar, resourceId)) return new Date(date.getTime());

  const step = 15 * MS_MINUTE;
  if (direction === "backward") {
    let cur = new Date(date.getTime());
    for (let i = 0; i < maxSteps; i++) {
      cur = addMs(cur, -step);
      if (isWorkingTime(cur, calendar, resourceId)) return cur;
    }
    return date;
  }

  if (direction === "nearest") {
    const forward = snapToWorkingTime(date, calendar, "forward", resourceId, maxSteps);
    const backward = snapToWorkingTime(date, calendar, "backward", resourceId, maxSteps);
    const df = Math.abs(forward.getTime() - date.getTime());
    const db = Math.abs(date.getTime() - backward.getTime());
    return df <= db ? forward : backward;
  }

  let cur = new Date(date.getTime());
  for (let i = 0; i < maxSteps; i++) {
    cur = addMs(cur, step);
    if (isWorkingTime(cur, calendar, resourceId)) return cur;
  }
  return date;
};

/**
 * Keep the calendar day when possible: before shift → shift start,
 * after shift → shift end. Non-working days still move forward/back.
 */
export const clampToWorkingTimeSameDay = (
  date: Date,
  calendar: GanttWorkingCalendar | undefined,
  prefer: "start" | "end" = "start",
  resourceId?: string | number,
): Date => {
  if (isWorkingTime(date, calendar, resourceId)) return new Date(date.getTime());

  const cal = resolveCalendar(calendar, resourceId);
  const shifts = cal.shifts ?? DEFAULT_SHIFTS;

  if (isWorkingDay(date, calendar, resourceId) && shifts.length > 0) {
    const minutes = date.getHours() * 60 + date.getMinutes();
    const starts = shifts.map((shift) => parseShiftMinutes(shift.start));
    const ends = shifts.map((shift) => parseShiftMinutes(shift.end));
    const firstStart = Math.min(...starts);
    const lastEnd = Math.max(...ends);

    const atMinutes = (total: number) => {
      const next = startOfDay(date);
      next.setHours(Math.floor(total / 60), total % 60, 0, 0);
      return next;
    };

    if (minutes < firstStart) return atMinutes(firstStart);
    if (minutes >= lastEnd) return atMinutes(lastEnd);

    let best = atMinutes(firstStart);
    let bestDist = Number.POSITIVE_INFINITY;
    for (const shift of shifts) {
      const start = parseShiftMinutes(shift.start);
      const end = parseShiftMinutes(shift.end);
      for (const edge of [start, end]) {
        const dist = Math.abs(minutes - edge);
        if (dist < bestDist) {
          bestDist = dist;
          best = atMinutes(edge);
        }
      }
    }
    return best;
  }

  return snapToWorkingTime(date, calendar, prefer === "end" ? "backward" : "forward", resourceId);
};


export const snapDate = (date: Date, snap: GanttSnapUnit = "none"): Date => {
  if (snap === "none") return new Date(date.getTime());
  const unit = SNAP_MS[snap];
  const t = date.getTime();
  return new Date(Math.round(t / unit) * unit);
};

export const enforceMinDuration = (start: Date, end: Date, minMs: number): { start: Date; end: Date } => {
  if (end.getTime() - start.getTime() >= minMs) return { start, end };
  return { start, end: addMs(start, minMs) };
};


export const generateGanttTimeline = (
  data: Task[],
  options?: {
    locale?: Intl.LocalesArgument;
    startDate?: GanttDateInput;
    endDate?: GanttDateInput;
    calendar?: GanttWorkingCalendar;
    padToMonth?: boolean;
  },
): GanttTimeline => {
  const locale = toLocaleTag(options?.locale);
  const padToMonth = options?.padToMonth !== false;

  if ((!data || data.length === 0) && !options?.startDate && !options?.endDate) {
    return { timelineStart: null, timelineEnd: null, months: [], days: [] };
  }

  let minDate: Date | null = null;
  let maxDate: Date | null = null;

  for (const task of data) {
    const start = parseGanttDate(task.start);
    const end = parseGanttDate(task.end);
    const plannedStart = parseGanttDate(task.plannedStart);
    const plannedEnd = parseGanttDate(task.plannedEnd);
    const actualStart = parseGanttDate(task.actualStart);
    const actualEnd = parseGanttDate(task.actualEnd);

    for (const d of [start, end, plannedStart, plannedEnd, actualStart, actualEnd]) {
      if (!d) continue;
      if (!minDate || d < minDate) minDate = d;
      if (!maxDate || d > maxDate) maxDate = d;
    }
  }

  const explicitStart = parseGanttDate(options?.startDate);
  const explicitEnd = parseGanttDate(options?.endDate);
  if (explicitStart) minDate = !minDate || explicitStart < minDate ? explicitStart : minDate;
  if (explicitEnd) maxDate = !maxDate || explicitEnd > maxDate ? explicitEnd : maxDate;

  if (!minDate || !maxDate) {
    const today = startOfDay(new Date());
    minDate = today;
    maxDate = addMs(today, 14 * MS_DAY);
  }

  const startTimeline = padToMonth ? startOfMonth(minDate) : startOfDay(minDate);
  const endTimeline = padToMonth ? endOfMonth(maxDate) : endOfDay(maxDate);

  const months: TimelineMonth[] = [];
  const days: TimelineDay[] = [];
  const current = new Date(startTimeline);

  while (current.getTime() <= endTimeline.getTime()) {
    const dayOfWeek = current.getDay();
    const weekend = dayOfWeek === 0 || dayOfWeek === 6;
    days.push({
      date: new Date(current),
      number: current.getDate(),
      name: current.toLocaleDateString(locale, { weekday: "short" }),
      isWeekend: weekend,
      isHoliday: (options?.calendar?.holidays ?? []).includes(toHolidayKey(current)),
      isWorking: isWorkingDay(current, options?.calendar),
    });

    const year = current.getFullYear();
    const number = current.getMonth();
    if (!months.some((m) => m.year === year && m.number === number)) {
      months.push({
        year,
        number,
        name: current.toLocaleDateString(locale, { month: "long" }),
        totalDays: new Date(year, number + 1, 0).getDate(),
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return {
    timelineStart: startTimeline,
    timelineEnd: endTimeline,
    months,
    days,
  };
};

export const buildTimelineUnits = (
  timelineStart: Date,
  timelineEnd: Date,
  zoom: GanttZoomLevel,
  locale?: Intl.LocalesArgument,
  calendar?: GanttWorkingCalendar,
): TimelineUnit[] => {
  const tag = toLocaleTag(locale);
  const units: TimelineUnit[] = [];
  let cursor = new Date(timelineStart.getTime());

  const pushUnit = (start: Date, end: Date, label: string, secondaryLabel?: string) => {
    units.push({
      start,
      end,
      label,
      secondaryLabel,
      isWeekend: start.getDay() === 0 || start.getDay() === 6,
      isWorking: isWorkingDay(start, calendar),
    });
  };

  if (zoom === "hour" || zoom === "4hour") {
    const step = zoom === "hour" ? MS_HOUR : 4 * MS_HOUR;
    while (cursor.getTime() < timelineEnd.getTime()) {
      const start = new Date(cursor);
      const end = addMs(start, step);
      const hour = start.getHours();
      const isMidnight = hour === 0;
      const label =
        zoom === "hour"
          ? String(hour).padStart(2, "0")
          : `${String(hour).padStart(2, "0")}:00`;
      const secondaryLabel = isMidnight
        ? start.toLocaleDateString(tag, { day: "2-digit", month: "short" })
        : undefined;
      pushUnit(start, end, label, secondaryLabel);
      cursor = end;
    }
    return units;
  }

  if (zoom === "day") {
    while (cursor.getTime() <= timelineEnd.getTime()) {
      const start = startOfDay(cursor);
      const end = endOfDay(cursor);
      pushUnit(
        start,
        end,
        String(start.getDate()).padStart(2, "0"),
        start.toLocaleDateString(tag, { weekday: "short" }),
      );
      cursor = addMs(startOfDay(cursor), MS_DAY);
    }
    return units;
  }

  if (zoom === "week") {
    while (cursor.getTime() <= timelineEnd.getTime()) {
      const start = startOfDay(cursor);
      const end = addMs(start, 7 * MS_DAY - 1);
      pushUnit(
        start,
        end,
        start.toLocaleDateString(tag, { day: "2-digit", month: "short" }),
        `W${getIsoWeek(start)}`,
      );
      cursor = addMs(start, 7 * MS_DAY);
    }
    return units;
  }

  if (zoom === "month") {
    cursor = startOfMonth(cursor);
    while (cursor.getTime() <= timelineEnd.getTime()) {
      const start = startOfMonth(cursor);
      const end = endOfMonth(cursor);
      pushUnit(start, end, start.toLocaleDateString(tag, { month: "short" }), String(start.getFullYear()));
      cursor = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    }
    return units;
  }

  cursor = new Date(cursor.getFullYear(), Math.floor(cursor.getMonth() / 3) * 3, 1);
  while (cursor.getTime() <= timelineEnd.getTime()) {
    const start = new Date(cursor);
    const end = new Date(start.getFullYear(), start.getMonth() + 3, 0, 23, 59, 59, 999);
    const q = Math.floor(start.getMonth() / 3) + 1;
    pushUnit(start, end, `Q${q}`, String(start.getFullYear()));
    cursor = new Date(start.getFullYear(), start.getMonth() + 3, 1);
  }
  return units;
};

export const getIsoWeek = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / MS_DAY + 1) / 7);
};


export interface TimelineGeometry {
  timelineStart: Date;
  timelineEnd: Date;
  zoom: GanttZoomLevel;
  unitMs: number;
  unitWidth: number;
  totalWidth: number;
  dateToX: (date: Date) => number;
  xToDate: (x: number) => Date;
  durationToWidth: (durationMs: number) => number;
  widthToDuration: (width: number) => number;
}

export const createTimelineGeometry = (options: {
  timelineStart: Date;
  timelineEnd: Date;
  zoom: GanttZoomLevel;
  /** Optional continuous scale multiplier (legacy zoom compat). */
  scale?: number;
  unitWidth?: number;
}): TimelineGeometry => {
  const zoom = options.zoom;
  const scale = options.scale ?? 1;
  const unitMs = ZOOM_UNIT_MS[zoom];
  const unitWidth = (options.unitWidth ?? ZOOM_UNIT_WIDTH[zoom]) * scale;
  const span = Math.max(options.timelineEnd.getTime() - options.timelineStart.getTime(), unitMs);
  const totalWidth = (span / unitMs) * unitWidth;

  const dateToX = (date: Date) =>
    ((date.getTime() - options.timelineStart.getTime()) / unitMs) * unitWidth;

  const xToDate = (x: number) =>
    new Date(options.timelineStart.getTime() + (x / unitWidth) * unitMs);

  const durationToWidth = (durationMs: number) => (durationMs / unitMs) * unitWidth;
  const widthToDuration = (width: number) => (width / unitWidth) * unitMs;

  return {
    timelineStart: options.timelineStart,
    timelineEnd: options.timelineEnd,
    zoom,
    unitMs,
    unitWidth,
    totalWidth,
    dateToX,
    xToDate,
    durationToWidth,
    widthToDuration,
  };
};

export const rowToY = (rowIndex: number, rowHeight: number, offset = 0): number =>
  rowIndex * rowHeight + offset;

export const yToRow = (y: number, rowHeight: number): number => {
  if (rowHeight <= 0) return 0;
  return Math.max(0, Math.floor(y / rowHeight));
};

export const visibleUnitRange = (
  scrollX: number,
  viewportWidth: number,
  unitWidth: number,
  totalUnits: number,
  buffer = 3,
): { start: number; end: number } => {
  if (!viewportWidth || totalUnits === 0 || unitWidth <= 0) {
    return { start: 0, end: Math.max(totalUnits - 1, 0) };
  }
  const first = Math.floor(scrollX / unitWidth) - buffer;
  const last = Math.ceil((scrollX + viewportWidth) / unitWidth) + buffer;
  return {
    start: Math.max(0, first),
    end: Math.min(totalUnits - 1, last),
  };
};

export const visibleRowRange = (
  scrollY: number,
  viewportHeight: number,
  rowHeight: number,
  totalRows: number,
  buffer = 4,
): { start: number; end: number } => {
  if (!viewportHeight || totalRows === 0 || rowHeight <= 0) {
    return { start: 0, end: Math.max(totalRows - 1, 0) };
  }
  const first = Math.floor(scrollY / rowHeight) - buffer;
  const last = Math.ceil((scrollY + viewportHeight) / rowHeight) + buffer;
  return {
    start: Math.max(0, first),
    end: Math.min(totalRows - 1, last),
  };
};


export const resolveTaskColor = (
  task: Task,
  index: number,
  theme?: GanttTheme,
): string => {
  if (task.color) return task.color;
  if (task.type === "milestone") {
    return theme?.task?.milestone ?? DEFAULT_STATUS_COLORS.milestone;
  }
  if (task.critical) {
    return theme?.task?.critical ?? DEFAULT_STATUS_COLORS.critical;
  }
  if (task.status && theme?.task?.[task.status]) return theme.task[task.status]!;
  if (task.status) return DEFAULT_STATUS_COLORS[task.status];
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
};

export const layoutTaskBars = (options: {
  tasks: Task[];
  rowIndexByTaskId: Map<string, number>;
  geometry: TimelineGeometry;
  rowHeight: number;
  theme?: GanttTheme;
  showPlanned?: boolean;
  showActual?: boolean;
}): TaskBarLayout[] => {
  const barHeight = options.rowHeight / 1.6;
  const layouts: TaskBarLayout[] = [];

  options.tasks.forEach((task, index) => {
    const start = parseGanttDate(task.start);
    const end = parseGanttDate(task.end);
    if (!start || !end) return;

    const idKey = String(task.id);
    const rowIndex = options.rowIndexByTaskId.get(idKey) ?? index;
    const x = options.geometry.dateToX(start);
    const width = Math.max(options.geometry.durationToWidth(end.getTime() - start.getTime()), 2);
    const y = rowToY(rowIndex, options.rowHeight, (options.rowHeight - barHeight) / 2);
    const progress = Math.min(100, Math.max(0, task.progress ?? 0));
    const isMilestone = task.type === "milestone" || width <= 2;

    let planned: TaskBarLayout["planned"];
    let actual: TaskBarLayout["actual"];

    if (options.showPlanned !== false) {
      const ps = parseGanttDate(task.plannedStart);
      const pe = parseGanttDate(task.plannedEnd);
      if (ps && pe) {
        planned = {
          x: options.geometry.dateToX(ps),
          width: Math.max(options.geometry.durationToWidth(pe.getTime() - ps.getTime()), 2),
        };
      }
    }

    if (options.showActual !== false) {
      const as = parseGanttDate(task.actualStart);
      const ae = parseGanttDate(task.actualEnd) ?? (task.status === "in-progress" ? new Date() : null);
      if (as && ae) {
        actual = {
          x: options.geometry.dateToX(as),
          width: Math.max(options.geometry.durationToWidth(ae.getTime() - as.getTime()), 2),
        };
      }
    }

    layouts.push({
      id: task.id,
      task,
      x,
      y,
      width: isMilestone ? barHeight : width,
      height: barHeight,
      planned,
      actual,
      progressWidth: (width * progress) / 100,
      color: resolveTaskColor(task, index, options.theme),
      isMilestone,
      rowIndex,
    });
  });

  return layouts;
};


export const collectDependencies = (
  tasks: Task[],
  external?: GanttDependency[],
): GanttDependency[] => {
  const list: GanttDependency[] = [...(external ?? [])];
  for (const task of tasks) {
    if (!task.dependencies) continue;
    for (const dep of task.dependencies) {
      list.push({
        ...dep,
        toId: dep.toId ?? task.id,
      });
    }
  }
  const seen = new Set<string>();
  return list.filter((dep) => {
    const key = `${dep.fromId}->${dep.toId}:${dep.type ?? "FS"}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const routeDependencyPath = (
  fromBar: TaskBarLayout,
  toBar: TaskBarLayout,
  type: GanttDependencyType = "FS",
): string => {
  const stub = 10;
  let x1: number;
  let y1: number;
  let x2: number;
  let y2: number;

  switch (type) {
    case "SS":
      x1 = fromBar.x;
      y1 = fromBar.y + fromBar.height / 2;
      x2 = toBar.x;
      y2 = toBar.y + toBar.height / 2;
      break;
    case "FF":
      x1 = fromBar.x + fromBar.width;
      y1 = fromBar.y + fromBar.height / 2;
      x2 = toBar.x + toBar.width;
      y2 = toBar.y + toBar.height / 2;
      break;
    case "SF":
      x1 = fromBar.x;
      y1 = fromBar.y + fromBar.height / 2;
      x2 = toBar.x + toBar.width;
      y2 = toBar.y + toBar.height / 2;
      break;
    case "FS":
    default:
      x1 = fromBar.x + fromBar.width;
      y1 = fromBar.y + fromBar.height / 2;
      x2 = toBar.x;
      y2 = toBar.y + toBar.height / 2;
      break;
  }

  const midX = x1 < x2 ? x1 + Math.max((x2 - x1) / 2, stub) : x1 + stub;
  const goAround = x1 >= x2 - 4;

  if (!goAround) {
    return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
  }

  const offsetY = y1 < y2 ? fromBar.height / 2 + 6 : -(fromBar.height / 2 + 6);
  const bypassY = y1 + offsetY;
  return `M ${x1} ${y1} L ${x1 + stub} ${y1} L ${x1 + stub} ${bypassY} L ${x2 - stub} ${bypassY} L ${x2 - stub} ${y2} L ${x2} ${y2}`;
};

export const buildDependencyPaths = (
  deps: GanttDependency[],
  barsById: Map<string, TaskBarLayout>,
): DependencyPath[] => {
  const paths: DependencyPath[] = [];
  for (const dep of deps) {
    const from = barsById.get(String(dep.fromId));
    const to = barsById.get(String(dep.toId));
    if (!from || !to) continue;
    const type = dep.type ?? "FS";
    paths.push({
      id: String(dep.id ?? `${dep.fromId}-${dep.toId}-${type}`),
      fromId: dep.fromId,
      toId: dep.toId,
      type,
      d: routeDependencyPath(from, to, type),
    });
  }
  return paths;
};


export const computeCriticalTaskIds = (
  tasks: Task[],
  deps: GanttDependency[],
): Set<string> => {
  const byId = new Map(tasks.map((t) => [String(t.id), t]));
  const outgoing = new Map<string, string[]>();
  for (const dep of deps) {
    if ((dep.type ?? "FS") !== "FS") continue;
    const from = String(dep.fromId);
    const to = String(dep.toId);
    if (!outgoing.has(from)) outgoing.set(from, []);
    outgoing.get(from)!.push(to);
  }

  const duration = (id: string) => {
    const t = byId.get(id);
    if (!t) return 0;
    const s = parseGanttDate(t.start);
    const e = parseGanttDate(t.end);
    if (!s || !e) return 0;
    return Math.max(0, e.getTime() - s.getTime());
  };

  const memo = new Map<string, number>();
  const visiting = new Set<string>();

  const longest = (id: string): number => {
    if (memo.has(id)) return memo.get(id)!;
    if (visiting.has(id)) return duration(id);
    visiting.add(id);
    const children = outgoing.get(id) ?? [];
    let best = 0;
    for (const child of children) best = Math.max(best, longest(child));
    visiting.delete(id);
    const value = duration(id) + best;
    memo.set(id, value);
    return value;
  };

  let bestRoot = "";
  let bestLen = -1;
  for (const t of tasks) {
    const id = String(t.id);
    const len = longest(id);
    if (len > bestLen) {
      bestLen = len;
      bestRoot = id;
    }
  }

  const critical = new Set<string>();
  let cursor: string | undefined = bestRoot;
  while (cursor) {
    critical.add(cursor);
    const children = outgoing.get(cursor) ?? [];
    let next: string | undefined;
    let nextLen = -1;
    for (const child of children) {
      const len = memo.get(child) ?? 0;
      if (len > nextLen) {
        nextLen = len;
        next = child;
      }
    }
    cursor = next;
  }

  for (const t of tasks) {
    if (t.critical) critical.add(String(t.id));
  }

  return critical;
};


export const buildTaskTreeRows = (
  tasks: Task[],
  collapsedIds: Set<string>,
): FlatRow[] => {
  const byParent = new Map<string, Task[]>();
  const roots: Task[] = [];

  for (const task of tasks) {
    if (task.parentId === undefined || task.parentId === null || task.parentId === "") {
      roots.push(task);
    } else {
      const key = String(task.parentId);
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key)!.push(task);
    }
  }

  const rows: FlatRow[] = [];

  const walk = (task: Task, depth: number) => {
    const id = String(task.id);
    const children = byParent.get(id) ?? [];
    const collapsed = collapsedIds.has(id) || task.collapsed === true;
    rows.push({
      id,
      kind: "task",
      depth,
      task,
      label: task.code ? `${task.code} ${task.name}` : task.name,
      expandable: children.length > 0,
      collapsed,
    });
    if (!collapsed) {
      for (const child of children) walk(child, depth + 1);
    }
  };

  const rootIds = new Set(roots.map((t) => String(t.id)));
  for (const task of tasks) {
    if (task.parentId !== undefined && task.parentId !== null && task.parentId !== "") {
      if (!tasks.some((t) => String(t.id) === String(task.parentId)) && !rootIds.has(String(task.id))) {
        roots.push(task);
        rootIds.add(String(task.id));
      }
    }
  }

  for (const root of roots) walk(root, 0);
  return rows;
};

export const buildResourceRows = (
  resources: GanttResource[],
  tasks: Task[],
  collapsedIds: Set<string>,
): FlatRow[] => {
  const byParent = new Map<string, GanttResource[]>();
  const roots: GanttResource[] = [];

  for (const resource of resources) {
    if (resource.parentId === undefined || resource.parentId === null || resource.parentId === "") {
      roots.push(resource);
    } else {
      const key = String(resource.parentId);
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key)!.push(resource);
    }
  }

  const tasksByResource = new Map<string, Task[]>();
  for (const task of tasks) {
    const rid = task.resourceId ?? task.machineId ?? task.workCenterId;
    if (rid === undefined) continue;
    const key = String(rid);
    if (!tasksByResource.has(key)) tasksByResource.set(key, []);
    tasksByResource.get(key)!.push(task);
  }

  const rows: FlatRow[] = [];

  const walk = (resource: GanttResource, depth: number) => {
    const id = String(resource.id);
    const children = byParent.get(id) ?? [];
    const assigned = tasksByResource.get(id) ?? [];
    const collapsed = collapsedIds.has(id) || resource.collapsed === true;
    const expandable = children.length > 0 || assigned.length > 0;

    rows.push({
      id: `resource:${id}`,
      kind: "resource",
      depth,
      resource,
      label: resource.code ? `${resource.code} ${resource.name}` : resource.name,
      expandable,
      collapsed,
    });

    if (collapsed) return;

    for (const child of children) walk(child, depth + 1);
    for (const task of assigned) {
      rows.push({
        id: String(task.id),
        kind: "task",
        depth: depth + 1,
        task,
        label: task.code ? `${task.code} ${task.name}` : task.name,
      });
    }
  };

  for (const root of roots) walk(root, 0);
  return rows;
};


export const filterTasks = (tasks: Task[], filters?: GanttFilterState): Task[] => {
  if (!filters) return tasks;
  const q = filters.query?.trim().toLowerCase();

  return tasks.filter((task) => {
    if (filters.statuses?.length && (!task.status || !filters.statuses.includes(task.status))) {
      return false;
    }
    if (filters.resourceIds?.length) {
      const rid = task.resourceId ?? task.machineId ?? task.workCenterId;
      if (rid === undefined || !filters.resourceIds.some((id) => String(id) === String(rid))) {
        return false;
      }
    }
    if (filters.priorities?.length && (task.priority === undefined || !filters.priorities.includes(task.priority))) {
      return false;
    }
    if (filters.criticalOnly && !task.critical) return false;
    if (q) {
      const hay = `${task.name} ${task.code ?? ""} ${task.id}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
};

/** Expand ancestors of matching tasks so search hits stay visible. */
export const expandAncestorsForMatches = (
  tasks: Task[],
  matchIds: Set<string>,
): Set<string> => {
  const byId = new Map(tasks.map((t) => [String(t.id), t]));
  const expand = new Set<string>();
  for (const id of matchIds) {
    let cursor = byId.get(id);
    while (cursor?.parentId !== undefined && cursor.parentId !== null && cursor.parentId !== "") {
      const parentKey = String(cursor.parentId);
      expand.add(parentKey);
      cursor = byId.get(parentKey);
    }
  }
  return expand;
};


export const ZOOM_ORDER: GanttZoomLevel[] = ["hour", "4hour", "day", "week", "month", "quarter"];

export const zoomIn = (zoom: GanttZoomLevel): GanttZoomLevel => {
  const idx = ZOOM_ORDER.indexOf(zoom);
  return ZOOM_ORDER[Math.max(0, idx - 1)] ?? zoom;
};

export const zoomOut = (zoom: GanttZoomLevel): GanttZoomLevel => {
  const idx = ZOOM_ORDER.indexOf(zoom);
  return ZOOM_ORDER[Math.min(ZOOM_ORDER.length - 1, idx + 1)] ?? zoom;
};

/** Preserve focal date when changing zoom / scale. */
export const preserveFocalScroll = (options: {
  focalDate: Date;
  geometry: TimelineGeometry;
  viewportWidth: number;
}): number => {
  const focalX = options.geometry.dateToX(options.focalDate);
  return Math.max(0, focalX - options.viewportWidth / 2);
};

export const getThemeCssVars = (theme?: GanttTheme): Record<string, string> => {
  if (!theme) return {};
  const style: Record<string, string> = {};
  if (theme.grid?.line) style["--gantt-grid-line"] = theme.grid.line;
  if (theme.grid?.weekend) style["--gantt-weekend"] = theme.grid.weekend;
  if (theme.grid?.nonWorking) style["--gantt-non-working"] = theme.grid.nonWorking;
  if (theme.todayLine?.stroke) style["--gantt-today"] = theme.todayLine.stroke;
  if (theme.dependency?.stroke) style["--gantt-dependency"] = theme.dependency.stroke;
  if (theme.planned?.fill) style["--gantt-planned"] = theme.planned.fill;
  if (theme.actual?.fill) style["--gantt-actual"] = theme.actual.fill;
  if (theme.progress?.fill) style["--gantt-progress"] = theme.progress.fill;
  if (theme.selection?.stroke) style["--gantt-selection"] = theme.selection.stroke;
  return style;
};

export const nextZoomFromWheel = (
  zoom: GanttZoomLevel,
  deltaY: number,
): GanttZoomLevel => (deltaY < 0 ? zoomIn(zoom) : zoomOut(zoom));


export const createHistory = (): GanttHistoryState => ({ past: [], future: [] });

export const pushCommand = (
  state: GanttHistoryState,
  command: GanttCommand,
  limit = 100,
): GanttHistoryState => {
  const past = [...state.past, command];
  if (past.length > limit) past.shift();
  return { past, future: [] };
};

export const undo = (
  state: GanttHistoryState,
): { state: GanttHistoryState; snapshot: GanttHistorySnapshot | null } => {
  if (state.past.length === 0) return { state, snapshot: null };
  const past = [...state.past];
  const command = past.pop()!;
  return {
    state: { past, future: [command, ...state.future] },
    snapshot: command.undo,
  };
};

export const redo = (
  state: GanttHistoryState,
): { state: GanttHistoryState; snapshot: GanttHistorySnapshot | null } => {
  if (state.future.length === 0) return { state, snapshot: null };
  const [command, ...future] = state.future;
  return {
    state: { past: [...state.past, command], future },
    snapshot: command.redo,
  };
};

export const canUndo = (state: GanttHistoryState) => state.past.length > 0;
export const canRedo = (state: GanttHistoryState) => state.future.length > 0;

export const cloneSnapshot = (
  tasks: Task[],
  dependencies: GanttDependency[],
): GanttHistorySnapshot => ({
  tasks: tasks.map((t) => ({ ...t })),
  dependencies: dependencies.map((d) => ({ ...d })),
});
