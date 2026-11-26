import { ComponentProps } from "react";
import Input from "../input";

export type DateRangeValue = {
  start: string;
  end: string;
};

export interface IMultiple {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  direction: "column" | "row";
  multiple: true;
}

export interface ISingle {
  value: string;
  onChange: (value: string) => void;
  direction?: "column" | "row";
  multiple?: false;
}

type Props = {
  /**
   * Minimum selectable bound (same string shape as `value`).
   * Days/times before this are disabled — useful when wiring two single DatePickers
   * (pass the start picker’s value as `min` on the end picker).
   */
  min?: string;
  config?: {
    locale?: Intl.LocalesArgument;
    isShortcutButtons?: boolean;
    isClock?: boolean;
    isOnlyClock?: boolean;
    isFooterButton?: boolean;
    step?: { minutes?: number };
  };
} & (IMultiple | ISingle) &
  Omit<ComponentProps<typeof Input>, "onChange" | "value" | "min">;

export default Props;
