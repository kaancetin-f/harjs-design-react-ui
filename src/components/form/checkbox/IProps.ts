import {
  IBorderProps,
  IColorProps,
  IUpperCaseProps,
  IValidationProps,
  IVariantProps,
} from "../../../libs/infrastructure/types/IGlobalProps";

interface IProps
  extends
    IVariantProps,
    IColorProps,
    IBorderProps,
    IUpperCaseProps,
    IValidationProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "type" | "size" | "color"> {
  label?: string;
}

export default IProps;
