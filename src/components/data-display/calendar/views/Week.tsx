import React from "react";
import { CalendarViewProps } from "../IProps";
import { DEFAULT_WEEK_STARTS_ON, getWeekDays } from "../helpers";
import TimeGrid from "./TimeGrid";

const Week = function <T>({ trackedBy, data, renderItem, states, config, onEventClick }: CalendarViewProps<T>) {
  const days = getWeekDays(states.currentDate.get, config?.weekStartsOn ?? DEFAULT_WEEK_STARTS_ON);

  return (
    <TimeGrid
      days={days}
      trackedBy={trackedBy}
      data={data}
      renderItem={renderItem}
      locale={config?.locale}
      onEventClick={onEventClick}
    />
  );
};

Week.displayName = "Calendar.Week";
export default Week;
