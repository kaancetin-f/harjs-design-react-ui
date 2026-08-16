"use client";

import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import Notification from "../../../../components/feedback/notification";
import PopupConfirm from "../../../../components/feedback/popup-confirm";
import IButtonProps from "../../../../components/form/button/IProps";

export type Status = "success" | "warning" | "information" | "error";
export type Direction =
  "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type NotificationCommand = {
  rev: number;
  op: "push" | "update" | "dismiss";
  id: string;
  title?: string;
  message?: string;
  status?: Status | number;
  duration?: number;
  pending?: boolean;
};

export type PopupButtonConfig = {
  okay?: IButtonProps;
  cancel?: IButtonProps;
};

export type ConfirmAskPayload = {
  title: string;
  message?: string;
  status: (Status | "save" | "delete") | number;
  buttons?: PopupButtonConfig | null;
};

type NotificationContextValue = {
  dispatchToast: (command: Omit<NotificationCommand, "rev">) => void;
  defaultDuration: number;
  askConfirm: (payload: ConfirmAskPayload) => Promise<boolean>;
  closeConfirm: () => void;
  setIsPopupOpen: Dispatch<SetStateAction<boolean>>;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification and useConfirm must be used within a NotificationProvider");
  }
  return context;
};

type Props = {
  children: ReactNode;
  direction?: Direction;
  duration?: number;
};

const NotificationProvider = ({
  children,
  direction = "bottom-left",
  duration = 3000,
}: Props) => {
  // refs
  const commandRev = useRef(0);
  const confirmResolver = useRef<((value: boolean) => void) | null>(null);

  // states
  const [command, setCommand] = useState<NotificationCommand | null>(null);
  const [confirm, setConfirm] = useState<ConfirmAskPayload & { open: boolean }>({
    open: false,
    title: "",
    status: "information",
  });

  // methods
  const dispatchToast = useCallback((next: Omit<NotificationCommand, "rev">) => {
    // Aynı id'li güncellemede rerender için rev artır.
    commandRev.current += 1;
    setCommand({ ...next, rev: commandRev.current });
  }, []);

  const settleConfirm = useCallback((value: boolean) => {
    confirmResolver.current?.(value);
    confirmResolver.current = null;
    setConfirm((current) => ({ ...current, open: false }));
  }, []);

  const askConfirm = useCallback((payload: ConfirmAskPayload) => {
    // Üst üste ask gelirse önceki promise'i false ile kapat.
    confirmResolver.current?.(false);
    setConfirm({ ...payload, open: true });
    return new Promise<boolean>((resolve) => {
      confirmResolver.current = resolve;
    });
  }, []);

  const closeConfirm = useCallback(() => {
    settleConfirm(false);
  }, [settleConfirm]);

  const setIsPopupOpen = useCallback<Dispatch<SetStateAction<boolean>>>((next) => {
    setConfirm((current) => ({
      ...current,
      open: typeof next === "function" ? next(current.open) : next,
    }));
  }, []);

  // variables
  const value = useMemo(
    () => ({
      dispatchToast,
      defaultDuration: duration,
      askConfirm,
      closeConfirm,
      setIsPopupOpen,
    }),
    [askConfirm, closeConfirm, dispatchToast, duration, setIsPopupOpen],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}

      <Notification direction={direction} duration={duration} command={command} />
      <PopupConfirm
        title={confirm.title}
        message={confirm.message}
        status={confirm.status}
        isOpen={confirm.open}
        buttons={confirm.buttons}
        onConfirm={settleConfirm}
      />
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider };
