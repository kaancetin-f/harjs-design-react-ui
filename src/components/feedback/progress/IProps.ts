import { Color } from "../../../libs/infrastructure/types";
import {
  IColorProps,
  ISizeProps,
} from "../../../libs/infrastructure/types/IGlobalProps";

interface IProps extends IColorProps, ISizeProps {
  value: number;
  /**
   * Inverts value-based color inference. Does not change fill direction.
   * Ignored when `color` is set.
   */
  reverse?: boolean;
  isVisibleValue?: boolean;
  /** When set, skips value-based color inference and uses this palette color instead. */
  color?: Color;
  /**
   * `"line"` is the default bar. `"circle"` is a round ring.
   * Size sets bar height for `"line"` and diameter for `"circle"`.
   */
  type?: "line" | "circle";
}

export default IProps;
