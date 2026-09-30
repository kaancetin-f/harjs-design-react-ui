"use client";

import React from "react";
import type { FlatRow, GanttColumn, GanttTaskStatus } from "../IProps";
import { formatGanttDateTime, parseGanttDate } from "../helpers";

export interface ResourcePanelProps {
  rows: FlatRow[];
  columns: GanttColumn[];
  rowHeight: number;
  headerHeight?: number;
  panelWidth: number;
  scrollTop: number;
  selectedIds: Set<string>;
  locale?: Intl.LocalesArgument;
  onScroll: (scrollTop: number) => void;
  onToggleCollapse: (rowId: string) => void;
  onRowClick: (row: FlatRow, event: React.MouseEvent) => void;
  renderResourceRow?: (row: FlatRow) => React.ReactNode;
}

const DEFAULT_COLUMNS: GanttColumn[] = [
  { key: "name", title: "Name", width: 240, field: "name" },
  { key: "status", title: "Status", width: 110, field: "status" },
];

const STATUS_LABEL: Record<GanttTaskStatus, string> = {
  planned: "Planned",
  released: "Released",
  "in-progress": "In progress",
  completed: "Completed",
  paused: "Paused",
  cancelled: "Cancelled",
  delayed: "Delayed",
};

const cellValue = (row: FlatRow, column: GanttColumn, locale?: Intl.LocalesArgument): string => {
  if (column.key === "name" || column.field === "name") return row.label;

  const task = row.task;
  if (!task) {
    if (column.key === "code") return row.resource?.code ?? "";
    return "";
  }

  const field = column.field ?? column.key;
  switch (field) {
    case "code":
      return task.code ?? "";
    case "status":
      return task.status ?? "";
    case "progress":
      return task.progress !== undefined ? `${task.progress}%` : "";
    case "start": {
      const d = parseGanttDate(task.start);
      return d ? formatGanttDateTime(d, locale) : "";
    }
    case "end": {
      const d = parseGanttDate(task.end);
      return d ? formatGanttDateTime(d, locale) : "";
    }
    case "machine":
    case "resourceId":
      return String(task.machineId ?? task.resourceId ?? "");
    default: {
      const value = (task as unknown as Record<string, unknown>)[field];
      return value === undefined || value === null ? "" : String(value);
    }
  }
};

const StatusChip = ({ status }: { status?: GanttTaskStatus }) => {
  if (!status) return <span className="ar-gantt-muted">—</span>;
  return <span className={`ar-gantt-status ar-gantt-status--${status}`}>{STATUS_LABEL[status]}</span>;
};

const ResourcePanel: React.FC<ResourcePanelProps> = ({
  rows,
  columns,
  rowHeight,
  headerHeight,
  panelWidth,
  scrollTop,
  selectedIds,
  locale,
  onScroll,
  onToggleCollapse,
  onRowClick,
  renderResourceRow,
}) => {
  const cols = columns.length ? columns : DEFAULT_COLUMNS;
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const resolvedHeaderHeight = headerHeight ?? rowHeight;

  React.useEffect(() => {
    if (bodyRef.current && Math.abs(bodyRef.current.scrollTop - scrollTop) > 1) {
      bodyRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  return (
    <div className="ar-gantt-panel" style={{ width: panelWidth }} role="treegrid" aria-label="Task list">
      <div className="ar-gantt-panel-header" style={{ height: resolvedHeaderHeight }}>
        {cols.map((col) => (
          <div
            key={col.key}
            className={[
              "ar-gantt-panel-cell",
              "ar-gantt-panel-header-cell",
              col.align ? `is-${col.align}` : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ width: col.width ?? 120 }}
          >
            {col.title}
          </div>
        ))}
      </div>

      <div
        ref={bodyRef}
        className="ar-gantt-panel-body"
        onScroll={(e) => onScroll(e.currentTarget.scrollTop)}
      >
        <div className="ar-gantt-panel-rows" style={{ height: rows.length * rowHeight }}>
          {rows.map((row, index) => {
            if (renderResourceRow) {
              return (
                <div
                  key={row.id}
                  className={`ar-gantt-panel-row${index % 2 ? " is-alt" : ""}`}
                  style={{ top: index * rowHeight, height: rowHeight }}
                >
                  {renderResourceRow(row)}
                </div>
              );
            }

            const selected = row.task ? selectedIds.has(String(row.task.id)) : false;
            const isGroup = row.kind === "resource" || row.task?.type === "production-order";
            const code = row.task?.code ?? row.resource?.code;

            return (
              <div
                key={row.id}
                className={[
                  "ar-gantt-panel-row",
                  index % 2 ? "is-alt" : "",
                  selected ? "is-selected" : "",
                  isGroup ? "is-group" : "",
                  row.kind === "resource" ? "is-resource" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{ top: index * rowHeight, height: rowHeight }}
                role="row"
                aria-level={row.depth + 1}
                aria-expanded={row.expandable ? !row.collapsed : undefined}
                onClick={(e) => onRowClick(row, e)}
              >
                {cols.map((col, colIndex) => {
                  const field = col.field ?? col.key;
                  const isName = colIndex === 0 || field === "name";
                  const isStatus = field === "status";

                  return (
                    <div
                      key={col.key}
                      className={[
                        "ar-gantt-panel-cell",
                        col.align ? `is-${col.align}` : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={{
                        width: col.width ?? 120,
                        paddingLeft: isName ? 12 + row.depth * 16 : undefined,
                      }}
                      role="gridcell"
                    >
                      {isName ? (
                        <>
                          {row.expandable ? (
                            <button
                              type="button"
                              className={`ar-gantt-collapse${row.collapsed ? " is-collapsed" : ""}`}
                              aria-label={row.collapsed ? "Expand" : "Collapse"}
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleCollapse(
                                  row.kind === "resource" ? row.id.replace(/^resource:/, "") : row.id,
                                );
                              }}
                            >
                              <span className="ar-gantt-collapse-icon" aria-hidden />
                            </button>
                          ) : (
                            <span className="ar-gantt-collapse-spacer" />
                          )}
                          <span className="ar-gantt-panel-name">
                            {code ? <span className="ar-gantt-code">{code}</span> : null}
                            <span className="ar-gantt-panel-text">
                              {row.task?.name ?? row.resource?.name ?? row.label}
                            </span>
                          </span>
                        </>
                      ) : isStatus ? (
                        <StatusChip status={row.task?.status} />
                      ) : (
                        <span className="ar-gantt-panel-text">{cellValue(row, col, locale)}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ResourcePanel);
