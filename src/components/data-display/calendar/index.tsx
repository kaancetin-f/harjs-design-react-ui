"use client";

import React, { SetStateAction, useState } from "react";
import { useTranslation } from "@harjs/translation";
import IProps from "./IProps";
import Body from "./Body";
import Header from "./Header";
import "../../../assets/css/components/data-display/calendar/styles.css";
import { View } from "../../../libs/infrastructure/types";
import { DEFAULT_VIEW } from "./helpers";
import ICalendarLocale from "../../../libs/core/application/locales/calendar/ICalendarLocale";
import CalendarTR from "../../../libs/core/application/locales/calendar/tr";
import CalendarEN from "../../../libs/core/application/locales/calendar/en";

const Calendar = function <T>({
  trackedBy,
  data,
  renderItem,
  currentDate,
  defaultDate,
  onDateChange,
  view,
  defaultView = DEFAULT_VIEW,
  onViewChange,
  onEventClick,
  height,
  config,
}: IProps<T>) {
  const isDateControlled = currentDate !== undefined;
  const isViewControlled = view !== undefined;
  const [internalDate, setInternalDate] = useState(defaultDate ?? new Date());
  const [internalView, setInternalView] = useState<View>(defaultView);
  const resolvedDate = isDateControlled ? currentDate : internalDate;
  const resolvedView = isViewControlled ? view : internalView;
  const { t } = useTranslation<ICalendarLocale>(String(config?.locale ?? "tr"), {
    tr: { ...CalendarTR },
    en: { ...CalendarEN },
  });

  const setDate = (updater: SetStateAction<Date>) => {
    const next = typeof updater === "function" ? updater(resolvedDate) : updater;
    if (!isDateControlled) setInternalDate(next);
    onDateChange?.(next);
  };

  const setView = (updater: SetStateAction<View>) => {
    const next = typeof updater === "function" ? updater(resolvedView) : updater;
    if (!isViewControlled) setInternalView(next);
    onViewChange?.(next);
  };

  const states = {
    currentDate: { get: resolvedDate, set: setDate },
    view: { get: resolvedView, set: setView },
  };

  return (
    <div
      className="har-calendar"
      role="region"
      aria-label={t("Calendar.Label")}
      style={height != null ? { height: typeof height === "number" ? `${height}px` : height } : undefined}
    >
      <Header states={states} config={config} />
      <Body
        trackedBy={trackedBy}
        data={data}
        renderItem={renderItem}
        states={states}
        config={config}
        onEventClick={onEventClick}
      />
    </div>
  );
};

Calendar.displayName = "Calendar";
export default Calendar;
