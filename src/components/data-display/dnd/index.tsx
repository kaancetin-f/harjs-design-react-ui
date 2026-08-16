"use client";

import React, { useEffect, useRef } from "react";
import IProps from "./IProps";
import "../../../assets/css/components/data-display/dnd/styles.css";
import { Icon } from "../../icons";

let _fromColumn: string | undefined = undefined;
let _hoverColumn: string | undefined = undefined;

const resolveHandle = (config?: IProps<unknown>["config"], confing?: IProps<unknown>["confing"]) =>
  config?.handle ?? confing?.isMoveIcon ?? true;

const DnD = function <T>({
  data,
  renderItem,
  columnKey,
  onChange,
  disabled = false,
  config,
  confing,
  itemKey,
}: IProps<T>) {
  // variables
  const showHandle = resolveHandle(config, confing);
  const handleOnly = showHandle && (config?.handleOnly ?? true);
  const color = config?.color ?? "blue";
  const className = [
    "har-dnd",
    color,
    showHandle ? "has-handle" : undefined,
    handleOnly ? "is-handle-only" : undefined,
    disabled ? "is-disabled" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  // refs
  const _arDnD = useRef<HTMLDivElement>(null);
  const _dragItem = useRef<HTMLElement | null>(null);
  const _order = useRef<T[]>(data);
  const _placeholder = useRef<HTMLDivElement | null>(null);
  const _scrollRaf = useRef<number | null>(null);
  const _initialNodes = useRef<HTMLElement[]>([]);
  const _escaped = useRef(false);
  // refs -> Latest
  const _data = useRef(data);
  const _onChange = useRef(onChange);
  const _columnKey = useRef(columnKey);
  const _disabled = useRef(disabled);
  const _handleOnly = useRef(handleOnly);

  _data.current = data;
  _onChange.current = onChange;
  _columnKey.current = columnKey;
  _disabled.current = disabled;
  _handleOnly.current = handleOnly;

  // methods
  const clearAllPlaceholders = () => {
    document.querySelectorAll("[data-id='placeholder']").forEach((node) => node.remove());
  };

  // useEffects
  useEffect(() => {
    if (_dragItem.current) return;
    _order.current = data.slice();
  }, [data]);

  useEffect(() => {
    const container = _arDnD.current;
    if (!container) return;

    const getItemElement = (target: EventTarget | null): HTMLElement | null => {
      let el: Element | null =
        target instanceof Element ? target : target instanceof Text ? target.parentElement : null;

      while (el) {
        if (el.classList.contains("item") && el.parentElement === container) {
          return el as HTMLElement;
        }

        el = el.parentElement;
      }

      return null;
    };

    const ensurePlaceholder = (): HTMLDivElement => {
      if (_placeholder.current?.isConnected) return _placeholder.current;

      const placeholder = document.createElement("div");
      placeholder.setAttribute("data-id", "placeholder");
      placeholder.classList.add("placeholder");
      _placeholder.current = placeholder;

      return placeholder;
    };

    const handleAutoScroll = (clientY: number) => {
      if (_scrollRaf.current != null) return;

      _scrollRaf.current = requestAnimationFrame(() => {
        _scrollRaf.current = null;

        if (clientY < 250) window.scrollBy(0, -20);
        else if (clientY > window.innerHeight - 150) window.scrollBy(0, 20);
      });
    };

    const handleDragStart = (event: DragEvent) => {
      if (_disabled.current || !event.dataTransfer) {
        event.preventDefault();
        return;
      }

      const origin = event.target instanceof Element ? event.target : null;
      if (_handleOnly.current && !origin?.closest(".move")) {
        event.preventDefault();
        return;
      }

      const dragItem = getItemElement(event.target);
      if (!dragItem) return;

      clearAllPlaceholders();
      _placeholder.current = null;

      const rect = dragItem.getBoundingClientRect();
      const ghost = document.createElement("div");
      ghost.className = "har-dnd-ghost";
      if (container.closest(".har-kanban-board")) ghost.classList.add("is-kanban");
      ghost.style.color = getComputedStyle(container).color;

      const clone = dragItem.cloneNode(true) as HTMLElement;
      clone.classList.remove("drag-item", "end-item");
      ghost.appendChild(clone);
      ghost.style.width = `${rect.width}px`;
      ghost.style.position = "fixed";
      ghost.style.top = "-1000px";
      ghost.style.left = "0";
      document.body.appendChild(ghost);
      void ghost.offsetWidth;

      const fromHandle = Boolean(origin?.closest(".move"));
      event.dataTransfer.setDragImage(
        ghost,
        fromHandle ? 22 : Math.min(Math.max(event.offsetX || 16, 16), 36),
        Math.min(rect.height / 2, 22),
      );
      setTimeout(() => {
        if (document.body.contains(ghost)) document.body.removeChild(ghost);
      }, 0);

      _dragItem.current = dragItem;
      dragItem.classList.add("drag-item");
      container.classList.add("is-dragging");

      _initialNodes.current = Array.prototype.slice.call(container.children) as HTMLElement[];

      const children = container.children;
      const dragIndex = Array.prototype.indexOf.call(children, dragItem);
      const currentData = _data.current;
      _order.current = currentData.slice();
      const draggedData = currentData[dragIndex];

      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(dragIndex));
      try {
        event.dataTransfer.setData("item", JSON.stringify(draggedData ?? null));
      } catch {
        event.dataTransfer.setData("item", "");
      }
      event.dataTransfer.setData("fromColumn", _columnKey.current ?? "");
      _fromColumn = _columnKey.current ?? undefined;
      _hoverColumn = _columnKey.current ?? undefined;
      _escaped.current = false;
    };

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move";

      handleAutoScroll(event.clientY);

      const overItem = getItemElement(event.target);
      const currentColumnKey = _columnKey.current;

      if (currentColumnKey) _hoverColumn = currentColumnKey;

      if (currentColumnKey && _fromColumn !== currentColumnKey) {
        if (!overItem) return;

        const rect = overItem.getBoundingClientRect();
        const isBelow = event.clientY > rect.top + rect.height / 2;
        const existing = _placeholder.current;

        if (existing?.parentNode === container) {
          if (isBelow ? overItem.nextSibling === existing : existing.nextSibling === overItem) {
            return;
          }
        }

        const placeholder = ensurePlaceholder();
        if (placeholder.parentNode !== container) {
          clearAllPlaceholders();
          _placeholder.current = placeholder;
        }

        container.insertBefore(placeholder, isBelow ? overItem.nextSibling : overItem);
        return;
      }

      if (!overItem || !_dragItem.current || _dragItem.current === overItem) return;

      const children = container.children;
      const dragItemIndex = Array.prototype.indexOf.call(children, _dragItem.current);
      const dropItemIndex = Array.prototype.indexOf.call(children, overItem);

      if (dragItemIndex === -1 || dropItemIndex === -1) return;

      container.insertBefore(_dragItem.current, dragItemIndex < dropItemIndex ? overItem.nextSibling : overItem);

      const order = _order.current;
      const [movedItem] = order.splice(dragItemIndex, 1);
      if (movedItem !== undefined) order.splice(dropItemIndex, 0, movedItem);
    };

    const handleDragEnd = (event: DragEvent) => {
      const item = getItemElement(event.target) ?? _dragItem.current;

      if (item) {
        item.classList.remove("drag-item");
        item.classList.add("end-item");

        setTimeout(() => {
          item.classList.remove("end-item");
        }, 450);
      }

      const currentColumnKey = _columnKey.current;
      const droppedInSameColumn = !currentColumnKey || _hoverColumn === currentColumnKey || _hoverColumn == null;
      const wasCancelled = _escaped.current;

      if (wasCancelled) {
        _initialNodes.current.forEach((node) => {
          if (node.parentNode === container) container.appendChild(node);
        });
        _order.current = _data.current.slice();
      } else if (droppedInSameColumn) {
        const original = _data.current;
        const next = _order.current;
        let changed = original.length !== next.length;

        if (!changed) {
          for (let i = 0; i < original.length; i++) {
            if (original[i] !== next[i]) {
              changed = true;
              break;
            }
          }
        }

        if (changed) _onChange.current?.(next.slice());
      }

      container.classList.remove("is-dragging");
      clearAllPlaceholders();
      _placeholder.current = null;
      _dragItem.current = null;
      _initialNodes.current = [];
      _fromColumn = undefined;
      _hoverColumn = undefined;
      _escaped.current = false;

      if (_scrollRaf.current != null) {
        cancelAnimationFrame(_scrollRaf.current);
        _scrollRaf.current = null;
      }
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") _escaped.current = true;
    };

    container.addEventListener("dragstart", handleDragStart);
    container.addEventListener("dragover", handleDragOver);
    container.addEventListener("drop", handleDrop);
    container.addEventListener("dragend", handleDragEnd);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("dragstart", handleDragStart);
      container.removeEventListener("dragover", handleDragOver);
      container.removeEventListener("drop", handleDrop);
      container.removeEventListener("dragend", handleDragEnd);
      window.removeEventListener("keydown", handleKeyDown);

      if (_scrollRaf.current != null) {
        cancelAnimationFrame(_scrollRaf.current);
        _scrollRaf.current = null;
      }

      clearAllPlaceholders();
      _placeholder.current = null;
      container.classList.remove("is-dragging");
    };
  }, []);

  return (
    <div ref={_arDnD} className={className} role="list" aria-disabled={disabled || undefined}>
      {data.map((item, index) => (
        <div
          key={itemKey ? itemKey(item, index) : index}
          className="item"
          draggable={!disabled && !handleOnly}
          role="listitem"
        >
          {showHandle ? (
            <div className="move" draggable={!disabled && handleOnly} aria-hidden>
              <Icon icon="GripVertical" size={20} />
            </div>
          ) : null}
          <div className="content">{renderItem(item, index)}</div>
        </div>
      ))}
    </div>
  );
};

DnD.displayName = "DnD";
export default DnD;
