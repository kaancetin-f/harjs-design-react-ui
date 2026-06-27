import { ComponentProps, ReactElement } from "react";
import Checkbox from "../checkbox";
import { IValidationProps } from "../../../libs/infrastructure/types/IGlobalProps";

type Props = {
  children: ReactElement<typeof Checkbox> | ReactElement<typeof Checkbox>[];
  orientation?: "horizontal" | "vertical";
} & Omit<ComponentProps<typeof Checkbox>, "children"> &
  IValidationProps;

export default Props;
