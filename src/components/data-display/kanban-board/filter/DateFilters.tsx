import React, { Dispatch, JSX, memo, SetStateAction } from "react";
import DatePicker from "../../../form/date-picker";
import { ARIcon } from "../../../icons";
import Grid from "../../grid-system";
import Button from "../../../form/button";
import Divider from "../../divider";
import { useTranslation } from "../../../../libs/core/application/hooks";
import { Config } from "../IProps";

interface IProps<T extends object> {
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

const { Row, Column, Box } = Grid;

function DateFilters<T extends object>({ states, methods, config }: IProps<T>) {
  // hooks
  const { t } = useTranslation(String(config?.locale ?? "tr"));

  return Object.entries(states.dateFilters.get).map(([name, range], index) => {
    const isEqualsName = states.openName.get === name;
    const className: string[] = [];

    if (isEqualsName) className.push("active");

    return (
      <>
        <li key={index} className={className.map((c) => c).join(" ")} onClick={() => methods.open(name)}>
          <div>
            <span>{name}</span>
            <ARIcon icon={"ChevronDown"} />
          </div>

          {isEqualsName && (
            <ul className={className.map((c) => c).join(" ")} onClick={(event) => event.stopPropagation()}>
              <Row>
                <Column>
                  <DatePicker
                    value={range.from?.toISOString()}
                    onChange={(value) => {
                      states.dateFilters.set((prev) => ({
                        ...prev,
                        [name]: {
                          ...prev[name],
                          from: new Date(value),
                        },
                      }));
                    }}
                    placeholder="From"
                  />
                </Column>
              </Row>

              <Row>
                <Column>
                  <DatePicker
                    value={range.to?.toISOString()}
                    onChange={(value) => {
                      states.dateFilters.set((prev) => ({
                        ...prev,
                        [name]: {
                          ...prev[name],
                          to: new Date(value),
                        },
                      }));
                    }}
                    placeholder="To"
                  />
                </Column>
              </Row>

              <Divider config={{ margin: "0.5rem 0" }} />

              <Box direction="flex-end">
                <Button
                  color="red"
                  size="small"
                  onClick={() => {
                    states.dateFilters.set((prev) => ({
                      ...prev,
                      [name]: { from: null, to: null },
                    }));
                  }}
                >
                  {t("KanbanBoard.Search.Button.Clear.Text")}
                </Button>
              </Box>
            </ul>
          )}
        </li>
      </>
    );
  });
}

export default memo(DateFilters) as <T extends object>(props: IProps<T>) => JSX.Element;
