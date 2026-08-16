"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import IProps from "./IProps";
import "../../../assets/css/components/feedback/popup-confirm/styles.css";
import Button from "../../form/button";
import { NotificationContext } from "../../../libs/core/application/contexts/Notification";
import Typography from "../../data-display/typography";
import { getPopupConfirmConfig } from "./helpers";
import { Icon } from "../../icons";

const { Title, Paragraph } = Typography;

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const EXIT_MS = 180;

let lockCount = 0;

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
  [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (node) => node.getClientRects().length > 0,
  );

const PopupConfirm = ({
  title,
  message,
  status,
  isOpen,
  buttons,
  onConfirm,
}: IProps) => {
  // hooks
  const context = useContext(NotificationContext);

  // methods
  const close = useCallback(() => {
    context?.setIsPopupOpen(false);
  }, [context]);

  // hooks
  const uid = useId();

  // variables
  const titleId = `${uid}-title`;
  const messageId = `${uid}-message`;

  // refs
  const _dialogRef = useRef<HTMLDivElement>(null);
  const _previousFocus = useRef<HTMLElement | null>(null);

  // states
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [exited, setExited] = useState(!isOpen);

  // variables
  const visual = getPopupConfirmConfig(status);
  const visible = isOpen || !exited;
  const hasCancel = Boolean(buttons?.cancel);

  // refs
  const _onConfirmRef = useRef(onConfirm);
  _onConfirmRef.current = onConfirm;

  // methods
  const finish = useCallback(
    (confirm: boolean) => {
      _onConfirmRef.current?.(confirm);
      close();
    },
    [close],
  );

  // useEffects
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    _previousFocus.current = document.activeElement as HTMLElement | null;
    lockScroll();

    const handleKeys = (event: KeyboardEvent) => {
      const root = _dialogRef.current;
      if (!root) return;

      if (event.key === "Tab") {
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
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      finish(false);
    };

    document.addEventListener("keydown", handleKeys, true);

    return () => {
      document.removeEventListener("keydown", handleKeys, true);
      unlockScroll();
      _previousFocus.current?.focus({ preventScroll: true });
    };
  }, [isOpen, finish]);

  // Yıkıcı işlemde iptale, diğerlerinde onaya odaklan.
  useEffect(() => {
    if (!isOpen || !entered) return;
    const root = _dialogRef.current;
    if (!root) return;
    const nodes = visibleFocusable(root);
    const focusTarget =
      visual.destructive && hasCancel
        ? (nodes[0] ?? root)
        : (nodes[nodes.length - 1] ?? root);
    focusTarget.focus({ preventScroll: true });
  }, [entered, hasCancel, isOpen, visual.destructive]);

  useEffect(() => {
    if (!isOpen || !mounted) return;
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [isOpen, mounted]);

  if (!mounted || !visible) return null;

  // variables
  const shellClass = [
    "ar-notification-popup-wrapper",
    entered ? "open" : undefined,
  ]
    .filter(Boolean)
    .join(" ");
  const panelClass = ["ar-notification-popup", entered ? "open" : undefined]
    .filter(Boolean)
    .join(" ");

  return createPortal(
    <div className={shellClass}>
      <div
        className="ar-notification-popup-bg"
        onMouseDown={() => finish(false)}
      />

      <div
        ref={_dialogRef}
        className={panelClass}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={message ? messageId : undefined}
        tabIndex={-1}
      >
        <div className={`icon ${visual.kind}`} aria-hidden="true">
          <Icon icon={visual.icon} size={24} />
        </div>

        <div className="content">
          <Title
            id={titleId}
            className={`title ${visual.kind}`}
            size="md"
            align="left"
          >
            {title}
          </Title>
          {message ? (
            <Paragraph
              id={messageId}
              className="message"
              size="sm"
              align="left"
            >
              {message}
            </Paragraph>
          ) : null}
        </div>

        <div className="footer">
          {hasCancel ? (
            <Button
              {...buttons?.cancel}
              variant={buttons?.cancel?.variant ?? "outlined"}
              color={buttons?.cancel?.color ?? "gray"}
              size={buttons?.cancel?.size ?? "md"}
              onClick={(event) => {
                buttons?.cancel?.onClick?.(event);
                finish(false);
              }}
            >
              {buttons?.cancel?.children ?? "Vazgeç"}
            </Button>
          ) : null}
          <Button
            {...buttons?.okay}
            color={buttons?.okay?.color ?? visual.color}
            size={buttons?.okay?.size ?? "md"}
            onClick={(event) => {
              buttons?.okay?.onClick?.(event);
              finish(true);
            }}
          >
            {buttons?.okay?.children ?? "Tamam"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

PopupConfirm.displayName = "PopupConfirm";
export default PopupConfirm;
