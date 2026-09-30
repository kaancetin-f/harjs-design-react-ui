"use client";

import React from "react";
import type { GanttZoomLevel } from "../IProps";
import { ZOOM_ORDER } from "../helpers";
import Button from "../../../form/button";
import Input from "../../../form/input";
import Select from "../../../form/select";
import type { Option } from "../../../../libs/infrastructure/types";

export interface GanttToolbarProps {
  title?: string;
  description?: string;
  zoom: GanttZoomLevel;
  canUndo: boolean;
  canRedo: boolean;
  searchQuery: string;
  showFilters: boolean;
  onZoomChange: (zoom: GanttZoomLevel) => void;
  onToday: () => void;
  onFit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSearchChange: (query: string) => void;
  onToggleFilters: () => void;
  renderHeader?: () => React.ReactNode;
}

const ZOOM_LABELS: Record<GanttZoomLevel, string> = {
  hour: "Hour",
  "4hour": "4 Hours",
  day: "Day",
  week: "Week",
  month: "Month",
  quarter: "Quarter",
};

const ZOOM_OPTIONS: Option[] = ZOOM_ORDER.map((level) => ({
  value: level,
  text: ZOOM_LABELS[level],
}));

const GanttToolbar: React.FC<GanttToolbarProps> = ({
  title,
  description,
  zoom,
  canUndo,
  canRedo,
  searchQuery,
  showFilters,
  onZoomChange,
  onToday,
  onFit,
  onUndo,
  onRedo,
  onSearchChange,
  onToggleFilters,
  renderHeader,
}) => {
  if (renderHeader) return <>{renderHeader()}</>;

  const zoomValue = ZOOM_OPTIONS.find((option) => option.value === zoom);

  return (
    <div className="ar-gantt-toolbar" role="toolbar" aria-label="Gantt toolbar">
      <div className="ar-gantt-toolbar-leading">
        {(title || description) && (
          <div className="ar-gantt-toolbar-titles">
            {title ? <span className="ar-gantt-title">{title}</span> : null}
            {description ? <span className="ar-gantt-description">{description}</span> : null}
          </div>
        )}
      </div>

      <div className="ar-gantt-toolbar-actions">
        <div className="ar-gantt-toolbar-field">
          <Select
            size="sm"
            variant="outlined"
            color="gray"
            placeholder="Zoom"
            options={ZOOM_OPTIONS}
            value={zoomValue}
            onChange={(option) => {
              if (!option?.value) return;
              onZoomChange(String(option.value) as GanttZoomLevel);
            }}
            config={{ clear: false }}
          />
        </div>

        <Button variant="outlined" color="gray" size="sm" onClick={onToday}>
          Today
        </Button>
        <Button variant="outlined" color="gray" size="sm" onClick={onFit}>
          Fit
        </Button>
        <Button variant="outlined" color="gray" size="sm" onClick={onUndo} disabled={!canUndo}>
          Undo
        </Button>
        <Button variant="outlined" color="gray" size="sm" onClick={onRedo} disabled={!canRedo}>
          Redo
        </Button>
        <Button
          variant={showFilters ? "filled" : "outlined"}
          color={showFilters ? "blue" : "gray"}
          size="sm"
          onClick={onToggleFilters}
          aria-pressed={showFilters}
        >
          Filters
        </Button>

        <div className="ar-gantt-toolbar-search">
          <Input
            size="sm"
            variant="outlined"
            color="gray"
            value={searchQuery}
            placeholder="Search tasks…"
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search tasks"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(GanttToolbar);
