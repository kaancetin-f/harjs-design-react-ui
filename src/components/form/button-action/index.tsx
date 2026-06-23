"use client";

import React, { useEffect, useRef, useState } from "react";
import "../../../assets/css/components/form/button-action/styles.css";
import IProps from "./IProps";
import Button from "../button";
import ReactDOM from "react-dom";

const ButtonAction: React.FC<IProps> = ({ buttons }) => {
  // refs
  const _wrapper = useRef<HTMLDivElement>(null);
  const _button = useRef<HTMLSpanElement>(null);
  const _list = useRef<HTMLDivElement>(null);

  // states
  const [open, setOpen] = useState<boolean>(false);

  // methods
  const handleClickOutSide = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (_wrapper.current && !_wrapper.current.contains(target)) setOpen(false);
  };

  const handleKeys = (event: KeyboardEvent) => {
    const key = event.key;

    if (key === "Escape") setOpen(false);
  };

  const handlePosition = () => {
    if (_wrapper.current && _button.current && _list.current) {
      const elementRect = _button.current.getBoundingClientRect();
      const popoverRect = _list.current.getBoundingClientRect();

      if (elementRect) {
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;
        const sx = window.scrollX || document.documentElement.scrollLeft;
        const sy = window.scrollY || document.documentElement.scrollTop;

        _list.current.style.visibility = "visible";
        _list.current.style.opacity = "1";
        _list.current.style.top = `${
          (elementRect.top > screenCenterY
            ? elementRect.top - popoverRect.height + elementRect.height
            : elementRect.top) + sy
        }px`;
        _list.current.style.left = `${
          (elementRect.left > screenCenterX
            ? elementRect.right - (elementRect.width + 7.5) - popoverRect.width
            : elementRect.left + elementRect.width + 7.5) + sx
        }px`;
      }
    }
  };

  const handleResizeEvent = () => setOpen(false);

  // useEffects
  useEffect(() => {
    if (!open) return;

    setTimeout(() => handlePosition(), 0);

    window.addEventListener("blur", () => setOpen(false));
    window.addEventListener("resize", handleResizeEvent);

    document.addEventListener("click", handleClickOutSide);
    document.addEventListener("keydown", handleKeys);

    return () => {
      window.removeEventListener("blur", () => setOpen(false));
      window.removeEventListener("resize", handleResizeEvent);

      document.removeEventListener("click", handleClickOutSide);
      document.removeEventListener("keydown", handleKeys);
    };
  }, [open]);

  return (
    <div ref={_wrapper} className="ar-button-action">
      <span ref={_button}>
        <Button
          variant="borderless"
          color="light"
          icon={{ element: <span className="dotted"></span> }}
          onClick={() => setOpen((prev) => !prev)}
        />
      </span>

      {open &&
        ReactDOM.createPortal(
          <span ref={_list} className="ar-action-buttons">
            {buttons.map((button, index) => (
              <Button
                key={index}
                style={{ display: "flex", justifyContent: "flex-start" }}
                variant="borderless"
                color={button.color ?? "blue"}
                size="small"
                icon={button.icon}
                onClick={button.onClick}
              >
                {button.text}
              </Button>
            ))}
          </span>,
          document.body
        )}
    </div>
  );
};

ButtonAction.displayName = "ButtonAction";

export default ButtonAction;
