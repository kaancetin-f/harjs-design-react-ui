import React, { Dispatch, memo, SetStateAction } from "react";
import { Actions } from "../IProps";
import ActionButtons from "./ActionButtons";

interface IProps {
  states: {
    createTrigger: { get: boolean; set: Dispatch<SetStateAction<boolean>> };
  };
  title?: string;
  description?: string;
  actions?: Actions;
}

const Header = ({ states, title, description, actions }: IProps) => {
  return (
    <div className="header">
      <div className="title">
        <h4>{title}</h4>
        {description && <h5>{description}</h5>}
      </div>

      {actions && <ActionButtons states={states} actions={actions} />}
    </div>
  );
};

export default memo(Header);
