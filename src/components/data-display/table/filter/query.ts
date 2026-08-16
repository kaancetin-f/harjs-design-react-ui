import { FilterOperator } from "../../../../libs/infrastructure/shared/Enums";
import { TableColumnProps } from "../../../../libs/infrastructure/types";
import { DateRangeValue } from "../../../form/date-picker/Props";
import { ExtractKey, GetColumnValue } from "../Helpers";
import { FilterValue, SearchedParam, Sort } from "../IProps";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Date);

const isDateRangeValue = (value: unknown): value is DateRangeValue =>
  isRecord(value) && "start" in value && "end" in value;

const toTime = (value: unknown): number | null => {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;

  const date = value instanceof Date ? value : new Date(String(value));
  const time = date.getTime();

  return Number.isNaN(time) ? null : time;
};

const inDateRange = (value: unknown, range: DateRangeValue): boolean => {
  if (!range.start && !range.end) return true;

  const itemTime = toTime(value);
  if (itemTime == null) return false;

  const start = toTime(range.start);
  const end = toTime(range.end);

  if (start != null && itemTime < start) return false;
  if (end != null && itemTime > end) return false;

  return true;
};

const GetFilterValue = <T extends object>(
  item: T,
  paramKey: string,
  columns?: TableColumnProps<T>[],
): unknown => {
  const column = columns?.find((entry) => String(ExtractKey(entry.key)) === paramKey);
  if (column) return GetColumnValue(item, column.key);

  return item[paramKey as keyof T];
};

const ApplyOperator = (value: unknown, filter: FilterValue): boolean => {
  if (isDateRangeValue(filter.value)) {
    if (Array.isArray(value)) return value.some((entry) => inDateRange(entry, filter.value as DateRangeValue));
    return inDateRange(value, filter.value);
  }

  if (Array.isArray(value)) {
    return value.some((entry) => ApplyOperator(entry, filter));
  }

  if (isRecord(value)) {
    return Object.values(value).some((entry) => ApplyOperator(entry, filter));
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

const DeepSearch = <T extends object>(
  item: T,
  searchParams: SearchedParam | undefined,
  columns?: TableColumnProps<T>[],
): boolean => {
  if (!searchParams || Object.keys(searchParams).length === 0) return true;

  return Object.entries(searchParams).every(([key, param]) => {
    const itemValue = GetFilterValue(item, key, columns);

    if (Array.isArray(param)) {
      if (param.length === 0) return true;
      return param.some((filter) => ApplyOperator(itemValue, filter));
    }

    return ApplyOperator(itemValue, param);
  });
};

const CompareValues = (a: unknown, b: unknown, direction: "asc" | "desc"): number => {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (a < b) return direction === "asc" ? -1 : 1;
  if (a > b) return direction === "asc" ? 1 : -1;
  return 0;
};

const SortRows = <T extends object>(rows: T[], sortConfig: Sort<T>[], columns?: TableColumnProps<T>[]): T[] => {
  if (sortConfig.length === 0) return rows;

  return [...rows].sort((a, b) => {
    for (const config of sortConfig) {
      if (!config.direction) continue;

      const column = columns?.find((entry) => ExtractKey(entry.key) === config.key);
      const aValue = column ? GetColumnValue(a, column.key) : a[config.key];
      const bValue = column ? GetColumnValue(b, column.key) : b[config.key];
      const compared = CompareValues(aValue, bValue, config.direction);

      if (compared !== 0) return compared;
    }

    return 0;
  });
};

export { DeepSearch, SortRows };
