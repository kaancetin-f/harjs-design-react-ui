import React, { Dispatch, memo, SetStateAction } from "react";
import Button from "../../form/button";
import { ARIcon } from "../../icons";
import { ExtractKey } from "./Helpers";
import { Config, Sort } from "./IProps";
import { TableColumnProps } from "../../../libs/infrastructure/types";

const MemoizedTHeadCell = function <T extends object>({
  refs,
  states,
  methods,
  columns,
  config,
}: {
  refs: {
    propertiesButton: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  };
  states: {
    open: { get: boolean; set: Dispatch<SetStateAction<boolean>> };
    sort: {
      get: Sort<T>[];
      set: Dispatch<SetStateAction<Sort<T>[]>>;
    };
    sortCurrentColumn: {
      set: React.Dispatch<React.SetStateAction<TableColumnProps<T> | null>>;
    };
    propertiesButtonCoordinate: {
      set: React.Dispatch<
        React.SetStateAction<{
          x: number;
          y: number;
        }>
      >;
    };
  };
  methods: {
    handleScroll: () => void;
  };
  columns: TableColumnProps<T>[];
  config: Config<T>;
}) {
  return (
    <>
      {columns.map((c, cIndex) => {
        const { isProperties = true } = c.config ?? {};
        // Orijinal c.key araması optimize edildi ve string formatına güvenli şekilde çekildi
        const columnKeyString = String(ExtractKey(c.key) ?? cIndex);
        const _direction = states.sort.get.find((s) => s.key === columnKeyString)?.direction;
        let _className: string[] = [];

        if (c.config?.sticky) _className.push(`sticky-${c.config.sticky}`);
        if (!c.config?.width) _className.push("min-w");
        if (c.config?.alignContent) {
          _className.push(`align-content-${c.config.alignContent}`);
        }

        return (
          <th
            key={`column-head-${columnKeyString}`}
            {...(_className.length > 0 && {
              className: `${_className.join(" ")}`,
            })}
            {...(c.config?.width
              ? {
                  style: { minWidth: c.config.width, maxWidth: c.config.width },
                }
              : { style: {} })}
            {...(c.config?.sticky && {
              "data-sticky-position": c.config.sticky,
            })}
          >
            <div>
              <span style={{ fontWeight: 500 }}>
                {(_direction === "asc" || _direction === "desc") && (
                  <span>
                    {_direction === "asc" && <ARIcon icon="ArrowUp" />}
                    {_direction === "desc" && <ARIcon icon="ArrowDown" />}
                  </span>
                )}
                {c.title}
              </span>

              {config.isProperties && isProperties && (
                <span
                  ref={(element) => {
                    if (element) {
                      refs.propertiesButton.current[cIndex] = element;
                    }
                  }}
                  className="properties-field"
                  data-properties-button="true"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const rect = event.currentTarget.getBoundingClientRect();
                    const screenCenterX = window.innerWidth / 2;
                    const coordinateX = rect.x > screenCenterX ? rect.x + rect.width - 225 : rect.x;
                    const coordinateY = rect.y + rect.height;

                    states.sortCurrentColumn.set(c);
                    states.propertiesButtonCoordinate.set({
                      x: coordinateX,
                      y: coordinateY,
                    });

                    states.sort.set((prev) => {
                      const key = ExtractKey(c.key) as keyof T;
                      const index = prev.findIndex((s) => s.key === key);

                      if (index === -1) return [...prev, { key, direction: null }];
                      return prev;
                    });
                    states.open.set(true);
                    methods.handleScroll();
                  }}
                >
                  <Button
                    variant="borderless"
                    icon={{
                      element: <ARIcon size={16} icon="ThreeDotsVertical" fill="var(--dark)" strokeWidth={0} />,
                    }}
                  />
                </span>
              )}
            </div>
          </th>
        );
      })}
    </>
  );
};

// React.memo kullanımı sırasında generic tipi koruyoruz.
const THeadCell = memo(MemoizedTHeadCell) as typeof MemoizedTHeadCell;

export default THeadCell;
