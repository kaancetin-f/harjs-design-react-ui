import React from "react";
import IProps from "./IProps";

const BREAKPOINTS = ["xl", "lg", "md", "sm", "xs"] as const;

const Column: React.FC<IProps> = ({ children, size, align, className }) => {
  // variables
  const classes: string[] = ["har-col"];

  if (typeof size === "object") {
    Object.entries(size).forEach(([key, value]) => {
      if (value != null) classes.push(`col-${key}-${value}`);
    });
  } else if (typeof size === "number") {
    BREAKPOINTS.forEach((breakpoint) => classes.push(`col-${breakpoint}-${size}`));
  } else {
    classes.push("col");
  }

  if (align) classes.push(align);
  if (className) classes.push(className);

  return <div className={classes.join(" ")}>{children}</div>;
};

Column.displayName = "Column";
export default Column;
