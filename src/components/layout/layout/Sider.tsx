"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { ILayoutSiderProps } from "./IProps";
import Paragraph from "../../data-display/typography/paragraph/Paragraph";
import { Icon } from "../../icons";
import { DispatchEvent, SessionStorage } from "../../../libs/infrastructure/shared/Enums";
import { useLayoutSider } from "./context";
import { cssVars, persistSiderPinned, readSiderPinned, toCssSize } from "./helpers";

const Sider: React.FC<ILayoutSiderProps> = ({
  children,
  logo,
  footer,
  defaultCollapsed = false,
  collapsed,
  onCollapse,
  collapsible = true,
  trigger,
  mode = "push",
  width,
  collapsedWidth,
  position = "left",
  reverseArrow = false,
  className,
  style,
}) => {
  // refs
  const _restored = useRef(false);
  const _prevDefaultCollapsed = useRef(defaultCollapsed);

  // states
  const [localPinned, setLocalPinned] = useState(!defaultCollapsed);
  const [localPeeking, setLocalPeeking] = useState(false);

  // hooks
  const fallbackId = useId();
  const ctx = useLayoutSider();

  // variables
  const siderId = ctx?.siderId ?? fallbackId;
  const isControlled = typeof collapsed === "boolean";
  const pinned = isControlled ? !collapsed : (ctx?.pinned ?? localPinned);
  const isMobile = ctx?.isMobile ?? false;
  const peeking = ctx?.peeking ?? localPeeking;
  const overlayOpen = ctx?.overlayOpen ?? false;
  const expanded = ctx?.expanded ?? (pinned || peeking);
  const hydratePinned = ctx?.hydratePinned;
  const setPinnedCtx = ctx?.setPinned;

  // methods
  const setPinned = (next: boolean) => {
    if (isControlled) {
      onCollapse?.(!next);
      persistSiderPinned(next, ctx?.name);
      return;
    }
    if (setPinnedCtx) {
      setPinnedCtx(next);
      return;
    }
    setLocalPinned(next);
    persistSiderPinned(next, ctx?.name);
  };

  const setPeeking = (next: boolean) => {
    if (ctx) {
      ctx.setPeeking(next);
      return;
    }
    setLocalPeeking(next);
  };

  const handleMouseEnter = () => {
    if (pinned || overlayOpen) return;
    // Dokunmatik cihazda hover ile açılmasına izin verme...
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    setPeeking(true);
  };

  const handleMouseLeave = () => {
    if (pinned) return;
    setPeeking(false);
  };

  const handleLogoClick = () => {
    if (!logo?.onClick) return;
    logo.onClick();
    if (typeof window === "undefined") return;
    // Logo tıklanınca menü seçimini sıfırla...
    window.sessionStorage.setItem(SessionStorage.SelectedMenuItem, "null");
    window.dispatchEvent(new Event(DispatchEvent.SelectedMenuItem));
  };

  // useEffects
  useEffect(() => {
    if (isControlled) return;
    const stored = readSiderPinned(ctx?.name);
    // İlk render'da saklı pin durumunu oku; defaultCollapsed değişirse sıfırla...
    if (!_restored.current) {
      _restored.current = true;
      _prevDefaultCollapsed.current = defaultCollapsed;
      const next = stored ?? !defaultCollapsed;
      if (hydratePinned) {
        hydratePinned(next);
        return;
      }
      setLocalPinned(next);
      return;
    }
    if (_prevDefaultCollapsed.current === defaultCollapsed) return;
    _prevDefaultCollapsed.current = defaultCollapsed;
    const next = !defaultCollapsed;
    if (setPinnedCtx) {
      setPinnedCtx(next);
      return;
    }
    setLocalPinned(next);
    persistSiderPinned(next, ctx?.name);
  }, [ctx?.name, defaultCollapsed, hydratePinned, isControlled, setPinnedCtx]);

  useEffect(() => {
    if (!isControlled || !setPinnedCtx) return;
    setPinnedCtx(!collapsed);
  }, [collapsed, isControlled, setPinnedCtx]);

  // refs
  const _siderClassName: string[] = [
    "har-sider",
    position,
    expanded ? "is-expanded" : "collapsed",
    overlayOpen ? "is-overlay-open" : "",
    mode === "overlay" ? "is-mode-overlay" : "",
    logo ? "has-logo" : "",
    className,
  ].filter(Boolean) as string[];

  // variables
  const siderStyle = {
    ...cssVars({
      "--har-layout-sider-width": toCssSize(width),
      "--har-layout-sider-collapsed-width": toCssSize(collapsedWidth),
    }),
    ...style,
  };

  const showDefaultTrigger = collapsible && trigger === undefined;
  const showCustomTrigger = collapsible && trigger != null;
  const arrowFlipped = reverseArrow ? position !== "right" : position === "right";
  const pinIcon = pinned
    ? arrowFlipped
      ? "ChevronBarRight"
      : "ChevronBarLeft"
    : arrowFlipped
      ? "ChevronBarLeft"
      : "ChevronBarRight";

  const logoMini = logo?.mini ?? logo?.default;

  return (
    <aside
      id={siderId}
      className={_siderClassName.map((c) => c).join(" ")}
      style={siderStyle}
      aria-label="Main navigation"
      aria-hidden={isMobile && !overlayOpen ? true : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showDefaultTrigger && (
        <button
          type="button"
          className="har-sider-toggle"
          aria-pressed={pinned}
          aria-expanded={expanded}
          aria-controls={siderId}
          aria-label={pinned ? "Unpin navigation" : "Pin navigation"}
          onClick={() => setPinned(!pinned)}
        >
          <Icon size={20} fill="currentColor" icon={pinIcon as "ChevronBarLeft" | "ChevronBarRight"} />
        </button>
      )}

      {showCustomTrigger && (
        <button
          type="button"
          className="har-sider-toggle is-custom"
          aria-pressed={pinned}
          aria-expanded={expanded}
          aria-controls={siderId}
          aria-label={pinned ? "Unpin navigation" : "Pin navigation"}
          onClick={() => setPinned(!pinned)}
        >
          {trigger}
        </button>
      )}

      <button
        type="button"
        className="har-sider-close"
        aria-label="Close navigation"
        onClick={() => ctx?.closeOverlay()}
      >
        <Icon icon="X" size={16} fill="currentColor" />
      </button>

      {logo &&
        (logo.onClick ? (
          <button type="button" className="har-sider-logo" onClick={handleLogoClick}>
            <span className="logo-stack">
              <span className={`logo-face is-full${expanded ? " is-active" : ""}`}>{logo.default}</span>
              <span className={`logo-face is-mini${!expanded ? " is-active" : ""}`}>{logoMini}</span>
            </span>
          </button>
        ) : (
          <div className="har-sider-logo">
            <span className="logo-stack">
              <span className={`logo-face is-full${expanded ? " is-active" : ""}`}>{logo.default}</span>
              <span className={`logo-face is-mini${!expanded ? " is-active" : ""}`}>{logoMini}</span>
            </span>
          </div>
        ))}

      <div className="har-sider-body">{children}</div>

      {footer != null && (
        <footer className="har-sider-footer">
          {typeof footer === "string" ? <Paragraph size="sm">{footer}</Paragraph> : footer}
        </footer>
      )}
    </aside>
  );
};

Sider.displayName = "Layout.Sider";
export default Sider;
