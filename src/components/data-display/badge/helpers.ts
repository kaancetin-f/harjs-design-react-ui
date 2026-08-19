export const DEFAULT_OVERFLOW_COUNT = 99;

export function shouldShowBadgeCount(
  count: number | string | undefined,
  showZero = false,
): boolean {
  if (count === undefined || count === null) return false;
  if (typeof count === "string") return count.trim() !== "";
  if (count === 0) return showZero;
  return true;
}

export function formatBadgeCount(
  count: number | string,
  overflowCount = DEFAULT_OVERFLOW_COUNT,
): string {
  if (typeof count === "string") return count;
  if (count > overflowCount) return `${overflowCount}+`;
  return String(count);
}
