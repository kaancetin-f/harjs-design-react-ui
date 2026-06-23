"use client";

import React, { Dispatch, MutableRefObject, ReactNode, SetStateAction, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

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
}

const FilterPopup = ({ children, refs, states, coordinate }: IProps) => {
  // refs
  const _arTableFilterPopup = useRef<HTMLDivElement>(null);

  // methods
  const handleClickOutSide = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const clickedInsidePopup = _arTableFilterPopup.current && _arTableFilterPopup.current.contains(target);
    const isOneOfButtons = refs.buttons.current.some((button) => button === target || button?.contains(target));

    if (!clickedInsidePopup && !isOneOfButtons) handleClose();
  };

  const handleKeys = (event: KeyboardEvent) => {
    const key = event.key;

    if (key === "Escape") states.open.set(false);
  };

  const handleOpen = () => states.open.set(true);

  const handleClose = () => states.open.set(false);

  // useEffects
  useEffect(() => {
    const currentButtons = refs.buttons.current;
    currentButtons.forEach((button) => {
      if (button) button.addEventListener("click", handleOpen);
    });

    return () => {
      currentButtons.forEach((button) => {
        if (button) button.removeEventListener("click", handleOpen);
      });
    };
  }, [refs.buttons]);

  useEffect(() => {
    const tableContentRef = refs.tableContent.current;
    if (tableContentRef) {
      tableContentRef.addEventListener("scroll", handleClose);
    }

    document.addEventListener("click", handleClickOutSide);
    document.addEventListener("keydown", handleKeys);

    return () => {
      document.removeEventListener("click", handleClickOutSide);
      document.removeEventListener("keydown", handleKeys);

      if (tableContentRef) {
        tableContentRef.removeEventListener("scroll", handleClose);
      }
    };
  }, []);

  return (
    states.open.get &&
    ReactDOM.createPortal(
      <div
        ref={_arTableFilterPopup}
        className="ar-table-filter-popup"
        style={{ top: coordinate.y, left: coordinate.x }}
      >
        {children}
      </div>,
      document.body,
    )
  );
};

export default FilterPopup;
