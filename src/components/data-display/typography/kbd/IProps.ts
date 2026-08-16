import type { HTMLAttributes } from "react";
import { ParagraphColors } from "../../../../libs/infrastructure/types";
import { IChildrenProps, IFontWeightProps, ISizeProps } from "../../../../libs/infrastructure/types/IGlobalProps";

interface IProps
  extends IChildrenProps,
    ISizeProps,
    IFontWeightProps,
    Omit<HTMLAttributes<HTMLElement>, "color"> {
  color?: ParagraphColors | (string & {});
}

export default IProps;
