"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { CalendarEvent } from "../IProps";
import HoverTooltip from "../HoverTooltip";
import {
  CELL_HEIGHT,
  HOURS_IN_DAY,
  computeEventLayout,
  endOfDay,
  eventsInRange,
  getEventColor,
  getTimeOffset,
  isSameDay,
  startOfDay,
} from "../helpers";

interface IProps<T> {
  days: Date[];
  trackedBy: keyof (T & CalendarEvent);
  data: (T & CalendarEvent)[];
  renderItem: (item: T, index: number) => React.JSX.Element;
  locale?: Intl.LocalesArgument;
  onEventClick?: (item: T & CalendarEvent, index: number) => void;
}

const TimeGrid = function <T>({ days, trackedBy, data, renderItem, locale = "tr", onEventClick }: IProps<T>) {
  // refs
  const _scrollRef = useRef<HTMLDivElement>(null);

  // states
  const [now, setNow] = useState(() => new Date());
  const [tooltip, setTooltip] = useState<{ content: React.JSX.Element; id: number } | null>(null);

  // variables
  const columns = Math.max(days.length, 1);
  const eventsByDay = useMemo(
    () =>
      days.map((day) => {
        const dayStart = startOfDay(day).getTime();
        const dayEnd = endOfDay(day).getTime();
        return computeEventLayout(eventsInRange(data, dayStart, dayEnd), dayStart, dayEnd);
      }),
    [data, days],
  );
  const todayIndex = days.findIndex((day) => isSameDay(day, now));

  // useEffects
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const node = _scrollRef.current;
    if (!node) return;
    node.scrollTop = Math.max(0, getTimeOffset(new Date()) - node.clientHeight / 3);
  }, []);

  return (
    <>
      <div
        className={["har-calendar-time-grid", columns === 1 ? "is-day" : "is-week"].join(" ")}
        style={{ ["--calendar-columns" as string]: String(columns) }}
      >
        <div className="head">
          <div className="gutter" aria-hidden="true" />
          <div className="days">
            {days.map((day) => {
              const today = isSameDay(day, now);
              return (
                <div
                  key={day.toISOString()}
                  className={["item", today ? "is-today" : undefined].filter(Boolean).join(" ")}
                  role="columnheader"
                  aria-current={today ? "date" : undefined}
                >
                  <span className="day-name">
                    {day.toLocaleString(locale, { weekday: "short" }).toLocaleUpperCase(String(locale))}
                  </span>
                  <span className="date">{day.getDate()}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div ref={_scrollRef} className="body">
          <div className="clocks" aria-hidden="true">
            {Array.from({ length: HOURS_IN_DAY }, (_, hour) => (
              <div key={hour} className={["clock", hour === 0 ? "is-first" : undefined].filter(Boolean).join(" ")}>
                <span>{String(hour).padStart(2, "0")}:00</span>
              </div>
            ))}
          </div>

          <div className="board" role="grid">
            <div className="lines">
              {Array.from({ length: HOURS_IN_DAY }, (_, hour) => (
                <div key={hour} className={["row", hour === 0 ? "is-first" : undefined].filter(Boolean).join(" ")} role="row">
                  {days.map((day) => (
                    <div key={day.toISOString()} className="cell" role="gridcell" />
                  ))}
                </div>
              ))}
            </div>

            <div className="events-layer">
              {todayIndex >= 0 ? (
                <div
                  className="now-line"
                  style={{
                    top: `${getTimeOffset(now)}px`,
                    left: `${(100 / columns) * todayIndex}%`,
                    width: `${100 / columns}%`,
                  }}
                />
              ) : null}

              {eventsByDay.map((positionedEvents, dayIndex) =>
                positionedEvents.map(({ event, layout, originalIndex }) => {
                  const uniqueValue = event[trackedBy];
                  const eventColor = getEventColor(uniqueValue as string | number);

                  return (
                    <div
                      key={`${String(uniqueValue)}-${dayIndex}`}
                      className="event-box"
                      onMouseEnter={() =>
                        setTooltip({ content: renderItem(event, originalIndex), id: originalIndex })
                      }
                      onMouseLeave={() => setTooltip(null)}
                      onClick={() => onEventClick?.(event, originalIndex)}
                      style={{
                        backgroundColor: eventColor.bg,
                        borderColor: eventColor.border,
                        top: `${layout.top}px`,
                        height: `${layout.height}px`,
                        left: `calc(${(100 / columns) * dayIndex}% + ${(layout.column * (100 / columns)) / layout.totalColumns}% + 2px)`,
                        width: `calc(${100 / columns / layout.totalColumns}% - 4px)`,
                      }}
                    >
                      {layout.height > CELL_HEIGHT / 3 ? renderItem(event, originalIndex) : null}
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        </div>
      </div>

      {tooltip ? <HoverTooltip>{tooltip.content}</HoverTooltip> : null}
    </>
  );
};

TimeGrid.displayName = "Calendar.TimeGrid";
export default TimeGrid;
