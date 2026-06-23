"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "../../../assets/css/components/form/switch/styles.css";
import IProps from "./IProps";
import Utils from "../../../libs/infrastructure/shared/Utils";

const Switch = forwardRef(
  ({ label, color, border = { radius: "pill" }, ...attributes }: IProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    // refs
    let _switchInput = useRef<HTMLInputElement>(null);
    let _switch = useRef<HTMLInputElement>(null);
    const _inputClassName: string[] = [];
    const _switchClassName: string[] = ["ar-switch"];

    // states
    const [checked, setChecked] = useState<boolean>(attributes.checked ?? false);

    _inputClassName.push(attributes.checked ? "checked" : "unchecked");
    _switchClassName.push(
      ...Utils.GetClassName(
        undefined,
        undefined,
        attributes.checked ? color : "light",
        border,
        undefined,
        undefined,
        attributes.className
      )
    );

    // hooks
    // Dışarıdan gelen ref'i _innerRef'e bağla.
    useImperativeHandle(ref, () => _switchInput.current as HTMLInputElement);

    // useEffects
    useEffect(() => {
      setChecked(attributes.checked ?? false);
    }, [attributes.checked]);

    return (
      <div className="ar-switch-wrapper">
        <label>
          <input
            ref={_switchInput}
            type={"checkbox"}
            {...attributes}
            className={_inputClassName.map((c) => c).join(" ")}
            checked={checked}
            size={0}
            onChange={(event) => {
              event.stopPropagation();

              (() => {
                setChecked(event.target.checked);
              })();

              (() => attributes.onChange && attributes.onChange(event))();
            }}
          />

          <span ref={_switch} className={_switchClassName.map((c) => c).join(" ")}>
            <span className="handle border-radius-pill"></span>
          </span>

          {label && <span className="label">{label}</span>}
        </label>
      </div>
    );
  }
);

Switch.displayName = "Switch";
export default Switch;
