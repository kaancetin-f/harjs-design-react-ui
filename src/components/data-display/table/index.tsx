"use client";

import "../../../assets/css/components/data-display/table/styles.css";
import { ARIcon } from "../../icons";
import Button from "../../form/button";
import Checkbox from "../../form/checkbox";
import IProps, { FilterValue, SearchedParam, Sort } from "./IProps";
import Pagination from "../../navigation/pagination";
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FilterDataType,
  HTMLTableElementWithCustomAttributes,
  Option,
  TableColumnProps,
} from "../../../libs/infrastructure/types";
import Input from "../../form/input";
import Utils from "../../../libs/infrastructure/shared/Utils";
import FilterPopup from "./FilterPopup";
import { FilterOperator } from "../../../libs/infrastructure/shared/Enums";
import Select from "../../form/select";
import Grid from "../grid-system";
import THeadCell from "./THeadCell";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import PropertiesPopup from "./PropertiesPopup";
import { ExtractKey } from "./Helpers";
import Header from "./header/Header";
import TBody from "./body/TBody";
import DatePicker from "../../form/date-picker";
import { useTranslation } from "@harjs/translation";
import TableTR from "../../../libs/core/application/locales/table/tr";
import TableEN from "../../../libs/core/application/locales/table/en";
import ITableLocale from "../../../libs/core/application/locales/table/ITableLocale";

const { Row, Column } = Grid;

