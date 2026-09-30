import type { ReactNode, MouseEvent, KeyboardEvent } from "react";

/** Date-like values accepted by Gantt (string keeps backward compatibility). */
export type GanttDateInput = string | Date | number;

export type GanttTaskType =
  | "production-order"
  | "operation"
  | "sub-operation"
  | "maintenance"
  | "downtime"
  | "setup"
  | "milestone"
  | "task";

export type GanttTaskStatus =
  | "planned"
  | "released"
  | "in-progress"
  | "completed"
  | "paused"
  | "cancelled"
  | "delayed";

export type GanttDependencyType = "FS" | "SS" | "FF" | "SF";

export type GanttZoomLevel = "hour" | "4hour" | "day" | "week" | "month" | "quarter";

export type GanttSnapUnit = "none" | "15min" | "30min" | "1hour" | "day";

export type GanttDensity = "compact" | "comfortable" | "spacious";

export type GanttViewMode = "task" | "resource";

/**
 * Core task model. Existing consumers only need `id`, `name`, `start`, `end`.
 * Additional fields are optional for ERP / production planning.
 */
export interface Task {
  id: string | number;
  name: string;
  /** ISO / parseable date string (legacy) or Date. */
  start: GanttDateInput;
  end: GanttDateInput;

  parentId?: string | number;
  type?: GanttTaskType;
  code?: string;

  plannedStart?: GanttDateInput;
  plannedEnd?: GanttDateInput;
  actualStart?: GanttDateInput;
  actualEnd?: GanttDateInput;

  /** 0–100 */
  progress?: number;

  resourceId?: string | number;
  machineId?: string | number;
  workCenterId?: string | number;

  status?: GanttTaskStatus;
  priority?: number;
  critical?: boolean;

  quantity?: number;
  completedQuantity?: number;

  color?: string;
  /** Inline dependency refs (merged with top-level `dependencies` prop). */
  dependencies?: GanttDependency[];

  collapsed?: boolean;
  metadata?: Record<string, unknown>;
}

export interface GanttDependency {
  id?: string | number;
  fromId: string | number;
  toId: string | number;
  type?: GanttDependencyType;
  lagMs?: number;
}

export interface GanttResource {
  id: string | number;
  name: string;
  parentId?: string | number;
  type?: "plant" | "work-center" | "machine" | "resource" | string;
  code?: string;
  capacity?: number;
  calendarId?: string;
  color?: string;
  collapsed?: boolean;
  metadata?: Record<string, unknown>;
}

export interface GanttShift {
  /** "HH:mm" */
  start: string;
  /** "HH:mm" */
  end: string;
}

export interface GanttWorkingCalendar {
  /** 0=Sun … 6=Sat. Default Mon–Fri. */
  workingDays?: number[];
  shifts?: GanttShift[];
  /** ISO date strings (YYYY-MM-DD) treated as non-working. */
  holidays?: string[];
  /** Resource-specific overrides keyed by resource id. */
  resourceCalendars?: Record<string, Omit<GanttWorkingCalendar, "resourceCalendars">>;
}

export interface GanttColumn {
  key: string;
  title: string;
  width?: number;
  minWidth?: number;
  /** Field on Task | Resource, or custom accessor key handled by renderCell. */
  field?: string;
  sticky?: boolean;
  align?: "left" | "center" | "right";
}

export interface GanttFilterState {
  statuses?: GanttTaskStatus[];
  resourceIds?: Array<string | number>;
  priorities?: number[];
  criticalOnly?: boolean;
  query?: string;
}

export interface GanttTheme {
  task?: Partial<Record<GanttTaskStatus | "default" | "critical" | "milestone", string>>;
  dependency?: { stroke?: string; width?: number };
  grid?: { line?: string; weekend?: string; nonWorking?: string };
  todayLine?: { stroke?: string; width?: number };
  planned?: { fill?: string; opacity?: number };
  actual?: { fill?: string; opacity?: number };
  progress?: { fill?: string };
  selection?: { stroke?: string; width?: number };
}

export type GanttConfig = {
  locale?: Intl.LocalesArgument;
  timezone?: string;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  isServerSide?: boolean;
  isSearchable?: boolean;
  dateFormat?: Intl.DateTimeFormatOptions;
  timeFormat?: Intl.DateTimeFormatOptions;
};

/** @deprecated Prefer `GanttConfig`. Kept for existing imports. */
export type Config = GanttConfig;

export interface TimelineDay {
  date: Date;
  number: number;
  name: string;
  isWeekend: boolean;
  isHoliday?: boolean;
  isWorking?: boolean;
}

export interface TimelineMonth {
  year: number;
  number: number;
  name: string;
  totalDays: number;
}

export interface GanttTimeline {
  timelineStart: Date | null;
  timelineEnd: Date | null;
  months: TimelineMonth[];
  days: TimelineDay[];
}

