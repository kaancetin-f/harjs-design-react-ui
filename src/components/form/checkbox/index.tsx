"use client";

import Utils from "../../../libs/infrastructure/shared/Utils";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import "../../../assets/css/components/form/checkbox/styles.css";
import Props from "./Props";

const Checkbox = forwardRef<HTMLInputElement, Props>(
  (
    { label, variant, color = "blue", border = { radius: "4" }, size = "sm", upperCase, validation, ...attributes },
    ref,
  ) => {
    // refs
    const _checkbox = useRef<HTMLInputElement>(null);
    const _checkboxClassName: string[] = ["har-checkbox"];
    const _innerRef = useRef<HTMLInputElement>(null);

    _checkboxClassName.push(
      ...Utils.GetClassName(
        variant ?? "outlined",
        undefined,
        validation?.text ? "red" : (color ?? "blue"),
        border ?? { radius: "4" },
        undefined,
        undefined,
        attributes.className,
      ),
    );
    if (size) _checkboxClassName.push(size);
    if (attributes.disabled) _checkboxClassName.push("disabled");

    // hooks
    // Dışarıdan gelen ref'i _innerRef'e bağla.
    useImperativeHandle(ref, () => _innerRef.current as HTMLInputElement);

    return (
      <div className="har-checkbox-wrapper">
        <label>
          <input
            ref={ref}
            type={"checkbox"}
            {...attributes}
            size={0}
            onChange={(event) => {
              // (() => {
              //   const _current = _checkbox.current;
              //   if (!_current) return;
              // })();

              (() => attributes.onChange && attributes.onChange(event))();
            }}
          />

          <span>
            <span ref={_checkbox} className={_checkboxClassName.map((c) => c).join(" ")}></span>

            {label && <span className="label">{upperCase ? label.toUpperCase() : label}</span>}
          </span>
        </label>

        {validation?.text && <div className="har-validation-text">{validation.text}</div>}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
