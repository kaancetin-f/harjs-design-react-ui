"use client";

import React from "react";
import { Sizes } from "../../../../libs/infrastructure/types";
import IProps from "./IProps";
import { isTokenColor } from "../tokenColor";

const TITLE_TAG: Record<Sizes, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  xs: "h6",
  sm: "h5",
  md: "h4",
  lg: "h3",
  xl: "h2",
  "2xl": "h1",
};

const Title: React.FC<IProps> = ({
  children,
  size = "md",
  align = "left",
  upperCase = false,
  fontWeight,
  color,
  className,
  style,
  ...attributes
}) => {
  // variables
  const Tag = TITLE_TAG[size];
  const token = color != null && isTokenColor(color);

  // refs
  const _titleClassName: string[] = [
    "har-typography-title",
    align,
    `size-${size}`,
    fontWeight ? `font-weight-${fontWeight}` : undefined,
    token ? color : undefined,
    className,
  ].filter(Boolean) as string[];

  return (
    <Tag {...attributes} className={_titleClassName.map((c) => c).join(" ")} style={color && !token ? { color, ...style } : style}>
      {typeof children === "string" && upperCase ? children.toLocaleUpperCase() : children}
    </Tag>
  );
};

Title.displayName = "Title";
export default Title;
