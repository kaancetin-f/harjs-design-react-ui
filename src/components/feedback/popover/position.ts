export const POPOVER_VIEWPORT_GUTTER = 8;
export const POPOVER_TRIGGER_GAP = 7.5;

export type PopoverBox = {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
};

export type ViewportSize = {
  width: number;
  height: number;
};

export const calculatePopoverPosition = (
  trigger: PopoverBox,
  panel: Pick<PopoverBox, "width" | "height">,
  viewport: ViewportSize,
  options?: { gutter?: number; gap?: number },
): { top: number; left: number } => {
  const gutter = options?.gutter ?? POPOVER_VIEWPORT_GUTTER;
  const gap = options?.gap ?? POPOVER_TRIGGER_GAP;
  const screenCenterX = viewport.width / 2;
  const screenCenterY = viewport.height / 2;

  let top =
    trigger.top > screenCenterY
      ? trigger.top - panel.height + trigger.height
      : trigger.top;
  let left =
    trigger.left > screenCenterX
      ? trigger.right - trigger.width - gap - panel.width
      : trigger.left + trigger.width + gap;

  top = Math.min(
    Math.max(gutter, top),
    Math.max(gutter, viewport.height - panel.height - gutter),
  );
  left = Math.min(
    Math.max(gutter, left),
    Math.max(gutter, viewport.width - panel.width - gutter),
  );

  return { top, left };
};
