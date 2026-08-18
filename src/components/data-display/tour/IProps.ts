import type { Dispatch, SetStateAction } from "react";
import type { TourTarget } from "./helpers";
import type { TourPlacement } from "./position";

export type { TourTarget, TourNavState } from "./helpers";
export type { TourPlacement } from "./position";

export type TourStep = {
  target: TourTarget;
  title?: string;
  description?: string;
  placement?: TourPlacement;
};

interface IProps {
  steps: TourStep[];
  open?: {
    get: boolean;
    set: Dispatch<SetStateAction<boolean>>;
  };
  currentStep?: number;
  onChange?: (currentStep: number) => void;
  onSkip?: () => void;
  onFinish?: () => void;
  name?: string;
  disableCloseOnEsc?: boolean;
  labels?: {
    next?: string;
    previous?: string;
    skip?: string;
    finish?: string;
    step?: string;
  };
  config?: {
    once?: boolean;
    locale?: Intl.LocalesArgument;
    padding?: number;
  };
}

export default IProps;
