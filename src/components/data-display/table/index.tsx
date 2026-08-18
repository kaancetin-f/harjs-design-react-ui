"use client";

import "../../../assets/css/components/data-display/table/styles.css";
import Button from "../../form/button";
import Checkbox from "../../form/checkbox";
import IProps, { FilterValue, SearchedParam, Sort } from "./IProps";
import Pagination from "../../navigation/pagination";
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useId,
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
import { DATE } from "../../../libs/infrastructure/shared";
import FilterPopup from "./FilterPopup";
import { FilterOperator } from "../../../libs/infrastructure/shared/Enums";
import Select from "../../form/select";
import THeadCell from "./THeadCell";
import PropertiesPopup from "./PropertiesPopup";
import {
  ExtractKey,
  BuildColumnGroups,
  GetColumnStorageKey,
  LoadColumnVisibility,
  SaveColumnVisibility,
  GetColumnOrderStorageKey,
  LoadColumnOrder,
  SaveColumnOrder,
  GetColumnPdfStorageKey,
  LoadColumnPdf,
  SaveColumnPdf,
  COLUMNS_POPUP_WIDTH,
  OpenAllSubrows,
  PlaceTablePopup,
  FILTER_POPUP_WIDTH,
} from "./Helpers";
import Header from "./header/Header";
import GroupRow from "./header/GroupRow";
import TBody from "./body/TBody";
import { Icon } from "../../icons";
import useStickyColumns from "./state/useStickyColumns";
import useTableQuery from "./state/useTableQuery";
import useTableDnd from "./dnd/useTableDnd";
import { useTranslation } from "@harjs/translation";
import TableTR from "../../../libs/core/application/locales/table/tr";
import TableEN from "../../../libs/core/application/locales/table/en";
import ITableLocale from "../../../libs/core/application/locales/table/ITableLocale";
import ColumnsPopup from "./ColumnsPopup";
import Tooltip from "../../feedback/tooltip";
import { DateRangeValue } from "../../form/date-picker/Props";
import DatePicker from "../../form/date-picker";
import GridSystem from "../../layout/grid-system";

const { Flex } = GridSystem;

