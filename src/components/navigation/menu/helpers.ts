import {
  DispatchEvent,
  SessionStorage,
} from "../../../libs/infrastructure/shared/Enums";
import { NavigationMenuProps } from "../../../libs/infrastructure/types";

export const menuKey = (key: string | number) => String(key);

export const findMenuPath = (
  key: string,
  items: NavigationMenuProps[],
  path: string[] = [],
): string[] | null => {
  for (const item of items) {
    const current = menuKey(item.key);
    if (current === key) return path;
    if (item.submenu?.length) {
      const nested = findMenuPath(key, item.submenu, [...path, current]);
      if (nested) return nested;
    }
  }
  return null;
};

export const isUsableSelectedKey = (value: string | null | undefined) =>
  Boolean(value) && value !== "null";

export const readSessionItem = (key: string): string | null => {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

export const writeSessionItem = (key: string, value: string) => {
  try {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(key, value);
  } catch {
    /* private mode / blocked storage */
  }
};

export const readMenuLocked = (): boolean => {
  const raw = readSessionItem(SessionStorage.MenuIsLocked);
  if (raw == null) return true;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "boolean") return parsed;
  } catch {
    /* Sider writes String(true|false); other values fall through */
  }
  return raw === "true";
};

export const readSelectedMenuKey = (): string | null => {
  const stored = readSessionItem(SessionStorage.SelectedMenuItem);
  return isUsableSelectedKey(stored) ? stored : null;
};

export { SessionStorage, DispatchEvent };
