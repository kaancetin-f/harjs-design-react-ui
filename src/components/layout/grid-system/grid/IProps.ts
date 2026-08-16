import { Property } from "csstype";
import { IChildrenProps } from "../../../../libs/infrastructure/types/IGlobalProps";

export type GridSpan = number | "full";

interface IProps extends IChildrenProps {
  columns?: number | Property.GridTemplateColumns;
  rows?: number | Property.GridTemplateRows;
  autoFlow?: Property.GridAutoFlow;
  justifyItems?: Property.JustifyItems;
  alignItems?: Property.AlignItems;
  justifyContent?: Property.JustifyContent;
  alignContent?: Property.AlignContent;
  gap?: Property.Gap;
  rowGap?: Property.RowGap;
  columnGap?: Property.ColumnGap;
  width?: Property.Width;
  height?: Property.Height;
  inline?: boolean;
  className?: string;
}

export interface IItemProps extends IChildrenProps {
  colSpan?: GridSpan | Property.GridColumn;
  rowSpan?: GridSpan | Property.GridRow;
  className?: string;
}

export default IProps;
