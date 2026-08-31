import { Color, TableColumnProps } from "../../../libs/infrastructure/types";

function GetColumnValue<T extends object>(item: T, key: TableColumnProps<T>["key"]): unknown {
  if (key == null) return undefined;
  if (typeof key !== "object") return item[key];

  const nested = item[key.field];
  if (nested && typeof nested === "object") {
    return (nested as Record<string, unknown>)[key.nestedKey];
  }

  return undefined;
}

function PatchColumnValue<T extends object>(item: T, key: TableColumnProps<T>["key"], value: unknown): T {
  if (key == null) return item;
  if (typeof key !== "object") return { ...item, [key]: value } as T;

  const current = item[key.field];
  const nextNested =
    current && typeof current === "object"
      ? { ...(current as Record<string, unknown>), [key.nestedKey]: value }
      : { [key.nestedKey]: value };

  return { ...item, [key.field]: nextNested } as T;
}

function OpenAllSubrows<T extends object>(
  targetData: T[],
  options: {
    trackBy?: (item: T) => string;
    selector: string;
    parentKey?: string;
  },
): Record<string, boolean> {
  const { trackBy, selector, parentKey = "" } = options;
  let result: Record<string, boolean> = {};

  targetData.forEach((item) => {
    const id = trackBy?.(item);
    const key = parentKey ? `${parentKey}.${id}` : `${id}`;
    const subitems = item[selector as keyof T];

    if (Array.isArray(subitems) && subitems.length > 0) {
      result[key] = true;
      result = {
        ...result,
        ...OpenAllSubrows(subitems as T[], { trackBy, selector, parentKey: key }),
      };
    }
  });

  return result;
}

function IsSubrowBranchEnd(subindex: number, siblingsLength: number, hasExpandedChildren: boolean): boolean {
  return subindex === siblingsLength - 1 && !hasExpandedChildren;
}

const TREE_LEVEL_INDENT_REM = 1.875;
const TREE_LINE_OFFSET_REM = 0.9375;
const TREE_TEXT_GAP_REM = 0.375;

function GetTreeLineLeft(levelIndex: number): string {
  return `${levelIndex * TREE_LEVEL_INDENT_REM + TREE_LINE_OFFSET_REM}rem`;
}

function GetTreePaddingLeft(level: number): string {
  return `${level * TREE_LEVEL_INDENT_REM + TREE_TEXT_GAP_REM}rem`;
}

type ColumnVisibilityState = Record<string, boolean>;

type ColumnGroupSegment = {
  title?: string;
  color?: Color;
  align: "left" | "center" | "right";
  colSpan: number;
  key: string;
};

function ExtractKey<T>(key: unknown): keyof T | null {
  if (!key) return null;
  if (typeof key !== "object") return key as keyof T;
  if ("field" in key) return (key as { field: keyof T }).field;

  return null;
}

/** Consecutive visible columns sharing `group.title` collapse into one colSpan segment. */
function BuildColumnGroups<T extends object>(columns: TableColumnProps<T>[]): ColumnGroupSegment[] | null {
  const visible = columns.filter((c) => c.isShow !== false);
  if (!visible.some((c) => c.group?.title)) return null;

  const segments: ColumnGroupSegment[] = [];

  visible.forEach((column, index) => {
    const group = column.group;
    const title = group?.title;
    const last = segments[segments.length - 1];

    if (title && last?.title === title) {
      last.colSpan += 1;
      return;
    }

    segments.push({
      title,
      color: group?.color,
      align: group?.align ?? "center",
      colSpan: 1,
      key: `${title ?? "ungrouped"}-${segments.length}-${index}`,
    });
  });

  return segments;
}

// Her tablo için tekil bir localStorage anahtarı üretir.
function GetColumnStorageKey(storageKey?: string, title?: string): string {
  return `har-table:columns:${storageKey ?? title ?? "default"}`;
}

// SSR güvenli okuma: window yoksa veya JSON bozuksa boş obje döner, patlamaz.
function LoadColumnVisibility(key: string): ColumnVisibilityState {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ColumnVisibilityState) : {};
  } catch {
    return {};
  }
}

