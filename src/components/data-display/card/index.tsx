import React from "react";
import "../../../assets/css/components/data-display/card/styles.css";
import IProps from "./IProps";
import Utils from "../../../libs/infrastructure/shared/Utils";

const Card: React.FC<IProps> = ({ children, title, actions, variant = "filled", status }) => {
  // variables
  const _className: string[] = ["ar-card"];

  _className.push(...Utils.GetClassName(variant, status, undefined, undefined, undefined, undefined, undefined));

  return (
    <div className={_className.map((c) => c).join(" ")}>
      {title && (
        <div className="title">
          <h4>{title}</h4>

          <div>{actions}</div>
        </div>
      )}
      <div className="content">{children}</div>
    </div>
  );
};

export default Card;
