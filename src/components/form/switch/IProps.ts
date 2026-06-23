import {
  IBorderProps,
  IColorProps,
  IDisabledProps,
  IIconProps,
  ISizeProps,
  IUpperCaseProps,
  IValidationProps,
  IVariantProps,
} from "../../../libs/infrastructure/types/IGlobalProps";

interface IProps
  extends
    IVariantProps,
    IColorProps,
    IBorderProps,
    IIconProps,
    ISizeProps,
    IUpperCaseProps,
    IValidationProps,
    IDisabledProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "size" | "color"> {
  label?: string;
}

export default IProps;
