import React from "react";
import { IItemProps } from "./IProps";

const isCount = (value: unknown): value is number => typeof value === "number" && value > 0;

const Item: React.FC<IItemProps> = ({ children, colSpan, rowSpan, className: externalClassName }) => {
  // variables
  const className = [
    "har-grid-item",
    isCount(colSpan) ? "col-span" : undefined,
    colSpan === "full" ? "col-span-full" : undefined,
    isCount(rowSpan) ? "row-span" : undefined,
    rowSpan === "full" ? "row-span-full" : undefined,
    externalClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const style: React.CSSProperties = {
    ...(isCount(colSpan) ? { ["--har-col-span" as string]: colSpan } : {}),
    ...(colSpan != null && !isCount(colSpan) && colSpan !== "full" ? { gridColumn: colSpan } : {}),
    ...(isCount(rowSpan) ? { ["--har-row-span" as string]: rowSpan } : {}),
    ...(rowSpan != null && !isCount(rowSpan) && rowSpan !== "full" ? { gridRow: rowSpan } : {}),
  };

  return (
    <div className={className} style={Object.keys(style).length > 0 ? style : undefined}>
      {children}
    </div>
  );
};

Item.displayName = "Grid.Item";
export default Item;
