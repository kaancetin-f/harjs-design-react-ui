"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import IProps from "./IProps";
import "../../../assets/css/components/form/radio/radio.css";
import Utils from "../../../libs/infrastructure/shared/Utils";

const Radio = forwardRef<HTMLInputElement, IProps>(
  (
    {
      label,
      size = "normal",
      color = "blue",
      border = { radius: "pill" },
      trace,
      pastTrace,
      upperCase,
      validation,
      ...attributes
    },
    ref
  ) => {
    // refs
    const _innerRef = useRef<HTMLInputElement>(null);
    const _checkbox = useRef<HTMLInputElement>(null);
    const _checkboxClassName: string[] = ["ar-radio"];
    const _traceClassName: string[] = ["trace", "filled"];
    const _pastTraceClassName: string[] = ["past-trace", "filled"];

    // hooks
    // Dışarıdan gelen ref'i _innerRef'e bağla.
    useImperativeHandle(ref, () => _innerRef.current as HTMLInputElement);

    _checkboxClassName.push(
      ...Utils.GetClassName(
        "filled",
        undefined,
        attributes.checked ? color : "light",
        border,
        size,
        undefined,
        attributes.className
      )
    );

    if (trace && Object.keys(trace).length > 0) _traceClassName.push(trace.color);
    if (pastTrace && Object.keys(pastTrace).length > 0) _pastTraceClassName.push(pastTrace.color);

    return (
      <div className="ar-radio-wrapper">
        <label>
          <input
            ref={_innerRef}
            type={"radio"}
            {...attributes}
            size={0}
            onChange={(event) => {
              (() => {
                const _current = _checkbox.current;
                if (!_current) return;
              })();

              (() => attributes.onChange && attributes.onChange(event))();
            }}
          />

          <span>
            <span ref={_checkbox} className={_checkboxClassName.map((c) => c).join(" ")}></span>
            {trace && Object.keys(trace).length > 0 && (
              <span className={_traceClassName.map((c) => c).join(" ")}></span>
            )}
            {pastTrace && Object.keys(pastTrace).length > 0 && (
              <span className={_pastTraceClassName.map((c) => c).join(" ")}></span>
            )}
            {label && <span className="label">{upperCase ? label.toUpperCase() : label}</span>}
          </span>

          {validation?.text && <span className="validation">{validation.text}</span>}
        </label>
      </div>
    );
  }
);

Radio.displayName = "Radio";

export default Radio;
