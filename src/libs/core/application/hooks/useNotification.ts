import { useContext } from "react";
import { NotificationContext, PopupButtonConfig, Status } from "../contexts/Notification";

const useNotification = () => {
  // contexts
  const { setTitle, setMessage, setStatus, setPopupStatus, setTrigger, setIsPopupOpen, setPopupButtons, setOnConfirm } =
    useContext(NotificationContext);

  // methods
  const notification = ({ title, message, status }: { title: string; message?: string; status: Status | number }) => {
    setTitle?.(title);
    setMessage?.(message ?? "");
    setStatus?.(status);
    setTrigger?.((trigger) => !trigger);
  };

  const popupConfirm = ({
    title,
    message,
    status,
    buttons,
    onConfirm,
  }: {
    title: string;
    message?: string;
    status: (Status | "save" | "delete") | number;
    buttons?: PopupButtonConfig | null;
    onConfirm?: (confirm: boolean) => void;
  }) => {
    setTitle?.(title);
    setMessage?.(message ?? "");
    setPopupStatus?.(status);
    setIsPopupOpen?.((trigger) => !trigger);
    setPopupButtons?.(buttons ?? null);
    setOnConfirm?.(() => onConfirm);
  };

  return { notification, popupConfirm };
};

export default useNotification;
