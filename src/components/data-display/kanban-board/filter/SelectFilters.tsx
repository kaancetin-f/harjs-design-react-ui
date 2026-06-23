import React, { Dispatch, JSX, memo, SetStateAction } from "react";
import { ARIcon } from "../../../icons";
import Checkbox from "../../../form/checkbox";
import Grid from "../../grid-system";
import Button from "../../../form/button";
import Divider from "../../divider";
import { useTranslation } from "../../../../libs/core/application/hooks";
import { Config } from "../IProps";

interface IProps<T extends object> {
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

const { Box } = Grid;

function SelectFilters<T extends object>({ states, methods, config }: IProps<T>) {
  // hooks
  const { t } = useTranslation(String(config?.locale ?? "tr"));

  return Object.entries(states.selectFilters.get).map(([name, values], index) => {
    const isEqualsName = states.openName.get === name;
    const className: string[] = [];

    if (isEqualsName) className.push("active");

    return (
      <li key={index} className={className.map((c) => c).join(" ")} onClick={() => methods.open(name)}>
        <div>
          <span>{name}</span>
          <ARIcon icon={"ChevronDown"} />
        </div>

        {isEqualsName && (
          <ul className={className.map((c) => c).join(" ")} onClick={(event) => event.stopPropagation()}>
            {values.map((value, index) => (
              <li key={index}>
                <Checkbox
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
              </li>
            ))}

            <Divider config={{ margin: "0.5rem 0" }} />

            <Box direction="flex-end">
              <Button
                color="red"
                size="small"
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
            </Box>
          </ul>
        )}
      </li>
    );
  });
}

export default memo(SelectFilters) as <T extends object>(props: IProps<T>) => JSX.Element;
