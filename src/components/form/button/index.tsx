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
  size = "md",
  position,
  fullWidth,
  icon,
  upperCase,
  ...attributes
}) => {
  // refs
  const _button = useRef<HTMLButtonElement>(null);
  const _buttonClassName: string[] = ["har-button"];

  _buttonClassName.push(
    ...Utils.GetClassName(
      attributes.disabled ? "surface-borderless" : variant,
      undefined,
      attributes.disabled ? "gray" : color,
      border,
      size,
      icon,
      attributes.className,
    ),
  );

  if (!children) _buttonClassName.push("no-content");
  if (fullWidth) _buttonClassName.push("full-width");
  if (shape) _buttonClassName.push(`shape ${shape}`);
  if (position) {
    _buttonClassName.push(position.type);
    _buttonClassName.push(position.inset.map((_inset) => _inset).join(" "));
  }
  if (attributes.disabled) _buttonClassName.push("disabled");

  return (
    <button
      ref={_button}
      {...attributes}
      type={attributes.type ?? "button"}
      className={_buttonClassName.map((c) => c).join(" ")}
      onClick={(event) => {
        // Disabled gelmesi durumunda işlem yapmasına izin verme...
        if (attributes.disabled) return;

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
        {icon?.element}
        {!shape && <span>{typeof children === "string" && upperCase ? children.toLocaleUpperCase() : children}</span>}
      </span>
    </button>
  );
};

Button.displayName = "Button";

export default Button;
