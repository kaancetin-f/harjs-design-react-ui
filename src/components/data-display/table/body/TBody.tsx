"use client";

import React, { Dispatch, Fragment, memo, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "../../../icons";
import Checkbox from "../../../form/checkbox";
import Editable from "./Editable";
import { Config } from "../IProps";
import { TableColumnProps } from "../../../../libs/infrastructure/types";
import { GetColumnValue, GetTreeLineLeft, GetTreePaddingLeft, IsSubrowBranchEnd } from "../Helpers";
import ITableLocale from "../../../../libs/core/application/locales/table/ITableLocale";
import TableTR from "../../../../libs/core/application/locales/table/tr";
import TableEN from "../../../../libs/core/application/locales/table/en";
import { useTranslation } from "@harjs/translation";

interface IProps<T extends object> {
  data: T[];
  columns: TableColumnProps<T>[];
  refs: {
    _checkboxItems: React.MutableRefObject<(HTMLInputElement | null)[]>;
    _selectionItems: React.MutableRefObject<T[]>;
  };
  states: {
    columnNumber: { get: number };
    setSelectAll: { get: boolean; set: Dispatch<SetStateAction<boolean>> };
    showSubitems: { get: { [key: string]: boolean }; set: Dispatch<React.SetStateAction<{ [key: string]: boolean }>> };
  };
  methods: {
    trackBy?: (item: T) => string;
    selections?: (selectionItems: T[]) => void;
    selectionDisabled?: (item: T) => boolean;
    onDnD?: (item: T[]) => void;
    onEditable?: (item: T, trackByValue: string, currentKey?: keyof T | null) => void;
    rowBackgroundColor?: (item: T) => string;
  };
  config: Config<T>;
}

type TBodyMethods<T extends object> = IProps<T>["methods"];
type TBodyStates<T extends object> = IProps<T>["states"];

interface IRenderCell<T> {
  item: T;
  column: TableColumnProps<T>;
  index: number;
  cIndex: number;
  depth: number;
  level: number;
  height?: number;
  isSubrows?: boolean;
  isBranchEnd?: boolean;
  hasExpandedChildren?: boolean;
}

interface ISubitemListProps<T extends object> {
  parentItem: T;
  items: T[];
  columns: TableColumnProps<T>[];
  depth: number;
  level?: number;
  parentKey?: string;
  config: Config<T>;
  methods: TBodyMethods<T>;
  states: TBodyStates<T>;
  renderCell: (args: IRenderCell<T>) => React.ReactNode;
}

const SubitemList = <T extends object>({
  parentItem,
  items,
  columns,
  depth,
  level = 1,
  parentKey = "",
  config,
  methods,
  states,
  renderCell,
}: ISubitemListProps<T>) => {
  // variables
  const _subrowSelector = config.subrow?.selector ?? "subitems";
  const _subrowButton = config.subrow?.button ?? false;

  if (config.subrow?.render) {
    return (
      <tr className={`subrow-item ${_subrowButton ? "type-b" : "type-a"}`} data-level={level}>
        {methods.selections && <td className="sticky sticky-left" data-sticky-position="left"></td>}
        {_subrowButton && <td className="sticky sticky-left" data-sticky-position="left"></td>}
        <td
          colSpan={states.columnNumber.get || columns.length || 1}
          style={{
            ...config.subrow.render.styles,
            padding: "var(--space-8)",
          }}
          {...(states.columnNumber.get > 0 ? { className: "sticky sticky-left", "data-sticky-position": "left" } : {})}
        >
          {config.subrow?.render.element(parentItem, items) ?? <></>}
        </td>
      </tr>
    );
  }

  return (
    <>
      {items.map((subitem: T, subindex: number) => {
        const id = methods.trackBy?.(subitem) ?? `sub-${subindex}`;
        const key = `${parentKey}.${id}`;
        const _subitem = subitem[_subrowSelector as keyof typeof subitem];
        const isHasSubitems = _subrowSelector in subitem;
        const hasExpandedChildren = Boolean(states.showSubitems.get[key] && _subitem);
        const isBranchEnd = IsSubrowBranchEnd(subindex, items.length, hasExpandedChildren);

        return (
          <Fragment key={`subitem-wrapper-${key}`}>
            <tr
              className={`subrow-item ${_subrowButton ? "type-b" : "type-a"}${isBranchEnd && config.isTreeView ? " branch-end" : ""}`}
              data-level={level}
            >
              {methods.selections && (
                <td
                  className="sticky sticky-left"
                  data-sticky-position="left"
                  style={{ display: "table-cell", verticalAlign: "middle" }}
                ></td>
              )}

              {_subrowButton && (
                <td
                  className="subrow-col sticky sticky-left"
                  data-sticky-position="left"
                  style={{ display: "table-cell", verticalAlign: "middle" }}
                >
                  <div
                    className="subitem-open-button-wrapper"
                    style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <span
                      className={`subitem-open-button ${(states.showSubitems.get[key] && "opened") ?? ""} ${!isHasSubitems || !_subitem ? "passive passive-arrow" : ""}`}
                      onClick={() => {
                        if (!isHasSubitems || !_subitem) return;
                        states.showSubitems.set((prev: any) => ({ ...prev, [key]: !prev[key] }));
                      }}
                    />
                  </div>
                </td>
              )}

              {columns.map((column: TableColumnProps<T>, cIndex: number) =>
                renderCell({
                  item: subitem,
                  column,
                  index: subindex,
                  cIndex,
                  depth: depth * (config.isTreeView ? 2.25 : 1.75),
                  level,
                  height: 0,
                  isSubrows: true,
                  isBranchEnd,
                  hasExpandedChildren,
                }),
              )}
            </tr>

            {states.showSubitems.get[key] && _subitem && (
              <SubitemList
                parentItem={subitem}
                items={_subitem as T[]}
                columns={columns}
                depth={depth + 0.75}
                level={level + 1}
                parentKey={key}
                config={config}
                methods={methods}
                states={states}
                renderCell={renderCell}
              />
            )}
          </Fragment>
        );
      })}
    </>
  );
};

function TBody<T extends object>({ data, columns, refs, methods, states, config }: IProps<T>) {
  // refs
  const _tBodyTR = useRef<(HTMLTableRowElement | null)[]>([]);
  const _tHeadTH = useRef<(HTMLTableCellElement | null)[]>([]);

  // states
  const [triggerForRender, setTriggerForRender] = useState<boolean>(false);
  const [rowHeights, setRowHeights] = useState<number[]>([]);

  // hooks
  const { t } = useTranslation<ITableLocale>(String(config.locale ?? "tr"), { tr: { ...TableTR }, en: { ...TableEN } });

  // variables
  const _subrowSelector: string = config.subrow?.selector ?? "subitems";
  const _subrowButton: boolean = config.subrow?.button ?? false;

  // methods
  const renderCell = ({
    item,
    column = { isShow: true },
    index,
    cIndex,
    depth,
    level,
    height = 0,
    isSubrows = false,
    isBranchEnd = false,
    hasExpandedChildren = false,
  }: IRenderCell<T>) => {
    if (column.isShow === false) return;

    let render: React.ReactNode;
    const itemTrackId = methods.trackBy?.(item) ?? index.toString();

    if (typeof column.key !== "object") render = column.render ? column.render(item) : (item[column.key as keyof T] as React.ReactNode);
    else if (typeof column.key === "object") {
      render = column.render ? column.render(item) : (GetColumnValue(item, column.key) as React.ReactNode);
    } else render = null;

    // refs
    const _className: string[] = [];
    if (column.config?.alignContent) _className.push(`align-content-${column.config.alignContent}`);
    if (column.config?.sticky) _className.push(`sticky sticky-${column.config.sticky}`);
    if (column.config?.textWrap) _className.push(`text-${column.config.textWrap}`);

    // Tree girintisini solda yapışık olmayan ilk kolona uygula.
    const firstCleanDataColumn = columns.find(
      (col) => col.config?.sticky === undefined || col.config?.sticky !== "left",
    );
    const isTargetPaddingColumn = firstCleanDataColumn !== undefined && column === firstCleanDataColumn;
    const showTreeLines = config.isTreeView && isTargetPaddingColumn && isSubrows && level > 0;
    const treeCellClassName = ["table-cell", showTreeLines ? "tree-cell" : ""].filter(Boolean).join(" ");

    return (
      <td
        key={`cell-${itemTrackId}-${cIndex}`}
        className={_className.join(" ")}
        style={{
          ...(column.config?.sticky && height > 0 ? { height } : {}),
          ...(column.config?.width
            ? {
                width: column.config.width,
                minWidth: column.config.width,
                maxWidth: column.config.width,
                overflow: "hidden",
              }
            : {}),
        }}
        data-sticky-position={column.config?.sticky}
      >
        <div
          style={{
            paddingLeft:
              isTargetPaddingColumn && config.isTreeView && isSubrows && level > 0
                ? GetTreePaddingLeft(level)
                : isTargetPaddingColumn && !config.isTreeView
                  ? `${depth === 0 ? 1 : depth}rem`
                  : undefined,
          }}
          className={treeCellClassName}
        >
          {showTreeLines && (
            <div className="tree-lines" aria-hidden="true">
              {Array.from({ length: level - 1 }).map((_, i) => (
                <span
                  key={`tree-guide-${itemTrackId}-${i}`}
                  className={`tree-vline is-guide${isBranchEnd && i === level - 2 ? " is-end" : ""}`}
                  style={{ left: GetTreeLineLeft(i) }}
                />
              ))}
              <span
                className={`tree-vline is-rail${isBranchEnd ? " is-end" : ""}`}
                style={{ left: GetTreeLineLeft(level - 1) }}
              />
              <span className="tree-fork" style={{ left: GetTreeLineLeft(level - 1) }} />
              {hasExpandedChildren && (
                <span className="tree-vline is-descent" style={{ left: GetTreeLineLeft(level) }} />
              )}
            </div>
          )}
          {React.isValidElement(render) ? (
            render
          ) : column.editable && methods.onEditable ? (
            <Editable
              key={`editable-${itemTrackId}-${String(column.key)}`}
              c={column}
              item={item}
              trackByValue={itemTrackId}
              onEditable={methods.onEditable}
              config={config}
            />
          ) : (
            <span className={showTreeLines ? "tree-cell-content" : undefined}>{render}</span>
          )}
        </div>
      </td>
    );
  };

  const renderRow = (item: T, index: number, deph: number, parentKey = "") => {
    const id = methods.trackBy?.(item) ?? index.toString();
    const key = parentKey ? `${parentKey}.${id}` : id;
    const _subitem = item[_subrowSelector as keyof typeof item];
    const isHasSubitems = _subrowSelector in item;
    const currentRowHeight = rowHeights[index] ?? 0;

    return (
      <Fragment key={`row-wrapper-${id}`}>
        <tr
          ref={(element) => {
            _tBodyTR.current[index] = element;
          }}
          {...(methods.rowBackgroundColor ? { style: { backgroundColor: methods.rowBackgroundColor(item) } } : {})}
          {...(methods.onDnD && data.length > 1 ? { className: "draggable", draggable: true } : {})}
        >
          {methods.selections && (
            <td
              ref={(element) => {
                _tHeadTH.current[index] = element;
              }}
              className="sticky sticky-left"
              data-sticky-position="left"
              style={{
                display: "table-cell",
                verticalAlign: "middle",
              }}
            >
              <div className="flex justify-content-center align-items-center" style={{ width: "100%", height: "100%" }}>
                <Checkbox
                  ref={(element) => {
                    if (element) refs._checkboxItems.current[index] = element;
                  }}
                  variant="filled"
                  color="green"
                  checked={refs._selectionItems.current.some(
                    (sItem) => methods.trackBy?.(sItem) === methods.trackBy?.(item),
                  )}
                  onChange={(event) => {
                    const rKey = methods.trackBy?.(item);
                    if (event.target.checked) {
                      if (!refs._selectionItems.current.some((_item) => methods.trackBy?.(_item) === rKey)) {
                        refs._selectionItems.current = [...refs._selectionItems.current, item];
                      }
                    } else {
                      refs._selectionItems.current = refs._selectionItems.current.filter(
                        (_item) => methods.trackBy?.(_item) !== rKey,
                      );
                    }
                    methods.selections?.(refs._selectionItems.current);
                    // Checkbox değişince select-all durumunu yeniden hesapla.
                    setTriggerForRender((prev) => !prev);
                  }}
                  disabled={methods.selectionDisabled?.(item)}
                />
              </div>
            </td>
          )}

          {_subrowButton && (
            <td
              className="subrow-col sticky sticky-left"
              data-sticky-position="left"
              style={{
                display: "table-cell",
                verticalAlign: "middle",
              }}
            >
              <div
                className="subitem-open-button-wrapper"
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                <span
                  className={`subitem-open-button ${(states.showSubitems.get[key] && "opened") ?? ""} ${!isHasSubitems || !_subitem ? "passive passive-arrow" : ""}`}
                  onClick={() => {
                    if (!isHasSubitems || !_subitem) return;
                    states.showSubitems.set((prev) => ({ ...prev, [key]: !prev[key] }));
                  }}
                />
              </div>
            </td>
          )}

          {columns.map((column, cIndex) =>
            renderCell({
              item,
              column,
              index,
              cIndex,
              depth: deph * (config.isTreeView ? 1.75 : 0),
              level: 0,
              height: currentRowHeight,
            }),
          )}
        </tr>

        {states.showSubitems.get[key] && _subitem && (
          <SubitemList
            parentItem={item}
            items={_subitem as T[]}
            columns={columns}
            depth={1.5}
            parentKey={key}
            config={config}
            methods={methods}
            states={states}
            renderCell={renderCell}
          />
        )}
      </Fragment>
    );
  };

  // useEffects
  useLayoutEffect(() => {
    if (!data || data.length === 0) {
      setRowHeights([]);
      return;
    }

    const rows = _tBodyTR.current;

    // Clear previously applied sticky heights so measurement isn't cumulative (+1px loop)
    rows.forEach((tr) => {
      if (!tr) return;
      tr.querySelectorAll<HTMLElement>("td[data-sticky-position]").forEach((td) => {
        td.style.height = "";
      });
    });

    const heights = rows.map((el) => (el ? Math.round(el.getBoundingClientRect().height) : 0));

    setRowHeights((prev) => {
      const unchanged = prev.length === heights.length && prev.every((h, i) => h === heights[i]);

      if (unchanged) {
        // Re-apply cleared inline heights without triggering a re-render
        rows.forEach((tr, i) => {
          if (!tr || heights[i] <= 0) return;
          tr.querySelectorAll<HTMLElement>("td[data-sticky-position]").forEach((td) => {
            td.style.height = `${heights[i]}px`;
          });
        });
        return prev;
      }

      return heights;
    });
  }, [data.length, data]);

  useEffect(() => {
    if (Array.isArray(refs._checkboxItems.current) && refs._checkboxItems.current.length > 0) {
      const allChecked = refs._checkboxItems.current.every((item) => item?.checked === true);
      states.setSelectAll.set(allChecked);
    }
  }, [triggerForRender]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tableContainer = _tBodyTR.current[0]?.closest("div");

    if (tableContainer && tableContainer.scrollLeft > 0) {
      const currentScroll = tableContainer.scrollLeft;
      // Sticky kolonları yeniden hizalamak için 1px scroll titretmesi.
      requestAnimationFrame(() => {
        tableContainer.scrollLeft = currentScroll + 1;
        tableContainer.scrollLeft = currentScroll;
      });
    }
  }, [states.showSubitems.get]);

  return data.length > 0 ? (
    data.map((item, index) => {
      const rowKey = methods.trackBy?.(item) ?? index.toString();
      return <React.Fragment key={`tbody-row-${rowKey}`}>{renderRow(item, index, 1)}</React.Fragment>;
    })
  ) : (
    <tr>
      <td colSpan={columns.filter((x) => x.isShow !== false).length || 1}>
        <div className="no-item">
          <Icon icon={"Inbox-Fill"} fill="currentColor" size={64} style={{ position: "relative", zIndex: 1 }} />
          <span>{t("Table.Body.NoData.Text")}</span>
          <p>{t("Table.Body.NoData.Hint")}</p>
        </div>
      </td>
    </tr>
  );
}

export default memo(TBody) as <T extends object>(props: IProps<T>) => React.JSX.Element;
