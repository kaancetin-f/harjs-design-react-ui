"use client";

import React from "react";
import { useTranslation } from "@harjs/translation";
import type { GanttZoomLevel } from "../IProps";
import { resolveGanttLanguage, ZOOM_ORDER } from "../helpers";
import Button from "../../../form/button";
import Input from "../../../form/input";
import Select from "../../../form/select";
import type { Option } from "../../../../libs/infrastructure/types";
import IGanttLocale from "../../../../libs/core/application/locales/gantt/IGanttLocale";
import GanttTR from "../../../../libs/core/application/locales/gantt/tr";
import GanttEN from "../../../../libs/core/application/locales/gantt/en";

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
  locale?: Intl.LocalesArgument;
}

const ZOOM_KEY: Record<GanttZoomLevel, keyof IGanttLocale> = {
  hour: "Gantt.Zoom.Hour",
  "4hour": "Gantt.Zoom.FourHour",
  day: "Gantt.Zoom.Day",
  week: "Gantt.Zoom.Week",
  month: "Gantt.Zoom.Month",
  quarter: "Gantt.Zoom.Quarter",
};

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
  locale,
}) => {
  const language = resolveGanttLanguage(locale);
  const { t } = useTranslation<IGanttLocale>(language, {
    tr: { ...GanttTR },
    en: { ...GanttEN },
  });

  if (renderHeader) return <>{renderHeader()}</>;

  const zoomOptions: Option[] = ZOOM_ORDER.map((level) => ({
    value: level,
    text: t(ZOOM_KEY[level]),
  }));
  const zoomValue = zoomOptions.find((option) => option.value === zoom);

  return (
    <div className="ar-gantt-toolbar" role="toolbar" aria-label={t("Gantt.Toolbar.Label")}>
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
            placeholder={t("Gantt.Toolbar.Zoom")}
            options={zoomOptions}
            value={zoomValue}
            onChange={(option) => {
              if (!option?.value) return;
              onZoomChange(String(option.value) as GanttZoomLevel);
            }}
            config={{ clear: false, locale: language }}
          />
        </div>

        <Button variant="outlined" color="gray" size="sm" onClick={onToday}>
          {t("Gantt.Toolbar.Today")}
        </Button>
        <Button variant="outlined" color="gray" size="sm" onClick={onFit}>
          {t("Gantt.Toolbar.Fit")}
        </Button>
        <Button variant="outlined" color="gray" size="sm" onClick={onUndo} disabled={!canUndo}>
          {t("Gantt.Toolbar.Undo")}
        </Button>
        <Button variant="outlined" color="gray" size="sm" onClick={onRedo} disabled={!canRedo}>
          {t("Gantt.Toolbar.Redo")}
        </Button>
        <Button
          variant={showFilters ? "filled" : "outlined"}
          color={showFilters ? "blue" : "gray"}
          size="sm"
          onClick={onToggleFilters}
          aria-pressed={showFilters}
        >
          {t("Gantt.Toolbar.Filters")}
        </Button>

        <div className="ar-gantt-toolbar-search">
          <Input
            size="sm"
            variant="outlined"
            color="gray"
            value={searchQuery}
            placeholder={t("Gantt.Toolbar.Search")}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label={t("Gantt.Toolbar.Search.Label")}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(GanttToolbar);
