import { ReactElement } from "react";
import CheckboxProps from "../Props";
import { IValidationProps } from "../../../../libs/infrastructure/types/IGlobalProps";

type Props = {
  children: ReactElement | ReactElement[];
  title?: string;
  columns?: number;
  orientation?: "horizontal" | "vertical";
} & Omit<CheckboxProps, "children"> &
  IValidationProps;

export default Props;
