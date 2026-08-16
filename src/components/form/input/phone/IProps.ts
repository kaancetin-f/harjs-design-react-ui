import { Option } from "../../../../libs/infrastructure/types";
import { ComponentProps } from "react";
import Input from "..";

interface IProps extends ComponentProps<typeof Input> {
  options?: Option[];
  values: { option?: string; value: string | number | readonly string[] | undefined };
  onSelected?: (option: Option | undefined) => void;
}

export default IProps;
