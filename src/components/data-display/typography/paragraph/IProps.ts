import { ParagraphColors, Status } from "../../../../libs/infrastructure/types";
import { IChildrenProps, ISizeProps, IUpperCaseProps } from "../../../../libs/infrastructure/types/IGlobalProps";

interface IProps extends IChildrenProps, ISizeProps, IUpperCaseProps {
  color?: ParagraphColors | Status;
  align?: "left" | "center" | "right";
}

export default IProps;
