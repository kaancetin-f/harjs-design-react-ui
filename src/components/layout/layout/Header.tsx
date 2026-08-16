"use client";

import React from "react";
import { ILayoutHeaderProps } from "./IProps";
import { useLayoutSider } from "./context";
import { Icon } from "../../icons";

const Header: React.FC<ILayoutHeaderProps> = ({
  children,
  actions,
  className,
  style,
  menuButton = true,
}) => {
  // refs
  const _headerClassName: string[] = ["har-header", className].filter(Boolean) as string[];

  // hooks
  const ctx = useLayoutSider();

  return (
    <header className={_headerClassName.map((c) => c).join(" ")} style={style}>
      {ctx && menuButton ? (
        <button
          type="button"
          className="har-header-menu-toggle"
          aria-expanded={ctx.overlayOpen}
          aria-controls={ctx.siderId}
          aria-label={ctx.overlayOpen ? "Close navigation" : "Open navigation"}
          onClick={ctx.toggleOverlay}
        >
          <Icon icon="BulletList" size={20} fill="currentColor" />
        </button>
      ) : null}
      {children}
      {actions != null && (
        <nav className="har-header-actions" aria-label="Page actions">
          {actions}
        </nav>
      )}
    </header>
  );
};

Header.displayName = "Layout.Header";
export default Header;
