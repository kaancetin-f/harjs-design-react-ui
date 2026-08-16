import React from "react";
import IProps from "./IProps";

const directionClass = {
  "flex-start": "is-start",
  center: "is-center",
  "flex-end": "is-end",
} as const;

const Box: React.FC<IProps> = ({ children, direction = "flex-start", gap, className: externalClassName }) => {
  // variables
  const className = ["har-box", directionClass[direction], externalClassName].filter(Boolean).join(" ");

  return (
    <div className={className} style={gap != null ? { gap } : undefined}>
      {children}
    </div>
  );
};

Box.displayName = "Box";
export default Box;
