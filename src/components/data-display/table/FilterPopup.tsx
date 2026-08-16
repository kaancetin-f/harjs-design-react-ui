"use client";

import React, { Dispatch, MutableRefObject, ReactNode, SetStateAction, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import useAnchoredPosition from "./popup/useAnchoredPosition";

interface IProps {
  refs: {
    tableContent: MutableRefObject<HTMLDivElement | null>;
    buttons: MutableRefObject<(HTMLSpanElement | null)[]>;
  };
  states: {
    open: { get: boolean; set: Dispatch<SetStateAction<boolean>> };
  };
  children: ReactNode;
  coordinate: { x: number; y: number };
  label?: string;
}

const FilterPopup = ({ children, refs, states, coordinate, label }: IProps) => {
  // refs
  const _arTableFilterPopup = useRef<HTMLDivElement>(null);

  // hooks
  const position = useAnchoredPosition(states.open.get, coordinate, _arTableFilterPopup);

  // methods
  const isPortaledOverlay = (target: EventTarget | null) => {
    const el = target instanceof Element ? target : null;
    if (!el) return false;
    return Boolean(el.closest(".har-date-calendar, .har-select-options"));
  };

  const handleClickOutSide = (event: Event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (isPortaledOverlay(target)) return;

    const clickedInsidePopup = Boolean(_arTableFilterPopup.current?.contains(target));
    const isOneOfButtons = refs.buttons.current.some((button) => button === target || button?.contains(target));

    if (!clickedInsidePopup && !isOneOfButtons) handleClose();
  };

  const handleKeys = (event: KeyboardEvent) => {
    const key = event.key;

    if (key === "Escape") states.open.set(false);
  };

  const handleClose = () => states.open.set(false);

  const handleScrollAway = (event: Event) => {
    if (isPortaledOverlay(event.target)) return;
    handleClose();
  };

  // useEffects
  useEffect(() => {
    if (!states.open.get) return;

    const tableContentRef = refs.tableContent.current;
    if (tableContentRef) {
      tableContentRef.addEventListener("scroll", handleClose);
    }

    document.addEventListener("pointerdown", handleClickOutSide);
    document.addEventListener("keydown", handleKeys);
    window.addEventListener("scroll", handleScrollAway, true);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutSide);
      document.removeEventListener("keydown", handleKeys);
      window.removeEventListener("scroll", handleScrollAway, true);

      if (tableContentRef) {
        tableContentRef.removeEventListener("scroll", handleClose);
      }
    };
  }, [states.open.get]);

  return (
    states.open.get &&
    ReactDOM.createPortal(
      <div
        ref={_arTableFilterPopup}
        className="har-table-filter-popup"
        role="dialog"
        aria-label={label}
        style={{ top: position.y, left: position.x }}
      >
        {children}
      </div>,
      document.body,
    )
  );
};

export default FilterPopup;
