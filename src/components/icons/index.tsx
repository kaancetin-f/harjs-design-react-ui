import React from "react";
import Icon from "./Compiler";
import { Icons } from "../../libs/infrastructure/types";

export const ARIcon: React.FC<{
  size?: string | number | undefined;
  icon: Icons;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  style?: React.CSSProperties | undefined;
}> = ({ size = 16, icon, fill = "var(--dark)", stroke = "var(--dark)", strokeWidth = 1, style }) => {
  const { Compiler } = new Icon(stroke, strokeWidth);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill={fill} width={size} height={size} style={style}>
      {Compiler(icon)}
    </svg>
  );
};
