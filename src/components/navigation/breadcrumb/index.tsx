"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Button from "../../form/button";
import { Icon } from "../../icons";
import IProps, { BreadcrumbItem } from "./IProps";
import "../../../assets/css/components/navigation/breadcrumb/styles.css";

const DEFAULT_SEPARATOR = "/";
const MENU_GAP = 4;
const MENU_GUTTER = 8;

const itemKey = (item: BreadcrumbItem, index: number) =>
  item.key != null ? String(item.key) : `breadcrumb-${index}`;

const placeMenu = (
  trigger: DOMRect,
  menu: DOMRect,
  viewport: { width: number; height: number },
) => {
  let top = trigger.bottom + MENU_GAP;
  // Viewport dışına taşarsa menüyü tetikleyicinin üstüne al...
  if (top + menu.height > viewport.height - MENU_GUTTER) {
    top = Math.max(MENU_GUTTER, trigger.top - menu.height - MENU_GAP);
  }

  const left = Math.min(
    Math.max(MENU_GUTTER, trigger.left),
    Math.max(MENU_GUTTER, viewport.width - menu.width - MENU_GUTTER),
  );

  return { top, left };
};

const CrumbControl = ({
  item,
  current,
  role,
  onActivate,
}: {
  item: BreadcrumbItem;
  current?: boolean;
  role?: string;
  onActivate?: () => void;
}) => {
  // methods
  const handleClick: React.MouseEventHandler<
    HTMLAnchorElement | HTMLButtonElement
  > = (event) => {
    item.onClick?.(event);
    onActivate?.();
  };

  if (current) {
    return <span className="current">{item.label}</span>;
  }

  if (item.disabled) {
    return (
      <span className="label" aria-disabled="true" role={role}>
        {item.label}
      </span>
    );
  }

  if (item.href) {
    return (
      <a className="link" href={item.href} role={role} onClick={handleClick}>
        {item.label}
      </a>
    );
  }

  if (item.onClick) {
    return (
      <Button
        variant="borderless"
        color="gray"
        size="xs"
        fullWidth={role === "menuitem"}
        role={role}
        onClick={handleClick}
      >
        {item.label}
      </Button>
    );
  }

  return (
    <span className="label" role={role}>
      {item.label}
    </span>
  );
};

