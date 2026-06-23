import React from "react";
import IProps from "./IProps";

const Row: React.FC<IProps> = ({ children }) => {
  return <div className="row">{React.Children.map(children, (child) => child)}</div>;
};

Row.displayName = "Row";
export default Row;
