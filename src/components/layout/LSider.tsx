"use client";

import React, { useEffect, useState } from "react";
import { useLayout } from "../../libs/core/application/hooks";
import { ILSiderProps } from "./IProps";
import Paragraph from "../data-display/typography/paragraph/Paragraph";
import { ARIcon } from "../icons";
import { DispatchEvent, SessionStorage } from "../../libs/infrastructure/shared/Enums";

const LSider: React.FC<ILSiderProps> = ({ logo, footer, ...attributes }) => {
  // states
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isLockedSessionStorage, setIsLockedSessionStorage] = useState<boolean>(true);

  // variables
  const _className: string[] = ["ar-aside", "left", isLocked ? "locked" : "un-locked"];

  if (attributes.className) _className.push(attributes.className);

  // hooks
  const { config } = useLayout();
  const sider = config.layout.sider.left;

  if (!sider?.active) return null;

  // useEffects
  useEffect(() => {
    const onStorageChange = () => {
      setIsLockedSessionStorage(JSON.parse(sessionStorage.getItem(SessionStorage.MenuIsLocked) ?? "true"));
    };

    window.addEventListener(DispatchEvent.MenuLock, onStorageChange);
    window.addEventListener("storage", onStorageChange);

    return () => {
      window.removeEventListener(DispatchEvent.MenuLock, onStorageChange);
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);

  return (
    <aside
      {...attributes}
      className={_className.map((c) => c).join(" ")}
      onMouseOver={() => {
        sessionStorage.setItem(SessionStorage.MenuIsLocked, String(true));
        window.dispatchEvent(new Event(DispatchEvent.MenuLock));
      }}
      onMouseLeave={() => {
        sessionStorage.setItem(SessionStorage.MenuIsLocked, String(isLocked));
        window.dispatchEvent(new Event(DispatchEvent.MenuLock));
      }}
    >
      <span className="button" role="button" onClick={() => setIsLocked((prev) => !prev)}>
        <ARIcon size={20} strokeWidth={0} fill="currentColor" icon={isLocked ? "ChevronBarLeft" : "ChevronBarRight"} />
      </span>

      <div
        className="logo"
        onClick={() => {
          if (!logo?.onClick) return;

          logo?.onClick();
          sessionStorage.setItem(SessionStorage.SelectedMenuItem, "null");
          window.dispatchEvent(new Event(DispatchEvent.SelectedMenuItem));
        }}
      >
        {isLockedSessionStorage ? logo?.default : logo?.mini}
      </div>

      <div>{sider.element}</div>

      {footer && (
        <footer>
          <Paragraph size="small">{footer}</Paragraph>
        </footer>
      )}
    </aside>
  );
};

LSider.displayName = "Layout.LSider";
export default LSider;
