import {
  IBorderProps,
  IColorProps,
  IDisabledProps,
  ISizeProps,
  IUpperCaseProps,
  IValidationProps,
  IVariantProps,
} from "../../../libs/infrastructure/types/IGlobalProps";

interface IProps
  extends
    IVariantProps<{ component: "switch" }>,
    IColorProps,
    IBorderProps,
    ISizeProps,
    IUpperCaseProps,
    IValidationProps,
    IDisabledProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "size" | "color"> {
  label?: string;
  icon?: {
    checked?: React.ReactNode;
    unchecked?: React.ReactNode;
  };
}

export default IProps;
