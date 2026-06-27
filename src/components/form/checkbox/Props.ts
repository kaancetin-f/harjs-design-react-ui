import {
  IBorderProps,
  IColorProps,
  IUpperCaseProps,
  IValidationProps,
  IVariantProps,
} from "../../../libs/infrastructure/types/IGlobalProps";

type Props = {
  label?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
} & IVariantProps<{ component: "checkbox" }> &
  IColorProps &
  IBorderProps &
  IUpperCaseProps &
  IValidationProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "size" | "color">;

export default Props;
