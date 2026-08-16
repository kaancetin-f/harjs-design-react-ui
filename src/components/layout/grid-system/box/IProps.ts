import { Property } from "csstype";
import { IChildrenProps } from "../../../../libs/infrastructure/types/IGlobalProps";

interface IProps extends IChildrenProps {
  direction?: "flex-start" | "center" | "flex-end";
  gap?: Property.Gap;
  className?: string;
}

export default IProps;
