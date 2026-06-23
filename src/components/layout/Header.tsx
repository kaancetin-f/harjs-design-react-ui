"use client";

import React from "react";
import { IHeaderProps } from "./IProps";

const Header: React.FC<IHeaderProps> = ({ actions }) => {
  return (
    <header>
      <div className="actions">{actions}</div>
    </header>
  );
};

Header.displayName = "Layout.Header";
export default Header;
