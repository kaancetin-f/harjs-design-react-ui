const TABLE_ROW_CLICK_IGNORE_SELECTOR = [
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "label",
  "[role='button']",
  "[role='checkbox']",
  "[role='link']",
  "[role='menuitem']",
  "[role='option']",
  "[role='switch']",
  "[contenteditable='true']",
  ".subitem-open-button",
  ".dnd-handle",
  ".har-checkbox-wrapper",
  ".har-input-wrapper",
  ".har-select-wrapper",
  ".har-select-options",
  ".har-date-picker",
].join(",");

const ROW_CLICK_MOVE_THRESHOLD = 4;

function IsInteractiveRowTarget(target: EventTarget | null): boolean {
  if (target == null || typeof (target as Element).closest !== "function") return false;

  return (target as Element).closest(TABLE_ROW_CLICK_IGNORE_SELECTOR) != null;
}

function IsRowPointerDrag(
  start: { x: number; y: number } | null,
  point: { x: number; y: number },
): boolean {
  if (!start) return false;

  return (
    Math.abs(point.x - start.x) > ROW_CLICK_MOVE_THRESHOLD || Math.abs(point.y - start.y) > ROW_CLICK_MOVE_THRESHOLD
  );
}

export { IsInteractiveRowTarget, IsRowPointerDrag, TABLE_ROW_CLICK_IGNORE_SELECTOR };
