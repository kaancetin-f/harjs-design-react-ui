import type { HTMLAttributes } from "react";
import {
  IBorderProps,
  IChildrenProps,
  IIconProps,
  IStatusProps,
  IVariantProps,
} from "../../../libs/infrastructure/types/IGlobalProps";

export type AlertMessage = string | AlertMessage[];

export type AlertBarSide = "start" | "end" | "top" | "bottom";
export type AlertBarSize = "2" | "3" | "4";

interface IProps
  extends IChildrenProps,
    IVariantProps<{ component: "alert" }>,
    IStatusProps<{ component: "alert" }>,
    IBorderProps,
    IIconProps,
    HTMLAttributes<HTMLDivElement> {
  message?: AlertMessage;
  emphasize?: string[];
  config?: {
    bar?: boolean | { side?: AlertBarSide; size?: AlertBarSize };
  };
}

export default IProps;
