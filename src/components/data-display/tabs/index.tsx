"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import IProps from "./IProps";
import "../../../assets/css/components/data-display/tabs/styles.css";
import Button from "../../form/button";
import { Icon } from "../../icons";

const storageKey = (name: string) => `${window.location.pathname}::${name}`;

const readStoredIndex = (name: string, length: number) => {
  if (typeof window === "undefined" || length === 0) return null;
  const raw = sessionStorage.getItem(storageKey(name));
  if (raw == null) return null;
  const index = Number(raw);
  if (!Number.isInteger(index) || index < 0 || index >= length) return null;
  return index;
};

const clampIndex = (index: number, length: number) => {
  if (length <= 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
};

const Tabs: React.FC<IProps> = ({
  name,
  tabs = [],
  activeTab,
  defaultActiveTab = 0,
  variant = "underline",
  orientation = "horizontal",
  onChange,
  onClose,
}) => {
  // refs
  const _container = useRef<HTMLDivElement>(null);
  const _items = useRef<(HTMLDivElement | null)[]>([]);
  const _isDragging = useRef(false);
  const _hasDragged = useRef(false);
  const _dragStart = useRef(0);
  const _dragScroll = useRef(0);
  const _listeners = useRef<{ move: (event: PointerEvent) => void; up: () => void } | null>(null);

  // states
  const [uncontrolledTab, setUncontrolledTab] = useState(() => clampIndex(defaultActiveTab, tabs.length));
  const [overflow, setOverflow] = useState({ start: false, end: false });

  // hooks
  const uid = useId();

  // variables
  const isControlled = activeTab !== undefined;
  const isHorizontal = orientation === "horizontal";
  const currentTab = clampIndex(isControlled ? (activeTab as number) : uncontrolledTab, tabs.length);
  const active = tabs[currentTab];
  const panelId = `${uid}-panel`;

  // methods
  const persist = (index: number) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(storageKey(name), String(index));
  };

  const selectTab = useCallback(
    (index: number) => {
      if (!tabs[index] || tabs[index].disabled) return;
      if (!isControlled) setUncontrolledTab(index);
      persist(index);
      onChange?.(index);
    },
    [isControlled, name, onChange, tabs],
  );

  const measureOverflow = useCallback(() => {
    const container = _container.current;
    if (!container) return;

    if (isHorizontal) {
      const max = container.scrollWidth - container.clientWidth;
      setOverflow({
        start: container.scrollLeft > 1,
        end: max > 1 && container.scrollLeft < max - 1,
      });
      return;
    }

    const max = container.scrollHeight - container.clientHeight;
    setOverflow({
      start: container.scrollTop > 1,
      end: max > 1 && container.scrollTop < max - 1,
    });
  }, [isHorizontal]);

  const scrollToTab = useCallback(
    (index: number) => {
      const container = _container.current;
      const target = _items.current[index];
      if (!container || !target) return;

      if (isHorizontal) {
        container.scrollTo({ left: target.offsetLeft - container.offsetLeft, behavior: "smooth" });
        return;
      }

      container.scrollTo({ top: target.offsetTop - container.offsetTop, behavior: "smooth" });
    },
    [isHorizontal],
  );

  const scrollStep = (direction: -1 | 1) => {
    const next = clampIndex(currentTab + direction, tabs.length);
    selectTab(next);
    scrollToTab(next);
    _items.current[next]?.focus();
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const container = _container.current;
    if (!container) return;

    const overflowing = isHorizontal
      ? container.scrollWidth > container.clientWidth + 1
      : container.scrollHeight > container.clientHeight + 1;
    if (!overflowing) return;

    _isDragging.current = true;
    _hasDragged.current = false;
    _dragStart.current = isHorizontal ? event.pageX : event.pageY;
    _dragScroll.current = isHorizontal ? container.scrollLeft : container.scrollTop;

    const onMove = (moveEvent: PointerEvent) => {
      if (!_isDragging.current || !_container.current) return;
      const point = isHorizontal ? moveEvent.pageX : moveEvent.pageY;
      const walk = point - _dragStart.current;
      if (Math.abs(walk) > 5) _hasDragged.current = true;
      if (isHorizontal) _container.current.scrollLeft = _dragScroll.current - walk;
      else _container.current.scrollTop = _dragScroll.current - walk;
    };

    const onUp = () => {
      _isDragging.current = false;
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      _listeners.current = null;
    };

    _listeners.current = { move: onMove, up: onUp };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  };

  const handleTabListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
    const enabled = tabs.map((tab, index) => ({ tab, index })).filter(({ tab }) => !tab.disabled);
    if (enabled.length === 0) return;

    const currentPos = Math.max(
      0,
      enabled.findIndex(({ index }) => index === currentTab),
    );

    let nextIndex: number | null = null;
    if (event.key === prevKey) nextIndex = enabled[(currentPos - 1 + enabled.length) % enabled.length].index;
    else if (event.key === nextKey) nextIndex = enabled[(currentPos + 1) % enabled.length].index;
    else if (event.key === "Home") nextIndex = enabled[0].index;
    else if (event.key === "End") nextIndex = enabled[enabled.length - 1].index;

    if (nextIndex == null) return;
    event.preventDefault();
    selectTab(nextIndex);
    scrollToTab(nextIndex);
    _items.current[nextIndex]?.focus();
  };

  // useEffects
  useEffect(() => {
    if (isControlled) return;
    const stored = readStoredIndex(name, tabs.length);
    if (stored == null) return;
    setUncontrolledTab(stored);
  }, [name, isControlled, tabs.length]);

  useEffect(() => {
    if (!isControlled) return;
    setUncontrolledTab(clampIndex(activeTab as number, tabs.length));
  }, [activeTab, isControlled, tabs.length]);

  useEffect(() => {
    if (isControlled || tabs.length === 0) return;
    if (uncontrolledTab <= tabs.length - 1) return;
    const next = tabs.length - 1;
    setUncontrolledTab(next);
    persist(next);
  }, [isControlled, tabs.length, uncontrolledTab, name]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      scrollToTab(currentTab);
      measureOverflow();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [currentTab, tabs.length, variant, orientation, scrollToTab, measureOverflow]);

  useEffect(() => {
    window.addEventListener("resize", measureOverflow);
    return () => {
      window.removeEventListener("resize", measureOverflow);
      if (_listeners.current) {
        document.removeEventListener("pointermove", _listeners.current.move);
        document.removeEventListener("pointerup", _listeners.current.up);
      }
    };
  }, [measureOverflow]);

  return (
    <div className={["har-tabs", `is-${orientation}`, variant].join(" ")}>
      <div className="tabs">
        {overflow.start && (
          <Button
            className="nav start"
            variant="outlined"
            color="gray"
            size="xs"
            shape="square"
            border={{ radius: "6" }}
            aria-label="Previous tabs"
            icon={{
              element: (
                <Icon icon={isHorizontal ? "ArrowLeft" : "ArrowUp"} />
              ),
            }}
            onClick={() => scrollStep(-1)}
          />
        )}

        {overflow.end && (
          <Button
            className="nav end"
            variant="outlined"
            color="gray"
            size="xs"
            shape="square"
            border={{ radius: "6" }}
            aria-label="Next tabs"
            icon={{
              element: (
                <Icon icon={isHorizontal ? "ArrowRight" : "ArrowDown"} />
              ),
            }}
            onClick={() => scrollStep(1)}
          />
        )}

        <div
          ref={_container}
          className="container"
          role="tablist"
          aria-orientation={orientation}
          onScroll={measureOverflow}
          onPointerDown={handlePointerDown}
          onKeyDown={handleTabListKeyDown}
        >
          {tabs.map((tab, index) => {
            const selected = currentTab === index;
            const tabId = `${uid}-tab-${index}`;
            const iconPosition = tab.icon?.position ?? "start";

            return (
              <div
                key={`${tab.title}-${index}`}
                ref={(element) => {
                  _items.current[index] = element;
                }}
                id={tabId}
                className={["item", selected ? "is-active" : undefined, tab.disabled ? "is-disabled" : undefined]
                  .filter(Boolean)
                  .join(" ")}
                role="tab"
                tabIndex={selected ? 0 : -1}
                aria-selected={selected}
                aria-controls={panelId}
                aria-disabled={tab.disabled || undefined}
                onClick={() => {
                  if (_hasDragged.current) return;
                  selectTab(index);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  if (_hasDragged.current) return;
                  selectTab(index);
                }}
              >
                {tab.icon?.element && iconPosition === "start" ? <span className="icon">{tab.icon.element}</span> : null}
                <span className="label">{tab.title}</span>
                {tab.icon?.element && iconPosition === "end" ? <span className="icon">{tab.icon.element}</span> : null}

                {tab.config?.canBeClosed && (
                  <Button
                    className="close"
                    variant="borderless"
                    color="red"
                    size="xs"
                    shape="circle"
                    border={{ radius: "full" }}
                    aria-label={`Close ${tab.title}`}
                    icon={{ element: <Icon icon="X" size={12} /> }}
                    onClick={(event) => {
                      event.stopPropagation();
                      onClose?.(index);
                    }}
                    onKeyDown={(event) => event.stopPropagation()}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="content" role="tabpanel" id={panelId} aria-labelledby={`${uid}-tab-${currentTab}`}>
        {active?.content}
      </div>
    </div>
  );
};

Tabs.displayName = "Tabs";
export default Tabs;
