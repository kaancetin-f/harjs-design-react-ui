import IButtonProps from "../button/IProps";
import { Variants } from "../../../libs/infrastructure/types";
import {
  IBorderProps,
  IColorProps,
  IIconProps,
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
    IUpperCaseProps,
    IValidationProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "color"> {
  button?: Omit<IButtonProps, "size" | "shape" | "position" | "fullWidth">;
  addon?: { variant?: Variants; before?: string | number; after?: string | number };
}

export default IProps;
