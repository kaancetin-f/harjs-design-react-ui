import {
  IBorderProps,
  IColorProps,
  IValidationProps,
  IVariantProps,
} from "../../../../libs/infrastructure/types/IGlobalProps";
import { Option } from "../../../../libs/infrastructure/types";

interface IProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "color">,
    IVariantProps,
    IColorProps,
    IBorderProps,
    IValidationProps {
  options?: Option[];
  values: { option?: string; value: string | number | readonly string[] | undefined };
  onSelected?: (option: Option | undefined) => void;
}

export default IProps;
