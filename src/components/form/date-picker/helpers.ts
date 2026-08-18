/** Matches Layout’s mobile breakpoint, plus coarse pointers (phones / tablets). */
export const NATIVE_DATE_PICKER_QUERY = "(max-width: 767px), (hover: none) and (pointer: coarse)";

export const isMobileUserAgent = (userAgent: string): boolean =>
  /android/i.test(userAgent) || /iphone|ipad|ipod/i.test(userAgent);

export const shouldUseNativeDatePicker = (userAgent: string, mediaMatches: boolean): boolean =>
  isMobileUserAgent(userAgent) || mediaMatches;
