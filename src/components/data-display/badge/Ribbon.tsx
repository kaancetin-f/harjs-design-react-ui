"use client";

import React from "react";
import { IRibbonProps } from "./IProps";
import Utils from "../../../libs/infrastructure/shared/Utils";

const BadgeRibbon: React.FC<IRibbonProps> = ({
  children,
  text,
  status = "danger",
  color,
  placement = "end",
  disabled,
  className,
}) => {
  const classNames: string[] = [
    "har-badge-ribbon-host",
    `placement-${placement}`,
    ...Utils.GetClassName(undefined, color ? undefined : status, color, undefined, undefined, undefined, className),
  ];

  if (disabled) classNames.push("disabled");

  const style = color
    ? ({
        ["--_badge-accent" as string]: `var(--${color}-500)`,
        ["--_badge-fg" as string]: `var(--${color}-700)`,
      } as React.CSSProperties)
    : undefined;

  return (
    <div className={classNames.join(" ")} style={style}>
      {children}
      <span className="har-badge-ribbon">{text}</span>
    </div>
  );
};

BadgeRibbon.displayName = "Badge.Ribbon";
export default BadgeRibbon;
