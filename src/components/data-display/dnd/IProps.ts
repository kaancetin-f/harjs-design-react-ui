import React from "react";

interface IProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.JSX.Element;
  columnKey?: string;
  onChange?: (data: T[]) => void;
  confing?: { isMoveIcon?: boolean; isInTable?: boolean };
}

export default IProps;
