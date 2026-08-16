"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import IProps from "./IProps";
import Typography from "../../data-display/typography";
import Button from "../../form/button";
import Tabs from "../../data-display/tabs";
import "../../../assets/css/components/feedback/drawer/styles.css";
import { useValidation } from "../../../libs/core/application/hooks";
import { TabProps, ValidationProps } from "../../../libs/infrastructure/types";
import Utils from "../../../libs/infrastructure/shared/Utils";
import { Icon } from "../../icons";

const { Title } = Typography;

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const overlayIsClear = () => {
  const empty = (className: string) => document.getElementsByClassName(className).length === 0;
  return (
    empty("har-modal-wrapper opened") &&
    empty("har-select-options") &&
    empty("har-date-calendar") &&
    empty("har-popover")
  );
};

const overlayRoot = () =>
  (document.querySelector(".har-select-options") as HTMLElement | null) ||
  (document.querySelector(".har-date-calendar") as HTMLElement | null) ||
  (document.querySelector(".har-popover") as HTMLElement | null);

const visibleFocusable = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((node) => node.getClientRects().length > 0);

const storageKey = (name: string) => `${window.location.pathname}::${name}`;

const readStoredIndex = (name: string, length: number) => {
  if (typeof window === "undefined" || length === 0) return null;
  const raw = sessionStorage.getItem(storageKey(name));
  if (raw == null) return null;
  const index = Number(raw);
  if (!Number.isInteger(index) || index < 0 || index >= length) return null;
  return index;
};

const injectErrors = <T extends object>(content: React.ReactNode, errors: Partial<{ [key in keyof T]: string }>) =>
  React.Children.map(content, (child) =>
    React.isValidElement(child)
      ? React.cloneElement(child as React.ReactElement<{ errors: Partial<{ [key in keyof T]: string }> }>, { errors })
      : child,
  );

const Drawer = function <T extends object>({
  children,
  title,
  name,
  tabs = [],
  activeTab,
  open,
  size = "2xl",
  placement = "right",
  onChange,
  onClose,
  validation,
  config,
  disableCloseOnBackdrop,
  disableCloseOnEsc,
  border,
  className,
  style,
  role,
  ...attributes
}: IProps<T>) {
  // variables
  const isTabControlled = activeTab !== undefined;
  const panels: TabProps[] = tabs.length > 0 ? tabs : children != null ? [{ title: "", content: children }] : [];
  const showTabs = panels.length > 1;

  // refs
  const _drawer = useRef<HTMLDivElement>(null);
  const _previousFocus = useRef<HTMLElement | null>(null);
  const _close = useRef<() => void>(() => {});

  // states
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [trackedPlacement, setTrackedPlacement] = useState(placement);
  const [uncontrolledTab, setUncontrolledTab] = useState(() => {
    if (isTabControlled) return activeTab;
    if (name) return readStoredIndex(name, panels.length) ?? config?.tabs?.defaultActiveTab ?? 0;
    return config?.tabs?.defaultActiveTab ?? 0;
  });

  if (placement !== trackedPlacement) {
    setTrackedPlacement(placement);
    setEntered(false);
  }

  if (!open.get && entered) setEntered(false);

  // variables -> Derived
  const currentTab = Math.min(
    Math.max(isTabControlled ? (activeTab as number) : uncontrolledTab, 0),
    Math.max(panels.length - 1, 0),
  );

  // hooks
  const uid = useId();
  const { errors, onSubmit, setSubmit } = useValidation(
    validation?.data as T,
    validation?.rules as ValidationProps<T>[],
    currentTab + 1,
  );
  const titleId = `${uid}-title`;

  // methods
  const persist = (index: number) => {
    if (!name || typeof window === "undefined") return;
    sessionStorage.setItem(storageKey(name), String(index));
  };

  const selectTab = (index: number) => {
    if (!isTabControlled) setUncontrolledTab(index);
    persist(index);
    onChange?.(index);
  };

  const close = useCallback(() => {
    const finish = () => {
      onClose?.(currentTab);
      open.set(false);
      setSubmit(false);
    };

    if (validation) {
      onSubmit((result) => {
        if (!result) return;
        finish();
      });
      return;
    }

    finish();
  }, [currentTab, onClose, onSubmit, open, setSubmit, validation]);
  _close.current = close;

  const panelContent = (content: React.ReactNode) => (validation ? injectErrors<T>(content, errors) : content);

  // useEffects
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open.get) return;

    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [open.get, placement]);

  useEffect(() => {
    if (isTabControlled) setUncontrolledTab(activeTab);
  }, [activeTab, isTabControlled]);

  useEffect(() => {
    if (!open.get) return;

    _previousFocus.current = document.activeElement as HTMLElement | null;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;

    return () => {
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      _previousFocus.current?.focus({ preventScroll: true });
    };
  }, [open.get]);

  useEffect(() => {
    if (!open.get) return;

    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const overlay = overlayRoot();
        const root = overlay ?? _drawer.current;
        if (!root) return;
        const nodes = visibleFocusable(root);
        if (nodes.length === 0) {
          if (overlay) return;
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
      _close.current();
    };

    document.addEventListener("keydown", handleKeys);
    return () => document.removeEventListener("keydown", handleKeys);
  }, [open.get, disableCloseOnEsc]);

  useEffect(() => {
    if (!open.get || !entered) return;
    const focusable = _drawer.current?.querySelector<HTMLElement>(FOCUSABLE);
    (focusable ?? _drawer.current)?.focus({ preventScroll: true });
  }, [open.get, entered]);

  // variables -> Class names
  const classNames = [
    "har-drawer",
    `size-${size}`,
    placement === "left" ? "is-left" : "is-right",
    ...Utils.GetClassName(undefined, undefined, undefined, border, undefined, undefined, className),
  ]
    .filter(Boolean)
    .join(" ");

  const wrapperClass = ["har-drawer-wrapper", open.get ? "opened" : "closed", entered ? "is-entered" : undefined]
    .filter(Boolean)
    .join(" ");

  const node = (
    <div className={wrapperClass} aria-hidden={!open.get}>
      <div
        className="har-drawer-bg"
        onClick={() => {
          if (disableCloseOnBackdrop) return;
          close();
        }}
      />

      <div
        {...attributes}
        ref={_drawer}
        className={classNames}
        style={style}
        role={role ?? "dialog"}
        aria-modal={open.get || undefined}
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
      >
        <div className={["header", title ? undefined : "bare"].filter(Boolean).join(" ")}>
          {title ? (
            <Title id={titleId} size="lg">
              {title}
            </Title>
          ) : null}
          <Button
            className="close"
            variant="borderless"
            color="red"
            size="xs"
            shape="circle"
            border={{ radius: "full" }}
            aria-label="Close"
            icon={{ element: <Icon icon="X" size={16} /> }}
            onClick={close}
          />
        </div>

        {open.get && panels.length > 0 && (
          <div className={["content", config?.freeContent ? "free" : undefined].filter(Boolean).join(" ")}>
            {showTabs ? (
              <Tabs
                orientation="vertical"
                {...config?.tabs}
                name={name ?? uid}
                tabs={panels.map((tab) => ({ ...tab, content: panelContent(tab.content) }))}
                activeTab={currentTab}
                onChange={selectTab}
                onClose={onClose}
              />
            ) : (
              panelContent(panels[0].content)
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(node, document.body);
};

Drawer.displayName = "Drawer";
export default Drawer;
