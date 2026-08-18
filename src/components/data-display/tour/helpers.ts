export type TourTarget = string | (() => Element | null);

export type TourNavState = {
  isFirst: boolean;
  isLast: boolean;
  showPrevious: boolean;
  showNext: boolean;
  showFinish: boolean;
  showSkip: boolean;
};

export const TOUR_SEEN_VALUE = "1";
export const TOUR_STORAGE_PREFIX = "har-tour";

export const clampTourStep = (step: number, count: number) => {
  if (count <= 0) return 0;
  if (!Number.isFinite(step)) return 0;
  return Math.min(Math.max(0, Math.trunc(step)), count - 1);
};

export const getTourStorageKey = (name: string) => `${TOUR_STORAGE_PREFIX}::${name}`;

export const parseTourSeen = (raw: string | null): boolean => raw === TOUR_SEEN_VALUE;

export const readTourSeen = (key: string): boolean => {
  if (typeof window === "undefined") return false;

  try {
    return parseTourSeen(window.localStorage.getItem(key));
  } catch {
    return false;
  }
};

export const writeTourSeen = (key: string) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, TOUR_SEEN_VALUE);
  } catch {
    // private mode / quota
  }
};

export const shouldAutoOpenTour = (options: { once: boolean; seen: boolean }): boolean => {
  if (options.once && options.seen) return false;
  return true;
};

export const getTourNavState = (index: number, count: number): TourNavState => {
  if (count <= 0) {
    return {
      isFirst: true,
      isLast: true,
      showPrevious: false,
      showNext: false,
      showFinish: false,
      showSkip: false,
    };
  }

  const isFirst = index <= 0;
  const isLast = index >= count - 1;

  return {
    isFirst,
    isLast,
    showPrevious: !isFirst,
    showNext: !isLast,
    showFinish: isLast,
    showSkip: !isLast,
  };
};

export const resolveTourTarget = (target: TourTarget | undefined): Element | null => {
  if (typeof document === "undefined" || target == null) return null;

  try {
    if (typeof target === "function") {
      const node = target();
      return node instanceof Element ? node : null;
    }

    if (typeof target === "string") {
      const selector = target.trim();
      if (!selector) return null;
      return document.querySelector(selector);
    }
  } catch {
    return null;
  }

  return null;
};

export const isOverflowScrollable = (
  overflowX: string,
  overflowY: string,
  scrollWidth: number,
  scrollHeight: number,
  clientWidth: number,
  clientHeight: number,
): boolean => {
  const canX = overflowX === "auto" || overflowX === "scroll" || overflowX === "overlay";
  const canY = overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";
  return (canX && scrollWidth > clientWidth) || (canY && scrollHeight > clientHeight);
};

export const getScrollOffsetToReveal = (
  targetStart: number,
  targetSize: number,
  viewStart: number,
  viewSize: number,
  currentScroll: number,
  padding: number,
): number => {
  const targetEnd = targetStart + targetSize;
  const paddedStart = viewStart + padding;
  const paddedEnd = viewStart + viewSize - padding;
  const paddedSize = viewSize - padding * 2;

  if (targetStart >= paddedStart && targetEnd <= paddedEnd) return currentScroll;

  if (targetSize >= paddedSize) return currentScroll + (targetStart - paddedStart);

  const targetCenter = targetStart + targetSize / 2;
  const viewCenter = viewStart + viewSize / 2;
  return currentScroll + (targetCenter - viewCenter);
};

export const collectScrollParents = (element: Element): HTMLElement[] => {
  const parents: HTMLElement[] = [];
  if (typeof window === "undefined" || typeof document === "undefined") return parents;

  let node = element.parentElement;
  while (node && node !== document.body && node !== document.documentElement) {
    const style = window.getComputedStyle(node);
    if (
      isOverflowScrollable(
        style.overflowX,
        style.overflowY,
        node.scrollWidth,
        node.scrollHeight,
        node.clientWidth,
        node.clientHeight,
      )
    ) {
      parents.push(node);
    }
    node = node.parentElement;
  }

  return parents;
};

export const scrollTourTargetIntoView = (element: Element, padding = 10) => {
  if (typeof window === "undefined") return;

  const parents = collectScrollParents(element);

  for (const parent of parents) {
    const target = element.getBoundingClientRect();
    const view = parent.getBoundingClientRect();
    parent.scrollTop = getScrollOffsetToReveal(
      target.top,
      target.height,
      view.top,
      view.height,
      parent.scrollTop,
      padding,
    );
    parent.scrollLeft = getScrollOffsetToReveal(
      target.left,
      target.width,
      view.left,
      view.width,
      parent.scrollLeft,
      padding,
    );
  }

  const box = element.getBoundingClientRect();
  const nextTop = getScrollOffsetToReveal(box.top, box.height, 0, window.innerHeight, window.scrollY, padding);
  const nextLeft = getScrollOffsetToReveal(box.left, box.width, 0, window.innerWidth, window.scrollX, padding);

  if (nextTop === window.scrollY && nextLeft === window.scrollX) return;

  window.scrollTo({
    top: Math.max(0, nextTop),
    left: Math.max(0, nextLeft),
    behavior: "auto",
  });
};
