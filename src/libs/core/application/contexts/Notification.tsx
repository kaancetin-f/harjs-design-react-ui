"use client";

import React, { ReactNode, createContext, useState } from "react";
import Notification from "../../../../components/feedback/notification";
import PopupConfirm from "../../../../components/feedback/popup-confirm";
import IButtonProps from "../../../../components/form/button/IProps";

export type Status = "success" | "warning" | "information" | "error";
export type Direction = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type Props = {
  children: ReactNode;
  direction: Direction;
};

export type PopupButtonConfig = {
  okay?: IButtonProps;
  cancel?: IButtonProps;
};

type NotificationContextProps = {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setStatus: React.Dispatch<React.SetStateAction<Status | number>>;
  setPopupStatus: React.Dispatch<React.SetStateAction<(Status | "save" | "delete") | number>>;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPopupButtons: React.Dispatch<React.SetStateAction<PopupButtonConfig | null>>;
  setOnConfirm: React.Dispatch<React.SetStateAction<((confirm: boolean) => void) | null>>;
};

const NotificationContext = createContext<Partial<NotificationContextProps>>({});

const NotificationProvider = ({ children, direction }: Props) => {
  const [title, setTitle] = useState<string>("Example");
  const [message, setMessage] = useState<string>(
    "Lorem Ipsum, dizgi ve baskı endüstrisinde kullanılan mıgır metinlerdir.",
  );
  const [status, setStatus] = useState<Status | number>("success");
  const [popupStatus, setPopupStatus] = useState<(Status | "save" | "delete") | number>("success");
  const [trigger, setTrigger] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [popupButtons, setPopupButtons] = useState<PopupButtonConfig | null>(null);
  const [onConfirm, setOnConfirm] = useState<((confirm: boolean) => void) | null>(null);

  return (
    <NotificationContext.Provider
      value={{
        setTitle,
        setMessage,
        setStatus,
        setPopupStatus,
        setTrigger,
        setIsPopupOpen,
        setPopupButtons,
        setOnConfirm,
      }}
    >
      {children}

      <Notification title={title} message={message} status={status} direction={direction} trigger={trigger} />
      <PopupConfirm
        title={title}
        message={message}
        status={popupStatus}
        isOpen={isPopupOpen}
        buttons={popupButtons}
        onConfirm={onConfirm}
      />
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider };
