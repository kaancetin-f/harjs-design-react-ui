import React from "react";
import { Errors, MimeTypes, TableColumnProps } from "../../../libs/infrastructure/types";
import { IChildrenProps } from "../../../libs/infrastructure/types/IGlobalProps";
import { FilterOperator } from "../../../libs/infrastructure/shared/Enums";
import { DateRangeValue } from "../../form/date-picker/Props";

export type Operator =
  "Contains" | "DoesNotContains" | "Equals" | "DoesNotEquals" | "BeginsWith" | "EndsWith" | "Blank" | "NotBlank";

export type FilterValue = {
  value: string | number | boolean | DateRangeValue;
  operator: FilterOperator;
};

export type ActionAppearance = "icon" | "labeled";

export type Actions = {
  /** `"icon"` is compact with a locale tooltip. `"labeled"` shows `text` (or locale) on the button. */
  appearance?: ActionAppearance;
  import?: ImportActionType;
  export?: ExportActionType;
  create?: CreateActionType;
  delete?: DeleteActionType;
};
export type Sort<T> = { key: keyof T; direction: "asc" | "desc" | null };
export type SearchedParam = { [key: string]: FilterValue | FilterValue[] };

export type Config<T extends object> = {
  locale?: Intl.LocalesArgument;
  isServerSide?: boolean;
  isProperties?: boolean;
  isSearchable?: boolean;
  scroll?: {
    maxHeight: number;
  };
  subrow?: {
    openAutomatically?: boolean;
    selector?: string;
    button?: boolean;
    render?: {
      styles: React.CSSProperties;
      element: (parentItem: T, subItem: unknown) => React.JSX.Element;
    };
  };
  dnd?: {
    renderItem: React.JSX.Element;
  };
  isTreeView?: boolean;
  validation?: {
    errors: Errors<T>;
    getChangeData?: (items: T[]) => void;
  };
  columnManagement?: {
    enabled?: boolean;
    storageKey?: string;
    /** When `false`, hides PDF column toggles in the column manager. Defaults to `true`. */
    pdfExport?: boolean;
  };
};

type ImportActionType = {
  title?: string;
  message?: string;
  text?: string;
  buttonText?: string;
  allowedTypes?: MimeTypes[];
  prefixItem?: React.ReactNode;
  suffixItem?: React.ReactNode;
  onClick: (formData: FormData | undefined, files: File[], base64: string[]) => void;
};

type ExportActionType = {
  title?: string;
  message?: string;
  text?: string;
  content?: React.JSX.Element;
  /** Receives the currently selected PDF column keys when confirmed. */
  onClick: (payload?: { pdfColumns: string[] }) => void;
};

type CreateActionType = {
  text?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

type DeleteActionType = {
  title?: string;
  message?: string;
  text?: string;
  onClick: () => void;
};

interface IProps<T extends object> extends IChildrenProps {
  trackBy?: (item: T) => string;
  title?: string;
  description?: string;
  extra?: React.ReactNode;
  data: T[];
  columns: TableColumnProps<T>[];
  actions?: Actions;
  rowBackgroundColor?: (item: T) => string;
  selections?: (selectionItems: T[]) => void;
  selectionDisabled?: (item: T) => boolean;
  previousSelections?: T[];
  sortedParams?: (params: Sort<T>[], query: string) => void;
  searchedParams?: (params: SearchedParam | null, query: string, operator: FilterOperator) => void;
  onPdfColumnsChange?: (pdfColumns: string[]) => void;
  onEditable?: (item: T, trackByValue: string, currentKey?: keyof T | null) => void;
  onDnD?: (item: T[]) => void;
  pagination?: {
    totalRecords: number;
    perPage: number;
    currentPage?: number;
    onChange?: (currentPage: number, perPage: number) => void;
  };
  config?: Config<T>;
}

export default IProps;
