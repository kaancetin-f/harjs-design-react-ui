import { KanbanBoardColumnProps } from "../../../libs/infrastructure/types";

const HEX = /^#([\da-f]{3}|[\da-f]{6})$/i;

export const columnsSignature = <T, TColumnProperties>(
  columns: KanbanBoardColumnProps<T, TColumnProperties>[],
  trackBy: (item: T) => string,
) => columns.map((column) => `${column.key}:${column.items.map(trackBy).join(",")}`).join("|");

export const parseDragItem = <T>(transfer: DataTransfer): { item: T | null; fromColumn: string } => {
  const fromColumn = transfer.getData("fromColumn");
  const raw = transfer.getData("item");

  if (!raw) return { item: null, fromColumn };

  try {
    return { item: JSON.parse(raw) as T, fromColumn };
  } catch {
    return { item: null, fromColumn };
  }
};

export const findMovedItem = <T>(
  prev: T[],
  next: T[],
  trackBy: (item: T) => string,
): { item: T; index: number } | null => {
  if (next.length === 0) return null;

  const prevIds = prev.map(trackBy);
  const nextIds = next.map(trackBy);

  for (let from = 0; from < prevIds.length; from++) {
    const id = prevIds[from];
    const to = nextIds.indexOf(id);
    if (to === -1 || to === from) continue;

    const simulated = prevIds.slice();
    simulated.splice(from, 1);
    simulated.splice(to, 0, id);

    if (simulated.every((value, index) => value === nextIds[index])) {
      return { item: next[to], index: to };
    }
  }

  for (let index = 0; index < nextIds.length; index++) {
    if (prevIds[index] !== nextIds[index]) {
      return { item: next[index], index };
    }
  }

  return null;
};

export const collectFilterMeta = <T extends object>(
  columns: { items: T[] }[],
  keysFn?: (item: T) => { key: keyof T; name: string; value: string; type: "select" | "date" }[],
) => {
  const selectMap = new Map<string, Set<string | null>>();
  const dateNames = new Set<string>();
  const keyMap: Record<string, keyof T> = {};

  if (!keysFn) {
    return {
      selectFilters: {} as Record<string, (string | null)[]>,
      dateNames: [] as string[],
      keyMap,
    };
  }

  for (const column of columns) {
    for (const item of column.items) {
      const keys = keysFn(item);
      if (!keys) continue;

      for (const entry of keys) {
        keyMap[entry.name] = entry.key;

        if (entry.type === "select") {
          if (!selectMap.has(entry.name)) selectMap.set(entry.name, new Set());
          selectMap.get(entry.name)!.add(entry.value ?? null);
        }

        if (entry.type === "date") dateNames.add(entry.name);
      }
    }
  }

  return {
    selectFilters: Object.fromEntries([...selectMap].map(([name, set]) => [name, Array.from(set)])),
    dateNames: Array.from(dateNames),
    keyMap,
  };
};

export const mergeSelectFilters = (
  prev: Record<string, (string | null)[]>,
  next: Record<string, (string | null)[]>,
) => {
  const merged: Record<string, (string | null)[]> = { ...prev };
  let changed = false;

  for (const [name, values] of Object.entries(next)) {
    const existing = merged[name] ?? [];
    const seen = new Set(existing);
    const combined = [...existing];

    for (const value of values) {
      if (seen.has(value)) continue;
      seen.add(value);
      combined.push(value);
      changed = true;
    }

    if (!merged[name]) changed = true;
    merged[name] = combined;
  }

  return changed ? merged : prev;
};

export const normalizeHex = (value?: string) => {
  if (!value) return undefined;

  const hex = value.trim();
  if (!HEX.test(hex)) return undefined;

  if (hex.length === 4) {
    const r = hex[1];
    const g = hex[2];
    const b = hex[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  return hex;
};

export const darkenColor = (hex: string, percent: number) => {
  let num = parseInt(hex.slice(1), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) - amt,
    G = ((num >> 8) & 0x00ff) - amt,
    B = (num & 0x0000ff) - amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 0 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

export const titleAccentStyle = (titleColor?: string) => {
  const hex = normalizeHex(titleColor);
  if (!hex) return undefined;

  const darkened = darkenColor(hex, 1);
  return { backgroundColor: darkened, borderColor: darkened };
};
