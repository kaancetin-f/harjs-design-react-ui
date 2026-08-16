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
    Omit<HTMLAttributes<HTMLParagraphElement>, "color"> {
  color?: ParagraphColors | (string & {});
  align?: "left" | "center" | "right";
}

export default IProps;
