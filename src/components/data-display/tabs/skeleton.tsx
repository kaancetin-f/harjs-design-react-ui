import React from "react";
import IProps from "./IProps";

const Skeleton = ({ tabs = [] }: IProps) => {
  return (
    <div className="ar-tabs skeleton">
      <div className="tabs">
        {tabs.length > 0 &&
          tabs.map((tab, index) => {
            return (
              <div key={index} className="item" style={{ width: `${tab.title.length}px` }}>
                <div className="title"></div>
              </div>
            );
          })}
      </div>

      <div className="content">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Skeleton;
