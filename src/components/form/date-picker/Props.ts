import {
  IBorderProps,
  IColorProps,
  IStatusProps,
  IValidationProps,
  IVariantProps,
} from "../../../libs/infrastructure/types/IGlobalProps";

type Props = {
  onChange: (value: string) => void;
  config?: {
    locale?: Intl.LocalesArgument;
    isClock?: boolean;
    isFooterButton?: boolean;
  };
} & IVariantProps &
  IColorProps &
  IStatusProps &
  IBorderProps &
  IValidationProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "onChange" | "color">;

export default Props;
