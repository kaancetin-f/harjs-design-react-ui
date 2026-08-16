"use client";

import React from "react";
import IProps from "./IProps";
import { isTokenColor } from "../tokenColor";

const Paragraph: React.FC<IProps> = ({
  children,
  color,
  align = "left",
  size = "md",
  upperCase = false,
  fontWeight,
  className,
  style,
  ...attributes
}) => {
  // variables
  const token = color != null && isTokenColor(color);

  // refs
  const _paragraphClassName: string[] = [
    "har-typography-paragraph",
    align,
    token ? color : undefined,
    `size-${size}`,
    fontWeight ? `font-weight-${fontWeight}` : undefined,
    className,
  ].filter(Boolean) as string[];

  return (
    <p {...attributes} className={_paragraphClassName.map((c) => c).join(" ")} style={color && !token ? { color, ...style } : style}>
      {typeof children === "string" && upperCase ? children.toLocaleUpperCase() : children}
    </p>
  );
};

Paragraph.displayName = "Paragraph";
export default Paragraph;
