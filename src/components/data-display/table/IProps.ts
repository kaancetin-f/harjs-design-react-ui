import React from "react";
import { Errors, MimeTypes, TableColumnProps } from "../../../libs/infrastructure/types";
import { IChildrenProps } from "../../../libs/infrastructure/types/IGlobalProps";
import { FilterOperator } from "../../../libs/infrastructure/shared/Enums";

export type Operator =
  | "Contains"
  | "DoesNotContains"
  | "Equals"
  | "DoesNotEquals"
  | "BeginsWith"
  | "EndsWith"
  | "Blank"
  | "NotBlank";

export type FilterValue = {
  value: string | number | boolean;
  operator: FilterOperator;
};

export type Actions = {
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
      element: (item: T[]) => React.JSX.Element;
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
};

type ImportActionType = {
  tooltip: string;
  title?: string;
  message?: string;
  buttonText?: string;
  allowedTypes?: MimeTypes[];
  prefixItem?: React.ReactNode;
  suffixItem?: React.ReactNode;
  onClick: (formData: FormData | undefined, files: File[], base64: string[]) => void;
};

type ExportActionType = {
  tooltip: string;
  title?: string;
  message?: string;
  content?: React.JSX.Element;
  onClick: () => void;
};

type CreateActionType = {
  tooltip: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

type DeleteActionType = {
  tooltip: string;
  title?: string;
  message?: string;
  onClick: () => void;
};

interface IProps<T extends object> extends IChildrenProps {
  trackBy?: (item: T) => string;
  title?: string;
  description?: string;
  data: T[];
  columns: TableColumnProps<T>[];
  actions?: Actions;
  rowBackgroundColor?: (item: T) => string;
  selections?: (selectionItems: T[]) => void;
  selectionDisabled?: (item: T) => boolean;
  previousSelections?: T[];
  sortedParams?: (params: Sort<T>[], query: string) => void;
  searchedParams?: (params: SearchedParam | null, query: string, operator: FilterOperator) => void;
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
