import { Color, StepProps, ValidationProps } from "../../../libs/infrastructure/types";
import { IChildrenProps } from "../../../libs/infrastructure/types/IGlobalProps";

export type StepsOrientation = "horizontal" | "vertical";

export type StepsTheme = {
  current?: Color | string;
  completed?: Color | string;
  pending?: Color | string;
};

interface IProps<TData extends object> extends IChildrenProps {
  name: string;
  steps: StepProps[];
  currentStep?: number;
  onChange: (currentStep: number) => void;
  validation?: {
    data: TData;
    rules: ValidationProps<TData>[];
  };
  variant?: StepsOrientation;
  direction?: StepsOrientation;
  config?: {
    isAutomatic?: boolean;
    locale?: Intl.LocalesArgument;
    theme?: StepsTheme;
    header?: boolean;
  };
  labels?: {
    back?: string;
    next?: string;
    step?: string;
  };
}

export default IProps;
