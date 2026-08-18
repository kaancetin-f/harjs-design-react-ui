import React, { useMemo } from "react";
import { CalendarViewProps } from "../IProps";
import {
  DEFAULT_WEEK_STARTS_ON,
  endOfDay,
  eventsInRange,
  getMonthGrid,
  getWeekDays,
  isSameDay,
  isSameMonth,
  startOfDay,
} from "../helpers";
import Button from "../../../form/button";

const Year = function <T>({ data, states, config }: CalendarViewProps<T>) {
  const locale = config?.locale ?? "tr";
  const weekStartsOn = config?.weekStartsOn ?? DEFAULT_WEEK_STARTS_ON;
  const year = states.currentDate.get.getFullYear();
  const today = new Date();
  const months = useMemo(() => Array.from({ length: 12 }, (_, month) => new Date(year, month, 1)), [year]);
  const weekdays = useMemo(() => getWeekDays(new Date(year, 0, 4), weekStartsOn), [year, weekStartsOn]);

  const openMonth = (month: Date) => {
    states.currentDate.set(startOfDay(month));
    states.view.set("Month");
  };

  const openDay = (day: Date) => {
    states.currentDate.set(startOfDay(day));
    states.view.set("Day");
  };

  return (
    <div className="har-calendar-year-view">
      {months.map((month) => {
        const days = getMonthGrid(month, weekStartsOn);
        return (
          <div key={month.toISOString()} className="month" onClick={() => openMonth(month)}>
            <Button className="title" onClick={() => openMonth(month)}>
              {month.toLocaleDateString(locale, { month: "long" })}
            </Button>
            <div className="weekdays">
              {weekdays.map((day) => (
                <span key={day.toISOString()}>{day.toLocaleString(locale, { weekday: "narrow" })}</span>
              ))}
            </div>
            <div className="days">
              {days.map((day) => {
                const inMonth = isSameMonth(day, month);
                const hasEvents =
                  inMonth && eventsInRange(data, startOfDay(day).getTime(), endOfDay(day).getTime()).length > 0;
                const todayCell = isSameDay(day, today);
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    className={[
                      "day",
                      inMonth ? undefined : "is-outside",
                      todayCell ? "is-today" : undefined,
                      hasEvents ? "has-events" : undefined,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    disabled={!inMonth}
                    onClick={(event) => {
                      event.stopPropagation();
                      openDay(day);
                    }}
                  >
                    {inMonth ? day.getDate() : ""}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

Year.displayName = "Calendar.Year";
export default Year;
