"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../../../assets/css/components/charts/gantt/styles.css";
import Pagination from "../../navigation/pagination";
import IProps from "./IProps";
import type { FlatRow, GanttDependency, GanttFilterState, GanttZoomLevel, Task } from "./IProps";
import {
  buildDependencyPaths,
  buildResourceRows,
  buildTaskTreeRows,
  canRedo as historyCanRedo,
  canUndo as historyCanUndo,
  cloneSnapshot,
  collectDependencies,
  computeCriticalTaskIds,
  createHistory,
  createTimelineGeometry,
  DENSITY_ROW_HEIGHT,
  enforceMinDuration,
  expandAncestorsForMatches,
  filterTasks,
  formatGanttDateTime,
  generateGanttTimeline,
  getNonWorkingDayRanges,
  getThemeCssVars,
  layoutTaskBars,
  nextZoomFromWheel,
  parseGanttDate,
  preserveFocalScroll,
  pushCommand,
  redo as historyRedo,
  snapDate,
  clampToWorkingTimeSameDay,
  undo as historyUndo,
  visibleRowRange,
  visibleUnitRange,
  buildTimelineUnits,
} from "./helpers";
import type { GanttHistoryState } from "./IProps";
import GanttToolbar from "./toolbar";
import ResourcePanel from "./resource-panel";
import Checkbox from "../../form/checkbox";
import { useTranslation } from "@harjs/translation";
import ITableLocale from "../../../libs/core/application/locales/table/ITableLocale";
import TableTR from "../../../libs/core/application/locales/table/tr";
import TableEN from "../../../libs/core/application/locales/table/en";

const HEADER_BAND = 56;
const MIN_DURATION_DEFAULT = 15 * 60_000;

type DragMode = "pan" | "move" | "resize-start" | "resize-end" | null;

interface DragState {
  mode: DragMode;
  taskId?: string;
  startClientX: number;
  startClientY: number;
  originScrollX: number;
  originStartMs?: number;
  originEndMs?: number;
  originResourceRow?: number;
}

