import { IChildrenProps } from "../../../libs/infrastructure/types/IGlobalProps";
import type { TooltipDirection } from "./position";

interface IProps extends IChildrenProps {
  /**
   * Short copy shown in the tooltip.
   * A string renders as a single line. An array renders a bullet list.
   */
  text: string | string[];
  /**
   * Preferred side of the trigger. Flips when that side does not fit.
   * @default "top"
   */
  direction?: TooltipDirection;
}

export default IProps;
