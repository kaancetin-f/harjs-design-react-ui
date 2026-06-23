"use client";

import React from "react";
import IProps from "./IProps";

const Paragraph: React.FC<IProps> = ({ children, color, align = "left", size, upperCase = false }) => {
  let _className: string[] = ["ar-typography-paragraph"];

  if (align) _className.push(align);
  if (color) _className.push(color);
  if (size) _className.push(size);

  return (
    <p className={_className.map((c) => c).join(" ")}>
      {typeof children === "string" && upperCase ? children.toLocaleUpperCase() : children}
    </p>
  );
};

Paragraph.displayName = "Paragraph";
export default Paragraph;
