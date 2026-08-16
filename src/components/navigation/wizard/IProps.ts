import { Dispatch, SetStateAction } from "react";
import { DrawerPlacement, DrawerSizes, StepProps, ValidationProps } from "../../../libs/infrastructure/types";

export interface IProps<TData extends object> {
  data: { get: Partial<TData>; set: Dispatch<SetStateAction<Partial<TData>>> };
  name: string;
  title?: string;
  description?: string;
  /** Drawer width when used as `Wizard.Drawer`. Ignored by the inline Wizard. */
  size?: DrawerSizes;
  steps: StepProps[];
  currentStep?: number;
  onChange: (currentStep: number) => void;
  onCompleted?: () => void;
  validation?: {
    data: TData;
    rules: ValidationProps<TData>[];
  };
  config?: {
    locale?: Intl.LocalesArgument;
  };
}

/**
 * Drawer wrapper around Wizard.
 * `config.locale` is forwarded to Wizard.
 * `config.freeContent` is forwarded to Drawer only — Wizard ignores it.
 */
export interface IWizardDrawerProps<TData extends object = Record<string, never>>
  extends Omit<IProps<TData>, "config"> {
  open: {
    get: boolean;
    set: Dispatch<SetStateAction<boolean>>;
  };
  placement?: DrawerPlacement;
  config?: { locale?: Intl.LocalesArgument; freeContent?: boolean };
}

export default IProps;
