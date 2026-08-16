import type { ReactNode } from "react";
import { IChildrenProps } from "../../../libs/infrastructure/types/IGlobalProps";

interface IProps extends IChildrenProps {
  title?: string;
  message?: string;
  content?: ReactNode;
  onConfirm?: (confirm: boolean) => void;
  /**
   * When `true`, the popover stays open if the window loses focus.
   * Use this when the panel contains a file picker. Default closes on blur.
   */
  windowBlur?: boolean;
  fullWidth?: boolean;
  config?: {
    buttons: {
      okay: string;
      cancel?: string;
    };
  };
}

export default IProps;
