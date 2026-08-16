"use client";

import React, { Dispatch, memo, MutableRefObject, SetStateAction, useEffect, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import { Icon } from "../../icons";
import { ExtractKey } from "./Helpers";
import useAnchoredPosition from "./popup/useAnchoredPosition";
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
  const position = useAnchoredPosition(states.open.get, coordinate, _arTablePropertiesPopup);
  const { t } = useTranslation<ITableLocale>(String(config.locale ?? "tr"), { tr: { ...TableTR }, en: { ...TableEN } });

  // methods
  const handleClickOutSide = (event: Event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const clickedInsidePopup = Boolean(_arTablePropertiesPopup.current?.contains(target));
    const isOneOfButtons = Boolean(target.closest('[data-properties-button="true"]'));

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

  const handleClose = () => {
    states.open.set(false);
    methods.handleScroll();
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
    window.addEventListener("scroll", handleClose, true);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutSide);
      document.removeEventListener("keydown", handleKeys);
      window.removeEventListener("scroll", handleClose, true);

      if (tableContentRef) {
        tableContentRef.removeEventListener("scroll", handleClose);
      }
    };
  }, [states.open.get]);

  const currentKey = ExtractKey(states.sort.currentColumn?.key);
  const currentSort = states.sort.get?.find((s) => s.key === currentKey);

  return (
    states.open.get &&
    ReactDOM.createPortal(
      <div
        ref={_arTablePropertiesPopup}
        className="har-table-properties-popup"
        role="menu"
        aria-label={t("Table.Properties.Popup.Label")}
        style={{ top: position.y, left: position.x }}
      >
          {currentSort && (!currentSort.direction || currentSort.direction === "desc") && (
            <button type="button" role="menuitem" onClick={() => handleSort(currentKey, "asc")}>
              <span>
                <Icon icon="ArrowUp" fill="currentColor" />
              </span>
              <span>{t("Table.Properties.Asc.Text")}</span>
            </button>
          )}

          {currentSort && (!currentSort.direction || currentSort.direction === "asc") && (
            <button type="button" role="menuitem" onClick={() => handleSort(currentKey, "desc")}>
              <span>
                <Icon icon="ArrowDown" fill="currentColor" />
              </span>
              <span>{t("Table.Properties.Desc.Text")}</span>
            </button>
          )}

          {currentSort && currentSort.direction && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                states.sort.set((prev) => prev.filter((s) => s.key !== currentKey));
                states.open.set(false);
              }}
            >
              <span>
                <Icon icon="ChevronExpand" fill="currentColor" />
              </span>
              <span>{t("Table.Properties.ClearSort.Text")}</span>
            </button>
          )}
      </div>,
      document.body,
    )
  );
}

export default memo(PropertiesPopup) as typeof PropertiesPopup;
