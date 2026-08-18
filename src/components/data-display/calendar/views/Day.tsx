import React from "react";
import { CalendarViewProps } from "../IProps";
import { startOfDay } from "../helpers";
import TimeGrid from "./TimeGrid";

const Day = function <T>({ trackedBy, data, renderItem, states, config, onEventClick }: CalendarViewProps<T>) {
  return (
    <TimeGrid
      days={[startOfDay(states.currentDate.get)]}
      trackedBy={trackedBy}
      data={data}
      renderItem={renderItem}
      locale={config?.locale}
      onEventClick={onEventClick}
    />
  );
};

Day.displayName = "Calendar.Day";
export default Day;
