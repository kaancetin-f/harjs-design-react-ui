import React from "react";
import IProps from "./IProps";

const Row: React.FC<IProps> = ({ children, className }) => {
  // variables
  const classes = ["har-row", "row", className].filter(Boolean).join(" ");

  return <div className={classes}>{children}</div>;
};

Row.displayName = "Row";
export default Row;
