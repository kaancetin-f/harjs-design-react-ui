"use client";

import React, { useCallback, useEffect, useId, useState } from "react";
import "../../../assets/css/components/navigation/menu/styles.css";
import IProps, { MenuItemProps } from "./IProps";
import { NavigationMenuProps } from "../../../libs/infrastructure/types";
import {
  DispatchEvent,
  findMenuPath,
  menuKey,
  readMenuLocked,
  readSelectedMenuKey,
  SessionStorage,
  writeSessionItem,
} from "./helpers";
import { useLayoutSider } from "../../layout/layout/context";

const visibleMenuButtons = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLButtonElement>("button.item-render")].filter(
    (button) => button.tabIndex !== -1,
  );

const Menu: React.FC<IProps> = ({
  data,
  variant = "vertical",
  theme,
  className,
  style,
  ...attributes
}) => {
  // refs
  const _navClassName: string[] = ["har-menu", variant, className].filter(Boolean) as string[];

  // states
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [storedLocked, setStoredLocked] = useState<boolean>(() => readMenuLocked());

  // hooks
  const uid = useId().replace(/:/g, "");
  const layoutSider = useLayoutSider();

  // variables
  const items = Array.isArray(data) ? data : [];
  const isMenuLocked =
    variant === "horizontal" ? true : layoutSider ? layoutSider.expanded : storedLocked;
  const inLayout = layoutSider != null;
  const menuStyle: React.CSSProperties = {
    ...(theme?.hover?.backgroundColor
      ? { ["--menu-hover-bg" as string]: theme.hover.backgroundColor }
      : {}),
    ...(theme?.hover?.textColor
      ? { ["--menu-hover-color" as string]: theme.hover.textColor }
      : {}),
    ...(theme?.selected?.color
      ? { ["--selected-icon-color" as string]: theme.selected.color }
      : {}),
    ...(theme?.selected?.backgroundColor
      ? {
          ["--selected-icon-bg-color" as string]:
            theme.selected.backgroundColor,
        }
      : {}),
    ...(theme?.selected?.ringColor
      ? {
          ["--selected-icon-ring-color" as string]: theme.selected.ringColor,
          ["--selected-icon-bg-color-rgb" as string]: theme.selected.ringColor,
        }
      : {}),
    ...style,
  };

  // methods
  const restoreSelection = useCallback((nextData: NavigationMenuProps[]) => {
    if (!nextData.length) {
      setSelectedKey(null);
      return;
    }

    const stored = readSelectedMenuKey();
    const path = stored ? findMenuPath(stored, nextData) : null;
    setSelectedKey(path !== null && stored ? stored : null);
    if (path) setOpenMenus(path);
  }, []);

  const handleItemClick = useCallback(
    (item: NavigationMenuProps) => {
      if (item.type === "divider") return;

      const key = menuKey(item.key);

      // Kilitli değilken grup öğesinin açılmasına izin verme...
      if (!isMenuLocked && item.type === "group") return;

      if (item.type === "group") {
        const parents = findMenuPath(key, items) ?? [];
        setOpenMenus((prev) => {
          const isOpen = prev.includes(key);
          if (isOpen) return prev.filter((entry) => entry !== key);
          return [...parents, key];
        });
        return;
      }

      setSelectedKey(key);
      writeSessionItem(SessionStorage.SelectedMenuItem, key);
    },
    [isMenuLocked, items],
  );

  // useEffects
  useEffect(() => {
    restoreSelection(items);
  }, [items, restoreSelection]);

  useEffect(() => {
    const onSelectedMenuItemChange = () => {
      const stored = readSelectedMenuKey();
      const path = stored ? findMenuPath(stored, items) : null;
      setSelectedKey(path !== null ? stored : null);
    };

    const onMenuLockChange = () => {
      setStoredLocked(readMenuLocked());
    };

    window.addEventListener(
      DispatchEvent.SelectedMenuItem,
      onSelectedMenuItemChange,
    );
    if (!inLayout) {
      window.addEventListener(DispatchEvent.MenuLock, onMenuLockChange);
    }

    return () => {
      window.removeEventListener(
        DispatchEvent.SelectedMenuItem,
        onSelectedMenuItemChange,
      );
      window.removeEventListener(DispatchEvent.MenuLock, onMenuLockChange);
    };
  }, [inLayout, items]);

  return (
    <nav {...attributes} className={_navClassName.map((c) => c).join(" ")} style={menuStyle}>
      <ul>
        {items.map((item, index) => (
          <MenuItem
            key={item.key ?? `menu-${index}`}
            item={item}
            openMenus={openMenus}
            selectedKey={selectedKey}
            isMenuLocked={isMenuLocked}
            focusable
            idPrefix={uid}
            onClick={handleItemClick}
          />
        ))}
      </ul>
    </nav>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({
  item,
  openMenus,
  selectedKey,
  isMenuLocked,
  focusable,
  idPrefix,
  onClick,
}) => {
  // variables
  const key = menuKey(item.key);
  const isGroup = item.type === "group";
  const isDivider = item.type === "divider";
  const isOpen = openMenus.includes(key);
  const isSelected = selectedKey === key && !isGroup && !isDivider;
  const hasSubmenu = Boolean(item.submenu?.length);
  const submenuId = `${idPrefix}-${key}-submenu`;
  const label = typeof item.render === "string" ? item.render : undefined;

  // refs
  const _itemClassName: string[] = [
    isDivider ? "divider" : undefined,
    isSelected ? "selected" : undefined,
    hasSubmenu ? "has-submenu" : undefined,
  ].filter(Boolean) as string[];
  const _renderClassName: string[] = [
    "item-render",
    isMenuLocked ? "align-left" : "align-center",
    hasSubmenu ? "with-submenu" : undefined,
    isOpen ? "opened" : undefined,
  ].filter(Boolean) as string[];

  // methods
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const nav = event.currentTarget.closest("nav.har-menu");
    if (!(nav instanceof HTMLElement)) return;

    if (event.key === "Escape") {
      // Escape ile açık grubu kapat ve tetikleyiciye odaklan...
      const submenu = event.currentTarget.closest("ul.submenu.opened");
      const group = submenu?.parentElement?.querySelector<HTMLButtonElement>(
        ":scope > .item-render",
      );
      if (!group) return;
      event.preventDefault();
      group.click();
      group.focus();
      return;
    }

    if (event.key === "ArrowRight" && isGroup && isMenuLocked && !isOpen) {
      event.preventDefault();
      onClick(item);
      return;
    }

    if (event.key === "ArrowLeft" && isGroup && isMenuLocked && isOpen) {
      event.preventDefault();
      onClick(item);
      return;
    }

    const buttons = visibleMenuButtons(nav);
    const index = buttons.indexOf(event.currentTarget);
    if (index < 0) return;

    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Home" ||
      event.key === "End"
    ) {
      event.preventDefault();
      const nextIndex =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? buttons.length - 1
            : event.key === "ArrowDown"
              ? (index + 1) % buttons.length
              : (index - 1 + buttons.length) % buttons.length;
      buttons[nextIndex]?.focus();
    }
  };

  return (
    <li data-menu-id={`har-menu-${key}`} className={_itemClassName.map((c) => c).join(" ") || undefined}>
      {isDivider ? (
        <div className={_renderClassName.map((c) => c).join(" ")}>
          {isMenuLocked ? (
            <hr />
          ) : (
            <span className="icon">
              {item.icon ?? <span className="no-icon" />}
            </span>
          )}
        </div>
      ) : (
        <button
          type="button"
          className={_renderClassName.map((c) => c).join(" ")}
          tabIndex={focusable ? 0 : -1}
          aria-current={isSelected ? "page" : undefined}
          aria-expanded={
            isGroup && hasSubmenu && isMenuLocked ? isOpen : undefined
          }
          aria-controls={
            isGroup && hasSubmenu && isMenuLocked ? submenuId : undefined
          }
          aria-label={!isMenuLocked ? label : undefined}
          onClick={() => onClick(item)}
          onKeyDown={handleKeyDown}
        >
          <span className="icon">
            {item.icon ?? <span className="no-icon" />}
          </span>
          {isMenuLocked && <span className="item">{item.render}</span>}
          {isMenuLocked && hasSubmenu && (
            <span className={`submenu-arrow ${isOpen ? "opened" : ""}`} />
          )}
        </button>
      )}

      {item.submenu && isMenuLocked && (
        <ul
          id={submenuId}
          className={`submenu ${isOpen ? "opened" : ""}`}
          aria-hidden={!isOpen}
        >
          {item.submenu.map((sub, index) => (
            <MenuItem
              key={sub.key ?? `${key}-${index}`}
              item={sub}
              openMenus={openMenus}
              selectedKey={selectedKey}
              isMenuLocked={isMenuLocked}
              focusable={focusable && isOpen}
              idPrefix={idPrefix}
              onClick={onClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

Menu.displayName = "Menu";
export default Menu;
