import React, { JSX, memo } from "react";
import DatePicker from "../../../form/date-picker";
import { Icon } from "../../../icons";
import Button from "../../../form/button";
import Divider from "../../divider";
import { IDateFiltersProps } from "./types";
import { useTranslation } from "@harjs/translation";
import IKanbanBoardLocale from "../../../../libs/core/application/locales/kanban-board/IKanbanBoardLocale";
import KanbanBoardTR from "../../../../libs/core/application/locales/kanban-board/tr";
import KanbanBoardEN from "../../../../libs/core/application/locales/kanban-board/en";

function DateFilters<T extends object>({ states, methods, config }: IDateFiltersProps<T>) {
  // hooks
  const { t } = useTranslation<IKanbanBoardLocale>(String(config?.locale ?? "tr"), {
    tr: { ...KanbanBoardTR },
    en: { ...KanbanBoardEN },
  });

  return Object.entries(states.dateFilters.get).map(([name, range]) => {
    const isOpen = states.openName.get === name;
    const isActive = Boolean(range.from || range.to);
    const triggerClass = ["trigger", isOpen ? "is-open" : undefined, isActive ? "is-active" : undefined]
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
          {isActive ? <span className="badge">1</span> : null}
          <span className="chevron" aria-hidden>
            <Icon icon={"ChevronDown"} fill="currentColor" stroke="currentColor" />
          </span>
        </button>

        {isOpen && (
          <div className="panel" role="dialog" aria-label={name} onPointerDown={(event) => event.stopPropagation()}>
            <div className="dates">
              <DatePicker
                value={range.from?.toISOString() ?? ""}
                onChange={(value) => {
                  states.dateFilters.set((prev) => ({
                    ...prev,
                    [name]: {
                      ...prev[name],
                      from: value ? new Date(value) : null,
                    },
                  }));
                }}
                placeholder={t("KanbanBoard.Filter.From")}
              />
              <DatePicker
                value={range.to?.toISOString() ?? ""}
                onChange={(value) => {
                  states.dateFilters.set((prev) => ({
                    ...prev,
                    [name]: {
                      ...prev[name],
                      to: value ? new Date(value) : null,
                    },
                  }));
                }}
                placeholder={t("KanbanBoard.Filter.To")}
              />
            </div>

            <Divider config={{ margin: "0.5rem 0" }} />

            <div className="panel-footer">
              <Button
                variant="borderless"
                color="red"
                size="sm"
                disabled={!isActive}
                onClick={() => {
                  states.dateFilters.set((prev) => ({
                    ...prev,
                    [name]: { from: null, to: null },
                  }));
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

export default memo(DateFilters) as <T extends object>(props: IDateFiltersProps<T>) => JSX.Element;
