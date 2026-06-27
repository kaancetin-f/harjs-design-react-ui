import { ComponentProps } from "react";
import Checkbox from "../checkbox";
import { Color } from "../../../libs/infrastructure/types";

interface IProps extends Omit<ComponentProps<typeof Checkbox>, "border"> {
  trace?: { color: Color };
  pastTrace?: { color: Color };
}

export default IProps;
