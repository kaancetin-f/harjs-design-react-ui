import React from "react";
import { ILayoutContentProps } from "./IProps";

const Content: React.FC<ILayoutContentProps> = ({ children, className, style }) => {
  // refs
  const _contentClassName: string[] = ["har-content", className].filter(Boolean) as string[];

  return (
    <main className={_contentClassName.map((c) => c).join(" ")} style={style}>
      {children}
    </main>
  );
};

Content.displayName = "Layout.Content";
export default Content;
