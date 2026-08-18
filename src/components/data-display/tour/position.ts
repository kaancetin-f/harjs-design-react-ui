export const TOUR_OFFSET = 12;
export const TOUR_VIEWPORT_PADDING = 10;
export const TOUR_SPOTLIGHT_PADDING = 8;

export type TourPlacement = "top" | "right" | "bottom" | "left";

export type TourBox = {
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

type TourSize = Pick<TourBox, "width" | "height">;

type SideSpace = Record<TourPlacement, number>;

const spaceAround = (trigger: TourBox, viewport: ViewportSize): SideSpace => ({
  top: trigger.top,
  bottom: viewport.height - trigger.bottom,
  left: trigger.left,
  right: viewport.width - trigger.right,
});

const neededSpace = (placement: TourPlacement, panel: TourSize, offset: number) =>
  placement === "top" || placement === "bottom" ? panel.height + offset : panel.width + offset;

const fits = (placement: TourPlacement, space: SideSpace, panel: TourSize, offset: number) =>
  space[placement] >= neededSpace(placement, panel, offset);

const opposite: Record<TourPlacement, TourPlacement> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

export const getBestTourPlacement = (
  preferred: TourPlacement,
  trigger: TourBox,
  panel: TourSize,
  viewport: ViewportSize,
  offset = TOUR_OFFSET,
): TourPlacement => {
  const space = spaceAround(trigger, viewport);
  let placement = preferred;

  if (!fits(placement, space, panel, offset)) {
    placement = opposite[placement];
  }

  if (fits(placement, space, panel, offset)) return placement;

  const maxSpace = Math.max(space.top, space.bottom, space.left, space.right);

  if (maxSpace === space.top) return "top";
  if (maxSpace === space.bottom) return "bottom";
  if (maxSpace === space.left) return "left";
  return "right";
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(min, value), Math.max(min, max));

export const rectToBox = (rect: {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}): TourBox => ({
  top: rect.top,
  left: rect.left,
  width: rect.width,
  height: rect.height,
  right: rect.right,
  bottom: rect.bottom,
});

export const getSpotlightRect = (rect: TourBox, padding: number): TourBox => {
  const top = rect.top - padding;
  const left = rect.left - padding;
  const width = Math.max(0, rect.width + padding * 2);
  const height = Math.max(0, rect.height + padding * 2);

  return {
    top,
    left,
    width,
    height,
    right: left + width,
    bottom: top + height,
  };
};

export const intersectBoxes = (a: TourBox, b: TourBox): TourBox | null => {
  const left = Math.max(a.left, b.left);
  const top = Math.max(a.top, b.top);
  const right = Math.min(a.right, b.right);
  const bottom = Math.min(a.bottom, b.bottom);

  if (right <= left || bottom <= top) return null;

  return { top, left, right, bottom, width: right - left, height: bottom - top };
};

export const isRectInViewport = (
  rect: Pick<TourBox, "top" | "left" | "right" | "bottom" | "width" | "height">,
  viewport: ViewportSize,
  padding = 0,
): boolean => {
  const visibleVertically = rect.bottom > padding && rect.top < viewport.height - padding;
  const visibleHorizontally = rect.right > padding && rect.left < viewport.width - padding;

  if (!visibleVertically || !visibleHorizontally) return false;

  const fitsVertically = rect.height <= viewport.height - padding * 2;
  const fitsHorizontally = rect.width <= viewport.width - padding * 2;

  if (!fitsVertically || !fitsHorizontally) return true;

  return (
    rect.top >= padding &&
    rect.left >= padding &&
    rect.bottom <= viewport.height - padding &&
    rect.right <= viewport.width - padding
  );
};

export const getTourPanelFallbackPosition = (
  panel: TourSize,
  viewport: ViewportSize,
  padding = TOUR_VIEWPORT_PADDING,
): { top: number; left: number } => ({
  top: clamp((viewport.height - panel.height) / 2, padding, viewport.height - panel.height - padding),
  left: clamp((viewport.width - panel.width) / 2, padding, viewport.width - panel.width - padding),
});

export const calculateTourPosition = ({
  triggerRect,
  panelRect,
  placement,
  viewport,
  offset = TOUR_OFFSET,
  padding = TOUR_VIEWPORT_PADDING,
}: {
  triggerRect: TourBox;
  panelRect: TourSize;
  placement: TourPlacement;
  viewport: ViewportSize;
  offset?: number;
  padding?: number;
}): { top: number; left: number; placement: TourPlacement } => {
  const finalPlacement = getBestTourPlacement(placement, triggerRect, panelRect, viewport, offset);

  let top = 0;
  let left = 0;

  switch (finalPlacement) {
    case "top":
      top = triggerRect.top - panelRect.height - offset;
      left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
      break;
    case "right":
      top = triggerRect.top + triggerRect.height / 2 - panelRect.height / 2;
      left = triggerRect.right + offset;
      break;
    case "bottom":
      top = triggerRect.bottom + offset;
      left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
      break;
    case "left":
      top = triggerRect.top + triggerRect.height / 2 - panelRect.height / 2;
      left = triggerRect.left - panelRect.width - offset;
      break;
  }

  left = clamp(left, padding, viewport.width - panelRect.width - padding);
  top = clamp(top, padding, viewport.height - panelRect.height - padding);

  return { top, left, placement: finalPlacement };
};
