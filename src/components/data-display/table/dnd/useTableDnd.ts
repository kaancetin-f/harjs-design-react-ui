import { useLayoutEffect, useRef, type JSX, type RefObject } from "react";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";

type UseTableDndOptions<T> = {
  enabled: boolean;
  tBodyRef: RefObject<HTMLTableSectionElement | null>;
  data: T[];
  onDnD?: (items: T[]) => void;
  renderItem?: JSX.Element;
};

const DRAG_GHOST_HTML = `
  <div class="har-dnd-shadow" style="background: white; padding: 10px; border: 1px solid #ccc;">
    <span>Dragging...</span>
  </div>
`;

function useTableDnd<T>({ enabled, tBodyRef, data, onDnD, renderItem }: UseTableDndOptions<T>) {
  const dataRef = useRef(data);
  const onDnDRef = useRef(onDnD);
  const renderItemRef = useRef(renderItem);
  const orderRef = useRef<T[]>(data.slice());
  const dragItemRef = useRef<HTMLElement | null>(null);
  const rootRef = useRef<Root | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);

  dataRef.current = data;
  onDnDRef.current = onDnD;
  renderItemRef.current = renderItem;

  if (!dragItemRef.current) {
    orderRef.current = data.slice();
  }

  useLayoutEffect(() => {
    const tbody = tBodyRef.current;
    if (!enabled || !tbody) return;

    const cleanupShadow = () => {
      rootRef.current?.unmount();
      rootRef.current = null;
      shadowRef.current?.remove();
      shadowRef.current = null;
    };

    const getRow = (target: EventTarget | null): HTMLElement | null => {
      if (!(target instanceof Element)) return null;

      const row = target.closest("tr");
      if (!row || row.parentElement !== tbody) return null;
      if (!row.draggable && !row.classList.contains("draggable")) return null;

      return row as HTMLElement;
    };

    const handleDragStart = (event: DragEvent) => {
      const row = getRow(event.target);
      if (!row || !event.dataTransfer) return;

      dragItemRef.current = row;
      orderRef.current = dataRef.current.slice();
      row.classList.add("drag-item");

      const shadowContainer = document.createElement("div");
      shadowContainer.style.position = "absolute";
      shadowContainer.style.top = "-9999px";
      shadowContainer.style.left = "-9999px";
      document.body.appendChild(shadowContainer);
      shadowRef.current = shadowContainer;

      const ghost = renderItemRef.current;
      if (ghost) {
        const root = createRoot(shadowContainer);
        rootRef.current = root;
        flushSync(() => {
          root.render(ghost);
        });
      } else {
        shadowContainer.innerHTML = DRAG_GHOST_HTML;
      }

      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setDragImage(shadowContainer, 20, 20);

      requestAnimationFrame(() => {
        cleanupShadow();
      });
    };

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();

      const overItem = getRow(event.target);
      const dragItem = dragItemRef.current;
      if (!overItem || !dragItem || dragItem === overItem) return;

      const rect = overItem.getBoundingClientRect();
      if (rect.top < 250) window.scrollBy(0, -20);
      if (rect.bottom > window.innerHeight - 150) window.scrollBy(0, 20);

      const children = Array.from(tbody.children);
      const dragItemIndex = children.indexOf(dragItem);
      const dropItemIndex = children.indexOf(overItem);
      if (dragItemIndex === -1 || dropItemIndex === -1) return;

      tbody.insertBefore(dragItem, dragItemIndex < dropItemIndex ? overItem.nextSibling : overItem);

      const next = orderRef.current.slice();
      const [movedItem] = next.splice(dragItemIndex, 1);
      if (movedItem === undefined) return;

      next.splice(dropItemIndex, 0, movedItem);
      orderRef.current = next;
    };

    const handleDragEnd = (event: DragEvent) => {
      const row = getRow(event.target) ?? dragItemRef.current;
      if (row) {
        row.classList.remove("drag-item");
        row.classList.add("end-item");
        setTimeout(() => {
          row.classList.remove("end-item");
          if (row.classList.length === 0) row.removeAttribute("class");
        }, 1000);
      }

      const original = dataRef.current;
      const next = orderRef.current;
      const changed = original.length !== next.length || original.some((item, index) => item !== next[index]);

      if (changed) onDnDRef.current?.(next.slice());

      dragItemRef.current = null;
      cleanupShadow();
    };

    tbody.addEventListener("dragstart", handleDragStart);
    tbody.addEventListener("dragover", handleDragOver);
    tbody.addEventListener("dragend", handleDragEnd);

    return () => {
      tbody.removeEventListener("dragstart", handleDragStart);
      tbody.removeEventListener("dragover", handleDragOver);
      tbody.removeEventListener("dragend", handleDragEnd);
      cleanupShadow();
      dragItemRef.current = null;
    };
  }, [enabled, tBodyRef]);
}

export default useTableDnd;
