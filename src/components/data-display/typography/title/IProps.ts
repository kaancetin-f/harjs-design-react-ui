import type { HTMLAttributes } from "react";
import { ParagraphColors } from "../../../../libs/infrastructure/types";
import {
  IChildrenProps,
  IFontWeightProps,
  ISizeProps,
  IUpperCaseProps,
} from "../../../../libs/infrastructure/types/IGlobalProps";

interface IProps
  extends IChildrenProps,
    ISizeProps,
    IUpperCaseProps,
    IFontWeightProps,
    Omit<HTMLAttributes<HTMLHeadingElement>, "color"> {
  align?: "left" | "center" | "right";
  color?: ParagraphColors | (string & {});
}

export default IProps;
