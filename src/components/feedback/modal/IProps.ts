import type { HTMLAttributes } from "react";
import { Sizes } from "../../../libs/infrastructure/types";
import { IBorderProps, IChildrenProps } from "../../../libs/infrastructure/types/IGlobalProps";
import IPopoverProps from "../../feedback/popover/IProps";

export type ModalSize = Sizes | "full";

interface IProps extends IChildrenProps, IBorderProps, Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  open: {
    get: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
  closePopover?: IPopoverProps;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  size?: ModalSize;
  onClose?: () => void;
  disableCloseOnBackdrop?: boolean;
  disableCloseOnEsc?: boolean;
  config?: {
    freeContent?: boolean;
    keepMounted?: boolean;
  };
}

export default IProps;
