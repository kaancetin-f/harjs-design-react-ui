import { ComponentProps } from "react";
import Input from "..";

interface IProps extends ComponentProps<typeof Input> {
  character: number;
}

export default IProps;
