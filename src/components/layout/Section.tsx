import React from "react";
import { ISectionProps } from "./IProps";

const Section: React.FC<ISectionProps> = ({ children, fullWidth }) => {
  // refs
  const _selectionClassName: string[] = [];

  if (fullWidth) _selectionClassName.push("full-width");

  return <section className={_selectionClassName.map((c) => c).join(" ")}>{children}</section>;
};

Section.displayName = "Layout.Section";
export default Section;
