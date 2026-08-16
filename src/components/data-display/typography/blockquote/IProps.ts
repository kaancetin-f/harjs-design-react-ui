import type { HTMLAttributes } from "react";
import { ParagraphColors } from "../../../../libs/infrastructure/types";
import { IChildrenProps, IFontWeightProps, ISizeProps } from "../../../../libs/infrastructure/types/IGlobalProps";

interface IProps
  extends IChildrenProps,
    ISizeProps,
    IFontWeightProps,
    Omit<HTMLAttributes<HTMLQuoteElement>, "color" | "cite"> {
  color?: ParagraphColors | (string & {});
  align?: "left" | "center" | "right";
  cite?: string;
}

export default IProps;
