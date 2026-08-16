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
  config?: {
    locale?: Intl.LocalesArgument;
    isShortcutButtons?: boolean;
    isClock?: boolean;
    isOnlyClock?: boolean;
    isFooterButton?: boolean;
    step?: { minutes?: number };
  };
} & (IMultiple | ISingle) &
  Omit<ComponentProps<typeof Input>, "onChange" | "value">;

export default Props;
