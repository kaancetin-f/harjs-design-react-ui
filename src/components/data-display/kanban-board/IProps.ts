import { KanbanBoardColumnProps } from "../../../libs/infrastructure/types";

export type Config<T extends object> = {
  locale?: Intl.LocalesArgument;
  safeAreaOffset?: { top?: number; right?: number; bottom?: number; left?: number };
  perPage?: number;
  filter?: {
    /**
     * @deprecated *
     */
    search?: (item: T, value: string) => boolean;
    keys: (item: T) => { key: keyof T; name: string; value: string; type: "select" | "date" }[];
  };
};

interface IProps<T extends object, TColumnProperties> {
  trackBy: (item: T) => string;
  columns: KanbanBoardColumnProps<T, TColumnProperties>[];
  onChange?: (item: T, columnKey: string, columnProperties: TColumnProperties, hoverIndex: number) => void;
  onLazyLoad?: (query: Record<string, string>, perPage: number, currentPage: number) => void;
  config?: Config<T>;
}

export default IProps;