const Table = forwardRef(
  <T extends object>(
    {
      children,
      trackBy,
      title,
      description,
      extra,
      data,
      columns,
      actions,
      rowBackgroundColor,
      selections,
      selectionDisabled,
      previousSelections,
      sortedParams,
      searchedParams,
      onPdfColumnsChange,
      onEditable,
      onDnD,
      pagination,
      config = { isSearchable: false },
    }: IProps<T>,
    ref: React.ForwardedRef<HTMLTableElementWithCustomAttributes>,
  ) => {
    // refs
    const _innerRef = useRef<HTMLTableElementWithCustomAttributes>(null);
    const _tableWrapper = useRef<HTMLDivElement>(null);
    const _tableContent = useRef<HTMLDivElement>(null);
    const _tBody = useRef<HTMLTableSectionElement>(null);
    const _columnsButton = useRef<HTMLSpanElement | null>(null);
    const _checkboxItems = useRef<(HTMLInputElement | null)[]>([]);
    const _filterCheckboxItems = useRef<(HTMLInputElement | null)[]>([]);
    const _searchTextInputs = useRef<(HTMLInputElement | null)[]>([]);
    const _searchTimeOut = useRef<NodeJS.Timeout | null>(null);
    const _propertiesButton = useRef<(HTMLSpanElement | null)[]>([]);
    const _filterButton = useRef<(HTMLSpanElement | null)[]>([]);
    const _selectionItems = useRef<T[]>([]);
    const _lastSentRef = useRef<T[]>([]);
    const _selectionsRef = useRef(selections);
    _selectionsRef.current = selections;

    const _subrowOpenAutomatically: boolean = config.subrow?.openAutomatically ?? false;
    const _subrowSelector: string = config.subrow?.selector ?? "subitems";
    const _subrowButton: boolean = config.subrow?.button ?? false;

    const _tableClassName: string[] = ["har-table", "scroll"];

    // states
    const [columnNumber, setColumnNumber] = useState<number>(0);
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
    const [filterPopupContent, setFilterPopupContent] = useState<React.ReactNode | null>(null);
    const [filterPopupOption, setFilterPopupOption] = useState<{ key: string; option: Option | undefined } | null>(
      null,
    );
    const [filterPopupOptionSearchText, setFilterPopupOptionSearchText] = useState<string | null>(null);
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [filterCurrentColumn, setFilterCurrentColumn] = useState<TableColumnProps<T> | null>(null);
    const [filterCurrentDataType, setFilterCurrentDataType] = useState<FilterDataType | null>(null);
    const [filterCurrentIndex, setFilterCurrentIndex] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedPerPage, setSelectedPerPage] = useState<number>(pagination?.perPage ?? 10);
    // states -> Columns
    const [openColumnsPopup, setOpenColumnsPopup] = useState<boolean>(false);
    const [columnsButtonCoordinate, setColumnsButtonCoordinate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [columnsVisibility, setColumnsVisibilityState] = useState<Record<string, boolean>>({});
    // states -> Columns sırası (sürükle-bırak ile değiştirilebilir kolon dizilimi)
    const [columnsOrder, setColumnsOrderState] = useState<string[]>([]);
    // states -> PDF çıktısına dahil edilecek kolonlar
    const [columnsPdf, setColumnsPdfState] = useState<Record<string, boolean>>({});
    const [pdfHydrated, setPdfHydrated] = useState(false);
    const prevPdfSignatureRef = useRef<string | null>(null);

    // hooks
    const { t } = useTranslation<ITableLocale>(String(config.locale ?? "tr"), {
      tr: { ...TableTR },
      en: { ...TableEN },
    });
    const titleId = useId();

    const columnsStorageKey = useMemo(
      () => GetColumnStorageKey(config.columnManagement?.storageKey, title),
      [config.columnManagement?.storageKey, title],
    );

    const columnsOrderStorageKey = useMemo(
      () => GetColumnOrderStorageKey(config.columnManagement?.storageKey, title),
      [config.columnManagement?.storageKey, title],
    );

    const columnsPdfStorageKey = useMemo(
      () => GetColumnPdfStorageKey(config.columnManagement?.storageKey, title),
      [config.columnManagement?.storageKey, title],
    );

    // Sürükle-bırak ile belirlenen sıraya göre kolonları yeniden diz.
    // Sırası olmayan (yeni eklenmiş) kolonlar mevcut konumlarını koruyarak sona eklenir.
    const orderedColumns = useMemo(() => {
      if (columnsOrder.length === 0) return columns;

      const remaining = new Map(columns.map((c, cIndex) => [String(ExtractKey(c.key) ?? c.title ?? cIndex), c]));
      const _ordered: TableColumnProps<T>[] = [];

      columnsOrder.forEach((key) => {
        const column = remaining.get(key);
        if (column) {
          _ordered.push(column);
          remaining.delete(key);
        }
      });

      remaining.forEach((column) => _ordered.push(column));

      return _ordered;
    }, [columns, columnsOrder]);

    const visibleColumns = useMemo(() => {
      return orderedColumns.map((c, cIndex) => {
        const key = String(ExtractKey(c.key) ?? c.title ?? cIndex);
        const stored = columnsVisibility[key];

        return stored === undefined ? c : { ...c, isShow: stored };
      });
    }, [orderedColumns, columnsVisibility]);

    const columnGroups = useMemo(() => BuildColumnGroups(visibleColumns), [visibleColumns]);
    const hasSubrowColumn = data.some((item) => _subrowSelector in item) && _subrowButton;

    const selectedPdfColumns = useMemo(() => {
      return orderedColumns.flatMap((c, cIndex) => {
        const key = String(ExtractKey(c.key) ?? c.title ?? cIndex);
        return (columnsPdf[key] ?? c.pdfExport ?? true) ? [key] : [];
      });
    }, [orderedColumns, columnsPdf]);

    const pdfColumnsSignature = useMemo(() => selectedPdfColumns.join("\0"), [selectedPdfColumns]);

    const resolvedActions = useMemo(() => {
      if (!actions?.export) return actions;

      return {
        ...actions,
        export: {
          ...actions.export,
          onClick: () => actions.export?.onClick({ pdfColumns: selectedPdfColumns }),
        },
      };
    }, [actions, selectedPdfColumns]);

    const { rows: tableRows, totalRecords } = useTableQuery({
      data,
      columns: visibleColumns,
      searchedText,
      sortConfig,
      isServerSide: config.isServerSide,
      pagination,
      currentPage,
      selectedPerPage,
    });

    const handleScroll = useStickyColumns(
      _tableContent,
      `${visibleColumns.length}:${tableRows.length}:${currentPage}:${selectedPerPage}:${columnGroups?.length ?? 0}`,
    );

    useTableDnd({
      enabled: typeof onDnD === "function",
      tBodyRef: _tBody,
      data,
      onDnD,
      renderItem: config.dnd?.renderItem,
    });

    // methods
    const handleSearch = useCallback(
      (name: string, value: string | DateRangeValue, dataType?: FilterDataType) => {
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
            dataType === "date" ||
              dataType === "datetime-local" ||
              dataType === "date-multiple" ||
              dataType === "datetime-local-multiple"
              ? 0
              : 750,
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
        let render: React.ReactNode = null;

        switch (dataType) {
          case "string":
          case "number":
            render = (
              <Flex flexDirection="column" gap="var(--space-8)">
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

                <Input
                  value={value ?? ""}
                  onChange={(event) => handleChange(event.target.value)}
                  placeholder={t("Table.Filters.Search.Input.Placeholder")}
                />
              </Flex>
            );
            break;
          case "date-multiple":
          case "datetime-local-multiple": {
            const key = String(c.key);
            const filterDataType = c.filterDataType as FilterDataType;
            const isClock = ["datetime-local", "datetime-local-multiple"].includes(filterDataType);

            const filterState = config.isServerSide ? _searchedParams?.[key] : searchedText?.[key];
            const filterValue = Array.isArray(filterState) ? "" : (filterState as FilterValue)?.value;

            render = (
              <DatePicker
                variant="filled"
                color="white"
                value={filterValue as unknown as DateRangeValue}
                onChange={(value) => handleSearch(key, value, c.filterDataType)}
                direction="row"
                multiple
                config={{
                  locale: config.locale,
                  isClock: isClock,
                  isFooterButton: true,
                  step: { minutes: c.config?.step?.minutes },
                }}
              />
            );
            break;
          }
          case "object":
          case "boolean": {
            const name = typeof c.key !== "object" ? String(c.key) : String(c.key.field);
            const selectedFilters = Array.isArray(checkboxSelectedParams?.[name])
              ? (checkboxSelectedParams?.[name] as FilterValue[])
              : [];
            const allSelected = (c.filters?.length ?? 0) > 0 && selectedFilters.length === (c.filters?.length ?? 0);

            render = (
              <Flex key="filter-check" flexDirection="column" gap="var(--space-8)">
                <Input
                  value={filterPopupOptionSearchText ?? ""}
                  onChange={(event) => setFilterPopupOptionSearchText(event.target.value)}
                  placeholder={t("Table.Filters.Search.Input.Placeholder")}
                />

                {dataType === "boolean" && (
                  <Button
                    variant="surface"
                    color={allSelected ? "red" : "blue"}
                    size="xs"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      setCheckboxSelectedParams((prev) => ({
                        ...prev,
                        [name]: allSelected
                          ? []
                          : (c.filters ?? []).map((filter) => ({
                              value: filter.value as string,
                              operator: FilterOperator.Equals,
                            })),
                      }));
                    }}
                  >
                    {allSelected ? t("Table.Filters.Clear.Text") : t("Table.Filters.SelectAll.Text")}
                  </Button>
                )}

                <div className="checkboxes-field">
                  <Flex flexDirection="column" gap="var(--space-8)">
                    {c.filters
                      ?.filter((filter) =>
                        filter.text
                          .toLocaleLowerCase()
                          .includes(filterPopupOptionSearchText?.toLocaleLowerCase() ?? ""),
                      )
                      ?.map((filter, fIndex) => {
                        return (
                          <Checkbox
                            key={`filter-check-${fIndex}`}
                            ref={(element) => {
                              if (element) _filterCheckboxItems.current[fIndex] = element;
                            }}
                            variant="filled"
                            color="blue"
                            size="xs"
                            label={filter.text}
                            name={name}
                            value={filter.value as string}
                            checked={selectedFilters.some((f) => String(f.value) === String(filter.value))}
                            onChange={async (event) => await handleCheckboxChange(event)}
                          />
                        );
                      })}
                  </Flex>
                </div>
              </Flex>
            );
            break;
          }
          default:
            break;
        }

        return <div className="content">{render}</div>;
      });
    };

    const handleColumnVisibilityChange = useCallback(
      (key: string, value: boolean) => {
        setColumnsVisibilityState((prev) => {
          const updated = { ...prev, [key]: value };
          SaveColumnVisibility(columnsStorageKey, updated);
          return updated;
        });
      },
      [columnsStorageKey],
    );

    const handleColumnOrderChange = useCallback(
      (order: string[]) => {
        setColumnsOrderState(order);
        SaveColumnOrder(columnsOrderStorageKey, order);
      },
      [columnsOrderStorageKey],
    );

    const handleColumnPdfChange = useCallback(
      (key: string, value: boolean) => {
        setColumnsPdfState((prev) => {
          const updated = { ...prev, [key]: value };
          SaveColumnPdf(columnsPdfStorageKey, updated);
          return updated;
        });
      },
      [columnsPdfStorageKey],
    );

    const handleColumnPdfChangeAll = useCallback(
      (value: boolean) => {
        setColumnsPdfState((prev) => {
          const updated = { ...prev };

          orderedColumns.forEach((c, cIndex) => {
            const key = String(ExtractKey(c.key) ?? c.title ?? cIndex);
            updated[key] = value;
          });

          // En az bir PDF kolonu seçili kalsın.
          if (!value) {
            const firstKey = String(ExtractKey(orderedColumns[0]?.key) ?? orderedColumns[0]?.title ?? 0);
            updated[firstKey] = true;
          }

          SaveColumnPdf(columnsPdfStorageKey, updated);
          return updated;
        });
      },
      [columnsPdfStorageKey, orderedColumns],
    );

    // useEffects
    useLayoutEffect(() => {
      const content = _tableContent.current;
      const maxHeight = config.scroll?.maxHeight;
      if (!content || maxHeight == null) return;

      content.style.maxHeight = `${maxHeight}rem`;
    }, [config.scroll?.maxHeight]);

    useEffect(() => {
      if (!_subrowOpenAutomatically) return;
      setShowSubitems(OpenAllSubrows(data, { trackBy, selector: _subrowSelector }));
    }, [data, _subrowOpenAutomatically, _subrowSelector, trackBy]);

    useLayoutEffect(() => {
      if (visibleColumns.length === 0 && config.subrow?.render) return;

      const _tableW = _tableWrapper.current;

      if (!_tableW) return;

      const { right } = _tableW?.getBoundingClientRect();
      const _th = _tableW.querySelectorAll("thead > tr > th");
      let i: number = 0;

      _th?.forEach((th) => {
        const thRect = th.getBoundingClientRect();

        if (thRect.left < right) i++;
      });

      setColumnNumber(i - 1);
      handleScroll();
    }, [visibleColumns, handleScroll]);

    useEffect(() => {
      setColumnsVisibilityState(LoadColumnVisibility(columnsStorageKey));
    }, [columnsStorageKey]);

    useEffect(() => {
      setColumnsOrderState(LoadColumnOrder(columnsOrderStorageKey));
    }, [columnsOrderStorageKey]);

    useEffect(() => {
      prevPdfSignatureRef.current = null;
      setColumnsPdfState(LoadColumnPdf(columnsPdfStorageKey));
      setPdfHydrated(true);
    }, [columnsPdfStorageKey]);

    // İçerik (signature) değişmeden callback tetiklenmez → loop yok.
    // Hydrate sonrası ilk değer de parent'a basılır.
    useEffect(() => {
      if (!pdfHydrated || orderedColumns.length === 0) return;
      if (prevPdfSignatureRef.current === pdfColumnsSignature) return;

      prevPdfSignatureRef.current = pdfColumnsSignature;
      onPdfColumnsChange?.(selectedPdfColumns);
    }, [pdfHydrated, pdfColumnsSignature, selectedPdfColumns, orderedColumns.length, onPdfColumnsChange]);

    useEffect(() => {
      if (previousSelections == null) return;
      if (previousSelections.length === 0) {
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
            searchRecord[key] = Object.entries(value.value)
              .map(([_, value]) => {
                return `${value}`;
              })
              .join("|");
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
      const notify = _selectionsRef.current;
      if (typeof notify !== "function") return;
      const payload = _selectionItems.current.map((item) => ({
        ...item,
        trackByValue: trackBy?.(item),
      }));
      if (!Utils.DeepEqual(payload, _lastSentRef.current)) {
        _lastSentRef.current = payload;
        notify(payload);
      }
    }, [trackBy, data, previousSelections]);

    useEffect(() => {
      if (filterCurrentColumn && filterCurrentDataType) {
        handleFilterPopupContent(filterCurrentColumn, filterCurrentDataType, filterCurrentIndex);
      }
    }, [checkboxSelectedParams, filterPopupOption, filterPopupOptionSearchText, searchedText, _searchedParams]);

    useLayoutEffect(() => {
      if (!pagination?.currentPage) return;
      setCurrentPage(pagination?.currentPage ?? 1);
    }, [pagination?.currentPage]);

    useLayoutEffect(() => {
      setCurrentPage(1);
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
      if (typeof selections !== "function" && config.validation) {
        config.validation.getChangeData?.(data.map((d) => ({ ...d, trackByValue: trackBy?.(d) })) ?? []);
      }

      return () => {
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

    const hasActiveFilters = useMemo(() => {
      const params = config.isServerSide ? _searchedParams : searchedText;
      if (!params) return false;

      return Object.values(params).some((param) => {
        if (Array.isArray(param)) return param.length > 0;
        if (!param || typeof param !== "object" || !("value" in param)) return false;

        const value = param.value;
        if (value === "" || value == null) return false;
        if (typeof value === "object" && "start" in value && "end" in value) {
          return Boolean(value.start || value.end);
        }
        return true;
      });
    }, [config.isServerSide, _searchedParams, searchedText]);

    const handleClearFilters = useCallback(() => {
      setSearchedText(null);
      setSearchedParams(null);
      setCheckboxSelectedParams(null);
      setFilterPopupOption(null);
      setFilterPopupOptionSearchText(null);
      setOpenFilter(false);
      _searchTextInputs.current.forEach((input) => {
        if (input) input.value = "";
      });
      setCurrentPage(1);
      pagination?.onChange?.(1, selectedPerPage);
    }, [pagination, selectedPerPage]);

    useImperativeHandle(
      ref,
      () => {
        const node = _innerRef.current as HTMLTableElementWithCustomAttributes | null;
        if (node) node.filterCleaner = handleClearFilters;
        return node as HTMLTableElementWithCustomAttributes;
      },
      [handleClearFilters],
    );

    const isActionLabeled = (actions?.appearance ?? "labeled") === "labeled";

    return (
      <div
        ref={_tableWrapper}
        className={_tableClassName.map((c) => c).join(" ")}
        aria-labelledby={title ? titleId : undefined}
      >
        {(title || description || extra || actions || React.Children.count(children) > 0) && (
          <Header
            states={{ createTrigger: { get: createTrigger, set: setCreateTrigger } }}
            title={title}
            titleId={titleId}
            description={description}
            extra={
              extra || React.Children.count(children) > 0 ? (
                <>
                  {extra}
                  {children}
                </>
              ) : undefined
            }
            actions={resolvedActions}
            locale={config.locale}
            tools={
              (config.isSearchable && hasActiveFilters) || config.columnManagement?.enabled !== false ? (
                <Flex alignItems="center" gap="var(--space-8)">
                  {config.isSearchable && hasActiveFilters && (
                    <Tooltip text={t("Table.Header.Extra.ClearFilters.Button.Text")}>
                      <Button
                        variant="outlined"
                        color="red"
                        size="sm"
                        shape={isActionLabeled ? undefined : "square"}
                        icon={{
                          element: <Icon icon="Filter" size={16} />,
                        }}
                        aria-label={t("Table.Header.Extra.ClearFilters.Button.Text")}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleClearFilters();
                        }}
                      >
                        {isActionLabeled ? t("Table.Header.Extra.ClearFilters.Button.Text") : null}
                      </Button>
                    </Tooltip>
                  )}

                  {config.columnManagement?.enabled !== false && (
                    <span ref={_columnsButton}>
                      <Tooltip text={t("Table.Header.Extra.ColumnManager.Button.Text")}>
                        <Button
                          variant="outlined"
                          size="sm"
                          shape={isActionLabeled ? undefined : "square"}
                          icon={{
                            element: <Icon icon="Columns" size={16} />,
                          }}
                          aria-label={t("Table.Header.Extra.ColumnManager.Button.Text")}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            const rect = event.currentTarget.getBoundingClientRect();
                            setColumnsButtonCoordinate(PlaceTablePopup(rect, COLUMNS_POPUP_WIDTH));
                            setOpenColumnsPopup((prev) => !prev);
                          }}
                        >
                          {isActionLabeled ? t("Table.Columns.Title.Text") : null}
                        </Button>
                      </Tooltip>
                    </span>
                  )}
                </Flex>
              ) : undefined
            }
          />
        )}

        <div ref={_tableContent} className="content" onScroll={handleScroll}>
          <table ref={_innerRef}>
            <thead>
              {columnGroups && (
                <GroupRow groups={columnGroups} hasSelection={!!selections} hasSubrow={hasSubrowColumn} />
              )}

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

                {hasSubrowColumn && (
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
                  columns={visibleColumns}
                  config={config}
                />
              </tr>

              {config?.isSearchable && (
                <tr key="isSearchable">
                  {selections && <th className="selection-col sticky sticky-left" data-sticky-position="left"></th>}

                  {hasSubrowColumn && <th className="subrow-col sticky sticky-left" data-sticky-position="left"></th>}

                  {visibleColumns.map((c, cIndex) => {
                    if (c.isShow === false) return null;

                    const key = typeof c.key !== "object" ? String(c.key) : String(c.key?.field);
                    const filterDataType = c.filterDataType as FilterDataType;
                    const isDateSingle = ["date", "datetime-local"].includes(filterDataType);
                    const isDate = ["date-multiple", "datetime-local-multiple"].includes(filterDataType);

                    let _className: string[] = [];

                    const filterState = config.isServerSide ? _searchedParams?.[key] : searchedText?.[key];
                    const filterValue = Array.isArray(filterState) ? "" : (filterState as FilterValue)?.value;
                    const selectedBooleanFilters =
                      filterDataType === "boolean" && Array.isArray(filterState) ? (filterState as FilterValue[]) : [];
                    const isAllBooleanFiltersSelected =
                      selectedBooleanFilters.length > 0 && selectedBooleanFilters.length === (c.filters?.length ?? 0);
                    const hasActiveBooleanFilter = selectedBooleanFilters.length > 0;
                    const booleanFilterDisplay = isAllBooleanFiltersSelected
                      ? t("Table.Filters.All.Text")
                      : hasActiveBooleanFilter
                        ? selectedBooleanFilters
                            .map(
                              (f) =>
                                c.filters?.find((opt) => String(opt.value) === String(f.value))?.text ??
                                String(f.value),
                            )
                            .join(", ")
                        : "";
                    const isClockDateRange = filterDataType === "datetime-local-multiple";
                    const dateRangeValue =
                      isDate &&
                      filterValue &&
                      typeof filterValue === "object" &&
                      "start" in filterValue &&
                      "end" in filterValue
                        ? (filterValue as DateRangeValue)
                        : null;
                    const formatFilterDate = (value: string) => {
                      if (!value || !DATE.IsValid(value)) return "";
                      const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
                      if (!DATE.IsValid(date)) return "";
                      const lang = String(config.locale ?? "tr");
                      return isClockDateRange || filterDataType === "datetime-local"
                        ? DATE.VerboseWithTime(date, lang)
                        : DATE.DMY(date);
                    };
                    const dateFilterDisplay = dateRangeValue
                      ? [
                          formatFilterDate(String(dateRangeValue.start ?? "")),
                          formatFilterDate(String(dateRangeValue.end ?? "")),
                        ]
                          .filter(Boolean)
                          .join(" - ")
                      : "";
                    const inputDisplayValue = isDate
                      ? dateFilterDisplay
                      : booleanFilterDisplay || ((filterValue as string) ?? "");
                    const inputTitle =
                      (hasActiveBooleanFilter && booleanFilterDisplay) || dateFilterDisplay || undefined;

                    if (c.config?.sticky) _className.push(`sticky sticky-${c.config.sticky}`);
                    if (c.config?.alignContent) _className.push(`align-content-${c.config.alignContent}`);

                    return (
                      <th
                        key={`column-search-${cIndex}`}
                        {...(_className.length > 0 && { className: _className.join(" ") })}
                        {...(c.config?.sticky && { "data-sticky-position": c.config.sticky })}
                      >
                        {c.key ? (
                          <div className="filter-field">
                            <>
                              {isDateSingle ? (
                                <DatePicker
                                  color="white"
                                  variant="outlined"
                                  size="md"
                                  name={key}
                                  value={typeof filterValue === "string" ? filterValue : ""}
                                  onChange={(value) => handleSearch(key, value, filterDataType)}
                                  onClick={() => handleScroll()}
                                  config={{
                                    locale: config.locale,
                                    isClock: filterDataType === "datetime-local",
                                    isFooterButton: true,
                                    step: { minutes: c.config?.step?.minutes },
                                  }}
                                />
                              ) : (
                                <>
                                  <Input
                                    ref={(element) => {
                                      if (element) _searchTextInputs.current[cIndex] = element;
                                    }}
                                    color="white"
                                    variant={(c.filters && c.filters.length > 0) || isDate ? "outlined" : "filled"}
                                    size="md"
                                    value={inputDisplayValue}
                                    title={inputTitle}
                                    placeholder={
                                      inputDisplayValue
                                        ? undefined
                                        : filterDataType === "boolean"
                                          ? t("Table.Filters.Boolean.Placeholder")
                                          : isDate
                                            ? t("Table.Filters.DateRange.Placeholder")
                                            : undefined
                                    }
                                    name={key}
                                    onClick={() => handleScroll()}
                                    onInput={(event) =>
                                      handleSearch(event.currentTarget.name, event.currentTarget.value)
                                    }
                                    disabled={(c.filters && c.filters.length > 0) || isDate}
                                  />

                                  <span
                                    ref={(element) => {
                                      if (element) _filterButton.current[cIndex] = element;
                                    }}
                                    className={`filter-button${hasActiveBooleanFilter || !!dateFilterDisplay ? " has-active-filter" : ""}`}
                                    onClick={(event) => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      setFilterPopupOptionSearchText("");

                                      const rect = event.currentTarget.getBoundingClientRect();
                                      const getDataFirstItem = { ...data[0] };
                                      const searchKey = typeof c.key !== "object" ? String(c.key) : String(c.key.field);

                                      const getValueByKey =
                                        getDataFirstItem[searchKey as keyof typeof getDataFirstItem];
                                      let dataType = typeof getValueByKey;
                                      if (getValueByKey == null) dataType = "string";

                                      setFilterButtonCoordinate(PlaceTablePopup(rect, FILTER_POPUP_WIDTH));
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
                                      variant="filled"
                                      color="white"
                                      size="md"
                                      shape="square"
                                      icon={{
                                        element: ["date-multiple", "datetime-local-multiple"].includes(
                                          filterDataType,
                                        ) ? (
                                          <Icon icon="Calendar" size={16} />
                                        ) : (
                                          <Icon icon="TextAlingCenter" size={16} />
                                        ),
                                      }}
                                    />
                                  </span>
                                </>
                              )}
                            </>
                          </div>
                        ) : (
                          <div className="filter-field filter-field--filler" aria-hidden="true" />
                        )}
                      </th>
                    );
                  })}
                </tr>
              )}
            </thead>

            <tbody ref={_tBody}>
              <TBody
                data={tableRows}
                columns={visibleColumns}
                refs={{ _checkboxItems: _checkboxItems, _selectionItems: _selectionItems }}
                states={{
                  columnNumber: { get: columnNumber },
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
          label={t("Table.Filters.Popup.Label")}
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

        {config.columnManagement?.enabled !== false && (
          <ColumnsPopup
            refs={{ tableContent: _tableContent, button: _columnsButton }}
            states={{
              open: { get: openColumnsPopup, set: setOpenColumnsPopup },
              visibility: { get: columnsVisibility, set: handleColumnVisibilityChange },
              order: { get: columnsOrder, set: handleColumnOrderChange },
              pdf: { get: columnsPdf, set: handleColumnPdfChange, setAll: handleColumnPdfChangeAll },
            }}
            coordinate={columnsButtonCoordinate}
            columns={orderedColumns}
            config={config}
          />
        )}

        <div className="footer">
          <span>
            {t(
              "Table.Pagination.Information.Text",
              (currentPage - 1) * selectedPerPage + 1,
              Math.min(currentPage * selectedPerPage, totalRecords),
              totalRecords,
            )}
          </span>

          {pagination && (
            <Pagination
              totalRecords={totalRecords}
              currentPage={currentPage}
              perPage={selectedPerPage}
              locale={config.locale}
              showTotal={false}
              onChange={(nextPage, perPage) => {
                setCurrentPage(nextPage);
                setSelectedPerPage(perPage);
                pagination.onChange?.(nextPage, perPage);
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
