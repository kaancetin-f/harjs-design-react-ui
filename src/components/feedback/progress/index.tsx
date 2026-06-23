import React from "react";
import IProps from "./IProps";
import Utils from "../../../libs/infrastructure/shared/Utils";
import { Status } from "../../../libs/infrastructure/types";
import "../../../assets/css/components/feedback/progress/progress.css";

const Progress: React.FC<IProps> = ({ value, reverse, isVisibleValue = false }) => {
  // variables
  let _status: Status | undefined = undefined;
  const _arProgressClassName: string[] = [];

  if (value >= 0 && value <= 25) _status = !reverse ? "danger" : "success";
  else if (value >= 26 && value <= 50) _status = !reverse ? "warning" : "primary";
  else if (value >= 51 && value <= 75) _status = !reverse ? "primary" : "warning";
  else if (value >= 76 && value <= 100) _status = !reverse ? "success" : "danger";

  _arProgressClassName.push(
    ...Utils.GetClassName("filled", _status, undefined, { radius: "pill" }, undefined, undefined, undefined),
  );

  return (
    <div className="ar-progress">
      <div className={`ar-progress-bar ${_arProgressClassName.map((c) => c).join(" ")}`}></div>
      <div
        className={`ar-progress-value ${_arProgressClassName.map((c) => c).join(" ")}`}
        style={{
          width: `${value}%`,
          transition: "width 250ms ease-in-out",
        }}
      >
        {!isVisibleValue && <span>%{value}</span>}
      </div>
    </div>
  );
};

export default Progress;