const BreadcrumbMenu = ({
  label,
  items,
  icon,
  children,
}: {
  label: string;
  items: Array<{ item: BreadcrumbItem; key: string }>;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  // refs
  const _trigger = useRef<HTMLSpanElement>(null);
  const _menu = useRef<HTMLDivElement>(null);

  // states
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // hooks
  const reactId = useId();

  // variables
  const menuId = `har-breadcrumb-menu${reactId.replace(/:/g, "")}`;

  // methods
  const close = useCallback(() => setOpen(false), []);

  const updatePosition = useCallback(() => {
    if (typeof window === "undefined") return;
    const trigger = _trigger.current;
    const menu = _menu.current;
    if (!trigger || !menu) return;

    const next = placeMenu(
      trigger.getBoundingClientRect(),
      menu.getBoundingClientRect(),
      {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    );

    menu.style.top = `${next.top}px`;
    menu.style.left = `${next.left}px`;
  }, []);

  // useEffects
  useEffect(() => {
    // SSR'da document.body olmadığı için menüyü mount sonrası portal ile aç...
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !mounted) return;
    updatePosition();
    // Menü açılınca ilk tıklanabilir öğeye odaklan...
    const first = _menu.current?.querySelector<HTMLElement>(
      '[role="menuitem"]:not([aria-disabled="true"])',
    );
    first?.focus();
  }, [open, mounted, updatePosition]);

  useEffect(() => {
    if (
      !open ||
      typeof window === "undefined" ||
      typeof document === "undefined"
    )
      return;

    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (_trigger.current?.contains(target)) return;
      if (_menu.current?.contains(target)) return;
      close();
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      close();
      _trigger.current?.querySelector("button")?.focus();
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, {
      capture: true,
      passive: true,
    });
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [close, open, updatePosition]);

  return (
    <>
      <span ref={_trigger} className="menu-trigger">
        <Button
          variant="borderless"
          color="gray"
          size="xs"
          shape={icon ? "square" : undefined}
          icon={icon ? { element: <>{icon}</> } : undefined}
          aria-label={label}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          onClick={() => setOpen((value) => !value)}
        >
          {icon ? undefined : children}
        </Button>
      </span>
      {mounted &&
        open &&
        createPortal(
          <div
            ref={_menu}
            id={menuId}
            className="har-breadcrumb-menu"
            role="menu"
          >
            {items.map(({ item, key }) => (
              <CrumbControl
                key={key}
                item={item}
                role="menuitem"
                onActivate={close}
              />
            ))}
          </div>,
          document.body,
        )}
    </>
  );
};

const Breadcrumb: React.FC<IProps> = ({
  items,
  separator = DEFAULT_SEPARATOR,
  maxItems,
  className,
  "aria-label": ariaLabel = "Breadcrumb",
  ...attributes
}) => {
  // refs
  const _navClassName: string[] = ["har-breadcrumb", className].filter(Boolean) as string[];

  // variables
  const trail = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) return null;

    const collapse =
      typeof maxItems === "number" && maxItems >= 2 && items.length > maxItems;

    if (!collapse) {
      return {
        head: items,
        hidden: [] as Array<{ item: BreadcrumbItem; index: number }>,
        tail: [] as BreadcrumbItem[],
      };
    }

    // maxItems aşıldığında ilk öğeyi tut, ortadakileri menüye gizle, kuyruğu bırak...
    const tailCount = maxItems - 1;
    return {
      head: items.slice(0, 1),
      hidden: items.slice(1, items.length - tailCount).map((item, offset) => ({
        item,
        index: offset + 1,
      })),
      tail: items.slice(items.length - tailCount),
    };
  }, [items, maxItems]);

  if (!trail) return null;

  const lastIndex = items.length - 1;
  const collapsed = trail.hidden.length > 0;

  // methods
  const renderCrumb = (
    item: BreadcrumbItem,
    index: number,
    isFirst: boolean,
  ) => {
    const isCurrent = index === lastIndex;
    const menuItems = !isCurrent && item.menu?.length ? item.menu : undefined;
    const _itemClassName: string[] = [
      "item",
      isCurrent ? "is-current" : undefined,
      item.disabled ? "is-disabled" : undefined,
      menuItems ? "has-menu" : undefined,
    ].filter(Boolean) as string[];

    return (
      <li
        key={itemKey(item, index)}
        className={_itemClassName.map((c) => c).join(" ")}
        aria-current={isCurrent ? "page" : undefined}
      >
        {!isFirst && (
          <span className="separator" aria-hidden="true">
            {separator}
          </span>
        )}
        <span className="crumb">
          <CrumbControl item={item} current={isCurrent} />
          {menuItems ? (
            <BreadcrumbMenu
              label="Related pages"
              items={menuItems.map((entry, menuIndex) => ({
                // İç içe menü oluşmasın diye alt öğenin menu'sunu temizle...
                item: { ...entry, menu: undefined },
                key: itemKey(entry, menuIndex),
              }))}
              icon={<Icon icon="ChevronDown" size={12} />}
            />
          ) : null}
        </span>
      </li>
    );
  };

  // variables
  const nodes: React.ReactNode[] = [];

  trail.head.forEach((item, index) => {
    nodes.push(renderCrumb(item, index, index === 0));
  });

  if (collapsed) {
    nodes.push(
      <li key="breadcrumb-overflow" className="item is-overflow">
        <span className="separator" aria-hidden="true">
          {separator}
        </span>
        <BreadcrumbMenu
          label="Show hidden pages"
          items={trail.hidden.map(({ item, index }) => ({
            item: { ...item, menu: undefined },
            key: itemKey(item, index),
          }))}
        >
          …
        </BreadcrumbMenu>
      </li>,
    );
  }

  const tailOffset = items.length - trail.tail.length;
  trail.tail.forEach((item, index) => {
    nodes.push(renderCrumb(item, tailOffset + index, false));
  });

  return (
    <nav {...attributes} className={_navClassName.map((c) => c).join(" ")} aria-label={ariaLabel}>
      <ol>{nodes}</ol>
    </nav>
  );
};

Breadcrumb.displayName = "Breadcrumb";

export type { BreadcrumbItem };
export default Breadcrumb;
