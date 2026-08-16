"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import IProps from "./IProps";
import { calculateTooltipPosition, type TooltipDirection } from "./position";
import "../../../assets/css/components/feedback/tooltip/styles.css";

const Tooltip: React.FC<IProps> = ({ children, text, direction = "top" }) => {
  // hooks
  const reactId = useId();

  // variables
  const tooltipId = `har-tooltip${reactId.replace(/:/g, "")}`;

  // refs
  const _triggerRef = useRef<HTMLDivElement>(null);
  const _tooltipRef = useRef<HTMLDivElement>(null);
  const _preferredDirection = useRef<TooltipDirection>(direction);
  const _positionFrame = useRef(0);
  // Hover ve focus ayrı tutulur; ikisinden biri varken açık kalır.
  const _hovered = useRef(false);
  const _focused = useRef(false);

  // states
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [resolvedDirection, setResolvedDirection] =
    useState<TooltipDirection>(direction);

  _preferredDirection.current = direction;

  // methods
  const syncOpen = useCallback(() => {
    setOpen(_hovered.current || _focused.current);
  }, []);

  const show = useCallback(() => {
    _hovered.current = true;
    syncOpen();
  }, [syncOpen]);

  const hideFromPointer = useCallback(() => {
    _hovered.current = false;
    syncOpen();
  }, [syncOpen]);

  const showFromFocus = useCallback(() => {
    _focused.current = true;
    syncOpen();
  }, [syncOpen]);

  const hideFromFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const next = event.relatedTarget as Node | null;
      if (next && event.currentTarget.contains(next)) return;
      _focused.current = false;
      syncOpen();
    },
    [syncOpen],
  );

  const dismiss = useCallback(() => {
    _hovered.current = false;
    _focused.current = false;
    setOpen(false);
  }, []);

  const updatePosition = useCallback(() => {
    if (typeof window === "undefined") return;

    const trigger = _triggerRef.current;
    const tooltip = _tooltipRef.current;
    if (!trigger || !tooltip) return;

    const next = calculateTooltipPosition({
      triggerRect: trigger.getBoundingClientRect(),
      tooltipRect: tooltip.getBoundingClientRect(),
      direction: _preferredDirection.current,
      viewport: { width: window.innerWidth, height: window.innerHeight },
    });

    tooltip.style.top = `${next.top}px`;
    tooltip.style.left = `${next.left}px`;

    setResolvedDirection((prev) =>
      prev === next.direction ? prev : next.direction,
    );
  }, []);

  const schedulePosition = useCallback(() => {
    if (typeof window === "undefined") return;
    if (_positionFrame.current) return;

    _positionFrame.current = window.requestAnimationFrame(() => {
      _positionFrame.current = 0;
      updatePosition();
    });
  }, [updatePosition]);

  // useEffects
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setResolvedDirection(direction);
  }, [direction]);

  useLayoutEffect(() => {
    if (!open || !mounted) {
      setReady(false);
      return;
    }

    updatePosition();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReady(true);
      return;
    }

    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setReady(true));
    });

    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [open, mounted, direction, updatePosition]);

  useEffect(() => {
    if (
      !open ||
      !mounted ||
      typeof window === "undefined" ||
      typeof document === "undefined"
    ) {
      return;
    }

    const tooltipNode = _tooltipRef.current;

    window.addEventListener("resize", schedulePosition);
    window.addEventListener("scroll", schedulePosition, {
      capture: true,
      passive: true,
    });

    const resizeObserver =
      tooltipNode && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => schedulePosition())
        : null;
    if (tooltipNode && resizeObserver) resizeObserver.observe(tooltipNode);

    const mutationObserver = new MutationObserver((records) => {
      const self = _tooltipRef.current;
      if (
        self &&
        records.every(
          (record) => record.target === self || self.contains(record.target),
        )
      ) {
        return;
      }
      schedulePosition();
    });

    mutationObserver.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener("resize", schedulePosition);
      window.removeEventListener("scroll", schedulePosition, true);
      resizeObserver?.disconnect();
      mutationObserver.disconnect();
      if (_positionFrame.current) {
        window.cancelAnimationFrame(_positionFrame.current);
        _positionFrame.current = 0;
      }
    };
  }, [open, mounted, schedulePosition]);

  // methods
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape" || !open) return;
    event.stopPropagation();
    dismiss();
  };

  // variables
  const describedBy = open ? tooltipId : undefined;
  const trigger = React.isValidElement<{ "aria-describedby"?: string }>(
    children,
  )
    ? React.cloneElement(children, {
        "aria-describedby":
          [children.props["aria-describedby"], describedBy]
            .filter(Boolean)
            .join(" ") || undefined,
      })
    : children;

  const lines = Array.isArray(text) ? text : null;

  return (
    <div className="ar-tooltip-wrapper">
      <div
        ref={_triggerRef}
        onMouseEnter={show}
        onMouseLeave={hideFromPointer}
        onFocus={showFromFocus}
        onBlur={hideFromFocus}
        onKeyDown={handleKeyDown}
      >
        {trigger}
      </div>

      {mounted &&
        open &&
        createPortal(
          <div
            ref={_tooltipRef}
            id={tooltipId}
            role="tooltip"
            className={[
              "ar-tooltip",
              resolvedDirection,
              ready ? "is-ready" : undefined,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {lines ? (
              lines.map((line, index) => (
                <span key={`${index}:${line}`} className="text">
                  <span className="bullet" aria-hidden="true">
                    &#8226;
                  </span>
                  <span>{line}</span>
                </span>
              ))
            ) : (
              <span className="text">{text}</span>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};

Tooltip.displayName = "Tooltip";

export default Tooltip;
