import { ReactElement } from "react";
import RadioProps from "../IProps";
import { IValidationProps } from "../../../../libs/infrastructure/types/IGlobalProps";

type Props = {
  children: ReactElement | ReactElement[];
  title?: string;
  columns?: number;
  orientation?: "horizontal" | "vertical";
} & Omit<RadioProps, "children"> &
  IValidationProps;

export default Props;
