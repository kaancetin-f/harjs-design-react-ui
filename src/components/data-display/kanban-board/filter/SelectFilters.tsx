import React, { JSX, memo } from "react";
import { Icon } from "../../../icons";
import Checkbox from "../../../form/checkbox";
import Button from "../../../form/button";
import Divider from "../../divider";
import { ISelectFiltersProps } from "./types";
import { useTranslation } from "@harjs/translation";
import IKanbanBoardLocale from "../../../../libs/core/application/locales/kanban-board/IKanbanBoardLocale";
import KanbanBoardTR from "../../../../libs/core/application/locales/kanban-board/tr";
import KanbanBoardEN from "../../../../libs/core/application/locales/kanban-board/en";

function SelectFilters<T extends object>({ states, methods, config }: ISelectFiltersProps<T>) {
  // hooks
  const { t } = useTranslation<IKanbanBoardLocale>(String(config?.locale ?? "tr"), {
    tr: { ...KanbanBoardTR },
    en: { ...KanbanBoardEN },
  });

  return Object.entries(states.selectFilters.get).map(([name, values]) => {
    const isOpen = states.openName.get === name;
    const selectedCount = states.selectedFilters.get[name]?.size ?? 0;
    const triggerClass = ["trigger", isOpen ? "is-open" : undefined, selectedCount > 0 ? "is-active" : undefined]
      .filter(Boolean)
      .join(" ");

    return (
      <div key={name} className="filter">
        <button
          type="button"
          className={triggerClass}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          onClick={() => methods.open(name)}
        >
          <span className="label">{name}</span>
          {selectedCount > 0 ? <span className="badge">{selectedCount}</span> : null}
          <span className="chevron" aria-hidden>
            <Icon icon={"ChevronDown"} fill="currentColor" stroke="currentColor" />
          </span>
        </button>

        {isOpen && (
          <div className="panel" role="dialog" aria-label={name} onPointerDown={(event) => event.stopPropagation()}>
            <div className="options">
              {values.map((value) => (
                <Checkbox
                  key={String(value)}
                  label={String(value ?? "-")}
                  checked={states.selectedFilters.get[name]?.has(value) ?? false}
                  onChange={() => {
                    states.selectedFilters.set((prev) => {
                      const next = { ...prev };
                      const set = new Set(next[name] ?? []);

                      set.has(value) ? set.delete(value) : set.add(value);
                      next[name] = set;

                      return next;
                    });
                  }}
                />
              ))}
            </div>

            <Divider config={{ margin: "0.5rem 0" }} />

            <div className="panel-footer">
              <Button
                variant="borderless"
                color="red"
                size="sm"
                disabled={selectedCount === 0}
                onClick={() => {
                  states.selectedFilters.set((prev) => {
                    const next = { ...prev };
                    delete next[name];
                    return next;
                  });
                }}
              >
                {t("KanbanBoard.Search.Button.Clear.Text")}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  });
}

export default memo(SelectFilters) as <T extends object>(props: ISelectFiltersProps<T>) => JSX.Element;
