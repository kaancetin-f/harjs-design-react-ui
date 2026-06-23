"use client";

import React, { useRef } from "react";
import IProps from "./IProps";

const Title: React.FC<IProps> = ({ children, Level, align = "left", size, upperCase = false, ...attributes }) => {
  // refs
  let _className = useRef<string>("ar-typography-title").current;

  if (align) _className += ` ${align}`;
  if (size) _className += ` ${size}`;

  return (
    <Level className={_className} {...attributes}>
      {typeof children === "string" && upperCase ? children.toLocaleUpperCase() : children}
    </Level>
  );
};

Title.displayName = "Title";
export default Title;
