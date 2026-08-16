import { useMemo } from "react";
import { TableColumnProps } from "../../../../libs/infrastructure/types";
import { DeepSearch, SortRows } from "../filter/query";
import { SearchedParam, Sort } from "../IProps";

type PaginationConfig = {
  totalRecords: number;
  perPage: number;
  currentPage?: number;
};

type UseTableQueryOptions<T extends object> = {
  data: T[];
  columns: TableColumnProps<T>[];
  searchedText: SearchedParam | null;
  sortConfig: Sort<T>[];
  isServerSide?: boolean;
  pagination?: PaginationConfig;
  currentPage: number;
  selectedPerPage: number;
};

function useTableQuery<T extends object>({
  data,
  columns,
  searchedText,
  sortConfig,
  isServerSide,
  pagination,
  currentPage,
  selectedPerPage,
}: UseTableQueryOptions<T>) {
  const filtered = useMemo(() => {
    if (isServerSide || !searchedText || Object.keys(searchedText).length === 0) return data;
    return data.filter((item) => DeepSearch(item, searchedText, columns));
  }, [columns, data, isServerSide, searchedText]);

  const sorted = useMemo(() => {
    if (isServerSide || sortConfig.length === 0) return filtered;
    return SortRows(filtered, sortConfig, columns);
  }, [columns, filtered, isServerSide, sortConfig]);

  const totalRecords = isServerSide ? (pagination?.totalRecords ?? data.length) : sorted.length;

  const hasPagination = Boolean(pagination);

  const rows = useMemo(() => {
    if (!hasPagination || isServerSide) return sorted;

    const start = (currentPage - 1) * selectedPerPage;
    return sorted.slice(start, start + selectedPerPage);
  }, [currentPage, hasPagination, isServerSide, selectedPerPage, sorted]);

  return { rows, totalRecords };
}

export default useTableQuery;
