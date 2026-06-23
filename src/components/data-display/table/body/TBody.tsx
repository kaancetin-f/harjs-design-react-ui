"use client";

import React, { Dispatch, Fragment, memo, SetStateAction, useEffect, useRef, useState } from "react";
import { ARIcon } from "../../../icons";
import Checkbox from "../../../form/checkbox";
import Editable from "./Editable";
import { Config } from "../IProps";
import { useTranslation } from "../../../../libs/core/application/hooks";
import { TableColumnProps } from "../../../../libs/infrastructure/types";

interface IProps<T extends object> {
  data: T[];
  columns: TableColumnProps<T>[];
  refs: {
    _checkboxItems: React.MutableRefObject<(HTMLInputElement | null)[]>;
    _selectionItems: React.MutableRefObject<T[]>;
  };
  states: {
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

interface IRenderCell<T> {
  item: T;
  column: TableColumnProps<T>;
  index: number;
  cIndex: number;
  depth: number;
  level: number;
  height?: number;
  isSubrows?: boolean;
}

interface ISubitemListProps<T> {
  items: T[];
  columns: TableColumnProps<T>[];
  depth: number;
  level?: number;
  parentKey?: string;
  config: any;
  methods: any;
  states: any;
  renderCell: (args: IRenderCell<T>) => React.ReactNode;
}

const SubitemList = <T extends object>({
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
  const _subrowSelector = config.subrow?.selector ?? "subitems";
  const _subrowButton = config.subrow?.button ?? true;

  if (config.subrow?.render) {
    return (
      <tr className={`subrow-item ${_subrowButton ? "type-b" : "type-a"}`} data-level={level}>
        {methods.selections && <td className="sticky sticky-left" data-sticky-position="left"></td>}
        {_subrowButton && <td className="sticky sticky-left" data-sticky-position="left"></td>}
        <td colSpan={columns.length || 1} style={{ ...config.subrow.render.styles, padding: "7.5px 7.5px 7.5px 0" }}>
          {config.subrow?.render.element(items) ?? <></>}
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

        return (
          <Fragment key={`subitem-wrapper-${key}`}>
            <tr className={`subrow-item ${_subrowButton ? "type-b" : "type-a"}`} data-level={level}>
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
                      className={`${(states.showSubitems.get[key] && "opened") ?? ""} ${!isHasSubitems || !_subitem ? "passive passive-arrow" : ""}`}
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
                }),
              )}
            </tr>

            {states.showSubitems.get[key] && _subitem && (
              <SubitemList
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
  const _tBodyTR = useRef<(HTMLTableRowElement | null)[]>([]);
  const _tHeadTH = useRef<(HTMLTableCellElement | null)[]>([]);

  const [triggerForRender, setTriggerForRender] = useState<boolean>(false);
  const [rowHeights, setRowHeights] = useState<number[]>([]);

  const _subrowSelector: string = config.subrow?.selector ?? "subitems";
  const _subrowButton: boolean = config.subrow?.button ?? false;
  const { t } = useTranslation(String(config.locale ?? "tr"));

  const renderCell = ({ item, column, index, cIndex, depth, level, height = 0, isSubrows = false }: IRenderCell<T>) => {
    let render: any;
    const itemTrackId = methods.trackBy?.(item) ?? index.toString();

    if (typeof column.key !== "object") render = column.render ? column.render(item) : item[column.key as keyof T];
    else if (typeof column.key === "object") {
      const _item = item[column.key.field as keyof T];
      if (_item && typeof _item === "object") {
        render = column.render ? column.render(item) : _item[column.key.nestedKey as keyof typeof _item];
      }
    } else render = null;

    const _className: string[] = [];
    if (column.config?.alignContent) _className.push(`align-content-${column.config.alignContent}`);
    if (column.config?.sticky) _className.push(`sticky-${column.config.sticky}`);
    if (column.config?.textWrap) _className.push(`text-${column.config.textWrap}`);

    const firstCleanDataColumn = columns.find(
      (col) => col.config?.sticky === undefined || col.config?.sticky !== "left",
    );
    const isTargetPaddingColumn = firstCleanDataColumn !== undefined && column === firstCleanDataColumn;

    return (
      <td
        key={`cell-${itemTrackId}-${cIndex}`}
        className={_className.join(" ")}
        style={{
          ...(column.config?.sticky ? { height } : {}),
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
            paddingLeft: isTargetPaddingColumn ? `${depth === 0 ? 1 : depth}rem` : "",
          }}
          className="table-cell"
        >
          {config.isTreeView && cIndex === 0 && (
            <>
              {isSubrows &&
                Array.from({ length: level }).map((_, i) => (
                  <div
                    key={`last-before-${itemTrackId}-${i}`}
                    style={{ left: `${(i > 0 ? i * 1.655 : i) + 0.65}rem` }}
                    className="last-before"
                  ></div>
                ))}
              <div className="before"></div>
            </>
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
            <span>{render}</span>
          )}
          {config.isTreeView && cIndex === 0 && (
            <div className="after">
              <div className="circle"></div>
            </div>
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
  useEffect(() => {
    if (!data || data.length === 0) return;
    const heights = _tBodyTR.current.map((el) => (el ? el.getBoundingClientRect().height : 0));
    setRowHeights(heights);
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
      <td colSpan={columns.length || 1}>
        <div className="no-item">
          <ARIcon icon={"Inbox-Fill"} fill="var(--gray-300)" size={64} style={{ position: "relative", zIndex: 1 }} />
          <span>{t("Table.Body.NoData.Text")}</span>
        </div>
      </td>
    </tr>
  );
}

export default memo(TBody) as <T extends object>(props: IProps<T>) => React.JSX.Element;
