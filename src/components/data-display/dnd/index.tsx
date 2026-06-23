"use client";

import React, { useEffect, useRef } from "react";
import IProps from "./IProps";
import "../../../assets/css/components/data-display/dnd/styles.css";
import { ARIcon } from "../../icons";

let _fromColumn: string | undefined = undefined;

const DnD = function <T>({ data, renderItem, columnKey, onChange, confing = { isMoveIcon: true } }: IProps<T>) {
  // refs
  const _arDnD = useRef<HTMLDivElement>(null);
  const _dragItem = useRef<HTMLElement>(null);

  // useEffects
  useEffect(() => {
    if (!_arDnD.current || data.length === 0) return;

    _arDnD.current.childNodes.forEach((item) => {
      const _item = item as HTMLElement;

      // Events
      _item.ondragstart = (event) => {
        const dragItem = event.currentTarget as HTMLElement;

        _dragItem.current = dragItem;
        dragItem.classList.add("drag-item");

        const index = [..._arDnD.current!.children].indexOf(dragItem);
        const draggedData = data[index];

        if (event.dataTransfer) {
          // #region Shadow
          const shadow = document.createElement("div");

          shadow.innerHTML = `
            <div class="ar-dnd-shadow">
              <i class="bi bi-gear-wide-connected"></i>
              <span>Dragging...</span>
            </div>
          `;
          shadow.style.position = "absolute";
          shadow.style.top = "-9999px";
          document.body.appendChild(shadow);
          event.dataTransfer.setDragImage(shadow, 0, 0);
          // #endregion

          event.dataTransfer.setData("item", JSON.stringify(draggedData));
          event.dataTransfer.setData("fromColumn", columnKey ?? "");
          _fromColumn = columnKey ?? undefined;
        }

        // Korumaya başla.
        if (_arDnD.current && columnKey && _fromColumn !== columnKey) {
          _arDnD.current.childNodes.forEach((item) => {
            const placeholder = document.createElement("div");
            placeholder.setAttribute("data-id", "placeholder");
            placeholder.style.position = "absolute";
            placeholder.style.inset = "0";

            item.appendChild(placeholder);
          });
        }
      };

      _item.ondragover = (event) => {
        event.preventDefault();

        const overItem = event.currentTarget as HTMLElement;
        const rect = overItem.getBoundingClientRect();

        // Otomatik scroll.
        if (rect.top < 250) window.scrollBy(0, -20);
        if (rect.bottom > window.innerHeight - 150) window.scrollBy(0, 20);

        // Sadece aynı kolondaysa drag-drop yap.
        if (columnKey && _fromColumn !== columnKey) {
          // Placeholder'ı temizle
          const nodes = document.querySelectorAll("[data-id='placeholder']");
          nodes.forEach((node) => node.remove());

          // Placeholder element oluştur.
          const placeholder = document.createElement("div");
          placeholder.setAttribute("data-id", "placeholder");
          placeholder.classList.add("placeholder");

          // Fare pozisyonuna göre yerleştir.
          const isBelow = event.clientY > rect.top + rect.height / 2;
          if (isBelow) {
            overItem.parentNode?.insertBefore(placeholder, overItem.nextSibling);
          } else {
            overItem.parentNode?.insertBefore(placeholder, overItem);
          }

          return; // taşıma yapma ama placeholder gösterilsin.
        }

        // Gerçek taşıma işlemi.
        if (_dragItem.current !== overItem) {
          if (_arDnD.current && _dragItem.current) {
            const dragItemIndex = [..._arDnD.current.children].indexOf(_dragItem.current!);
            const dropItemIndex = [..._arDnD.current.children].indexOf(overItem);

            if (dragItemIndex === -1 || dropItemIndex === -1) return;

            _arDnD.current.insertBefore(
              _dragItem.current,
              dragItemIndex < dropItemIndex ? overItem.nextSibling : overItem,
            );

            const movedItem = data.splice(dragItemIndex, 1)[0];

            if (movedItem) {
              data.splice(dropItemIndex, 0, movedItem);
              onChange?.(data);
            }
          }
        }
      };

      _item.ondragend = (event) => {
        const item = event.currentTarget as HTMLElement;
        item.classList.remove("drag-item");
        item.classList.add("end-item");

        setTimeout(() => {
          item.classList.remove("end-item");

          if (item.classList.length === 0) item.removeAttribute("class");
        }, 1000);
      };
    });

    _arDnD.current.ondragover = (event) => event.preventDefault();

    return () => {
      if (!_arDnD.current) return;

      _arDnD.current.childNodes.forEach((item) => {
        const _item = item as HTMLElement;

        _item.ondragstart = null;
        _item.ondragover = null;
        _item.ondragend = null;
      });

      _arDnD.current.ondragover = null;
    };
  }, [data]);

  return (
    <div ref={_arDnD} className="ar-dnd">
      {data.map((item, index) => (
        <div key={index} className="item" draggable>
          {confing?.isMoveIcon && (
            <div className="move">
              <ARIcon icon={"GripVertical"} fill="var(--blue-500)" size={18} />
            </div>
          )}
          <div className="content">{renderItem(item, index)}</div>
        </div>
      ))}
    </div>
  );
};

export default DnD;
