import {
  IBorderProps,
  IColorProps,
  ISizeProps,
  IUpperCaseProps,
  IValidationProps,
  IVariantProps,
} from "../../../libs/infrastructure/types/IGlobalProps";

type Props = {
  label?: string;
} & IVariantProps<{ component: "checkbox" }> &
  IColorProps &
  IBorderProps &
  ISizeProps &
  IUpperCaseProps &
  IValidationProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "size" | "color">;

export default Props;