export interface TimelineUnit {
  start: Date;
  end: Date;
  label: string;
  secondaryLabel?: string;
  isWeekend?: boolean;
  isWorking?: boolean;
}

export interface TaskBarLayout {
  id: string | number;
  task: Task;
  x: number;
  y: number;
  width: number;
  height: number;
  planned?: { x: number; width: number };
  actual?: { x: number; width: number };
  progressWidth: number;
  color: string;
  isMilestone: boolean;
  rowIndex: number;
}

export interface DependencyPath {
  id: string;
  fromId: string | number;
  toId: string | number;
  type: GanttDependencyType;
  d: string;
}

export interface FlatRow {
  id: string;
  kind: "task" | "resource" | "group";
  depth: number;
  task?: Task;
  resource?: GanttResource;
  label: string;
  expandable?: boolean;
  collapsed?: boolean;
}

export interface GanttTaskChangePayload {
  task: Task;
  previous: Task;
  reason: "move" | "resize-start" | "resize-end" | "resource" | "update";
}

export interface GanttSelectionChangePayload {
  selectedIds: Array<string | number>;
  tasks: Task[];
}

export type GanttCommandType =
  | "move-task"
  | "resize-task"
  | "change-resource"
  | "delete-task"
  | "create-dependency"
  | "delete-dependency"
  | "batch";

export interface GanttHistorySnapshot {
  tasks: Task[];
  dependencies: GanttDependency[];
}

export interface GanttCommand {
  type: GanttCommandType;
  label?: string;
  undo: GanttHistorySnapshot;
  redo: GanttHistorySnapshot;
}

export interface GanttHistoryState {
  past: GanttCommand[];
  future: GanttCommand[];
}

interface IProps {
  title?: string;
  description?: string;

  /**
   * Primary task list (backward-compatible name).
   * Prefer this over inventing a parallel `tasks` prop for existing consumers.
   */
  data: Task[];

  /** Optional alias — if provided without mutating API surface, ignored when `data` is set. */
  tasks?: Task[];

  resources?: GanttResource[];
  dependencies?: GanttDependency[];

  startDate?: GanttDateInput;
  endDate?: GanttDateInput;

  /** Controlled zoom level. */
  zoom?: GanttZoomLevel;
  defaultZoom?: GanttZoomLevel;

  viewMode?: GanttViewMode;
  density?: GanttDensity;
  snap?: GanttSnapUnit;
  minDurationMs?: number;

  columns?: GanttColumn[];
  calendar?: GanttWorkingCalendar;
  theme?: GanttTheme;

  showToday?: boolean;
  showCriticalPath?: boolean;
  showPlanned?: boolean;
  showActual?: boolean;
  showProgress?: boolean;
  showDependencies?: boolean;
  showToolbar?: boolean;

  filters?: GanttFilterState;
  searchQuery?: string;

  selectedIds?: Array<string | number>;
  defaultSelectedIds?: Array<string | number>;

  pagination?: {
    totalRecords: number;
    perPage: number;
    currentPage?: number;
    onChange?: (currentPage: number, perPage: number) => void;
  };

  config?: GanttConfig;

  /** Uncontrolled initial tasks (ignored when parent drives `data`). */
  defaultTasks?: Task[];

  loading?: boolean;
  emptyText?: string;

  onTaskClick?: (task: Task, event: MouseEvent) => void;
  onTaskDoubleClick?: (task: Task, event: MouseEvent) => void;
  onTaskChange?: (payload: GanttTaskChangePayload) => void;
  onTaskMove?: (payload: GanttTaskChangePayload) => void;
  onTaskResize?: (payload: GanttTaskChangePayload) => void;
  onTaskSelect?: (task: Task, event: MouseEvent | KeyboardEvent) => void;
  onSelectionChange?: (payload: GanttSelectionChangePayload) => void;
  onDependencyCreate?: (dependency: GanttDependency) => void;
  onDependencyDelete?: (dependency: GanttDependency) => void;
  onResourceChange?: (task: Task, resourceId: string | number | undefined) => void;
  onContextMenu?: (task: Task | null, event: MouseEvent) => void;
  onZoomChange?: (zoom: GanttZoomLevel) => void;
  onDateRangeChange?: (range: { start: Date; end: Date }) => void;
  onFiltersChange?: (filters: GanttFilterState) => void;
  onSearchChange?: (query: string) => void;

  renderTask?: (bar: TaskBarLayout) => ReactNode;
  renderTaskContent?: (bar: TaskBarLayout) => ReactNode;
  renderResourceRow?: (row: FlatRow) => ReactNode;
  renderTooltip?: (task: Task) => ReactNode;
  renderMilestone?: (bar: TaskBarLayout) => ReactNode;
  renderDependency?: (path: { id: string; d: string }) => ReactNode;
  renderHeader?: () => ReactNode;
}

export default IProps;
