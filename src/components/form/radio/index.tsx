"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import IProps from "./IProps";
import Checkbox from "../checkbox";

const Radio = forwardRef<HTMLInputElement, IProps>(({ ...props }, ref) => {
  const { trace, pastTrace } = props;

  // refs
  const _innerRef = useRef<HTMLInputElement>(null);
  const _traceClassName: string[] = ["trace", "filled"];
  const _pastTraceClassName: string[] = ["past-trace", "filled"];

  // hooks
  // Dışarıdan gelen ref'i _innerRef'e bağla.
  useImperativeHandle(ref, () => _innerRef.current as HTMLInputElement);

  if (trace && Object.keys(trace).length > 0) _traceClassName.push(trace.color);
  if (pastTrace && Object.keys(pastTrace).length > 0) _pastTraceClassName.push(pastTrace.color);

  return (
    <div className="har-radio-wrapper">
      <Checkbox ref={_innerRef} {...props} type="radio" border={{ radius: "full" }} />

      <div>
        {trace && Object.keys(trace).length > 0 && <span className={_traceClassName.map((c) => c).join(" ")}></span>}
        {pastTrace && Object.keys(pastTrace).length > 0 && (
          <span className={_pastTraceClassName.map((c) => c).join(" ")}></span>
        )}
      </div>
    </div>
  );
});

Radio.displayName = "Radio";

export default Radio;
