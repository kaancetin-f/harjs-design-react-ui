import type { HTMLAttributes } from "react";
import {
  ISizeProps,
  IStatusProps,
} from "../../../libs/infrastructure/types/IGlobalProps";

interface IProps
  extends
    ISizeProps,
    IStatusProps,
    Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * Accessible name announced to screen readers. Not shown visually.
   * Defaults to `"Loading"`. Pass an empty string to make the spinner decorative.
   */
  label?: string;
}

export default IProps;
