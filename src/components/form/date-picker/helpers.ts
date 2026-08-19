/** Matches Layout’s mobile breakpoint, plus coarse pointers (phones / tablets). */
export const NATIVE_DATE_PICKER_QUERY = "(max-width: 767px), (hover: none) and (pointer: coarse)";

export const CALENDAR_VIEWPORT_PADDING = 8;

export const isMobileUserAgent = (userAgent: string): boolean =>
  /android/i.test(userAgent) || /iphone|ipad|ipod/i.test(userAgent);

export const shouldUseNativeDatePicker = (userAgent: string, mediaMatches: boolean): boolean =>
  isMobileUserAgent(userAgent) || mediaMatches;

export const clampCalendarPosition = (
  left: number,
  top: number,
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
  scrollX: number,
  scrollY: number,
  padding: number = CALENDAR_VIEWPORT_PADDING,
): { left: number; top: number } => {
  const minLeft = padding + scrollX;
  const maxLeft = scrollX + viewportWidth - width - padding;
  const minTop = padding + scrollY;
  const maxTop = scrollY + viewportHeight - height - padding;

  return {
    left: Math.min(Math.max(left, minLeft), Math.max(minLeft, maxLeft)),
    top: Math.min(Math.max(top, minTop), Math.max(minTop, maxTop)),
  };
};
