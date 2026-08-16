"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import "../../../../assets/css/components/form/button-action/styles.css";
import IProps from "./IProps";
import IButtonProps from "../IProps";
import ReactDOM from "react-dom";
import Button from "../Button";

const ButtonAction: React.FC<IProps> = ({ children, title, variant, _color, _icon, ...actionProps }) => {
  // refs
  const _wrapper = useRef<HTMLDivElement>(null);
  const _button = useRef<HTMLDivElement>(null);
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
        const gap = 6;

        // 1. YÜKSEKLİK (TOP) HESAPLAMA
        if (elementRect.top > screenCenterY) {
          _list.current.style.top = `${elementRect.top - popoverRect.height - gap}px`;
        } else {
          _list.current.style.top = `${elementRect.bottom + gap}px`;
        }

        // 2. YATAY HİZALAMA (LEFT) HESAPLAMA (Görsellerdeki sorunu çözen kısım)
        if (elementRect.left > screenCenterX) {
          _list.current.style.left = `${elementRect.right - popoverRect.width}px`;
        } else {
          _list.current.style.left = `${elementRect.left}px`;
        }

        _list.current.style.visibility = "visible";
        _list.current.style.opacity = "1";
      }
    }
  };

  const handleResizeEvent = () => setOpen(false);

  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement<IButtonProps>(child)) {
        return React.cloneElement(child, {
          ...actionProps,
          ...child.props,
          variant: "borderless",
        });
      }

      return child;
    });
  };

  // useEffects
  useLayoutEffect(() => {
    if (!open) return;

    handlePosition();

    // window.addEventListener("blur", () => setOpen(false));
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
    <div ref={_wrapper} className="har-button-action">
      <div ref={_button}>
        <Button
          variant={variant}
          color={_color}
          icon={_icon ? { ..._icon } : { element: <span className="dotted"></span> }}
          {...(!title && { shape: "square" })}
          onClick={() => setOpen((prev) => !prev)}
        >
          {title && title}
        </Button>
      </div>

      {open &&
        ReactDOM.createPortal(
          <div ref={_list} className="har-action-buttons">
            {renderChildren()}
          </div>,
          document.body,
        )}
    </div>
  );
};

ButtonAction.displayName = "Button.Action";

export default ButtonAction;
