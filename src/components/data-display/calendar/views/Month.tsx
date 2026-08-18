"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "@harjs/translation";
import { CalendarViewProps } from "../IProps";
import HoverTooltip from "../HoverTooltip";
import {
  DEFAULT_WEEK_STARTS_ON,
  DAYS_IN_WEEK,
  endOfDay,
  eventsInRange,
  getEventColor,
  getMonthGrid,
  getWeekDays,
  isSameDay,
  isSameMonth,
  startOfDay,
} from "../helpers";
import ICalendarLocale from "../../../../libs/core/application/locales/calendar/ICalendarLocale";
import CalendarTR from "../../../../libs/core/application/locales/calendar/tr";
import CalendarEN from "../../../../libs/core/application/locales/calendar/en";

const MAX_VISIBLE_EVENTS = 3;

const Month = function <T>({ trackedBy, data, renderItem, states, config, onEventClick }: CalendarViewProps<T>) {
  // variables
  const locale = config?.locale ?? "tr";
  const weekStartsOn = config?.weekStartsOn ?? DEFAULT_WEEK_STARTS_ON;
  const today = new Date();

  // states
  const [tooltip, setTooltip] = useState<{ content: React.JSX.Element; id: number } | null>(null);

  // hooks
  const { t } = useTranslation<ICalendarLocale>(String(locale), {
    tr: { ...CalendarTR },
    en: { ...CalendarEN },
  });

  // methods
  const days = useMemo(
    () => getMonthGrid(states.currentDate.get, weekStartsOn),
    [states.currentDate.get, weekStartsOn],
  );

  const weekdays = useMemo(
    () => getWeekDays(states.currentDate.get, weekStartsOn),
    [states.currentDate.get, weekStartsOn],
  );

  const openDay = (day: Date) => {
    states.currentDate.set(startOfDay(day));
    states.view.set("Day");
  };

  return (
    <>
      <div className="har-calendar-month-view" role="grid">
        <div className="weekdays" role="row">
          {weekdays.map((day) => (
            <span key={day.toISOString()} role="columnheader">
              {day.toLocaleString(locale, { weekday: "short" }).toLocaleUpperCase(String(locale))}
            </span>
          ))}
        </div>

        <div className="days">
          {Array.from({ length: days.length / DAYS_IN_WEEK }, (_, weekIndex) => (
            <div key={weekIndex} className="week" role="row">
              {days.slice(weekIndex * DAYS_IN_WEEK, weekIndex * DAYS_IN_WEEK + DAYS_IN_WEEK).map((day) => {
                const dayStart = startOfDay(day).getTime();
                const dayEnd = endOfDay(day).getTime();
                const dayEvents = eventsInRange(data, dayStart, dayEnd);
                const visible = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
                const hidden = dayEvents.length - visible.length;
                const inMonth = isSameMonth(day, states.currentDate.get);
                const todayCell = isSameDay(day, today);

                return (
                  <div
                    key={day.toISOString()}
                    className={["day", inMonth ? undefined : "is-outside", todayCell ? "is-today" : undefined]
                      .filter(Boolean)
                      .join(" ")}
                    role="gridcell"
                    aria-current={todayCell ? "date" : undefined}
                    onClick={() => openDay(day)}
                  >
                    <span className="date">{day.getDate()}</span>
                    <div className="events">
                      {visible.map(({ event, originalIndex }) => {
                        const uniqueValue = event[trackedBy];
                        const color = getEventColor(uniqueValue as string | number);
                        return (
                          <button
                            key={`${String(uniqueValue)}-${originalIndex}`}
                            type="button"
                            className="event"
                            style={{ backgroundColor: color.bg, borderColor: color.border }}
                            onMouseEnter={() =>
                              setTooltip({ content: renderItem(event, originalIndex), id: originalIndex })
                            }
                            onMouseLeave={() => setTooltip(null)}
                            onClick={(click) => {
                              click.stopPropagation();
                              onEventClick?.(event, originalIndex);
                            }}
                          >
                            {renderItem(event, originalIndex)}
                          </button>
                        );
                      })}
                      {hidden > 0 ? (
                        <span className="more">{t("Calendar.More").replace("{count}", String(hidden))}</span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {tooltip ? <HoverTooltip>{tooltip.content}</HoverTooltip> : null}
    </>
  );
};

Month.displayName = "Calendar.Month";
export default Month;
