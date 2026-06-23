import {
  IBorderProps,
  IColorProps,
  IDisabledProps,
  IPlaceholderProps,
  IUpperCaseProps,
  IValidationProps,
  IVariantProps,
} from "../../../../libs/infrastructure/types/IGlobalProps";

interface IProps
  extends
    IVariantProps,
    IColorProps,
    IBorderProps,
    IUpperCaseProps,
    IValidationProps,
    IPlaceholderProps,
    IDisabledProps {
  name: string;
  value: string | number | readonly string[] | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  locale?: Intl.LocalesArgument;
  digits?: { minimum?: number; maximum?: number };
}

export default IProps;
