"use client";

import React from "react";
import "../../../assets/css/components/data-display/chip/chip.css";
import IProps from "./IProps";
import Utils from "../../../libs/infrastructure/shared/Utils";

const Chip: React.FC<IProps> = ({
  variant = "outlined",
  color = "light",
  customColor,
  border = { radius: "sm" },
  text,
  icon,
}) => {
  let _chipClassName: string[] = ["ar-chip"];

  _chipClassName.push(...Utils.GetClassName(variant, undefined, color, border, undefined, undefined, undefined));

  return (
    <div
      className={_chipClassName.map((c) => c).join(" ")}
      {...(customColor && {
        style: {
          backgroundColor: customColor,
          color: "var(--black)",
        },
      })}
    >
      {icon?.element && <span>{icon?.element}</span>}
      <span>{text}</span>
    </div>
  );
};

export default Chip;
