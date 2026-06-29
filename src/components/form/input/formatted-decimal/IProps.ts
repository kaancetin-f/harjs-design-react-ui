import { ComponentProps } from "react";
import Input from "..";

interface IProps extends ComponentProps<typeof Input> {
  locale?: Intl.LocalesArgument;
  digits?: { minimum?: number; maximum?: number };
}

export default IProps;
