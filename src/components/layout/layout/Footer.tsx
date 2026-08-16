"use client";

import React from "react";
import { ILayoutFooterProps } from "./IProps";

const Footer: React.FC<ILayoutFooterProps> = ({ children, className, style }) => {
  // refs
  const _footerClassName: string[] = ["har-footer", className].filter(Boolean) as string[];

  return (
    <footer className={_footerClassName.map((c) => c).join(" ")} style={style}>
      {children}
    </footer>
  );
};

Footer.displayName = "Layout.Footer";
export default Footer;
