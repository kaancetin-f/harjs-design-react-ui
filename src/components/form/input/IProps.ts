import { Variants } from "../../../libs/infrastructure/types";
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
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "color" | "size"> {
  // button?: Omit<ComponentProps<typeof Button>, "size" | "shape" | "position" | "fullWidth">;
  addon?: { variant?: Variants; before?: string | number; after?: string | number };
}

export default IProps;
