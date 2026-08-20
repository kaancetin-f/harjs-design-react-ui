export const DEFAULT_TRIGGER_KEY = "@";
export const DEFAULT_ALIAS_COLOR = "blue";
export const ALIAS_ITEM_HEIGHT = 40;
export const ALIAS_VISIBLE_COUNT = 8;
export const ALIAS_OVERSCAN = 4;
export const ALIAS_CARET_GAP = 8;
export const ALIAS_VIEWPORT_PADDING = 8;
export const ALIAS_PANEL_MIN_WIDTH = 260;
export const ALIAS_HEADER_HEIGHT = 36;
export const ALIAS_FOOTER_HEIGHT = 28;

const COLOR_TOKENS = new Set([
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "cyan",
  "gray",
  "white",
]);

const AVATAR_TONES = ["blue", "purple", "pink", "teal", "cyan", "green", "orange"] as const;

export type AliasAvatarTone = (typeof AVATAR_TONES)[number];

export type AliasBox = {
  top: number;
  left: number;
  bottom: number;
  height: number;
};

export type AliasSize = {
  width: number;
  height: number;
};

export type ViewportSize = {
  width: number;
  height: number;
};

export type AliasPlacement = "top" | "bottom";

export type AliasMatchPart = {
  text: string;
  match: boolean;
};

export type AliasWindow = {
  start: number;
  end: number;
  offsetTop: number;
  height: number;
};

export const getDisplayText = <T extends object>(item: T, display: keyof T) => {
  const value = item[display];
  return value == null ? "" : String(value);
};

export const resolveAliasTokenColors = (
  color: string | undefined,
  readToken: (name: string) => string,
): { accent: string; text: string } => {
  const token = color && COLOR_TOKENS.has(color) ? color : undefined;

  if (token) {
    const accentFallback = token === "white" ? "#ffffff" : token === "gray" ? "#6b7280" : "#3b82f6";
    const accent = readToken(`--${token}-500`) || accentFallback;
    const text =
      token === "white" || token === "gray"
        ? readToken("--gray-700") || "#374151"
        : readToken(`--${token}-700`) || accent;

    return { accent, text };
  }

  const custom = color?.trim();
  if (custom) return { accent: custom, text: custom };

  return {
    accent: readToken("--blue-500") || "#3b82f6",
    text: readToken("--blue-700") || "#1d4ed8",
  };
};

export const getTriggerQuery = (text: string, triggerKey = DEFAULT_TRIGGER_KEY) => {
  if (!triggerKey) return null;

  const atIndex = text.lastIndexOf(triggerKey);
  if (atIndex === -1) return null;

  if (atIndex > 0 && !/\s/.test(text[atIndex - 1] ?? "")) return null;

  const query = text.slice(atIndex + triggerKey.length);
  if (/\s/.test(query)) return null;

  return { atIndex, query };
};

export const filterAliasItems = <T extends object>(items: T[], display: keyof T, query: string) => {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return items;

  return items.filter((item) => getDisplayText(item, display).toLocaleLowerCase().includes(needle));
};

export const splitMatchParts = (text: string, query: string): AliasMatchPart[] => {
  const needle = query.trim();
  if (!needle) return [{ text, match: false }];

  const index = text.toLocaleLowerCase().indexOf(needle.toLocaleLowerCase());
  if (index === -1) return [{ text, match: false }];

  const end = index + needle.length;
  const parts: AliasMatchPart[] = [];

  if (index > 0) parts.push({ text: text.slice(0, index), match: false });
  parts.push({ text: text.slice(index, end), match: true });
  if (end < text.length) parts.push({ text: text.slice(end), match: false });

  return parts;
};

export const getInitials = (text: string) => {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`.toUpperCase();
};

export const getAvatarTone = (text: string): AliasAvatarTone => {
  let hash = 0;
  for (let index = 0; index < text.length; index++) {
    hash = (hash + text.charCodeAt(index)) % AVATAR_TONES.length;
  }
  return AVATAR_TONES[hash] ?? "blue";
};

export const wrapIndex = (index: number, length: number) => {
  if (length <= 0) return 0;
  if (index < 0) return length - 1;
  if (index >= length) return 0;
  return index;
};

export const getAliasWindow = (
  total: number,
  scrollTop: number,
  itemHeight = ALIAS_ITEM_HEIGHT,
  visibleCount = ALIAS_VISIBLE_COUNT,
  overscan = ALIAS_OVERSCAN,
): AliasWindow => {
  if (total <= 0) return { start: 0, end: 0, offsetTop: 0, height: 0 };

  const start = Math.max(0, Math.floor(Math.max(0, scrollTop) / itemHeight) - overscan);
  const visibleEnd = Math.ceil((Math.max(0, scrollTop) + visibleCount * itemHeight) / itemHeight) + overscan;
  const end = Math.min(total, Math.max(start + 1, visibleEnd));

  return {
    start,
    end,
    offsetTop: start * itemHeight,
    height: total * itemHeight,
  };
};

export const estimateAliasPanelHeight = (itemCount: number) => {
  const listHeight = Math.min(Math.max(itemCount, 1), ALIAS_VISIBLE_COUNT) * ALIAS_ITEM_HEIGHT;
  return ALIAS_HEADER_HEIGHT + listHeight + ALIAS_FOOTER_HEIGHT;
};

export const scrollIndexIntoView = (scrollTop: number, index: number, viewportHeight: number, itemHeight = ALIAS_ITEM_HEIGHT) => {
  const top = index * itemHeight;
  const bottom = top + itemHeight;

  if (top < scrollTop) return top;
  if (bottom > scrollTop + viewportHeight) return bottom - viewportHeight;
  return scrollTop;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(min, value), Math.max(min, max));

export const calculateAliasPanelPosition = ({
  caret,
  iframe,
  panel,
  viewport,
  gap = ALIAS_CARET_GAP,
  padding = ALIAS_VIEWPORT_PADDING,
}: {
  caret: AliasBox;
  iframe: Pick<AliasBox, "top" | "left">;
  panel: AliasSize;
  viewport: ViewportSize;
  gap?: number;
  padding?: number;
}): { top: number; left: number; placement: AliasPlacement } => {
  const caretTop = iframe.top + caret.top;
  const caretBottom = iframe.top + (caret.bottom || caret.top + caret.height);
  const caretLeft = iframe.left + caret.left;
  const spaceBelow = viewport.height - caretBottom - padding;
  const spaceAbove = caretTop - padding;
  const placement: AliasPlacement =
    spaceBelow < panel.height + gap && spaceAbove > spaceBelow ? "top" : "bottom";

  const top = placement === "bottom" ? caretBottom + gap : caretTop - panel.height - gap;
  const left = caretLeft;

  return {
    top: clamp(top, padding, viewport.height - panel.height - padding),
    left: clamp(left, padding, viewport.width - panel.width - padding),
    placement,
  };
};
