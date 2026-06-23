"use client";

import React, { Dispatch, memo, MutableRefObject, SetStateAction, useEffect, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import { ARIcon } from "../../icons";
import { ExtractKey } from "./Helpers";
import { Config, Sort } from "./IProps";
import { TableColumnProps } from "../../../libs/infrastructure/types";
import ITableLocale from "../../../libs/core/application/locales/table/ITableLocale";
import TableTR from "../../../libs/core/application/locales/table/tr";
import TableEN from "../../../libs/core/application/locales/table/en";
import { useTranslation } from "@harjs/translation";

interface IProps<T extends object> {
  refs: {
    tableContent: MutableRefObject<HTMLDivElement | null>;
    buttons: MutableRefObject<(HTMLSpanElement | null)[]>;
  };
  states: {
    open: { get: boolean; set: Dispatch<SetStateAction<boolean>> };
    sort: {
      get: Sort<T>[];
      set: Dispatch<SetStateAction<Sort<T>[]>>;
      currentColumn: TableColumnProps<T> | null;
    };
  };
  methods: {
    handleScroll: () => void;
  };
  coordinate: { x: number; y: number };
  config: Config<T>;
}

function PropertiesPopup<T extends object>({ refs, states, methods, coordinate, config }: IProps<T>) {
  // refs
  const _arTablePropertiesPopup = useRef<HTMLDivElement>(null);

  // hooks
  const { t } = useTranslation<ITableLocale>(String(config.locale ?? "tr"), { tr: { ...TableTR }, en: { ...TableEN } });

  // methods
  const handleClickOutSide = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const clickedInsidePopup = _arTablePropertiesPopup.current && _arTablePropertiesPopup.current.contains(target);
    const isOneOfButtons = target.closest('[data-properties-button="true"]');

    if (!clickedInsidePopup && !isOneOfButtons) handleClose();
  };

  const handleSort = useMemo(() => {
    return (columnKey: keyof T | null, direction: "asc" | "desc") => {
      if (!columnKey) return;
      states.sort.set(() => [{ key: columnKey, direction }]);
    };
  }, [states.sort]);

  const handleKeys = (event: KeyboardEvent) => {
    const key = event.key;

    if (key === "Escape") handleClose();
  };

  const handleOpen = () => {
    states.open.set(true);
    methods.handleScroll();
  };

  const handleClose = () => {
    states.open.set(false);
    methods.handleScroll();
  };

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

  const currentKey = ExtractKey(states.sort.currentColumn?.key);
  const currentSort = states.sort.get?.find((s) => s.key === currentKey);

  return (
    states.open.get &&
    ReactDOM.createPortal(
      <div
        ref={_arTablePropertiesPopup}
        className="ar-table-properties-popup"
        style={{ top: coordinate.y, left: coordinate.x }}
      >
        <ul>
          {/* ASC */}
          {currentSort && (!currentSort.direction || currentSort.direction === "desc") && (
            <li onClick={() => handleSort(currentKey, "asc")}>
              <span>
                <ARIcon icon="ArrowUp" />
              </span>
              <span>{t("Table.Properties.Asc.Text")}</span>
            </li>
          )}

          {/* DESC */}
          {currentSort && (!currentSort.direction || currentSort.direction === "asc") && (
            <li onClick={() => handleSort(currentKey, "desc")}>
              <span>
                <ARIcon icon="ArrowDown" />
              </span>
              <span>{t("Table.Properties.Desc.Text")}</span>
            </li>
          )}

          {/* CLEAR */}
          {currentSort && currentSort.direction && (
            <li
              onClick={() => {
                states.sort.set((prev) => prev.filter((s) => s.key !== currentKey));
                states.open.set(false);
              }}
            >
              <span>
                <ARIcon icon="ChevronExpand" />
              </span>
              <span>{t("Table.Properties.ClearSort.Text")}</span>
            </li>
          )}
        </ul>
      </div>,
      document.body,
    )
  );
}

export default memo(PropertiesPopup) as typeof PropertiesPopup;
