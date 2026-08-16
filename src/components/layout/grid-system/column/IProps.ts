import { IChildrenProps } from "../../../../libs/infrastructure/types/IGlobalProps";

export type ColumnSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type ColumnSize =
  | ColumnSpan
  | {
      xl?: ColumnSpan;
      lg?: ColumnSpan;
      md?: ColumnSpan;
      sm?: ColumnSpan;
      xs?: ColumnSpan;
    };

interface IProps extends IChildrenProps {
  size?: ColumnSize;
  align?: "left" | "center" | "right";
  className?: string;
}

export default IProps;
