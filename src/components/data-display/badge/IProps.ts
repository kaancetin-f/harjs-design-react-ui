import type { HTMLAttributes } from "react";
import {
  IBorderProps,
  IChildrenProps,
  IColorProps,
  IDisabledProps,
  IIconProps,
  ISizeProps,
  IStatusProps,
  IUpperCaseProps,
  IVariantProps,
} from "../../../libs/infrastructure/types/IGlobalProps";

export type BadgeConfig = {
  /**
   * Show `{n}+` once `count` is greater than this. Default `99`.
   */
  overflowCount?: number;
  /**
   * Shift the overlay mark from the top-end corner, in pixels: `[x, y]`.
   */
  offset?: [number, number];
  /**
   * Keep a numeric mark when `count` is `0`.
   */
  showZero?: boolean;
};

interface IProps
  extends IChildrenProps,
    IVariantProps,
    IStatusProps,
    IColorProps,
    ISizeProps,
    IIconProps,
    IBorderProps,
    IDisabledProps,
    IUpperCaseProps,
    Omit<HTMLAttributes<HTMLElement>, "color"> {
  /**
   * Status label, or the ribbon copy on `Badge.Ribbon`.
   */
  text?: string;
  /**
   * Numeric (or short string) mark. Wraps `children` when they are passed.
   */
  count?: number | string;
  /**
   * Render a status dot instead of a count.
   */
  dot?: boolean;
  config?: BadgeConfig;
}

export interface IRibbonProps extends IChildrenProps, IStatusProps, IColorProps, IDisabledProps {
  text: string;
  /**
   * Corner of the host. Default `end`.
   */
  placement?: "start" | "end";
  className?: string;
}

export default IProps;
