import React from "react";
import IProps from "./IProps";
import Item from "./Item";

const isCount = (value: unknown): value is number => typeof value === "number" && value > 0;

const GridBase: React.FC<IProps> = ({
  children,
  columns,
  rows,
  autoFlow,
  justifyItems,
  alignItems,
  justifyContent,
  alignContent,
  gap,
  rowGap,
  columnGap,
  width,
  height,
  inline,
  className: externalClassName,
}) => {
  // variables
  const className = [
    "har-grid",
    inline ? "inline-grid" : "grid",
    isCount(columns) ? "grid-columns" : undefined,
    isCount(rows) ? "grid-rows" : undefined,
    autoFlow ? `grid-auto-flow-${String(autoFlow).replace(/\s+/g, "-")}` : undefined,
    justifyItems ? `justify-items-${justifyItems}` : undefined,
    alignItems ? `align-items-${alignItems}` : undefined,
    justifyContent ? `justify-content-${justifyContent}` : undefined,
    alignContent ? `align-content-${alignContent}` : undefined,
    externalClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const style: React.CSSProperties = {
    ...(isCount(columns) ? { ["--har-grid-cols" as string]: columns } : {}),
    ...(isCount(rows) ? { ["--har-grid-rows" as string]: rows } : {}),
    ...(!isCount(columns) && columns != null ? { gridTemplateColumns: columns } : {}),
    ...(!isCount(rows) && rows != null ? { gridTemplateRows: rows } : {}),
    ...(gap != null ? { gap } : {}),
    ...(rowGap != null ? { rowGap } : {}),
    ...(columnGap != null ? { columnGap } : {}),
    ...(width != null ? { width } : {}),
    ...(height != null ? { height } : {}),
  };

  return (
    <div className={className} style={Object.keys(style).length > 0 ? style : undefined}>
      {children}
    </div>
  );
};

type GridComponent = typeof GridBase & {
  Item: typeof Item;
};

const Grid = GridBase as GridComponent;
Grid.Item = Item;
Grid.displayName = "Grid";

export default Grid;
