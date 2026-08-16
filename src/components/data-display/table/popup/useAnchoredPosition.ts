import { useLayoutEffect, useState, type RefObject } from "react";
import { ClampTablePopup } from "../Helpers";

function useAnchoredPosition(
  open: boolean,
  coordinate: { x: number; y: number },
  popupRef: RefObject<HTMLElement | null>,
) {
  const [clamped, setClamped] = useState<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setClamped(null);
      return;
    }

    const node = popupRef.current;
    if (!node) {
      setClamped(coordinate);
      return;
    }

    setClamped(ClampTablePopup(coordinate, node.getBoundingClientRect()));
  }, [coordinate, open, popupRef]);

  return clamped ?? coordinate;
}

export default useAnchoredPosition;
