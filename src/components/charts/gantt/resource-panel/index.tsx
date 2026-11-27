"use client";

import React from "react";
import { useTranslation } from "@harjs/translation";
import type { FlatRow, GanttColumn, GanttTaskStatus } from "../IProps";
import { formatGanttDateTime, parseGanttDate, resolveGanttLanguage } from "../helpers";
import IGanttLocale from "../../../../libs/core/application/locales/gantt/IGanttLocale";
import GanttTR from "../../../../libs/core/application/locales/gantt/tr";
import GanttEN from "../../../../libs/core/application/locales/gantt/en";

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

const STATUS_KEY: Record<GanttTaskStatus, keyof IGanttLocale> = {
  planned: "Gantt.Status.Planned",
  released: "Gantt.Status.Released",
  "in-progress": "Gantt.Status.InProgress",
  completed: "Gantt.Status.Completed",
  paused: "Gantt.Status.Paused",
  cancelled: "Gantt.Status.Cancelled",
  delayed: "Gantt.Status.Delayed",
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

const StatusChip = ({ status, label }: { status?: GanttTaskStatus; label?: string }) => {
  if (!status || !label) return <span className="ar-gantt-muted">—</span>;
  return <span className={`ar-gantt-status ar-gantt-status--${status}`}>{label}</span>;
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
  const language = resolveGanttLanguage(locale);
  const { t } = useTranslation<IGanttLocale>(language, {
    tr: { ...GanttTR },
    en: { ...GanttEN },
  });
  const cols = (columns.length ? columns : DEFAULT_COLUMNS).map((col) => {
    if (columns.length) return col;
    if (col.key === "name") return { ...col, title: t("Gantt.Column.Name") };
    if (col.key === "status") return { ...col, title: t("Gantt.Column.Status") };
    return col;
  });
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const resolvedHeaderHeight = headerHeight ?? rowHeight;

  React.useEffect(() => {
    if (bodyRef.current && Math.abs(bodyRef.current.scrollTop - scrollTop) > 1) {
      bodyRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  return (
    <div className="ar-gantt-panel" style={{ width: panelWidth }} role="treegrid" aria-label={t("Gantt.Panel.Label")}>
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
                              aria-label={row.collapsed ? t("Gantt.Expand") : t("Gantt.Collapse")}
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
                        <StatusChip status={row.task?.status} label={row.task?.status ? t(STATUS_KEY[row.task.status]) : undefined} />
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
