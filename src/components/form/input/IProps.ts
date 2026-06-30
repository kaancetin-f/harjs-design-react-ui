import {
  IBorderProps,
  IChildrenProps,
  IColorProps,
  ISizeProps,
  IUpperCaseProps,
  IValidationProps,
  IVariantProps,
} from "../../../libs/infrastructure/types/IGlobalProps";

interface IProps
  extends
    IChildrenProps,
    IVariantProps<{ component: "input" }>,
    IColorProps,
    IBorderProps,
    ISizeProps,
    IUpperCaseProps,
    IValidationProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "color" | "size"> {}

export default IProps;
