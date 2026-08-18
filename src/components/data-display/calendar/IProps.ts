import type { Dispatch, ReactElement, SetStateAction } from "react";
import { View } from "../../../libs/infrastructure/types";

export type CalendarEvent = {
  start: Date;
  end: Date;
};

export type CalendarConfig = {
  locale?: Intl.LocalesArgument;
  weekStartsOn?: number;
};

export type CalendarStates = {
  currentDate: {
    get: Date;
    set: Dispatch<SetStateAction<Date>>;
  };
  view: { get: View; set: Dispatch<SetStateAction<View>> };
};

export type CalendarViewProps<T> = {
  trackedBy: keyof (T & CalendarEvent);
  data: (T & CalendarEvent)[];
  renderItem: (item: T, index: number) => ReactElement;
  states: CalendarStates;
  config?: CalendarConfig;
  onEventClick?: (item: T & CalendarEvent, index: number) => void;
};

interface IProps<T> {
  trackedBy: keyof (T & CalendarEvent);
  data: (T & CalendarEvent)[];
  renderItem: (item: T, index: number) => ReactElement;
  currentDate?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  view?: View;
  defaultView?: View;
  onViewChange?: (view: View) => void;
  onEventClick?: (item: T & CalendarEvent, index: number) => void;
  height?: string | number;
  config?: CalendarConfig;
}

export default IProps;
