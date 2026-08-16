"use client";

import React from "react";
import { Icons } from "../../libs/infrastructure/types";
import { ICON_PATHS } from "./paths";

export type IconProps = {
  icon: Icons;
  size?: string | number;
} & Omit<React.SVGProps<SVGSVGElement>, "children">;

const Icon: React.FC<IconProps> = ({
  icon,
  size = 16,
  fill = "currentColor",
  style,
  className,
  ...attributes
}) => {
  // variables
  const d = ICON_PATHS[icon];

  if (!d) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      fill={fill}
      style={style}
      className={className}
      aria-hidden
      {...attributes}
    >
      <path d={d} />
    </svg>
  );
};

Icon.displayName = "Icon";

export { Icon };
/** @deprecated Use `Icon`. Kept for existing imports. */
export const ARIcon = Icon;

export default Icon;
