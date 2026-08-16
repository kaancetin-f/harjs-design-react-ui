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
import "../../../assets/css/components/feedback/popover/styles.css";
import Button from "../../form/button";
import Typography from "../../data-display/typography";
import IProps from "./IProps";
import { calculatePopoverPosition } from "./position";

const { Title, Paragraph } = Typography;

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const EXIT_MS = 180;

const popoverStack: symbol[] = [];

const visibleFocusable = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (node) => node.getClientRects().length > 0,
  );

const Popover: React.FC<IProps> = ({
  children,
  title,
  message,
  content,
  onConfirm,
  windowBlur,
  fullWidth,
  config,
}) => {
  // hooks
  const uid = useId();

  // variables
  const panelId = `${uid}-panel`;
  const titleId = `${uid}-title`;
  const messageId = `${uid}-message`;

  // refs
  const _instanceId = useRef(Symbol("har-popover"));
  const _wrapperRef = useRef<HTMLDivElement>(null);
  const _panelRef = useRef<HTMLDivElement>(null);
  const _triggerRef = useRef<HTMLDivElement>(null);
  const _previousFocus = useRef<HTMLElement | null>(null);
  const _positionFrame = useRef(0);

  // states
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [exited, setExited] = useState(true);

  // variables
  // Çıkış animasyonu bitene kadar paneli DOM'da tut.
  const visible = open || !exited;

  // methods
  const close = useCallback(() => setOpen(false), []);

  const updatePosition = useCallback(() => {
    const panel = _panelRef.current;
    const trigger = _triggerRef.current;
    if (!panel || !trigger) return;

    const next = calculatePopoverPosition(
      trigger.getBoundingClientRect(),
      panel.getBoundingClientRect(),
      { width: window.innerWidth, height: window.innerHeight },
    );

    panel.style.top = `${next.top}px`;
    panel.style.left = `${next.left}px`;
  }, []);

  const schedulePosition = useCallback(() => {
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
    if (open) {
      setExited(false);
      return;
    }

    setEntered(false);

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setExited(true);
      return;
    }

    const timeout = window.setTimeout(() => setExited(true), EXIT_MS);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !mounted) return;

    updatePosition();

    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setEntered(true));
    });

    const panel = _panelRef.current;
    const observer =
      panel && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => schedulePosition())
        : null;
    if (panel && observer) observer.observe(panel);

    window.addEventListener("resize", schedulePosition);
    window.addEventListener("scroll", schedulePosition, {
      capture: true,
      passive: true,
    });

    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
      if (_positionFrame.current) {
        window.cancelAnimationFrame(_positionFrame.current);
        _positionFrame.current = 0;
      }
      observer?.disconnect();
      window.removeEventListener("resize", schedulePosition);
      window.removeEventListener("scroll", schedulePosition, true);
    };
  }, [open, mounted, updatePosition, schedulePosition]);

  useEffect(() => {
    if (!open) return;

    const id = _instanceId.current;
    popoverStack.push(id);
    _previousFocus.current = document.activeElement as HTMLElement | null;

    const handleClickOutside = (event: Event) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (_panelRef.current?.contains(target)) return;
      if (_triggerRef.current?.contains(target)) return;
      if (_wrapperRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const root = _panelRef.current;
        if (!root) return;
        const nodes = visibleFocusable(root);
        if (nodes.length === 0) {
          event.preventDefault();
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      if (event.key !== "Escape") return;
      if (popoverStack[popoverStack.length - 1] !== id) return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    };

    const handleWindowBlur = () => setOpen(false);

    const timeout = window.setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeys);
      if (!windowBlur) window.addEventListener("blur", handleWindowBlur);
    }, 0);

    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeys);
      window.removeEventListener("blur", handleWindowBlur);
      const index = popoverStack.lastIndexOf(id);
      if (index >= 0) popoverStack.splice(index, 1);
      _previousFocus.current?.focus({ preventScroll: true });
    };
  }, [open, windowBlur]);

  useEffect(() => {
    if (!open || !entered) return;
    _panelRef.current?.focus({ preventScroll: true });
  }, [open, entered]);

  // methods
  const confirm = (value: boolean) => {
    onConfirm?.(value);
    close();
  };

  // variables
  const trigger = React.isValidElement(children)
    ? React.cloneElement(
        children as React.ReactElement<Record<string, unknown>>,
        {
          "aria-expanded": open,
          "aria-haspopup": "dialog",
          "aria-controls": visible ? panelId : undefined,
        },
      )
    : children;

  const wrapperClass = [
    "har-popover-wrapper",
    fullWidth ? "full-width" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const panelClass = [
    "har-popover",
    onConfirm ? "is-confirm" : undefined,
    entered ? "is-entered" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={_wrapperRef} className={wrapperClass}>
      {mounted &&
        visible &&
        createPortal(
          <div
            ref={_panelRef}
            id={panelId}
            className={panelClass}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={message ? messageId : undefined}
            tabIndex={-1}
          >
            {title ? (
              <div className="title">
                <Title id={titleId} size="md">
                  {title}
                </Title>
              </div>
            ) : null}

            {message ? (
              <Paragraph id={messageId} className="message" size="sm">
                {message}
              </Paragraph>
            ) : null}

            {content ? <div className="content">{content}</div> : null}

            {onConfirm ? (
              <div className="footer">
                <Button
                  variant="outlined"
                  color="gray"
                  size="sm"
                  onClick={() => confirm(false)}
                >
                  {config?.buttons.cancel ?? "Hayır"}
                </Button>
                <Button color="green" size="sm" onClick={() => confirm(true)}>
                  {config?.buttons.okay ?? "Evet"}
                </Button>
              </div>
            ) : null}
          </div>,
          document.body,
        )}

      <div
        ref={_triggerRef}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        {trigger}
      </div>
    </div>
  );
};

Popover.displayName = "Popover";
export default Popover;
export { calculatePopoverPosition } from "./position";
