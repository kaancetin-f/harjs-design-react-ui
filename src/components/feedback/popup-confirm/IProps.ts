import { PopupButtonConfig, Status } from "../../../libs/core/application/contexts/Notification";

interface IProps {
  title: string;
  message?: string;
  status: (Status | "save" | "delete") | number;
  isOpen: boolean;
  buttons?: PopupButtonConfig | null;
  onConfirm?: ((confirm: boolean) => void) | null;
}

export default IProps;
