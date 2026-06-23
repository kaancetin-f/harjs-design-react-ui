import React from "react";
import Typography from "../typography";
import "../../../assets/css/components/data-display/paper/styles.css";
import IProps from "./IProps";

const { Title } = Typography;

const Paper: React.FC<IProps> = ({ children, title, action }) => {
  return (
    <div className="ar-paper">
      {(title || action) && (
        <div className="header">
          {title && <Title Level="h3">{title}</Title>}

          {action && <div className="actions-field">{action}</div>}
        </div>
      )}

      <div className="content">{children}</div>
    </div>
  );
};

export default Paper;
