"use client";

import React, { useRef } from "react";
import "../../../assets/css/components/form/button/styles.css";
import IProps from "./IProps";
import Utils from "../../../libs/infrastructure/shared/Utils";

const Button: React.FC<IProps> = ({
  children,
  variant = "filled",
  shape,
  color = "gray",
  border = { radius: "4" },
  size = "lg",
  position,
  align,
  fullWidth,
  icon,
  upperCase,
  loading,
  spinner,
  ...attributes
}) => {
  // refs
  const _button = useRef<HTMLButtonElement>(null);
  const _buttonClassName: string[] = ["har-button"];

  // variables
  _buttonClassName.push(
    ...Utils.GetClassName(
      attributes.disabled ? "surface-borderless" : variant,
      undefined,
      attributes.disabled ? "gray" : color,
      border,
      size,
      loading ? undefined : icon,
      attributes.className,
    ),
  );

  if (!children) _buttonClassName.push("no-content");
  if (fullWidth) _buttonClassName.push("full-width");
  if (align) _buttonClassName.push(`align-${align}`);
  if (shape) _buttonClassName.push(`shape ${shape}`);
  if (position) {
    _buttonClassName.push(position.type);
    _buttonClassName.push(position.inset.map((_inset) => _inset).join(" "));
  }
  if (attributes.disabled) _buttonClassName.push("disabled");
  if (loading) _buttonClassName.push("loading", "icon", "icon-start");

  const graphic = loading ? (
    <span className="har-button-spinner">
      {spinner ?? <span className="har-button-spinner-track"></span>}
    </span>
  ) : (
    icon?.element
  );
  const label =
    !shape && (
      <span>{typeof children === "string" && upperCase ? children.toLocaleUpperCase() : children}</span>
    );
  const iconAtEnd = !loading && icon?.position === "end";

  return (
    <button
      ref={_button}
      {...attributes}
      type={attributes.type ?? "button"}
      className={_buttonClassName.map((c) => c).join(" ")}
      disabled={attributes.disabled || loading}
      onClick={(event) => {
        // Disabled veya loading gelmesi durumunda işlem yapmasına izin verme...
        if (attributes.disabled || loading) return;

        (() => {
          const _current = _button.current;
          const addClass = "active";

          if (_current && !_current.classList.contains(addClass)) {
            // Sınıf ekleniyor...
            _current.classList.add(addClass);

            // Sınıf 500 milisaniye sonra kaldırlacak.
            setTimeout(() => _current.classList.remove(addClass), 750);
          }
        })();

        (() => attributes.onClick && attributes.onClick(event))();
      }}
    >
      <span className="text">
        {iconAtEnd ? (
          <>
            {label}
            {graphic}
          </>
        ) : (
          <>
            {graphic}
            {label}
          </>
        )}
      </span>
    </button>
  );
};

Button.displayName = "Button";

export default Button;
