"use client";

import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import "../../../assets/css/components/form/switch/styles.css";
import IProps from "./IProps";
import Utils from "../../../libs/infrastructure/shared/Utils";

const Switch = forwardRef<HTMLInputElement, IProps>(
  (
    {
      label,
      variant = "filled",
      color = "blue",
      border = { radius: "full" },
      size,
      upperCase,
      validation,
      icon,
      ...attributes
    },
    ref,
  ) => {
    // refs
    const _switchInput = useRef<HTMLInputElement>(null);
    const _switch = useRef<HTMLSpanElement>(null);
    const _inputClassName: string[] = [];
    const _switchClassName: string[] = ["har-switch"];

    // states
    const [internalChecked, setInternalChecked] = useState<boolean>(
      attributes.checked ?? attributes.defaultChecked ?? false,
    );

    // variables
    // checked prop geldiyse kontrollü çalış.
    const isControlled = attributes.checked !== undefined;
    const isChecked = isControlled ? (attributes.checked ?? false) : internalChecked;

    _inputClassName.push(isChecked ? "checked" : "unchecked");
    _switchClassName.push(
      ...Utils.GetClassName(
        variant,
        undefined,
        validation?.text ? "red" : attributes.disabled ? "gray" : isChecked ? color : "gray",
        border,
        size,
        undefined,
        attributes.className,
      ),
    );
    if (attributes.disabled) _switchClassName.push("disabled");
    if (icon?.checked || icon?.unchecked) _switchClassName.push("has-icon");

    // hooks
    useImperativeHandle(ref, () => _switchInput.current as HTMLInputElement);

    return (
      <div className="har-switch-wrapper">
        <label>
          <input
            ref={_switchInput}
            type={"checkbox"}
            {...attributes}
            className={_inputClassName.map((c) => c).join(" ")}
            checked={isChecked}
            size={0}
            onChange={(event) => {
              event.stopPropagation();

              if (!isControlled) setInternalChecked(event.target.checked);

              attributes.onChange?.(event);
            }}
          />

          <span ref={_switch} className={_switchClassName.map((c) => c).join(" ")}>
            {icon?.checked && (
              <span className="icon checked" aria-hidden>
                {icon.checked}
              </span>
            )}
            <span className={`handle ${border.radius ? `radius-${border.radius}` : "radius-full"}`}></span>
            {icon?.unchecked && (
              <span className="icon unchecked" aria-hidden>
                {icon.unchecked}
              </span>
            )}
          </span>

          {label && <span className="label">{upperCase ? label.toUpperCase() : label}</span>}
        </label>

        {validation?.text && <div className="har-validation-text">{validation.text}</div>}
      </div>
    );
  },
);

Switch.displayName = "Switch";
export default Switch;
