"use client";

import React from "react";
import IProps from "./IProps";

const Column: React.FC<IProps> = ({ children, size, align }) => {
  // refs
  let _className: string[] = [];

  // className
  if (typeof size === "object") {
    Object.entries(size).map(([key, value]) => _className.push(`col-${key}-${value}`));
  } else if (typeof size === "number") {
    ["xl", "lg", "md", "sm", "xs"].map((col) => _className.push(`col-${col}-${size}`));
  } else if (typeof size === "undefined") {
    _className.push("col");
  }

  if (align) _className.push(align);

  return <div className={_className.map((c) => c).join(" ")}>{children}</div>;
};

Column.displayName = "Column";
export default Column;
