"use client";

import { useEffect, useRef, useState } from "react";
import DateFilters from "./DateFilters";
import SelectFilters from "./SelectFilters";
import React from "react";
import Input from "../../../form/input";
import { IFilterProps } from "./types";
import { useTranslation } from "@harjs/translation";
import IKanbanBoardLocale from "../../../../libs/core/application/locales/kanban-board/IKanbanBoardLocale";
import KanbanBoardTR from "../../../../libs/core/application/locales/kanban-board/tr";
import KanbanBoardEN from "../../../../libs/core/application/locales/kanban-board/en";

function Filter<T extends object>({ states, config }: IFilterProps<T>) {
  // refs
  const _root = useRef<HTMLDivElement>(null);
  const _searchTimeOut = useRef<NodeJS.Timeout | null>(null);

  // states
  const [openName, setOpenName] = useState<string | null>(null);

  // hooks
  const { t } = useTranslation<IKanbanBoardLocale>(String(config?.locale ?? "tr"), {
    tr: { ...KanbanBoardTR },
    en: { ...KanbanBoardEN },
  });

  // methods
  const handleOpen = (name: string | null) => setOpenName((current) => (current === name ? null : name));

  // useEffects
  useEffect(() => {
    if (!openName) return;

    const close = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (_root.current?.contains(target)) return;
      if (target instanceof Element && target.closest(".har-date-calendar, .har-date-picker")) return;

      setOpenName(null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenName(null);
    };

    document.addEventListener("pointerdown", close);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openName]);

  return (
    <div ref={_root} className="har-kanban-filters" role="search" aria-label={t("KanbanBoard.Filters.Label")}>
      <div className="search">
        <Input
          variant="outlined"
          size="md"
          border={{ radius: "6" }}
          onChange={(event) => {
            if (_searchTimeOut.current) clearTimeout(_searchTimeOut.current);

            _searchTimeOut.current = setTimeout(() => {
              states.search.set(event.target.value.toLocaleLowerCase());
            }, 750);
          }}
          placeholder={t("KanbanBoard.Search.Input.Placeholder")}
        />
      </div>

      <div className="groups">
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
      </div>
    </div>
  );
}

export default Filter;
