import { IChildrenProps } from "../../../libs/infrastructure/types/IGlobalProps";

interface IProps extends IChildrenProps {
  text: string | string[];
  direction?: "top" | "right" | "left" | "bottom";
}

export default IProps;
