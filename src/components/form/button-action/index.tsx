"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "../../../assets/css/components/form/button-action/styles.css";
import IProps from "./IProps";
import Button from "../button";
import ReactDOM from "react-dom";
import Alert from "../../feedback/alert";

const ButtonAction: React.FC<IProps> = ({ children, title, variant, _color, _icon, ...actionProps }) => {
  // refs
  const _wrapper = useRef<HTMLDivElement>(null);
  const _button = useRef<HTMLDivElement>(null);
  const _list = useRef<HTMLDivElement>(null);

  // states
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    if (error) return <Alert status="danger" message={error} />;

    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement<any>(child, {
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

  useEffect(() => {
    try {
      React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child) || child.type !== Button) {
          throw new Error("It can only have Button elements as children.");
        }
      });

      // Hata yoksa, error'u temizle.
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        // Hata varsa error state'e yaz.
        setError(err.message);
        console.error(err.message);
      }
    }
  }, [children]);

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

ButtonAction.displayName = "ButtonAction";

export default ButtonAction;
