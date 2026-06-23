import { IChildrenProps, ISizeProps } from "../../../libs/infrastructure/types/IGlobalProps";
import IPopoverProps from "../../feedback/popover/IProps";

interface IProps extends IChildrenProps, ISizeProps, React.HTMLAttributes<HTMLDivElement> {
  open: {
    get: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
  closePopover?: IPopoverProps;
  title?: string;
  footer?: React.ReactNode;
  disableCloseOnBackdrop?: boolean;
  disableCloseOnEsc?: boolean;
}

export default IProps;
