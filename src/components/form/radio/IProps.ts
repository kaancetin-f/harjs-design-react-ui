import {
  IBorderProps,
  IColorProps,
  IIconProps,
  ISizeProps,
  IUpperCaseProps,
  IValidationProps,
  IVariantProps,
} from "../../../libs/infrastructure/types/IGlobalProps";
import { Color } from "../../../libs/infrastructure/types";

interface IProps
  extends
    IVariantProps,
    IColorProps,
    IBorderProps,
    IIconProps,
    ISizeProps,
    IUpperCaseProps,
    IValidationProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "size" | "color"> {
  label?: string;
  trace?: { color: Color };
  pastTrace?: { color: Color };
}

export default IProps;
