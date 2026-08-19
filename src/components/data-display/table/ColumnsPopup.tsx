"use client";

import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Checkbox from "../../form/checkbox";
import Button from "../../form/button";
import DnD from "../dnd";
import { COLUMNS_POPUP_WIDTH, ExtractKey } from "./Helpers";
import useAnchoredPosition from "./popup/useAnchoredPosition";
import { Config } from "./IProps";
import { TableColumnProps } from "../../../libs/infrastructure/types";
import ITableLocale from "../../../libs/core/application/locales/table/ITableLocale";
import TableTR from "../../../libs/core/application/locales/table/tr";
import TableEN from "../../../libs/core/application/locales/table/en";
import { useTranslation } from "@harjs/translation";
import Title from "../typography/title/Title";
import GridSystem from "../../layout/grid-system";

interface IProps<T extends object> {
  refs: {
    tableContent: MutableRefObject<HTMLDivElement | null>;
    button: MutableRefObject<HTMLSpanElement | null>;
  };
  states: {
    open: { get: boolean; set: Dispatch<SetStateAction<boolean>> };
    visibility: { get: Record<string, boolean>; set: (key: string, value: boolean) => void };
    // Kolonların sürükle-bırak ile sıralanmış hallini tutan key listesi.
    order: { get: string[]; set: (order: string[]) => void };
    pdf: {
      get: Record<string, boolean>;
      set: (key: string, value: boolean) => void;
      setAll: (value: boolean) => void;
    };
  };
  coordinate: { x: number; y: number };
  columns: TableColumnProps<T>[];
  config: Config<T>;
}

const { Flex } = GridSystem;

function ColumnsPopup<T extends object>({ refs, states, coordinate, columns, config }: IProps<T>) {
  // refs
  const _arColumnsPopup = useRef<HTMLDivElement>(null);

  // hooks
  const position = useAnchoredPosition(states.open.get, coordinate, _arColumnsPopup);
  const { t } = useTranslation<ITableLocale>(String(config.locale ?? "tr"), { tr: { ...TableTR }, en: { ...TableEN } });

  // variables
  const pdfExportEnabled = config.columnManagement?.pdfExport !== false;

  // methods
  // Kolonun sabit key değerini üretir (visibility mantığıyla aynı kural).
  const getColumnKey = (c: TableColumnProps<T>, index: number) => String(ExtractKey(c.key) ?? c.title ?? index);

  const handleClickOutSide = (event: Event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const clickedInsidePopup = Boolean(_arColumnsPopup.current?.contains(target));
    const isTriggerButton = refs.button.current === target || Boolean(refs.button.current?.contains(target));

    if (!clickedInsidePopup && !isTriggerButton) states.open.set(false);
  };

  const handleKeys = (event: KeyboardEvent) => {
    if (event.key === "Escape") states.open.set(false);
  };

  const handleClose = () => states.open.set(false);

  const handleScrollAway = (event: Event) => {
    const target = event.target instanceof Node ? event.target : null;
    if (target && _arColumnsPopup.current?.contains(target)) return;
    handleClose();
  };

  const setAllVisibility = (value: boolean) => {
    columns.forEach((c, cIndex) => {
      const key = getColumnKey(c, cIndex);
      // En az bir kolon görünür kalmalı; tümünü kapatmaya izin verme.
      if (!value) return;
      states.visibility.set(key, value);
    });
  };

  const setAllPdf = (value: boolean) => {
    states.pdf.setAll(value);
  };

  // useEffects
  useEffect(() => {
    if (!states.open.get) return;

    const tableContentRef = refs.tableContent.current;
    if (tableContentRef) tableContentRef.addEventListener("scroll", handleClose);

    document.addEventListener("pointerdown", handleClickOutSide);
    document.addEventListener("keydown", handleKeys);
    window.addEventListener("scroll", handleScrollAway, true);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutSide);
      document.removeEventListener("keydown", handleKeys);
      window.removeEventListener("scroll", handleScrollAway, true);
      if (tableContentRef) tableContentRef.removeEventListener("scroll", handleClose);
    };
  }, [states.open.get]);

  // Görünür kolon sayısı: en az 1 kolon her zaman açık kalmalı.
  const visibleCount = columns.filter((c, i) => {
    const key = getColumnKey(c, i);
    return states.visibility.get[key] ?? c.isShow ?? true;
  }).length;

  const pdfCount = columns.filter((c, i) => {
    const key = getColumnKey(c, i);
    return states.pdf.get[key] ?? c.pdfExport ?? true;
  }).length;

  return (
    states.open.get &&
    ReactDOM.createPortal(
      <div
        ref={_arColumnsPopup}
        className={`har-table-columns-popup${pdfExportEnabled ? " has-pdf" : ""}`}
        role="dialog"
        aria-label={t("Table.Columns.Title.Text")}
        style={{ top: position.y, left: position.x, width: COLUMNS_POPUP_WIDTH }}
      >
        <div className="header">
          <Title size="sm" style={{ fontWeight: 600 }}>
            {t("Table.Columns.Title.Text")}
          </Title>
        </div>

        <div className="body">
          <DnD
            data={columns}
            itemKey={getColumnKey}
            renderItem={(c, cIndex) => {
              const key = getColumnKey(c, cIndex);
              const isVisible = states.visibility.get[key] ?? c.isShow ?? true;
              const isLastVisible = isVisible && visibleCount <= 1;
              const isPdf = states.pdf.get[key] ?? c.pdfExport ?? true;
              const isLastPdf = isPdf && pdfCount <= 1;

              return (
                <div className="rows">
                  <span className="name" title={c.title ?? key}>
                    {c.title ?? key}
                  </span>

                  <div className="toggles">
                    <Checkbox
                      variant="filled"
                      color="blue"
                      checked={isVisible}
                      disabled={isLastVisible}
                      size="xs"
                      onChange={(event) => {
                        event.stopPropagation();
                        states.visibility.set(key, event.target.checked);
                      }}
                    />

                    {pdfExportEnabled && (
                      <Checkbox
                        variant="filled"
                        color="red"
                        checked={isPdf}
                        disabled={isLastPdf}
                        size="xs"
                        onChange={(event) => {
                          event.stopPropagation();
                          states.pdf.set(key, event.target.checked);
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            }}
            onChange={(reordered) => states.order.set(reordered.map((c, cIndex) => getColumnKey(c, cIndex)))}
          />
        </div>

        <div className="footer">
          <Flex justifyContent="flex-end" gap="var(--space-4)">
            <Button variant="surface" size="xs" onClick={() => setAllVisibility(true)}>
              {t("Table.Columns.ShowAll.Text")}
            </Button>

            {pdfExportEnabled && (
              <Button variant="surface" color="red" size="xs" onClick={() => setAllPdf(true)}>
                {t("Table.Columns.Pdf.SelectAll.Text")}
              </Button>
            )}
          </Flex>
        </div>
      </div>,
      document.body,
    )
  );
}

export default ColumnsPopup;