// SSR güvenli yazma: quota dolu / erişim yasaklıysa sessizce yutar.
function SaveColumnVisibility(key: string, state: ColumnVisibilityState): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // localStorage dolu veya erişilemez durumda; kritik değil, sessiz geç
  }
}

// Kolon sırası için tekil bir localStorage anahtarı üretir.
function GetColumnOrderStorageKey(storageKey?: string, title?: string): string {
  return `har-table:column-order:${storageKey ?? title ?? "default"}`;
}

// SSR güvenli okuma: window yoksa veya JSON bozuksa boş dizi döner, patlamaz.
function LoadColumnOrder(key: string): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

// SSR güvenli yazma: quota dolu / erişim yasaklıysa sessizce yutar.
function SaveColumnOrder(key: string, order: string[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(order));
  } catch {
    // localStorage dolu veya erişilemez durumda; kritik değil, sessiz geç
  }
}

// PDF kolon seçimi için tekil bir localStorage anahtarı üretir.
function GetColumnPdfStorageKey(storageKey?: string, title?: string): string {
  return `har-table:column-pdf:${storageKey ?? title ?? "default"}`;
}

function LoadColumnPdf(key: string): ColumnVisibilityState {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ColumnVisibilityState) : {};
  } catch {
    return {};
  }
}

function SaveColumnPdf(key: string, state: ColumnVisibilityState): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // localStorage dolu veya erişilemez durumda; kritik değil, sessiz geç
  }
}

const COLUMNS_POPUP_WIDTH = 320;
const FILTER_POPUP_WIDTH = 264;
const PROPERTIES_POPUP_WIDTH = 225;
const POPUP_VIEWPORT_PAD = 8;
const POPUP_GAP = 6;

function PlaceTablePopup(trigger: DOMRect, width: number): { x: number; y: number } {
  const vw = window.innerWidth;
  let x = trigger.left;

  if (trigger.left > vw / 2) x = trigger.right - width;

  x = Math.min(Math.max(POPUP_VIEWPORT_PAD, x), Math.max(POPUP_VIEWPORT_PAD, vw - width - POPUP_VIEWPORT_PAD));

  return { x, y: trigger.bottom + POPUP_GAP };
}

function ClampTablePopup(origin: { x: number; y: number }, popup: DOMRect): { x: number; y: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let x = origin.x;
  let y = origin.y;

  if (x + popup.width > vw - POPUP_VIEWPORT_PAD) x = Math.max(POPUP_VIEWPORT_PAD, vw - popup.width - POPUP_VIEWPORT_PAD);
  if (x < POPUP_VIEWPORT_PAD) x = POPUP_VIEWPORT_PAD;

  if (y + popup.height > vh - POPUP_VIEWPORT_PAD) {
    const flipped = origin.y - popup.height - POPUP_GAP * 2;
    y = flipped >= POPUP_VIEWPORT_PAD ? flipped : Math.max(POPUP_VIEWPORT_PAD, vh - popup.height - POPUP_VIEWPORT_PAD);
  }

  if (y < POPUP_VIEWPORT_PAD) y = POPUP_VIEWPORT_PAD;

  return { x, y };
}

export {
  ExtractKey,
  GetColumnValue,
  PatchColumnValue,
  OpenAllSubrows,
  IsSubrowBranchEnd,
  GetTreeLineLeft,
  GetTreePaddingLeft,
  BuildColumnGroups,
  GetColumnStorageKey,
  LoadColumnVisibility,
  SaveColumnVisibility,
  GetColumnOrderStorageKey,
  LoadColumnOrder,
  SaveColumnOrder,
  GetColumnPdfStorageKey,
  LoadColumnPdf,
  SaveColumnPdf,
  COLUMNS_POPUP_WIDTH,
  FILTER_POPUP_WIDTH,
  PROPERTIES_POPUP_WIDTH,
  PlaceTablePopup,
  ClampTablePopup,
};
export type { ColumnVisibilityState, ColumnGroupSegment };
