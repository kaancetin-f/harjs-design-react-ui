import { Dispatch, SetStateAction } from "react";
import { Config } from "../IProps";

export interface IFilterProps<T extends object> {
  states: {
    search: {
      get: string | null;
      set: Dispatch<SetStateAction<string | null>>;
    };
    dateFilters: {
      get: Record<string, { from: Date | null; to: Date | null }>;
      set: Dispatch<SetStateAction<Record<string, { from: Date | null; to: Date | null }>>>;
    };
    selectFilters: {
      get: { [key: string]: (string | null)[] };
      set: Dispatch<SetStateAction<{ [key: string]: (string | null)[] }>>;
    };
    selectedFilters: {
      get: Record<string, Set<string | null>>;
      set: Dispatch<SetStateAction<Record<string, Set<string | null>>>>;
    };
  };
  config?: Config<T>;
}

export interface IDateFiltersProps<T extends object> {
  states: {
    dateFilters: {
      get: Record<string, { from: Date | null; to: Date | null }>;
      set: Dispatch<SetStateAction<Record<string, { from: Date | null; to: Date | null }>>>;
    };
    openName: {
      get: string | null;
    };
  };
  methods: {
    open: (name: string | null) => void;
  };
  config?: Config<T>;
}

export interface ISelectFiltersProps<T extends object> {
  states: {
    selectFilters: {
      get: { [key: string]: (string | null)[] };
      set: Dispatch<SetStateAction<{ [key: string]: (string | null)[] }>>;
    };
    selectedFilters: {
      get: Record<string, Set<string | null>>;
      set: Dispatch<SetStateAction<Record<string, Set<string | null>>>>;
    };
    openName: {
      get: string | null;
    };
  };
  methods: {
    open: (name: string | null) => void;
  };
  config?: Config<T>;
}
