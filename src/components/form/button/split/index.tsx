"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import "../../../../assets/css/components/form/button-action/styles.css";
import "../../../../assets/css/components/form/button-split/styles.css";
import IProps from "./IProps";
import IButtonProps from "../IProps";
import ReactDOM from "react-dom";
import Button from "../Button";
import { Icon } from "../../../icons";

const ButtonSplit: React.FC<IProps> = ({
  children,
  variant,
  color,
  size,
  border,
  icon,
  upperCase,
  loading,
  spinner,
  disabled,
  fullWidth,
  align,
  className,
  onClick,
  ...attributes
}) => {
  // refs
  const _wrapper = useRef<HTMLDivElement>(null);
  const _list = useRef<HTMLDivElement>(null);
  const _splitClassName: string[] = ["har-button-split"];
  const _label: React.ReactNode[] = [];
  const _menuItems: React.ReactElement<IButtonProps>[] = [];

  if (fullWidth) _splitClassName.push("full-width");
  if (className) _splitClassName.push(className);

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && (child.type as { displayName?: string }).displayName === "Button") {
      _menuItems.push(child as React.ReactElement<IButtonProps>);
    } else if (child != null && child !== false) {
      _label.push(child);
    }
  });

  // states
  const [open, setOpen] = useState<boolean>(false);

  // methods
  const handleClickOutSide = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (
      _wrapper.current &&
      !_wrapper.current.contains(target) &&
      _list.current &&
      !_list.current.contains(target)
    )
      setOpen(false);
  };

  const handleKeys = (event: KeyboardEvent) => {
    const key = event.key;

    if (key === "Escape") setOpen(false);
  };

  const handlePosition = () => {
    if (_wrapper.current && _list.current) {
      const elementRect = _wrapper.current.getBoundingClientRect();
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

        // 2. YATAY HİZALAMA (LEFT) HESAPLAMA
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
    return React.Children.map(_menuItems, (child) => {
      if (React.isValidElement<IButtonProps>(child)) {
        return React.cloneElement(child, {
          color,
          size,
          upperCase,
          ...child.props,
          variant: "borderless",
          onClick: (event) => {
            setOpen(false);

            (() => child.props.onClick && child.props.onClick(event))();
          },
        });
      }

      return child;
    });
  };

  // useEffects
  useLayoutEffect(() => {
    if (!open) return;

    handlePosition();

    window.addEventListener("resize", handleResizeEvent);

    document.addEventListener("click", handleClickOutSide);
    document.addEventListener("keydown", handleKeys);

    return () => {
      window.removeEventListener("resize", handleResizeEvent);

      document.removeEventListener("click", handleClickOutSide);
      document.removeEventListener("keydown", handleKeys);
    };
  }, [open]);

  return (
    <div ref={_wrapper} className={_splitClassName.map((c) => c).join(" ")}>
      <Button
        {...attributes}
        className="split-main"
        variant={variant}
        color={color}
        size={size}
        border={border}
        icon={icon}
        upperCase={upperCase}
        loading={loading}
        spinner={spinner}
        disabled={disabled}
        align={align}
        onClick={(event) => {
          (() => setOpen(false))();

          (() => onClick && onClick(event))();
        }}
      >
        {_label}
      </Button>

      <Button
        className={`split-trigger${open ? " open" : ""}`}
        variant={variant}
        color={color}
        size={size}
        border={border}
        disabled={disabled || loading}
        shape="square"
        icon={{
          element: (
            <Icon className="chevron" icon="ChevronDown" size={12} />
          ),
        }}
        onClick={() => setOpen((prev) => !prev)}
      />

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

ButtonSplit.displayName = "Button.Split";

export default ButtonSplit;
