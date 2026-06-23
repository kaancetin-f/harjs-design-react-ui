"use client";

import React, { useEffect, useRef } from "react";
import IProps from "./IProps";
import "../../../assets/css/components/feedback/modal/styles.css";
import Typography from "../../data-display/typography";
import Popover from "../popover";

const { Title } = Typography;

const Modal: React.FC<IProps> = ({
  children,
  open,
  closePopover,
  title,
  size = "normal",
  footer,
  disableCloseOnBackdrop,
  disableCloseOnEsc,
  ...attributes
}) => {
  // refs
  const _arModal = useRef<HTMLDivElement>(null);
  const _modalWrapperClassName: string[] = ["ar-modal-wrapper"];
  const _modalClassName: string[] = ["ar-modal", size];

  if (Object.keys(open).length > 0 && open.get) _modalWrapperClassName.push("opened");
  else _modalWrapperClassName.push("closed");

  // methods
  const handleKeys = (event: KeyboardEvent) => {
    if (disableCloseOnEsc) return;

    const key = event.key;
    const isArSelectOptions = document.getElementsByClassName("ar-select-options").length === 0;
    const isArCalendar = document.getElementsByClassName("ar-date-calendar").length === 0;
    const isArPopover = document.getElementsByClassName("ar-popover").length === 0;

    if (key === "Escape" && isArCalendar && isArSelectOptions && isArPopover) {
      event.stopPropagation();
      open.set(false);
    }
  };

  const handlePosition = () => {
    if (_arModal.current) {
      const arModal = _arModal.current;
      const content = arModal.querySelector("div.content") as HTMLDivElement;

      const rect = arModal.getBoundingClientRect();
      const screenCenterX = window.innerWidth / 2;
      // const screenCenterY = window.innerHeight / 2;
      const sx = window.scrollX || document.documentElement.scrollLeft;
      // const sy = window.scrollY || document.documentElement.scrollTop;

      if (window.innerHeight > 1024) {
        // arModal.style.top = `${sy + 100}px`;
        arModal.style.top = "100px";
        content.removeAttribute("style");
      } else if (window.innerHeight > 575 && window.innerHeight < 1024) {
        // arModal.style.top = `${screenCenterY - rect.height / 2 + sy}px`;
        arModal.style.top = "100px";
        content.removeAttribute("style");
      } else if (window.innerHeight < 575) {
        // arModal.style.top = `${sy + 15}px`;
        arModal.style.top = "15px";
        content.style.maxHeight = `calc(100vh - ${footer ? "2.5px" : "-30.5px"} - 3.5rem - 4rem - ${
          footer ? "2rem" : "0rem"
        })`;
      }

      arModal.style.left = `${screenCenterX - rect.width / 2 + sx}px`;
    }
  };

  // useEffects
  useEffect(() => {
    handlePosition();

    if (open.get) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeys);
      window.addEventListener("resize", handlePosition);
    }

    return () => {
      document.body.style.removeProperty("overflow");
      document.removeEventListener("keydown", handleKeys);
      window.removeEventListener("resize", handlePosition);
    };
  }, [open.get]);

  useEffect(() => {
    if (attributes.className) _modalClassName.push(attributes.className);
  }, [attributes.className]);

  return (
    <div className={_modalWrapperClassName.map((c) => c).join(" ")}>
      <div
        className="ar-modal-bg"
        onMouseDown={(event) => {
          if (disableCloseOnBackdrop) return;

          event.stopPropagation();

          const target = event.target as HTMLElement;
          if (_arModal.current && !_arModal.current.contains(target)) open.set(false);
        }}
      ></div>

      <div ref={_arModal} {...attributes} className={_modalClassName.map((c) => c).join(" ")} role="dialog">
        {title && (
          <div className="header">
            <Title Level="h3">{title}</Title>

            {closePopover ? (
              <Popover {...closePopover}>
                <div className="close"></div>
              </Popover>
            ) : (
              <div className="close" onClick={() => open.set((prev) => !prev)}></div>
            )}
          </div>
        )}

        <div className="content">{children}</div>

        {footer && <div className="footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