const Gantt: React.FC<IProps> = ({
  title,
  description,
  data,
  tasks: tasksAlias,
  resources,
  dependencies: dependenciesProp,
  startDate,
  endDate,
  zoom: zoomProp,
  defaultZoom = "day",
  viewMode = "task",
  density = "comfortable",
  snap = "15min",
  minDurationMs = MIN_DURATION_DEFAULT,
  columns,
  calendar,
  theme,
  showToday = true,
  showCriticalPath = false,
  showPlanned = true,
  showActual = true,
  showProgress = true,
  showDependencies = true,
  showToolbar = true,
  filters: filtersProp,
  searchQuery: searchQueryProp,
  selectedIds: selectedIdsProp,
  defaultSelectedIds,
  pagination,
  config = { isSearchable: false },
  defaultTasks,
  loading,
  emptyText = "No tasks to display",
  onTaskClick,
  onTaskDoubleClick,
  onTaskChange,
  onTaskMove,
  onTaskResize,
  onTaskSelect,
  onSelectionChange,
  onDependencyCreate: _onDependencyCreate,
  onDependencyDelete: _onDependencyDelete,
  onResourceChange,
  onContextMenu,
  onZoomChange,
  onDateRangeChange,
  onFiltersChange,
  onSearchChange,
  renderTask,
  renderTaskContent,
  renderResourceRow,
  renderTooltip,
  renderMilestone,
  renderDependency,
  renderHeader,
}) => {
  // refs
  const _scrollX = useRef(0);
  const _scrollY = useRef(0);
  const _rafId = useRef<number | null>(null);
  const _isPressedCtrl = useRef(false);
  const _drag = useRef<DragState | null>(null);
  const _timelineRef = useRef<HTMLDivElement>(null);
  const _svgRef = useRef<SVGSVGElement>(null);
  const _timeGroupRef = useRef<SVGGElement>(null);
  const _latestTasks = useRef<Task[]>([]);

  // states
  const [internalTasks, setInternalTasks] = useState<Task[]>(defaultTasks ?? (tasksAlias ?? data));
  const [internalZoom, setInternalZoom] = useState<GanttZoomLevel>(defaultZoom);
  const [internalSelected, setInternalSelected] = useState<Array<string | number>>(defaultSelectedIds ?? []);
  const [internalSearch, setInternalSearch] = useState("");
  const [internalFilters, setInternalFilters] = useState<GanttFilterState>({});
  const [showFilters, setShowFilters] = useState(false);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [hoverTaskId, setHoverTaskId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; task: Task } | null>(null);
  const [history, setHistory] = useState<GanttHistoryState>(createHistory);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPerPage, setSelectedPerPage] = useState(pagination?.perPage ?? 10);
  const [isMobile, setIsMobile] = useState(false);
  const [dragPreview, setDragPreview] = useState<Map<string, { start: Date; end: Date }>>(new Map());

  // hooks
  const { t } = useTranslation<ITableLocale>(String(config?.locale ?? "tr"), {
    tr: { ...TableTR },
    en: { ...TableEN },
  });

  // variables
  const sourceTasks = tasksAlias ?? data;
  const isTasksControlled = defaultTasks === undefined;
  const isZoomControlled = zoomProp !== undefined;
  const isSelectionControlled = selectedIdsProp !== undefined;
  const tasks = isTasksControlled ? sourceTasks : internalTasks;
  const zoom = isZoomControlled ? zoomProp! : internalZoom;
  const selectedIds = isSelectionControlled ? selectedIdsProp! : internalSelected;
  const searchQuery = searchQueryProp ?? internalSearch;
  const filters = filtersProp ?? internalFilters;
  const rowHeight = DENSITY_ROW_HEIGHT[density];
  const selectedSet = useMemo(() => new Set(selectedIds.map(String)), [selectedIds]);
  const panelWidth = useMemo(() => {
    const cols = columns?.length
      ? columns
      : [
          { width: 240 },
          { width: 110 },
        ];
    return cols.reduce((sum, col) => sum + (col.width ?? 120), 0);
  }, [columns]);
  _latestTasks.current = tasks;

  const mergedFilters = useMemo<GanttFilterState>(
    () => ({ ...filters, query: searchQuery || filters.query }),
    [filters, searchQuery],
  );

  const filteredTasks = useMemo(() => filterTasks(tasks, mergedFilters), [tasks, mergedFilters]);

  const pagedTasks = useMemo(() => {
    if (!pagination || config.isServerSide) return filteredTasks;
    const end = currentPage * selectedPerPage;
    const start = end - selectedPerPage;
    return filteredTasks.slice(start, end);
  }, [filteredTasks, pagination, config.isServerSide, currentPage, selectedPerPage]);

  const autoExpandIds = useMemo(() => {
    if (!mergedFilters.query) return new Set<string>();
    const matchIds = new Set(pagedTasks.map((t) => String(t.id)));
    return expandAncestorsForMatches(tasks, matchIds);
  }, [mergedFilters.query, pagedTasks, tasks]);

  const effectiveCollapsed = useMemo(() => {
    const next = new Set(collapsedIds);
    for (const id of autoExpandIds) next.delete(id);
    return next;
  }, [collapsedIds, autoExpandIds]);

  const rows: FlatRow[] = useMemo(() => {
    if (viewMode === "resource" && resources?.length) {
      return buildResourceRows(resources, pagedTasks, effectiveCollapsed);
    }
    return buildTaskTreeRows(pagedTasks, effectiveCollapsed);
  }, [viewMode, resources, pagedTasks, effectiveCollapsed]);

  const taskRows = useMemo(() => rows.filter((r) => r.kind === "task" && r.task), [rows]);

  const rowIndexByTaskId = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((row, index) => {
      if (row.task) map.set(String(row.task.id), index);
    });
    return map;
  }, [rows]);

  const timeline = useMemo(
    () =>
      generateGanttTimeline(pagedTasks.length ? pagedTasks : tasks, {
        locale: config.locale,
        startDate,
        endDate,
        calendar,
      }),
    [pagedTasks, tasks, config.locale, startDate, endDate, calendar],
  );

  const geometry = useMemo(() => {
    if (!timeline.timelineStart || !timeline.timelineEnd) return null;
    return createTimelineGeometry({
      timelineStart: timeline.timelineStart,
      timelineEnd: timeline.timelineEnd,
      zoom,
    });
  }, [timeline.timelineStart, timeline.timelineEnd, zoom]);

  const units = useMemo(() => {
    if (!timeline.timelineStart || !timeline.timelineEnd) return [];
    return buildTimelineUnits(timeline.timelineStart, timeline.timelineEnd, zoom, config.locale, calendar);
  }, [timeline.timelineStart, timeline.timelineEnd, zoom, config.locale, calendar]);

  const deps = useMemo(
    () => collectDependencies(pagedTasks, dependenciesProp),
    [pagedTasks, dependenciesProp],
  );

  const criticalIds = useMemo(
    () => (showCriticalPath ? computeCriticalTaskIds(pagedTasks, deps) : new Set<string>()),
    [showCriticalPath, pagedTasks, deps],
  );

  const displayTasks = useMemo(() => {
    if (dragPreview.size === 0) return pagedTasks;
    return pagedTasks.map((task) => {
      const preview = dragPreview.get(String(task.id));
      if (!preview) return task;
      return { ...task, start: preview.start, end: preview.end };
    });
  }, [pagedTasks, dragPreview]);

  const taskBars = useMemo(() => {
    if (!geometry) return [];
    return layoutTaskBars({
      tasks: displayTasks,
      rowIndexByTaskId,
      geometry,
      rowHeight,
      theme,
      showPlanned,
      showActual,
    });
  }, [displayTasks, rowIndexByTaskId, geometry, rowHeight, theme, showPlanned, showActual]);

  const barsById = useMemo(() => new Map(taskBars.map((b) => [String(b.id), b])), [taskBars]);

  const dependencyPaths = useMemo(() => {
    if (!showDependencies) return [];
    return buildDependencyPaths(deps, barsById);
  }, [showDependencies, deps, barsById]);

  const nonWorkingRanges = useMemo(() => {
    if (!timeline.timelineStart || !timeline.timelineEnd) return [];
    return getNonWorkingDayRanges(timeline.timelineStart, timeline.timelineEnd, calendar);
  }, [timeline.timelineStart, timeline.timelineEnd, calendar]);

  const contentHeight = rows.length * rowHeight;
  const MAX_BODY_HEIGHT = 440;
  const bodyViewport =
    rows.length === 0 ? 0 : Math.min(Math.max(contentHeight, rowHeight), MAX_BODY_HEIGHT);

  const visibleUnits = useMemo(() => {
    if (!geometry) return { start: 0, end: 0 };
    return visibleUnitRange(scrollX, viewport.width, geometry.unitWidth, units.length, 3);
  }, [scrollX, viewport.width, geometry, units.length]);

  const visibleRows = useMemo(
    () => visibleRowRange(scrollY, bodyViewport, rowHeight, rows.length, 4),
    [scrollY, bodyViewport, rowHeight, rows.length],
  );

  const todayX = useMemo(() => {
    if (!geometry || !showToday) return null;
    return geometry.dateToX(new Date());
  }, [geometry, showToday]);

  const themeStyle = useMemo(
    () => ({
      ...getThemeCssVars(theme),
      ["--gantt-header-height" as string]: `${HEADER_BAND}px`,
      ["--gantt-row-height" as string]: `${rowHeight}px`,
    }),
    [theme, rowHeight],
  );

  const svgWidth = geometry?.totalWidth ?? 0;
  const mainHeight = HEADER_BAND + (rows.length === 0 ? 160 : bodyViewport);

  // methods
  const setZoomValue = useCallback(
    (next: GanttZoomLevel) => {
      if (!isZoomControlled) setInternalZoom(next);
      onZoomChange?.(next);
    },
    [isZoomControlled, onZoomChange],
  );

  const setSelected = useCallback(
    (ids: Array<string | number>, eventTasks?: Task[]) => {
      if (!isSelectionControlled) setInternalSelected(ids);
      const resolved = eventTasks ?? tasks.filter((t) => ids.some((id) => String(id) === String(t.id)));
      onSelectionChange?.({ selectedIds: ids, tasks: resolved });
    },
    [isSelectionControlled, onSelectionChange, tasks],
  );

  const commitTasks = useCallback(
    (
      nextTasks: Task[],
      meta: { type: "move-task" | "resize-task" | "change-resource"; previous: Task[]; reason: "move" | "resize-start" | "resize-end" | "resource" | "update" },
    ) => {
      const prevDeps = dependenciesProp ?? collectDependencies(_latestTasks.current);
      const nextDeps = dependenciesProp ?? collectDependencies(nextTasks);
      setHistory((h) =>
        pushCommand(h, {
          type: meta.type,
          undo: cloneSnapshot(meta.previous, prevDeps),
          redo: cloneSnapshot(nextTasks, nextDeps),
        }),
      );

      if (!isTasksControlled) setInternalTasks(nextTasks);

      for (const task of nextTasks) {
        const previous = meta.previous.find((t) => String(t.id) === String(task.id));
        if (!previous) continue;
        if (previous.start === task.start && previous.end === task.end && previous.resourceId === task.resourceId) {
          continue;
        }
        const payload = { task, previous, reason: meta.reason };
        onTaskChange?.(payload);
        if (meta.reason === "move") onTaskMove?.(payload);
        if (meta.reason === "resize-start" || meta.reason === "resize-end") onTaskResize?.(payload);
        if (meta.reason === "resource") onResourceChange?.(task, task.resourceId);
      }
    },
    [dependenciesProp, isTasksControlled, onTaskChange, onTaskMove, onTaskResize, onResourceChange],
  );

  const applySnapshot = useCallback(
    (snapshot: { tasks: Task[]; dependencies: GanttDependency[] }) => {
      if (!isTasksControlled) setInternalTasks(snapshot.tasks);
      for (const task of snapshot.tasks) {
        const previous = _latestTasks.current.find((t) => String(t.id) === String(task.id));
        if (previous) onTaskChange?.({ task, previous, reason: "update" });
      }
    },
    [isTasksControlled, onTaskChange],
  );

  const handleUndo = useCallback(() => {
    setHistory((h) => {
      const result = historyUndo(h);
      if (result.snapshot) applySnapshot(result.snapshot);
      return result.state;
    });
  }, [applySnapshot]);

  const handleRedo = useCallback(() => {
    setHistory((h) => {
      const result = historyRedo(h);
      if (result.snapshot) applySnapshot(result.snapshot);
      return result.state;
    });
  }, [applySnapshot]);


  const syncTimeGroup = useCallback((x: number) => {
    if (_timeGroupRef.current) {
      _timeGroupRef.current.setAttribute("transform", `translate(${-x}, 0)`);
    }
  }, []);

  const setScrollXValue = useCallback(
    (next: number, immediate = false) => {
      const max = Math.max(0, (geometry?.totalWidth ?? 0) - viewport.width);
      const clamped = Math.min(Math.max(0, next), max);
      _scrollX.current = clamped;
      syncTimeGroup(clamped);
      if (immediate) {
        setScrollX(clamped);
        return;
      }
      if (_rafId.current === null) {
        _rafId.current = requestAnimationFrame(() => {
          setScrollX(_scrollX.current);
          _rafId.current = null;
        });
      }
    },
    [geometry?.totalWidth, viewport.width, syncTimeGroup],
  );

  const handleToday = useCallback(() => {
    if (!geometry) return;
    const x = preserveFocalScroll({
      focalDate: new Date(),
      geometry,
      viewportWidth: viewport.width,
    });
    setScrollXValue(x, true);
  }, [geometry, viewport.width, setScrollXValue]);

  const handleFit = useCallback(() => {
    if (!timeline.timelineStart || !timeline.timelineEnd) return;
    onDateRangeChange?.({ start: timeline.timelineStart, end: timeline.timelineEnd });
    setScrollXValue(0, true);
    setZoomValue("week");
  }, [timeline.timelineStart, timeline.timelineEnd, onDateRangeChange, setScrollXValue, setZoomValue]);

  const changeZoom = useCallback(
    (next: GanttZoomLevel) => {
      if (!geometry || next === zoom) {
        setZoomValue(next);
        return;
      }
      const focal = geometry.xToDate(_scrollX.current + viewport.width / 2);
      setZoomValue(next);
      requestAnimationFrame(() => {
        const approx = createTimelineGeometry({
          timelineStart: geometry.timelineStart,
          timelineEnd: geometry.timelineEnd,
          zoom: next,
        });
        const nextScroll = preserveFocalScroll({
          focalDate: focal,
          geometry: approx,
          viewportWidth: viewport.width,
        });
        setScrollXValue(nextScroll, true);
      });
    },
    [geometry, zoom, viewport.width, setZoomValue, setScrollXValue],
  );


  const updateSelection = useCallback(
    (task: Task, event: React.MouseEvent | React.KeyboardEvent) => {
      const id = task.id;
      const multi = "metaKey" in event && (event.metaKey || event.ctrlKey);
      const range = "shiftKey" in event && event.shiftKey;
      let next: Array<string | number>;

      if (multi) {
        const exists = selectedIds.some((s) => String(s) === String(id));
        next = exists ? selectedIds.filter((s) => String(s) !== String(id)) : [...selectedIds, id];
      } else if (range && selectedIds.length) {
        const ids = taskRows.map((r) => r.task!.id);
        const last = selectedIds[selectedIds.length - 1];
        const a = ids.findIndex((i) => String(i) === String(last));
        const b = ids.findIndex((i) => String(i) === String(id));
        if (a >= 0 && b >= 0) {
          const [from, to] = a < b ? [a, b] : [b, a];
          next = ids.slice(from, to + 1);
        } else {
          next = [id];
        }
      } else {
        next = [id];
      }

      setSelected(next);
      onTaskSelect?.(task, event);
    },
    [selectedIds, taskRows, setSelected, onTaskSelect],
  );

  const beginTaskDrag = useCallback(
    (task: Task, mode: "move" | "resize-start" | "resize-end", event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      const start = parseGanttDate(task.start);
      const end = parseGanttDate(task.end);
      if (!start || !end) return;

      updateSelection(task, event);
      _drag.current = {
        mode,
        taskId: String(task.id),
        startClientX: event.clientX,
        startClientY: event.clientY,
        originScrollX: _scrollX.current,
        originStartMs: start.getTime(),
        originEndMs: end.getTime(),
        originResourceRow: rowIndexByTaskId.get(String(task.id)),
      };
    },
    [updateSelection, rowIndexByTaskId],
  );

  const handleTimelineMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button !== 0) return;
    if ((event.target as Element).closest?.(".ar-gantt-task")) return;
    _drag.current = {
      mode: "pan",
      startClientX: event.clientX,
      startClientY: event.clientY,
      originScrollX: _scrollX.current,
    };
  }, []);

  const autoScrollDuringDrag = useCallback(
    (clientX: number, clientY: number) => {
      const rect = _timelineRef.current?.getBoundingClientRect();
      if (!rect) return;
      const edge = 40;
      let dx = 0;
      let dy = 0;
      if (clientX > rect.right - edge) dx = 24;
      else if (clientX < rect.left + edge) dx = -24;
      if (clientY > rect.bottom - edge) dy = 16;
      else if (clientY < rect.top + edge) dy = -16;
      if (dx) setScrollXValue(_scrollX.current + dx);
      if (dy) {
        const maxY = Math.max(0, contentHeight - bodyViewport);
        const nextY = Math.min(Math.max(0, _scrollY.current + dy), maxY);
        _scrollY.current = nextY;
        setScrollY(nextY);
      }
    },
    [setScrollXValue, contentHeight, bodyViewport],
  );

  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      if (_isPressedCtrl.current || event.ctrlKey || event.metaKey) {
        event.preventDefault();
        const next = nextZoomFromWheel(zoom, event.deltaY);
        if (next !== zoom) changeZoom(next);
        return;
      }
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        setScrollXValue(_scrollX.current + event.deltaX);
      } else {
        const maxY = Math.max(0, contentHeight - bodyViewport);
        const nextY = Math.min(Math.max(0, _scrollY.current + event.deltaY), maxY);
        _scrollY.current = nextY;
        setScrollY(nextY);
      }
    },
    [zoom, changeZoom, setScrollXValue, contentHeight, bodyViewport],
  );


  // useEffects
  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const drag = _drag.current;
      if (!drag || !drag.mode) return;

      if (drag.mode === "pan") {
        const delta = drag.startClientX - event.clientX;
        setScrollXValue(drag.originScrollX + delta);
        return;
      }

      if (!geometry || drag.taskId === undefined || drag.originStartMs === undefined || drag.originEndMs === undefined) {
        return;
      }

      autoScrollDuringDrag(event.clientX, event.clientY);

      const deltaX = event.clientX - drag.startClientX + (_scrollX.current - drag.originScrollX);
      const deltaMs = geometry.widthToDuration(deltaX);
      let nextStart = new Date(drag.originStartMs);
      let nextEnd = new Date(drag.originEndMs);

      if (drag.mode === "move") {
        nextStart = new Date(drag.originStartMs + deltaMs);
        nextEnd = new Date(drag.originEndMs + deltaMs);
      } else if (drag.mode === "resize-start") {
        nextStart = new Date(drag.originStartMs + deltaMs);
      } else if (drag.mode === "resize-end") {
        nextEnd = new Date(drag.originEndMs + deltaMs);
      }

      nextStart = snapDate(nextStart, snap);
      nextEnd = snapDate(nextEnd, snap);
      const enforced = enforceMinDuration(nextStart, nextEnd, minDurationMs);
      nextStart = clampToWorkingTimeSameDay(enforced.start, calendar, "start");
      nextEnd = clampToWorkingTimeSameDay(enforced.end, calendar, "end");
      if (nextEnd.getTime() <= nextStart.getTime()) {
        nextEnd = new Date(nextStart.getTime() + minDurationMs);
      }

      setDragPreview(new Map([[drag.taskId, { start: nextStart, end: nextEnd }]]));
    };

    const onUp = (event: MouseEvent) => {
      const drag = _drag.current;
      _drag.current = null;
      if (!drag || drag.mode === "pan" || !drag.taskId) {
        setDragPreview(new Map());
        return;
      }

      setDragPreview((current) => {
        const finalPreview = current.get(drag.taskId!);
        if (!finalPreview) return new Map();

        const previous = _latestTasks.current;
        const nextTasks = previous.map((task) => {
          if (String(task.id) !== drag.taskId) return task;

          let resourceId = task.resourceId;
          if (viewMode === "resource" && resources?.length && drag.mode === "move") {
            const rect = _timelineRef.current?.getBoundingClientRect();
            if (rect) {
              const y = event.clientY - rect.top + _scrollY.current;
              const rowIndex = Math.floor(y / rowHeight);
              const row = rows[rowIndex];
              if (row?.resource) resourceId = row.resource.id;
              else if (row?.task?.resourceId) resourceId = row.task.resourceId;
            }
          }

          return {
            ...task,
            start: finalPreview.start.toISOString(),
            end: finalPreview.end.toISOString(),
            resourceId,
          };
        });

        const reason =
          drag.mode === "move" ? "move" : drag.mode === "resize-start" ? "resize-start" : "resize-end";
        const type = drag.mode === "move" ? "move-task" : "resize-task";
        commitTasks(nextTasks, { type, previous, reason });
        return new Map();
      });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [
    geometry,
    snap,
    minDurationMs,
    calendar,
    setScrollXValue,
    autoScrollDuringDrag,
    dragPreview,
    commitTasks,
    viewMode,
    resources,
    rowHeight,
    rows,
  ]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (["Control", "Meta"].includes(event.key)) _isPressedCtrl.current = true;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) handleRedo();
        else handleUndo();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        handleRedo();
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (["Control", "Meta"].includes(event.key)) _isPressedCtrl.current = false;
    };
    const onResize = () => setIsMobile(window.innerWidth <= 768);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
    };
  }, [handleUndo, handleRedo]);

  useEffect(() => {
    const el = _timelineRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const update = () => setViewport({ width: el.clientWidth, height: el.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (_rafId.current !== null) cancelAnimationFrame(_rafId.current);
    };
  }, []);

  useEffect(() => {
    syncTimeGroup(scrollX);
  }, [scrollX, syncTimeGroup]);


  // variables
  const formatSafe = (value: Task["start"] | undefined) => {
    const parsed = parseGanttDate(value);
    return parsed ? formatGanttDateTime(parsed, config.locale, config.timezone) : "—";
  };

  const defaultTooltip = (task: Task) => (
    <div className="ar-gantt-tooltip-content">
      {task.type ? <div className="ar-gantt-tooltip-type">{task.type}</div> : null}
      <div className="ar-gantt-tooltip-title">
        {task.code ? `${task.code} · ` : ""}
        {task.name}
      </div>
      {task.status ? <div>Status: {task.status}</div> : null}
      <div>
        Planned: {formatSafe(task.plannedStart ?? task.start)} → {formatSafe(task.plannedEnd ?? task.end)}
      </div>
      {(task.actualStart || task.actualEnd) && (
        <div>
          Actual: {formatSafe(task.actualStart)} → {formatSafe(task.actualEnd)}
        </div>
      )}
      {task.progress !== undefined ? <div>Progress: {task.progress}%</div> : null}
      {task.quantity !== undefined ? (
        <div>
          Quantity: {task.completedQuantity ?? 0} / {task.quantity}
        </div>
      ) : null}
      {(task.machineId || task.resourceId) && (
        <div>Resource: {String(task.machineId ?? task.resourceId)}</div>
      )}
    </div>
  );


  return (
    <div
      className={`ar-gantt-chart${loading ? " is-loading" : ""}`}
      style={themeStyle}
      role="application"
      aria-label={title ?? "Gantt chart"}
    >
      {showToolbar && (
        <GanttToolbar
          title={title}
          description={description}
          zoom={zoom}
          canUndo={historyCanUndo(history)}
          canRedo={historyCanRedo(history)}
          searchQuery={searchQuery}
          showFilters={showFilters}
          onZoomChange={changeZoom}
          onToday={handleToday}
          onFit={handleFit}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSearchChange={(q) => {
            if (searchQueryProp === undefined) setInternalSearch(q);
            onSearchChange?.(q);
          }}
          onToggleFilters={() => setShowFilters((v) => !v)}
          renderHeader={renderHeader}
        />
      )}

      {showFilters && (
        <div className="ar-gantt-filters" role="region" aria-label="Filters">
          {(["planned", "in-progress", "completed", "delayed"] as const).map((status) => {
            const active = filters.statuses?.includes(status);
            return (
              <Checkbox
                key={status}
                label={status}
                size="sm"
                color="blue"
                checked={!!active}
                onChange={() => {
                  const current = filters.statuses ?? [];
                  const next = active
                    ? current.filter((s: (typeof current)[number]) => s !== status)
                    : [...current, status];
                  const nextFilters = { ...filters, statuses: next };
                  if (!filtersProp) setInternalFilters(nextFilters);
                  onFiltersChange?.(nextFilters);
                }}
              />
            );
          })}
          <Checkbox
            label="Critical only"
            size="sm"
            color="blue"
            checked={!!filters.criticalOnly}
            onChange={() => {
              const nextFilters = { ...filters, criticalOnly: !filters.criticalOnly };
              if (!filtersProp) setInternalFilters(nextFilters);
              onFiltersChange?.(nextFilters);
            }}
          />
        </div>
      )}

      <div className="ar-gantt-main" style={{ height: mainHeight }}>
        <ResourcePanel
          rows={rows}
          columns={columns ?? []}
          rowHeight={rowHeight}
          headerHeight={HEADER_BAND}
          panelWidth={panelWidth}
          scrollTop={scrollY}
          selectedIds={selectedSet}
          locale={config.locale}
          onScroll={(top) => {
            const maxY = Math.max(0, contentHeight - bodyViewport);
            const next = Math.min(Math.max(0, top), maxY);
            _scrollY.current = next;
            setScrollY(next);
          }}
          onToggleCollapse={(id) => {
            setCollapsedIds((prev) => {
              const next = new Set(prev);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              return next;
            });
          }}
          onRowClick={(row, event) => {
            if (row.task) {
              updateSelection(row.task, event);
              onTaskClick?.(row.task, event);
            }
          }}
          renderResourceRow={renderResourceRow}
        />

        <div
          ref={_timelineRef}
          className="ar-gantt-timeline"
          onWheel={handleWheel}
        >
          {!geometry || rows.length === 0 ? (
            <div className="ar-gantt-empty">{loading ? "Loading…" : emptyText}</div>
          ) : (
            <svg
              ref={_svgRef}
              className="ar-gantt-chart-svg"
              width="100%"
              height={HEADER_BAND + bodyViewport}
              role="img"
              aria-label="Timeline"
              onMouseDown={handleTimelineMouseDown}
              onContextMenu={(e) => {
                e.preventDefault();
                onContextMenu?.(null, e);
              }}
            >
              <defs>
                <marker
                  id="gantt-arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--gantt-dependency, var(--gray-600))" />
                </marker>
                <pattern id="gantt-weekend-stripes" width="6" height="6" patternUnits="userSpaceOnUse">
                  <rect width="6" height="6" fill="var(--gantt-non-working)" />
                  <path d="M0 6 L6 0" stroke="rgba(148,163,184,0.35)" strokeWidth={0.75} />
                </pattern>
              </defs>
              <g className="ar-gantt-time-header">
                <rect x={0} y={0} width="100%" height={HEADER_BAND} fill="var(--gantt-header-bg, #f8fafc)" />
                <g ref={_timeGroupRef} transform={`translate(${-scrollX}, 0)`}>
                  {units.slice(visibleUnits.start, visibleUnits.end + 1).map((unit, i) => {
                    const index = visibleUnits.start + i;
                    const x = geometry.dateToX(unit.start);
                    const w = Math.max(geometry.dateToX(unit.end) - x, 1);
                    return (
                      <g key={`${unit.start.getTime()}-${index}`}>
                        <text
                          x={x + w / 2}
                          y={22}
                          textAnchor="middle"
                          className="ar-gantt-unit-primary"
                          fill={unit.isWorking === false ? "var(--red-500)" : "var(--gray-700)"}
                        >
                          {unit.label}
                        </text>
                        {unit.secondaryLabel ? (
                          <text
                            x={x + w / 2}
                            y={38}
                            textAnchor="middle"
                            className="ar-gantt-unit-secondary"
                            fill="var(--gray-500)"
                          >
                            {unit.secondaryLabel}
                          </text>
                        ) : null}
                        <line
                          x1={x + w}
                          y1={8}
                          x2={x + w}
                          y2={HEADER_BAND - 8}
                          stroke="var(--gantt-grid-line)"
                          strokeWidth={1}
                        />
                      </g>
                    );
                  })}
                </g>
                <line
                  x1={0}
                  y1={HEADER_BAND - 0.5}
                  x2="100%"
                  y2={HEADER_BAND - 0.5}
                  stroke="var(--gantt-row-line)"
                  strokeWidth={1}
                />
              </g>

              <g transform={`translate(0, ${HEADER_BAND})`}>
                <svg x={0} y={0} width="100%" height={bodyViewport} overflow="hidden">
                  <g transform={`translate(0, ${-scrollY})`}>
                    {rows.slice(visibleRows.start, visibleRows.end + 1).map((row, i) => {
                      const index = visibleRows.start + i;
                      const isGroup = row.kind === "resource" || row.task?.type === "production-order";
                      const fill = isGroup
                        ? index % 2
                          ? "#f1f5f9"
                          : "#f8fafc"
                        : index % 2
                          ? "var(--gantt-row-alt)"
                          : "#ffffff";
                      return (
                        <rect
                          key={`bg-${row.id}`}
                          x={0}
                          y={index * rowHeight}
                          width="100%"
                          height={rowHeight}
                          fill={fill}
                          pointerEvents="none"
                        />
                      );
                    })}

                    <g transform={`translate(${-scrollX}, 0)`}>
                      {nonWorkingRanges.map((range) => {
                        const x = geometry.dateToX(range.start);
                        const w = geometry.dateToX(range.end) - x;
                        return (
                          <rect
                            key={range.start.getTime()}
                            x={x}
                            y={0}
                            width={w}
                            height={contentHeight}
                            fill="url(#gantt-weekend-stripes)"
                            pointerEvents="none"
                          />
                        );
                      })}
                      {units.slice(visibleUnits.start, visibleUnits.end + 1).map((unit, i) => {
                        const index = visibleUnits.start + i;
                        const x = geometry.dateToX(unit.start);
                        return (
                          <line
                            key={`grid-${index}`}
                            x1={x}
                            y1={0}
                            x2={x}
                            y2={contentHeight}
                            stroke="var(--gantt-grid-line)"
                            strokeWidth={1}
                            pointerEvents="none"
                          />
                        );
                      })}
                      {rows.slice(visibleRows.start, visibleRows.end + 1).map((_, i) => {
                        const index = visibleRows.start + i;
                        const y = (index + 1) * rowHeight - 0.5;
                        return (
                          <line
                            key={`row-${index}`}
                            x1={0}
                            y1={y}
                            x2={svgWidth}
                            y2={y}
                            stroke="var(--gantt-row-line)"
                            strokeWidth={1}
                            pointerEvents="none"
                          />
                        );
                      })}
                      {todayX !== null && todayX >= 0 && todayX <= svgWidth && (
                        <g pointerEvents="none">
                          <line
                            x1={todayX}
                            y1={0}
                            x2={todayX}
                            y2={contentHeight}
                            stroke="var(--gantt-today)"
                            strokeWidth={theme?.todayLine?.width ?? 1.5}
                          />
                          <rect
                            x={todayX + 4}
                            y={4}
                            width={42}
                            height={16}
                            rx={3}
                            fill="var(--gantt-today)"
                          />
                          <text
                            x={todayX + 25}
                            y={15}
                            textAnchor="middle"
                            fill="#fff"
                            fontSize={9}
                            fontWeight={700}
                          >
                            TODAY
                          </text>
                        </g>
                      )}
                      {dependencyPaths.map((path) =>
                        renderDependency ? (
                          <React.Fragment key={path.id}>{renderDependency(path)}</React.Fragment>
                        ) : (
                          <path
                            key={path.id}
                            d={path.d}
                            fill="none"
                            stroke="var(--gantt-dependency, var(--gray-600))"
                            strokeWidth={theme?.dependency?.width ?? 1.25}
                            markerEnd="url(#gantt-arrow)"
                            pointerEvents="none"
                          />
                        ),
                      )}
                      {taskBars
                        .filter((bar) => bar.rowIndex >= visibleRows.start && bar.rowIndex <= visibleRows.end)
                        .map((bar) => {
                          const selected = selectedSet.has(String(bar.id));
                          const isCritical = criticalIds.has(String(bar.id));
                          const searchHit =
                            !!mergedFilters.query &&
                            `${bar.task.name} ${bar.task.code ?? ""}`.toLowerCase().includes(mergedFilters.query.toLowerCase());

                          if (renderTask) {
                            return <React.Fragment key={String(bar.id)}>{renderTask(bar)}</React.Fragment>;
                          }

                          if (bar.isMilestone) {
                            if (renderMilestone) {
                              return <React.Fragment key={String(bar.id)}>{renderMilestone(bar)}</React.Fragment>;
                            }
                            const size = bar.height * 0.7;
                            const cx = bar.x;
                            const cy = bar.y + bar.height / 2;
                            return (
                              <g
                                key={String(bar.id)}
                                className="ar-gantt-task ar-gantt-milestone"
                                transform={`translate(${cx}, ${cy})`}
                                onMouseDown={(e) => beginTaskDrag(bar.task, "move", e)}
                                onClick={(e) => {
                                  updateSelection(bar.task, e);
                                  onTaskClick?.(bar.task, e);
                                }}
                                onDoubleClick={(e) => onTaskDoubleClick?.(bar.task, e)}
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onContextMenu?.(bar.task, e);
                                }}
                              >
                                <polygon
                                  points={`0,${-size / 2} ${size / 2},0 0,${size / 2} ${-size / 2},0`}
                                  fill={bar.color}
                                  stroke={selected ? "var(--gantt-selection, var(--blue-700))" : "none"}
                                  strokeWidth={selected ? 2 : 0}
                                />
                              </g>
                            );
                          }

                          return (
                            <g
                              key={String(bar.id)}
                              className={`ar-gantt-task${selected ? " is-selected" : ""}${isCritical ? " is-critical" : ""}${searchHit ? " is-search-hit" : ""}`}
                              onMouseEnter={(e) => {
                                setHoverTaskId(String(bar.id));
                                setTooltip({ x: e.clientX, y: e.clientY, task: bar.task });
                              }}
                              onMouseLeave={() => {
                                setHoverTaskId(null);
                                setTooltip(null);
                              }}
                              onMouseMove={(e) => {
                                if (hoverTaskId === String(bar.id)) {
                                  setTooltip({ x: e.clientX, y: e.clientY, task: bar.task });
                                }
                              }}
                              onMouseDown={(e) => beginTaskDrag(bar.task, "move", e)}
                              onClick={(e) => {
                                updateSelection(bar.task, e);
                                onTaskClick?.(bar.task, e);
                              }}
                              onDoubleClick={(e) => onTaskDoubleClick?.(bar.task, e)}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onContextMenu?.(bar.task, e);
                              }}
                              role="button"
                              tabIndex={0}
                              aria-label={`${bar.task.code ?? ""} ${bar.task.name}`.trim()}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  updateSelection(bar.task, e);
                                }
                              }}
                            >
                              {bar.planned && showPlanned && (
                                <rect
                                  x={bar.planned.x}
                                  y={bar.y - 3}
                                  width={bar.planned.width}
                                  height={3}
                                  fill="var(--gantt-planned, var(--gray-400))"
                                  opacity={theme?.planned?.opacity ?? 0.7}
                                  rx={1}
                                  pointerEvents="none"
                                />
                              )}

                              {bar.actual && showActual && (
                                <rect
                                  x={bar.actual.x}
                                  y={bar.y + bar.height}
                                  width={bar.actual.width}
                                  height={3}
                                  fill="var(--gantt-actual, var(--orange-500))"
                                  opacity={theme?.actual?.opacity ?? 0.85}
                                  rx={1}
                                  pointerEvents="none"
                                />
                              )}

                              <rect
                                x={bar.x}
                                y={bar.y}
                                width={bar.width}
                                height={bar.height}
                                fill={bar.color}
                                rx={4}
                                stroke={
                                  selected
                                    ? "var(--gantt-selection)"
                                    : isCritical
                                      ? "#b91c1c"
                                      : searchHit
                                        ? "#ca8a04"
                                        : "transparent"
                                }
                                strokeWidth={selected || isCritical || searchHit ? 1.5 : 0}
                              />

                              {showProgress && bar.progressWidth > 0 && (
                                <rect
                                  x={bar.x}
                                  y={bar.y}
                                  width={Math.min(bar.progressWidth, bar.width)}
                                  height={bar.height}
                                  fill="var(--gantt-progress)"
                                  rx={4}
                                  pointerEvents="none"
                                />
                              )}

                              {bar.width > 56 &&
                                (renderTaskContent ? (
                                  renderTaskContent(bar)
                                ) : (
                                  <text
                                    x={bar.x + 10}
                                    y={bar.y + bar.height / 2 + 4}
                                    fontSize={11}
                                    fontWeight={600}
                                    fill="#fff"
                                    style={{ pointerEvents: "none" }}
                                  >
                                    {bar.task.code ? `${bar.task.code}  ` : ""}
                                    {bar.task.name}
                                  </text>
                                ))}
                              <rect
                                className="ar-gantt-resize-handle"
                                x={bar.x - 2}
                                y={bar.y}
                                width={6}
                                height={bar.height}
                                fill="transparent"
                                style={{ cursor: "ew-resize" }}
                                onMouseDown={(e) => beginTaskDrag(bar.task, "resize-start", e)}
                              />
                              <rect
                                className="ar-gantt-resize-handle"
                                x={bar.x + bar.width - 4}
                                y={bar.y}
                                width={6}
                                height={bar.height}
                                fill="transparent"
                                style={{ cursor: "ew-resize" }}
                                onMouseDown={(e) => beginTaskDrag(bar.task, "resize-end", e)}
                              />
                            </g>
                          );
                        })}
                    </g>
                  </g>
                </svg>
              </g>
            </svg>
          )}
        </div>
      </div>

      {tooltip && (
        <div
          className="ar-gantt-tooltip"
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
          role="tooltip"
        >
          {renderTooltip ? renderTooltip(tooltip.task) : defaultTooltip(tooltip.task)}
        </div>
      )}

      <div className="footer">
        <span>
          {isMobile ? (
            <strong>
              {(currentPage - 1) * selectedPerPage + 1} -{" "}
              {Math.min(currentPage * selectedPerPage, pagination?.totalRecords || filteredTasks.length)} of{" "}
              {pagination?.totalRecords || filteredTasks.length}
            </strong>
          ) : (
            t(
              "Table.Pagination.Information.Text",
              (currentPage - 1) * selectedPerPage + 1,
              Math.min(currentPage * selectedPerPage, pagination?.totalRecords || filteredTasks.length),
              pagination?.totalRecords || filteredTasks.length,
            )
          )}
        </span>

        {pagination && (
          <Pagination
            totalRecords={config.isServerSide ? pagination.totalRecords : (filteredTasks.length ?? 0)}
            currentPage={currentPage}
            perPage={selectedPerPage}
            locale={config.locale}
            showTotal={false}
            onChange={(page, perPage) => {
              setCurrentPage(page);
              setSelectedPerPage(perPage);
              pagination.onChange?.(page, perPage);
            }}
          />
        )}
      </div>
    </div>
  );
};

export type { Task } from "./IProps";

Gantt.displayName = "Gantt";

export default React.memo(Gantt);
