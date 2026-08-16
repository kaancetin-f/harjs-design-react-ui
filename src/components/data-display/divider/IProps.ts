import { IChildrenProps, IColorProps } from "../../../libs/infrastructure/types/IGlobalProps";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerVariant = "fade" | "solid" | "dashed";
export type DividerAlign = "start" | "center" | "end";

interface IProps extends IChildrenProps, IColorProps {
  /**
   * Axis of the rule. Vertical stretch-fills a flex row. Default `horizontal`.
   */
  orientation?: DividerOrientation;
  /**
   * Line treatment. `fade` softens both ends. Default `fade`.
   */
  variant?: DividerVariant;
  /**
   * Label placement when `children` is set. Default `center`.
   */
  align?: DividerAlign;
  config?: {
    /**
     * CSS `margin`. Overrides the orientation default.
     */
    margin?: string | number;
  };
}

export default IProps;