const Table = forwardRef(
  <T extends object>(
    {
      children,
      trackBy,
      title,
      description,
      data,
      columns,
      actions,
      rowBackgroundColor,
      selections,
      selectionDisabled,
      previousSelections,
      sortedParams,
      searchedParams,
      onEditable,
      onDnD,
      pagination,
      config = { isSearchable: false },
    }: IProps<T>,
    ref: React.ForwardedRef<HTMLTableElementWithCustomAttributes>,
  ) => {
    const _innerRef = useRef<HTMLTableElementWithCustomAttributes>(null);
    const _tableWrapper = useRef<HTMLDivElement>(null);
    const _tableContent = useRef<HTMLDivElement>(null);
    const _tBody = useRef<HTMLTableSectionElement>(null);
    const _dragItem = useRef<HTMLElement>(null);
    const _checkboxItems = useRef<(HTMLInputElement | null)[]>([]);
    const _filterCheckboxItems = useRef<(HTMLInputElement | null)[]>([]);
    const _searchTextInputs = useRef<(HTMLInputElement | null)[]>([]);
    const _searchTimeOut = useRef<NodeJS.Timeout | null>(null);
    const _propertiesButton = useRef<(HTMLSpanElement | null)[]>([]);
    const _filterButton = useRef<(HTMLSpanElement | null)[]>([]);
    const _selectionItems = useRef<T[]>([]);
    const lastSentRef = useRef<T[]>([]);

    const _subrowOpenAutomatically: boolean = config.subrow?.openAutomatically ?? false;
    const _subrowSelector: string = config.subrow?.selector ?? "subitems";
    const _subrowButton: boolean = config.subrow?.button ?? false;

    const _tableClassName: string[] = ["ar-table", "scroll"];

    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [showSubitems, setShowSubitems] = useState<{ [key: string]: boolean }>({});
    const [createTrigger, setCreateTrigger] = useState<boolean>(false);
    const [searchedText, setSearchedText] = useState<SearchedParam | null>(null);
    const [_searchedParams, setSearchedParams] = useState<SearchedParam | null>(null);
    const [checkboxSelectedParams, setCheckboxSelectedParams] = useState<SearchedParam | null>(null);
    const [sortConfig, setSortConfig] = useState<Sort<T>[]>([]);
    const [sortCurrentColumn, setSortCurrentColumn] = useState<TableColumnProps<T> | null>(null);
    const [openProperties, setOpenProperties] = useState<boolean>(false);
    const [propertiesButtonCoordinate, setPropertiesButtonCoordinate] = useState<{ x: number; y: number }>({
      x: 0,
      y: 0,
    });
    const [filterButtonCoordinate, setFilterButtonCoordinate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [filterPopupContent, setFilterPopupContent] = useState<React.JSX.Element | null>(null);
    const [filterPopupOption, setFilterPopupOption] = useState<{ key: string; option: Option | undefined } | null>(
      null,
    );
    const [filterPopupOptionSearchText, setFilterPopupOptionSearchText] = useState<string | null>(null);
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [filterCurrentColumn, setFilterCurrentColumn] = useState<TableColumnProps<T> | null>(null);
    const [filterCurrentDataType, setFilterCurrentDataType] = useState<FilterDataType | null>(null);
    const [filterCurrentIndex, setFilterCurrentIndex] = useState<number | null>(null);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedPerPage, setSelectedPerPage] = useState<number>(pagination?.perPage ?? 10);
    const [isMobile, setIsMobile] = useState(false);

    const { t } = useTranslation<ITableLocale>(String(config.locale ?? "tr"), {
      tr: { ...TableTR },
      en: { ...TableEN },
    });
    useImperativeHandle(ref, () => _innerRef.current as HTMLTableElementWithCustomAttributes);

    if (config && Object.keys(config.scroll || {}).length > 0) {
      if (_tableContent.current && config.scroll) {
        if (config.scroll.maxHeight) {
          _tableContent.current.style.maxHeight = `${config?.scroll?.maxHeight}rem`;
        }
      }
    }

    const handleScroll = useCallback(() => {
      if (!_tableWrapper.current) return;
      const wrapperRect = _tableWrapper.current.getBoundingClientRect();

      const updateStickyPositions = (elements: NodeListOf<HTMLTableRowElement>) => {
        elements.forEach((element) => {
          const leftChildren = Array.from(element.childNodes)
            .filter((node): node is HTMLElement => node.nodeType === Node.ELEMENT_NODE)
            .filter((child) => child.dataset.stickyPosition === "left");
          const rightChildren = Array.from(element.childNodes)
            .filter((node): node is HTMLElement => node.nodeType === Node.ELEMENT_NODE)
            .filter((child) => child.dataset.stickyPosition === "right")
            .reverse();

          const leftRects = leftChildren.map((child) => child.getBoundingClientRect());
          const rightRects = rightChildren.map((child) => child.getBoundingClientRect());

          const leftPrevious = leftRects.map((rect) => Math.abs(rect.right - wrapperRect.left));
          const rightPrevious = rightRects.map((rect) => Math.abs(rect.left - wrapperRect.right));

          leftChildren.forEach((child, index) => {
            const prevLeft = index > 0 ? leftPrevious[index - 1] : 0;
            if (index > 0) {
              const childLeft = leftRects[index].left - wrapperRect.left;
              if (Math.floor(childLeft) === Math.floor(prevLeft)) {
                if (!child.classList.contains("active-sticky")) child.classList.add("active-sticky");
              } else child.classList.remove("active-sticky");
              child.style.left = `${prevLeft}px`;
            } else child.classList.add("sticky");
            if (child.nodeName === "TD") child.style.zIndex = `5`;
          });

          rightChildren.forEach((child, index) => {
            const prevRight = index > 0 ? rightPrevious[index - 1] : 0;
            if (index > 0) {
              const childRight = Math.abs(rightRects[index].right - wrapperRect.right);
              if (Math.floor(childRight) === Math.floor(prevRight)) {
                if (!child.classList.contains("active-sticky")) child.classList.add("active-sticky");
              } else child.classList.remove("active-sticky");
              child.style.right = `${prevRight}px`;
            } else child.classList.add("sticky");
          });
        });
      };

      const theadElements = _tableWrapper.current.querySelectorAll<HTMLTableRowElement>("table > thead > tr");
      const tbodyElements = _tableWrapper.current.querySelectorAll<HTMLTableRowElement>("table > tbody > tr");

      requestAnimationFrame(() => {
        updateStickyPositions(theadElements);
        updateStickyPositions(tbodyElements);
      });
    }, []);

    const handleResize = useMemo(() => {
      return () => {
        setIsMobile(window.innerWidth <= 768);
      };
    }, []);

    const handleSearch = useCallback(
      (name: string, value: string, dataType?: FilterDataType) => {
        const operator =
          filterPopupOption?.key === name
            ? (filterPopupOption.option?.value as FilterOperator)
            : FilterOperator.Contains;

        if (config.isServerSide) {
          if (_searchTimeOut.current) clearTimeout(_searchTimeOut.current);
          _searchTimeOut.current = setTimeout(
            () => {
              setSearchedParams((prev) => ({
                ...prev,
                [name]: { value: value, operator: operator },
              }));
              if (pagination) pagination.onChange?.(1, selectedPerPage);
            },
            dataType === "date" ? 0 : 750,
          );
        } else {
          setSearchedText((prev) => {
            const _state = { ...prev };
            if (value === "") {
              delete _state[name];
            } else {
              _state[name] = { value: value, operator: operator };
            }
            return _state;
          });
        }
        setCurrentPage(1);
      },
      [filterPopupOption, config.isServerSide, pagination, selectedPerPage],
    );

    const handleCheckboxChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();
      const { name, value, checked } = event.target;

      setCheckboxSelectedParams((prev) => {
        const prevFilters = (prev?.[name] as FilterValue[]) || [];
        const updatedSet = new Set(prevFilters.map((f) => String(f.value)));

        checked ? updatedSet.add(value) : updatedSet.delete(value);

        const updatedArray: FilterValue[] = Array.from(updatedSet).map((v) => ({
          value: v,
          operator: FilterOperator.Equals,
        }));

        return {
          ...prev,
          ...(updatedArray.length > 0 ? { [name]: updatedArray } : { [name]: [] }),
        };
      });
    }, []);

    const handleFilterPopupContent = (c: TableColumnProps<T>, dataType: FilterDataType, index: number | null) => {
      const key: keyof T | null = ExtractKey(c.key);
      if (!key) return;

      const value = Array.isArray(searchedText?.[key]) ? "" : ((searchedText?.[key] as FilterValue)?.value as string);

      const handleChange = (val: string) => {
        const input = _searchTextInputs.current[index ?? 0];
        if (input) {
          input.value = val;
          handleSearch(key as string, val, dataType);
        }
      };

      setFilterPopupContent(() => {
        switch (dataType) {
          case "string":
          case "number":
            return (
              <Row>
                <Column size={12}>
                  <Select
                    value={
                      filterOption.find(
                        (x) => x.value === filterPopupOption?.option?.value && filterPopupOption.key === c.key,
                      ) ?? filterOption[0]
                    }
                    options={filterOption}
                    onChange={(option) => {
                      setFilterPopupOption({ key: c.key as string, option: option });
                    }}
                    placeholder={t("Table.Filters.Where.Input.Placeholder")}
                  />
                </Column>
                <Column size={12}>
                  <Input
                    value={value ?? ""}
                    onChange={(event) => handleChange(event.target.value)}
                    placeholder={t("Table.Filters.Search.Input.Placeholder")}
                  />
                </Column>
              </Row>
            );
          case "object":
          case "boolean":
            return (
              <Row>
                <Column size={12}>
                  <Input
                    value={filterPopupOptionSearchText ?? ""}
                    onChange={(event) => setFilterPopupOptionSearchText(event.target.value)}
                    placeholder={t("Table.Filters.Search.Input.Placeholder")}
                  />
                </Column>
                <Column size={12}>
                  {c.filters
                    ?.filter((filter) =>
                      filter.text.toLocaleLowerCase().includes(filterPopupOptionSearchText?.toLocaleLowerCase() ?? ""),
                    )
                    ?.map((filter, fIndex) => {
                      const name = typeof c.key !== "object" ? String(c.key) : String(c.key.field);
                      return (
                        <div key={`filter-check-${fIndex}`}>
                          <Checkbox
                            ref={(element) => {
                              if (element) _filterCheckboxItems.current[fIndex] = element;
                            }}
                            variant="filled"
                            color="green"
                            label={filter.text}
                            name={name}
                            value={filter.value as string}
                            checked={
                              Array.isArray(checkboxSelectedParams?.[name]) &&
                              (checkboxSelectedParams?.[name] as FilterValue[])?.some(
                                (f) => String(f.value) === String(filter.value),
                              )
                            }
                            onChange={async (event) => await handleCheckboxChange(event)}
                          />
                        </div>
                      );
                    })}
                </Column>
              </Row>
            );
          default:
            return <></>;
        }
      });
    };

    const deepSearch = (item: T, searchParams: SearchedParam | undefined): boolean => {
      if (!searchParams || Object.keys(searchParams).length === 0) return true;

      const applyOperator = (value: any, filter: FilterValue): boolean => {
        if (Array.isArray(value)) {
          return value.some((arrItem) => applyOperator(arrItem, filter));
        }
        if (typeof value === "object" && value !== null) {
          return Object.values(value).some((v) => applyOperator(v, filter));
        }

        const text = String(value ?? "").toLocaleLowerCase();
        const searchText = String(filter.value ?? "").toLocaleLowerCase();

        switch (filter.operator) {
          case FilterOperator.Contains:
            return text.includes(searchText);
          case FilterOperator.DoesNotContains:
            return !text.includes(searchText);
          case FilterOperator.Equals:
            return text === searchText;
          case FilterOperator.DoesNotEquals:
            return text !== searchText;
          case FilterOperator.BeginsWith:
            return text.startsWith(searchText);
          case FilterOperator.EndsWith:
            return text.endsWith(searchText);
          case FilterOperator.Blank:
            return text.trim() === "";
          case FilterOperator.NotBlank:
            return text.trim() !== "";
          default:
            return false;
        }
      };

      return Object.entries(searchParams).every(([key, param]) => {
        const _itemValue = item[key as keyof typeof item];
        if (Array.isArray(param)) {
          if (param.length === 0) return true;
          return param.some((filter) => applyOperator(_itemValue, filter));
        } else {
          return applyOperator(_itemValue, param);
        }
      });
    };

    const openAllSubrowsRecursively = (targetData: T[], parentKey: string = ""): Record<string, boolean> => {
      let result: Record<string, boolean> = {};
      targetData.forEach((item) => {
        const id = trackBy?.(item);
        const key = parentKey ? `${parentKey}.${id}` : `${id}`;
        const subitems = item[_subrowSelector as keyof typeof item];

        if (subitems && Array.isArray(subitems) && subitems.length > 0) {
          const nested = openAllSubrowsRecursively(subitems as T[], key);
          result[key] = true;
          result = { ...result, ...nested };
        }
      });
      return result;
    };

    const getData = useMemo(() => {
      let _data: T[] = [...data];
      if (_subrowOpenAutomatically) setShowSubitems(openAllSubrowsRecursively(data));

      if (searchedText && Object.keys(searchedText).length > 0) {
        _data = _data.filter((item) => deepSearch(item, searchedText));
        setTotalRecords(_data.length);
      } else {
        setTotalRecords(data.length);
      }

      if (sortConfig.length > 0 && !config.isServerSide) {
        _data.sort((a, b) => {
          for (const sCfg of sortConfig) {
            const aValue = a[sCfg.key];
            const bValue = b[sCfg.key];
            if (aValue < bValue) return sCfg.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sCfg.direction === "asc" ? 1 : -1;
          }
          return 0;
        });
      }

      if (pagination && !config.isServerSide) {
        const indexOfLastRow = currentPage * selectedPerPage;
        const indexOfFirstRow = indexOfLastRow - selectedPerPage;
        _data = _data.slice(indexOfFirstRow, indexOfLastRow);
      }

      setTimeout(() => handleScroll(), 0);
      return _data;
    }, [data, searchedText, currentPage, selectedPerPage, sortConfig, config.isServerSide]);

    useEffect(() => {
      if (!previousSelections || previousSelections.length === 0) {
        _selectionItems.current = [];
        return;
      }
      const validSelections = data.filter((item) =>
        previousSelections.some((selected) => trackBy?.(selected) === trackBy?.(item)),
      );
      if (!Utils.DeepEqual(_selectionItems.current, validSelections)) {
        _selectionItems.current = validSelections;
      }
    }, [previousSelections, data, trackBy]);

    useEffect(() => {
      if (config?.isServerSide && sortedParams) {
        const sortRecord: Record<string, string> = {};
        sortConfig?.forEach((s) => {
          if (s.direction) sortRecord[String(s.key)] = s.direction;
        });
        const query = new URLSearchParams(sortRecord);
        sortedParams(sortConfig ?? [], query.toString());
      }
    }, [sortConfig]);

    useEffect(() => {
      if (config?.isServerSide && searchedParams) {
        const searchRecord: Record<string, string> = {};
        Object.entries(_searchedParams ?? {}).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            searchRecord[key] = value.map((v) => v.value).join(",");
          } else if (value && typeof value === "object") {
            searchRecord[key] = String(value.value);
          }
        });

        const query = new URLSearchParams(searchRecord);
        columns.forEach((column) => {
          const key = column.key as keyof typeof _searchedParams;
          const filterValue = _searchedParams?.[key];
          const filterArray = Array.isArray(filterValue) ? filterValue : filterValue ? [filterValue] : [];
          if ((column.filters?.length ?? 0) === filterArray.length) {
            query.delete(column.key as string);
          }
        });
        searchedParams(_searchedParams, query.toString(), filterPopupOption?.option?.value as FilterOperator);
      }
    }, [_searchedParams]);

    useEffect(() => {
      if (!checkboxSelectedParams) return;
      if (config.isServerSide) {
        if (_searchTimeOut.current) clearTimeout(_searchTimeOut.current);
        setSearchedParams((prev) => ({ ...prev, ...checkboxSelectedParams }));
      } else {
        setSearchedText((prev) => ({ ...prev, ...checkboxSelectedParams }));
      }
      setCurrentPage(1);
      if (pagination) pagination.onChange?.(1, selectedPerPage);
    }, [checkboxSelectedParams]);

    useEffect(() => {
      if (typeof selections !== "function") return;
      const payload = _selectionItems.current.map((item) => ({
        ...item,
        trackByValue: trackBy?.(item),
      }));
      if (!Utils.DeepEqual(payload, lastSentRef.current)) {
        lastSentRef.current = payload;
        selections(payload);
      }
    }, [selections, trackBy]);

    useEffect(() => {
      if (filterCurrentColumn && filterCurrentDataType) {
        handleFilterPopupContent(filterCurrentColumn, filterCurrentDataType, filterCurrentIndex);
      }
    }, [checkboxSelectedParams, filterPopupOption, filterPopupOptionSearchText]);

    useLayoutEffect(() => {
      if (!onDnD || !_tBody.current || data.length === 0) return;

      _tBody.current.childNodes.forEach((item) => {
        const _item = item as HTMLElement;
        _item.ondragstart = (event) => {
          const dragItem = event.currentTarget as HTMLElement;
          _dragItem.current = dragItem;
          dragItem.classList.add("drag-item");

          if (event.dataTransfer) {
            const shadowContainer = document.createElement("div");
            shadowContainer.style.position = "absolute";
            shadowContainer.style.top = "-9999px";
            shadowContainer.style.left = "-9999px";
            document.body.appendChild(shadowContainer);

            if (config.dnd?.renderItem) {
              const root = createRoot(shadowContainer);
              flushSync(() => {
                root.render(config.dnd?.renderItem);
              });
            } else {
              shadowContainer.innerHTML = `
                <div class="ar-dnd-shadow" style="background: white; padding: 10px; border: 1px solid #ccc;">
                  <i class="bi bi-gear-wide-connected"></i>
                  <span>Dragging...</span>
                </div>
              `;
            }
            event.dataTransfer.setDragImage(shadowContainer, 20, 20);
            setTimeout(() => {
              if (document.body.contains(shadowContainer)) {
                document.body.removeChild(shadowContainer);
              }
            }, 0);
          }
        };

        _item.ondragover = (event) => {
          event.preventDefault();
          const overItem = event.currentTarget as HTMLElement;
          const rect = overItem.getBoundingClientRect();

          if (rect.top < 250) window.scrollBy(0, -20);
          if (rect.bottom > window.innerHeight - 150) window.scrollBy(0, 20);

          if (_dragItem.current !== overItem) {
            if (_tBody.current && _dragItem.current) {
              const dragItemIndex = [..._tBody.current.children].indexOf(_dragItem.current!);
              const dropItemIndex = [..._tBody.current.children].indexOf(overItem);

              if (dragItemIndex === -1 || dropItemIndex === -1) return;

              _tBody.current.insertBefore(
                _dragItem.current,
                dragItemIndex < dropItemIndex ? overItem.nextSibling : overItem,
              );

              const movedItem = data.splice(dragItemIndex, 1)[0];
              if (movedItem) {
                data.splice(dropItemIndex, 0, movedItem);
                onDnD?.(data);
              }
            }
          }
        };

        _item.ondragend = (event) => {
          const dragEndItem = event.currentTarget as HTMLElement;
          dragEndItem.classList.remove("drag-item");
          dragEndItem.classList.add("end-item");
          setTimeout(() => {
            dragEndItem.classList.remove("end-item");
            if (dragEndItem.classList.length === 0) dragEndItem.removeAttribute("class");
          }, 1000);
        };
      });

      _tBody.current.ondragover = (event) => event.preventDefault();

      return () => {
        if (!_tBody.current) return;
        _tBody.current.childNodes.forEach((item) => {
          const cleanupItem = item as HTMLElement;
          cleanupItem.ondragstart = null;
          cleanupItem.ondragover = null;
          cleanupItem.ondragend = null;
        });
        _tBody.current.ondragover = null;
      };
    }, [data, onDnD]);

    useLayoutEffect(() => {
      if (!pagination?.currentPage) return;
      setTimeout(() => handleScroll(), 0);
      setCurrentPage(pagination?.currentPage ?? 1);
    }, [pagination?.currentPage]);

    useLayoutEffect(() => {
      setCurrentPage(1);
      setTimeout(() => handleScroll(), 0);
    }, [selectedPerPage]);

    useEffect(() => {
      if (typeof selections !== "function" && config.validation) {
        const updatedData = data.map((item) => {
          if (!("trackByValue" in item) && trackBy) {
            return { ...item, trackByValue: trackBy(item) };
          }
          return item;
        });
        config.validation?.getChangeData?.(updatedData);
      }
      handleScroll();
    }, [createTrigger]);

    useEffect(() => {
      setIsMobile(window.innerWidth <= 768);
      window.addEventListener("resize", handleResize);

      if (typeof selections !== "function" && config.validation) {
        config.validation.getChangeData?.(data.map((d) => ({ ...d, trackByValue: trackBy?.(d) })) ?? []);
      }

      return () => {
        window.removeEventListener("resize", handleResize);
        if (_searchTimeOut.current) clearTimeout(_searchTimeOut.current);
      };
    }, []);

    const filterOption: Option[] = [
      { value: FilterOperator.Contains, text: t("Table.Filters.Where.Input.Item.1.Text") },
      { value: FilterOperator.DoesNotContains, text: t("Table.Filters.Where.Input.Item.2.Text") },
      { value: FilterOperator.Equals, text: t("Table.Filters.Where.Input.Item.3.Text") },
      { value: FilterOperator.DoesNotEquals, text: t("Table.Filters.Where.Input.Item.4.Text") },
      { value: FilterOperator.BeginsWith, text: t("Table.Filters.Where.Input.Item.5.Text") },
      { value: FilterOperator.EndsWith, text: t("Table.Filters.Where.Input.Item.6.Text") },
      { value: FilterOperator.Blank, text: t("Table.Filters.Where.Input.Item.7.Text") },
      { value: FilterOperator.NotBlank, text: t("Table.Filters.Where.Input.Item.8.Text") },
    ];

    return (
      <div ref={_tableWrapper} className={_tableClassName.map((c) => c).join(" ")}>
        {(title || description || actions || React.Children.count(children) > 0) && (
          <Header
            states={{ createTrigger: { get: createTrigger, set: setCreateTrigger } }}
            title={title}
            description={description}
            actions={actions}
          />
        )}

        <div ref={_tableContent} className="content" onScroll={handleScroll}>
          <table ref={_innerRef}>
            <thead>
              <tr key="selection">
                {selections && (
                  <th className="selection-col sticky sticky-left" data-sticky-position="left" style={{ bottom: 0 }}>
                    <Checkbox
                      variant="filled"
                      color="green"
                      checked={selectAll}
                      onChange={(event) => {
                        if (_checkboxItems.current.length > 0) {
                          setSelectAll(event.target.checked);
                          _checkboxItems.current.forEach((item) => {
                            if (item && item.checked !== event.target.checked) item.click();
                          });
                        }
                      }}
                    />
                  </th>
                )}

                {data.some((item) => _subrowSelector in item) && _subrowButton && (
                  <th className="subrow-col sticky sticky-left" data-sticky-position="left" style={{ bottom: 0 }}></th>
                )}

                <THeadCell
                  refs={{ propertiesButton: _propertiesButton }}
                  states={{
                    open: { get: openProperties, set: setOpenProperties },
                    sort: { get: sortConfig, set: setSortConfig },
                    sortCurrentColumn: { set: setSortCurrentColumn },
                    propertiesButtonCoordinate: { set: setPropertiesButtonCoordinate },
                  }}
                  methods={{ handleScroll }}
                  columns={columns}
                  config={config}
                />
              </tr>

              {config?.isSearchable && (
                <tr key="isSearchable">
                  {selections && <th className="selection-col sticky-left" data-sticky-position="left"></th>}

                  {data.some((item) => _subrowSelector in item) && _subrowButton && (
                    <th className="subrow-col sticky sticky-left" data-sticky-position="left"></th>
                  )}

                  {columns.map((c, cIndex) => {
                    let _className: string[] = [];
                    const key = typeof c.key !== "object" ? String(c.key) : String(c.key.field);
                    const csrValue = Array.isArray(searchedText?.[key])
                      ? ""
                      : ((searchedText?.[key] as FilterValue)?.value as string);
                    const ssrValue = Array.isArray(_searchedParams?.[key])
                      ? ""
                      : ((_searchedParams?.[key] as FilterValue)?.value as string);

                    if (c.config?.sticky) _className.push(`sticky-${c.config.sticky}`);
                    if (c.config?.alignContent) _className.push(`align-content-${c.config.alignContent}`);

                    return (
                      <th
                        key={`column-search-${cIndex}`}
                        {...(_className.length > 0 && { className: `${_className.join(" ")}` })}
                        {...(c.config?.sticky && { "data-sticky-position": c.config.sticky })}
                      >
                        {c.key && (
                          <div className="filter-field">
                            {c.filterDataType === "date" ? (
                              <DatePicker
                                value={(config.isServerSide ? ssrValue : csrValue) ?? ""}
                                name={key}
                                onClick={() => handleScroll()}
                                onChange={(value) => handleSearch(key, value, c.filterDataType)}
                                style={{ height: "2rem" }}
                                config={{ isClock: true, isFooterButton: true, locale: config.locale }}
                                disabled={!c.key || !!c.filters}
                              />
                            ) : (
                              <>
                                <Input
                                  ref={(element) => {
                                    if (element) _searchTextInputs.current[cIndex] = element;
                                  }}
                                  variant={c.key && !c.filters ? "outlined" : "filled"}
                                  style={{ height: "2rem" }}
                                  value={(config.isServerSide ? ssrValue : csrValue) ?? ""}
                                  name={key}
                                  onClick={() => handleScroll()}
                                  onInput={(event) => handleSearch(event.currentTarget.name, event.currentTarget.value)}
                                  disabled={!c.key || !!c.filters}
                                />

                                <span
                                  ref={(element) => {
                                    if (element) _filterButton.current[cIndex] = element;
                                  }}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setFilterPopupOptionSearchText("");

                                    const rect = event.currentTarget.getBoundingClientRect();
                                    const screenCenterX = window.innerWidth / 2;
                                    const coordinateX = rect.x > screenCenterX ? rect.x + rect.width - 225 : rect.x;
                                    const coordinateY = rect.y + rect.height;
                                    const getDataFirstItem = { ...data[0] };
                                    const searchKey = typeof c.key !== "object" ? String(c.key) : String(c.key.field);

                                    const getValueByKey = getDataFirstItem[searchKey as keyof typeof getDataFirstItem];
                                    let dataType = typeof getValueByKey;
                                    if (getValueByKey == null) dataType = "string";

                                    setFilterButtonCoordinate({ x: coordinateX, y: coordinateY });
                                    setFilterCurrentColumn(c);
                                    setFilterCurrentDataType(c.filterDataType ?? (dataType as FilterDataType));
                                    setFilterCurrentIndex(cIndex);
                                    setOpenFilter(true);

                                    handleFilterPopupContent(
                                      c,
                                      c.filterDataType ?? (dataType as FilterDataType),
                                      cIndex,
                                    );
                                    handleScroll();
                                  }}
                                >
                                  <Button
                                    variant="borderless"
                                    icon={{
                                      element: <ARIcon size={24} icon="Filter" fill="var(--dark)" strokeWidth={0} />,
                                    }}
                                  />
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              )}
            </thead>

            <tbody ref={_tBody}>
              <TBody
                data={getData}
                columns={columns}
                refs={{ _checkboxItems: _checkboxItems, _selectionItems: _selectionItems }}
                states={{
                  setSelectAll: { get: selectAll, set: setSelectAll },
                  showSubitems: { get: showSubitems, set: setShowSubitems },
                }}
                methods={{
                  trackBy: trackBy,
                  selections: selections,
                  selectionDisabled: selectionDisabled,
                  onDnD: onDnD,
                  onEditable: onEditable,
                  rowBackgroundColor: rowBackgroundColor,
                }}
                config={config}
              />
            </tbody>
          </table>
        </div>

        <FilterPopup
          refs={{ tableContent: _tableContent, buttons: _filterButton }}
          states={{ open: { get: openFilter, set: setOpenFilter } }}
          coordinate={filterButtonCoordinate}
        >
          {filterPopupContent}
        </FilterPopup>

        {config.isProperties && (
          <PropertiesPopup
            refs={{ tableContent: _tableContent, buttons: _propertiesButton }}
            states={{
              open: { get: openProperties, set: setOpenProperties },
              sort: { get: sortConfig, set: setSortConfig, currentColumn: sortCurrentColumn },
            }}
            methods={{ handleScroll }}
            coordinate={propertiesButtonCoordinate}
            config={config}
          />
        )}

        <div className="footer">
          <span>
            {isMobile ? (
              <strong>
                {(currentPage - 1) * selectedPerPage + 1} -{" "}
                {Math.min(currentPage * selectedPerPage, pagination?.totalRecords || getData.length)} of{" "}
                {pagination?.totalRecords || getData.length}
              </strong>
            ) : (
              t(
                "Table.Pagination.Information.Text",
                (currentPage - 1) * selectedPerPage + 1,
                Math.min(currentPage * selectedPerPage, pagination?.totalRecords || getData.length),
                pagination?.totalRecords || getData.length,
              )
            )}
          </span>

          {pagination && (
            <Pagination
              totalRecords={config.isServerSide ? pagination.totalRecords : (totalRecords ?? 0)}
              currentPage={currentPage}
              perPage={selectedPerPage}
              onChange={(currentPage, perPage) => {
                setCurrentPage(currentPage);
                setSelectedPerPage(perPage);
                pagination.onChange?.(currentPage, perPage);

                setTimeout(() => handleScroll(), 0);
              }}
            />
          )}
        </div>
      </div>
    );
  },
);

// export default memo(Table, <T extends object>(prevProps: IProps<T>, nextProps: IProps<T>) => {
//   const data = Utils.DeepEqual(prevProps.data, nextProps.data);
//   const columns = Utils.DeepEqual(prevProps.columns, nextProps.columns);
//   const actions = Utils.DeepEqual(prevProps.actions, nextProps.actions);
//   const previousSelections = Utils.DeepEqual(prevProps.previousSelections, nextProps.previousSelections);
//   const pagination = Utils.DeepEqual(prevProps.pagination, nextProps.pagination);

//   return data && columns && actions && previousSelections && pagination;
// }) as <T extends object>(props: IProps<T> & { ref?: React.Ref<HTMLTableElement> }) => React.JSX.Element;

export default memo(Table) as <T extends object>(
  props: IProps<T> & { ref?: React.Ref<HTMLTableElement> },
) => React.JSX.Element;
