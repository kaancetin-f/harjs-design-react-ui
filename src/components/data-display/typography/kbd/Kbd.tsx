"use client";

import React from "react";
import IProps from "./IProps";
import { isTokenColor } from "../tokenColor";

const Kbd: React.FC<IProps> = ({
  children,
  color = "gray",
  size = "md",
  fontWeight,
  className,
  style,
  ...attributes
}) => {
  // variables
  const token = isTokenColor(color);

  // refs
  const _kbdClassName: string[] = [
    "har-typography-kbd",
    token ? color : undefined,
    `size-${size}`,
    fontWeight ? `font-weight-${fontWeight}` : undefined,
    className,
  ].filter(Boolean) as string[];

  return (
    <kbd {...attributes} className={_kbdClassName.map((c) => c).join(" ")} style={token ? style : { borderColor: color, ...style }}>
      {children}
    </kbd>
  );
};

Kbd.displayName = "Kbd";
export default Kbd;
