"use client";

import React from "react";
import IProps from "./IProps";
import { isTokenColor } from "../tokenColor";

const Blockquote: React.FC<IProps> = ({
  children,
  color = "gray",
  align = "left",
  size = "md",
  fontWeight,
  cite,
  className,
  style,
  ...attributes
}) => {
  // variables
  const token = isTokenColor(color);

  // refs
  const _blockquoteClassName: string[] = [
    "har-typography-blockquote",
    align,
    token ? color : undefined,
    `size-${size}`,
    fontWeight ? `font-weight-${fontWeight}` : undefined,
    className,
  ].filter(Boolean) as string[];

  return (
    <blockquote
      {...attributes}
      className={_blockquoteClassName.map((c) => c).join(" ")}
      style={token ? style : { borderLeftColor: color, ...style }}
    >
      {children}
      {cite ? <footer className="cite">{cite}</footer> : null}
    </blockquote>
  );
};

Blockquote.displayName = "Blockquote";
export default Blockquote;
