import {
  Children,
  Fragment,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import type { LayoutSizeValue } from "./IProps";

export const LAYOUT_SLOT = {
  Sider: "Layout.Sider",
  Header: "Layout.Header",
  Content: "Layout.Content",
  Section: "Layout.Section",
  Footer: "Layout.Footer",
} as const;

export type LayoutSlotName = (typeof LAYOUT_SLOT)[keyof typeof LAYOUT_SLOT];

export type CSSPropertiesWithVars = CSSProperties &
  Record<`--${string}`, string | number | undefined>;

export const LAYOUT_MOBILE_QUERY = "(max-width: 767px)";

/** Matches `SessionStorage.MenuIsLocked`. */
export const DEFAULT_SIDER_LOCK_KEY = "is-menu-locked";
/** Matches `DispatchEvent.MenuLock`. */
export const MENU_LOCK_EVENT = "menuLock";

export const toCssSize = (value?: LayoutSizeValue): string | undefined => {
  if (value == null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
};

export const cssVars = (vars: Record<string, string | undefined>): CSSPropertiesWithVars => {
  const style: Record<string, string> = {};
  for (const [name, value] of Object.entries(vars)) {
    if (value) style[name] = value;
  }
  return style as CSSPropertiesWithVars;
};

export const pickTheme = (specific?: string, fallback?: string) => specific ?? fallback;

const elementDisplayName = (child: ReactElement) =>
  (child.type as { displayName?: string }).displayName;

const walkChildren = (
  nodes: ReactNode,
  visit: (child: ReactElement) => boolean,
): boolean => {
  let found = false;
  Children.forEach(nodes, (child) => {
    if (found || !isValidElement(child)) return;
    if (child.type === Fragment) {
      found = walkChildren((child.props as { children?: ReactNode }).children, visit);
      return;
    }
    found = visit(child);
  });
  return found;
};

/** Direct `Layout.Sider` child — drives row vs column flex. */
export const hasDirectSider = (nodes: ReactNode): boolean =>
  walkChildren(nodes, (child) => elementDisplayName(child) === LAYOUT_SLOT.Sider);

/** Sider anywhere below, including nested `Layout` — drives the sider provider. */
export const hasDescendantSider = (nodes: ReactNode): boolean =>
  walkChildren(nodes, (child) => {
    if (elementDisplayName(child) === LAYOUT_SLOT.Sider) return true;
    return hasDescendantSider((child.props as { children?: ReactNode }).children);
  });

export const getSiderStorageKey = (name?: string, pathname?: string) => {
  if (!name) return DEFAULT_SIDER_LOCK_KEY;
  const path =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");
  return `${path}::${name}::sider-pinned`;
};

export const parseStoredPinned = (raw: string | null): boolean | null => {
  if (raw == null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "boolean") return parsed;
  } catch {
    /* Sider historically wrote String(true|false) */
  }
  if (raw === "true") return true;
  if (raw === "false") return false;
  return null;
};

export const persistSiderPinned = (pinned: boolean, name?: string) => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(getSiderStorageKey(name), String(pinned));
    if (name) {
      window.sessionStorage.setItem(DEFAULT_SIDER_LOCK_KEY, String(pinned));
    }
    window.dispatchEvent(new Event(MENU_LOCK_EVENT));
  } catch {
    /* private mode / blocked storage */
  }
};

export const readSiderPinned = (name?: string): boolean | null => {
  if (typeof window === "undefined") return null;
  try {
    return parseStoredPinned(window.sessionStorage.getItem(getSiderStorageKey(name)));
  } catch {
    return null;
  }
};
