export const TOOLTIP_OFFSET = 17.5;
export const VIEWPORT_PADDING = 10;

export type TooltipDirection = "top" | "right" | "left" | "bottom";

export type TooltipBox = {
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

type TooltipSize = Pick<TooltipBox, "width" | "height">;

type SideSpace = Record<TooltipDirection, number>;

const spaceAround = (
  trigger: TooltipBox,
  viewport: ViewportSize,
): SideSpace => ({
  top: trigger.top,
  bottom: viewport.height - trigger.bottom,
  left: trigger.left,
  right: viewport.width - trigger.right,
});

const neededSpace = (
  direction: TooltipDirection,
  tooltip: TooltipSize,
  offset: number,
) =>
  direction === "top" || direction === "bottom"
    ? tooltip.height + offset
    : tooltip.width + offset;

const fits = (
  direction: TooltipDirection,
  space: SideSpace,
  tooltip: TooltipSize,
  offset: number,
) => space[direction] >= neededSpace(direction, tooltip, offset);

const opposite: Record<TooltipDirection, TooltipDirection> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

export const getBestTooltipDirection = (
  preferred: TooltipDirection,
  trigger: TooltipBox,
  tooltip: TooltipSize,
  viewport: ViewportSize,
  offset = TOOLTIP_OFFSET,
): TooltipDirection => {
  const space = spaceAround(trigger, viewport);
  let direction = preferred;

  if (!fits(direction, space, tooltip, offset)) {
    direction = opposite[direction];
  }

  if (fits(direction, space, tooltip, offset)) return direction;

  const maxSpace = Math.max(space.top, space.bottom, space.left, space.right);

  if (maxSpace === space.top) return "top";
  if (maxSpace === space.bottom) return "bottom";
  if (maxSpace === space.left) return "left";
  return "right";
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(min, value), Math.max(min, max));

export const calculateTooltipPosition = ({
  triggerRect,
  tooltipRect,
  direction,
  viewport,
  offset = TOOLTIP_OFFSET,
  padding = VIEWPORT_PADDING,
}: {
  triggerRect: TooltipBox;
  tooltipRect: TooltipSize;
  direction: TooltipDirection;
  viewport: ViewportSize;
  offset?: number;
  padding?: number;
}): { top: number; left: number; direction: TooltipDirection } => {
  const finalDirection = getBestTooltipDirection(
    direction,
    triggerRect,
    tooltipRect,
    viewport,
    offset,
  );

  let top = 0;
  let left = 0;

  switch (finalDirection) {
    case "top":
      top = triggerRect.top - tooltipRect.height - offset;
      left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
      break;
    case "right":
      top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
      left = triggerRect.right + offset;
      break;
    case "bottom":
      top = triggerRect.bottom + offset;
      left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
      break;
    case "left":
      top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
      left = triggerRect.left - tooltipRect.width - offset;
      break;
  }

  left = clamp(left, padding, viewport.width - tooltipRect.width - padding);
  top = clamp(top, padding, viewport.height - tooltipRect.height - padding);

  return { top, left, direction: finalDirection };
};
