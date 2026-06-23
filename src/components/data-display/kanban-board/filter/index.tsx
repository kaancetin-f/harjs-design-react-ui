"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";
import DateFilters from "./DateFilters";
import SelectFilters from "./SelectFilters";
import React from "react";
import Input from "../../../form/input";
import { Config } from "../IProps";
import { useTranslation } from "../../../../libs/core/application/hooks";

interface IProps<T extends object> {
  states: {
    search: {
      get: string | null;
      set: Dispatch<React.SetStateAction<string | null>>;
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

function Filter<T extends object>({ states, config }: IProps<T>) {
  // refs
  const _searchTimeOut = useRef<NodeJS.Timeout | null>(null);

  // states
  const [openName, setOpenName] = useState<string | null>(null);

  // hooks
  const { t } = useTranslation(String(config?.locale ?? "tr"));

  // methods
  const handleOpen = (name: string | null) => setOpenName(openName === name ? null : name);

  return (
    <div className="filters">
      <Input
        variant="borderless"
        placeholder={t("KanbanBoard.Search.Input.Placeholder")}
        onChange={(event) => {
          if (_searchTimeOut.current) clearTimeout(_searchTimeOut.current);

          _searchTimeOut.current = setTimeout(() => {
            states.search.set(event.target.value.toLocaleLowerCase());
          }, 750);
        }}
      />

      <ul>
        <DateFilters
          states={{
            dateFilters: {
              get: states.dateFilters.get,
              set: states.dateFilters.set,
            },
            openName: { get: openName },
          }}
          methods={{
            open: handleOpen,
          }}
          config={config}
        />

        <SelectFilters
          states={{
            selectFilters: {
              get: states.selectFilters.get,
              set: states.selectFilters.set,
            },
            selectedFilters: {
              get: states.selectedFilters.get,
              set: states.selectedFilters.set,
            },
            openName: { get: openName },
          }}
          methods={{ open: handleOpen }}
          config={config}
        />
      </ul>
    </div>
  );
}

export default Filter;
