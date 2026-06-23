"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import IProps from "./IProps";
import "../../../assets/css/components/feedback/popup-confirm/styles.css";
import Button from "../../form/button";
import ReactDOM from "react-dom";
import { NotificationContext } from "../../../libs/core/application/contexts/Notification";
import { Color } from "../../../libs/infrastructure/types";
import { ARIcon } from "../../icons";
import Row from "../../data-display/grid-system/row/Row";
import Column from "../../data-display/grid-system/column/Column";

const PopupConfirm = ({ title, message, status, isOpen, buttons, onConfirm }: IProps) => {
  // contexts
  const { setIsPopupOpen } = useContext(NotificationContext);

  // refs
  const _arNotificationPopupWrapper = useRef<HTMLDivElement>(null);
  const _arNotificationPopup = useRef<HTMLDivElement>(null);

  // states
  const _notificaitonPopupWrapperClassName: string[] = ["ar-notification-popup-wrapper"];
  const [className, setClassName] = useState<string[]>(["ar-notification-popup", ""]);

  // methods
  const buttonColor = (): Color => {
    switch (status) {
      case "success":
      case "save":
        return "green";
      case "warning":
        return "orange";
      case "information":
        return "cyan";
      case "error":
      case "delete":
        return "red";

      default:
        return "light";
    }
  };

  const buttonIcons = () => {
    switch (status) {
      case "success":
        return <ARIcon icon="CheckAll" fill="var(--success)" size={24} />;
      case "save":
        return <ARIcon icon="Floppy-Fill" fill="var(--success)" size={24} />;
      case "warning":
        return <ARIcon icon="ExclamationDiamond-Fill" fill="var(--warning)" size={24} />;
      case "information":
        return <ARIcon icon="Information-Circle-Fill" fill="var(--information)" size={24} />;
      case "error":
        return <ARIcon icon="XCircle-Fill" fill="var(--danger)" size={24} />;
      case "delete":
        return <ARIcon icon="Trash-Fill" fill="var(--danger)" size={24} />;

      default:
        return "light";
    }
  };

  // useEffects
  useEffect(() => {
    setClassName((prev) => {
      const updated = [...prev.slice(0, -1), isOpen ? "open" : ""];

      return updated;
    });

    if (isOpen) document.body.style.overflow = "hidden";

    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [isOpen]);

  return (
    isOpen &&
    ReactDOM.createPortal(
      <div ref={_arNotificationPopupWrapper} className={_notificaitonPopupWrapperClassName.map((c) => c).join(" ")}>
        <div
          className="ar-notification-popup-bg"
          onMouseDown={(event) => {
            event.stopPropagation();

            const target = event.target as HTMLElement;
            if (_arNotificationPopup.current && !_arNotificationPopup.current.contains(target)) {
              setClassName((prev) => {
                const updated = [...prev.slice(0, -1), isOpen ? "open" : ""];

                return updated;
              });
            }
          }}
        ></div>

        <div ref={_arNotificationPopup} className={className.map((c) => c).join(" ")}>
          <div className={`icon ${status}`}>{buttonIcons()}</div>

          <div className="content">
            <span className={`title ${status}`}>{title}</span>
            <span className="message">{message}</span>
          </div>

          <div className="footer">
            <Row>
              <Column size={buttons?.cancel ? 6 : 12}>
                <Button
                  color={buttonColor()}
                  onClick={(event) => {
                    buttons?.okay?.onClick?.(event);

                    onConfirm?.(true);
                    setIsPopupOpen?.((prev) => !prev);
                  }}
                  fullWidth
                >
                  {buttons?.okay?.children ?? "Tamam"}
                </Button>
              </Column>

              {buttons?.cancel && (
                <Column size={6}>
                  <Button
                    variant="outlined"
                    color={buttons.cancel.color ?? "gray"}
                    onClick={(event) => {
                      buttons?.cancel?.onClick?.(event);

                      onConfirm?.(false);
                      setIsPopupOpen?.((prev) => !prev);
                    }}
                    fullWidth
                  >
                    {buttons.cancel.children ?? "Vazgeç"}
                  </Button>
                </Column>
              )}
            </Row>
          </div>
        </div>
      </div>,
      document.body,
    )
  );
};

export default PopupConfirm;
