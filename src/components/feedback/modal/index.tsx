"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import IProps from "./IProps";
import "../../../assets/css/components/feedback/modal/styles.css";
import Typography from "../../data-display/typography";
import Button from "../../form/button";
import Popover from "../popover";
import Utils from "../../../libs/infrastructure/shared/Utils";
import { Icon } from "../../icons";

const { Title, Paragraph } = Typography;

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const BASE_Z = 1050;
const EXIT_MS = 220;

const overlayIsClear = () => {
  const empty = (className: string) => document.getElementsByClassName(className).length === 0;
  return empty("har-select-options") && empty("har-date-calendar") && empty("har-popover");
};

let lockCount = 0;
const modalStack: symbol[] = [];

const lockScroll = () => {
  if (typeof document === "undefined") return;
  if (lockCount === 0) {
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
  }
  lockCount += 1;
};

const unlockScroll = () => {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("padding-right");
  }
};

const visibleFocusable = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((node) => node.getClientRects().length > 0);

const Modal: React.FC<IProps> = ({
  children,
  open,
  closePopover,
  title,
  description,
  size = "lg",
  footer,
  border,
  onClose,
  disableCloseOnBackdrop,
  disableCloseOnEsc,
  config,
  className,
  style,
  role,
  ...attributes
}) => {
  // refs
  const _instanceId = useRef(Symbol("har-modal"));
  const _modal = useRef<HTMLDivElement>(null);
  const _previousFocus = useRef<HTMLElement | null>(null);

  // states
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [exited, setExited] = useState(!open.get);
  const [depth, setDepth] = useState(0);

  // hooks
  const uid = useId();

  // variables
  const keepMounted = config?.keepMounted ?? false;
  const titleId = `${uid}-title`;
  const descriptionId = `${uid}-description`;
  const setOpen = open.set;

  // methods
  const close = useCallback(() => {
    onClose?.();
    setOpen(false);
  }, [onClose, setOpen]);

  // useEffects
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open.get) setExited(false);
  }, [open.get]);

  useEffect(() => {
    if (!open.get) {
      setEntered(false);
      return;
    }

    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [open.get]);

  useEffect(() => {
    if (open.get) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setExited(true);
      return;
    }

    const timeout = window.setTimeout(() => setExited(true), EXIT_MS);
    return () => window.clearTimeout(timeout);
  }, [open.get]);

  useEffect(() => {
    if (!open.get) return;

    const id = _instanceId.current;
    modalStack.push(id);
    setDepth(modalStack.length - 1);
    _previousFocus.current = document.activeElement as HTMLElement | null;
    lockScroll();

    const handleKeys = (event: KeyboardEvent) => {
      if (modalStack[modalStack.length - 1] !== id) return;

      if (event.key === "Tab") {
        const popover = document.querySelector(".har-popover") as HTMLElement | null;
        const root = popover ?? _modal.current;
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

      if (disableCloseOnEsc) return;
      if (event.key !== "Escape" || !overlayIsClear()) return;
      event.stopPropagation();
      close();
    };

    document.addEventListener("keydown", handleKeys);

    return () => {
      const index = modalStack.lastIndexOf(id);
      if (index >= 0) modalStack.splice(index, 1);
      unlockScroll();
      document.removeEventListener("keydown", handleKeys);
      _previousFocus.current?.focus({ preventScroll: true });
    };
  }, [open.get, close, disableCloseOnEsc]);

  useEffect(() => {
    if (!open.get || !entered) return;
    const focusable = _modal.current ? visibleFocusable(_modal.current)[0] : undefined;
    (focusable ?? _modal.current)?.focus({ preventScroll: true });
  }, [open.get, entered]);

  // variables
  // Çıkış animasyonu bitene veya keepMounted olana kadar render et.
  const present = open.get || !exited || keepMounted;
  if (!mounted || !present) return null;

  const wrapperClass = [
    "har-modal-wrapper",
    open.get || !exited ? "opened" : "closed",
    entered ? "is-entered" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const classNames = [
    "har-modal",
    `size-${size}`,
    ...Utils.GetClassName(undefined, undefined, undefined, border, undefined, undefined, className),
  ]
    .filter(Boolean)
    .join(" ");

  const closeControl = (
    <Button
      className="close"
      variant="borderless"
      color="red"
      size="xs"
      shape="circle"
      border={{ radius: "full" }}
      aria-label="Close"
      icon={{ element: <Icon icon="X" size={16} /> }}
      onClick={closePopover ? undefined : close}
    />
  );

  const node = (
    <div className={wrapperClass} aria-hidden={!open.get} style={{ zIndex: BASE_Z + depth * 10 }}>
      <div
        className="har-modal-bg"
        onMouseDown={() => {
          if (disableCloseOnBackdrop || !overlayIsClear()) return;
          close();
        }}
      />

      <div
        {...attributes}
        ref={_modal}
        className={classNames}
        style={style}
        role={role ?? "dialog"}
        aria-modal={open.get || undefined}
        aria-labelledby={title ? titleId : description ? descriptionId : undefined}
        aria-describedby={title && description ? descriptionId : undefined}
        tabIndex={-1}
        onTransitionEnd={(event) => {
          if (event.target !== event.currentTarget) return;
          if (!open.get) setExited(true);
        }}
      >
        <div className={["header", title || description ? undefined : "bare"].filter(Boolean).join(" ")}>
          {title || description ? (
            <div className="heading">
              {title ? (
                <Title id={titleId} size="lg">
                  {title}
                </Title>
              ) : null}
              {description ? (
                <Paragraph id={descriptionId} color="gray-500">
                  {description}
                </Paragraph>
              ) : null}
            </div>
          ) : null}
          {closePopover ? (
            <div onMouseDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()}>
              <Popover {...closePopover}>{closeControl}</Popover>
            </div>
          ) : (
            closeControl
          )}
        </div>

        <div className={["content", config?.freeContent ? "free" : undefined].filter(Boolean).join(" ")}>{children}</div>

        {footer ? <div className="footer">{footer}</div> : null}
      </div>
    </div>
  );

  return createPortal(node, document.body);
};

Modal.displayName = "Modal";
export default Modal;
