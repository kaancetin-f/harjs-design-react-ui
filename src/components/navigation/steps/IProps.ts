import { StepProps, ValidationProps } from "../../../libs/infrastructure/types";
import { IChildrenProps } from "../../../libs/infrastructure/types/IGlobalProps";

interface IProps<TData extends object> extends IChildrenProps {
  name: string;
  steps: StepProps[];
  currentStep?: number;
  onChange: (currentStep: number) => void;
  validation?: {
    data: TData;
    rules: ValidationProps<TData>[];
  };
  config?: {
    isAutomatic?: boolean;
  };
}

export default IProps;
