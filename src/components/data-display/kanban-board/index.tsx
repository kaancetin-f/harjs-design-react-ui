"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import IProps from "./IProps";
import "../../../assets/css/components/data-display/kanban-board/styles.css";
import DnD from "../dnd";
import { ARIcon } from "../../icons";
import Filter from "./filter";
import { KanbanBoardColumnProps } from "../../../libs/infrastructure/types";

const KanbanBoard = function <T extends object, TColumnProperties>({
  trackBy,
  columns,
  onChange,
  onLazyLoad,
  config,
}: IProps<T, TColumnProperties>) {
  // refs
  const _kanbanWrapper = useRef<HTMLDivElement>(null);
  const _kanbanItems = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const _hoverItemIndex = useRef<number | null>(null);
  const _isProgrammaticScroll = useRef<boolean>(false);
  const _scrollInterval = useRef<number | null>(null);
  const _scrollAnimationFrame = useRef<number | null>(null);
  const _scrollSpeedRef = useRef(0);
  const _lastScrollTop = useRef(0);
  const _lastRequest = useRef<string>("");

  // states
  const [data, setData] = useState<KanbanBoardColumnProps<T, TColumnProperties>[]>([]);
  // states -> Lazy Load
  const [query, setQuery] = useState<any>(null);
  const [perPage] = useState<number>(config?.perPage ?? 10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // states -> Filters
  const [search, setSearch] = useState<string | null>(null);
  const [selectFilters, setSelectFilters] = useState<{
    [k: string]: (string | null)[];
  }>({});
  const [selectedFilters, setSelectedFilters] = useState<Record<string, Set<string | null>>>({});
  const [dateFilters, setDateFilters] = useState<Record<string, { from: Date | null; to: Date | null }>>({});

  // methods
  const handleBoardDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    const kanbanWrapper = _kanbanWrapper.current;

    if (!kanbanWrapper) return;

    const rect = kanbanWrapper.getBoundingClientRect();
    const mouseX = event.clientX;

    const edgeThreshold = 100; // px olarak kenar hassasiyeti.

    if (mouseX - rect.left < edgeThreshold) {
      // sol kenara yaklaştı.
      _scrollSpeedRef.current = -Math.max(1, (edgeThreshold - (mouseX - rect.left)) / 2);
    } else if (rect.right - mouseX < edgeThreshold) {
      // sağ kenara yaklaştı.
      _scrollSpeedRef.current = Math.max(1, (edgeThreshold - (rect.right - mouseX)) / 2);
    } else {
      _scrollSpeedRef.current = 0;
    }

    if (!_scrollAnimationFrame.current) {
      const scrollLoop = () => {
        if (kanbanWrapper && _scrollSpeedRef.current !== 0) {
          kanbanWrapper.scrollLeft += _scrollSpeedRef.current;
        }
        _scrollAnimationFrame.current = requestAnimationFrame(scrollLoop);
      };
      scrollLoop();
    }
  };

  const handleDrop = (toColumn: string) => (event: React.DragEvent) => {
    event.preventDefault();

    const item = JSON.parse(event.dataTransfer.getData("item"));
    const fromColumn = event.dataTransfer.getData("fromColumn");

    const nodes = document.querySelectorAll("[data-id='placeholder']");
    nodes.forEach((node) => node.remove());

    if (!item || fromColumn === toColumn) return;

    const updatedColumns = data.map((board) => {
      if (board.key === fromColumn) {
        return {
          ...board,
          items: board.items.filter((_item: T) => trackBy(_item) !== trackBy(item)),
        };
      }

      if (board.key === toColumn) {
        const boardItems = [...board.items];
        const safeIndex = Math.min(_hoverItemIndex.current ?? Infinity, boardItems.length); // son elemandan fazla olmasın.
        boardItems.splice(safeIndex, 0, item);

        onChange?.(item, board.key, board.columnProperties, safeIndex);

        return {
          ...board,
          items: boardItems,
        };
      }

      return board;
    });

    setData(updatedColumns);

    // Temizlik
    event.dataTransfer.clearData("item");
    event.dataTransfer.clearData("fromColumn");
    _hoverItemIndex.current = null;
  };

  const handleItemsDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const item = event.currentTarget as HTMLElement;

    if (!item.classList.contains("dragging")) item.classList.add("dragging");
  };

  const handleItemsDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const item = event.currentTarget as HTMLElement;
    const rect = item.getBoundingClientRect();
    const { clientX, clientY } = event;

    const isInside = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;

    if (!isInside && item.classList.contains("dragging")) {
      item.classList.remove("dragging");
    }
  };

  const handleItemsDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const item = event.currentTarget as HTMLElement;

    if (item.classList.contains("dragging")) item.classList.remove("dragging");
  };

  const handleLazyLoadScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;

    if (_isProgrammaticScroll.current) {
      if (scrollTop <= 5) _isProgrammaticScroll.current = false;

      return;
    }

    const isScrollingDown = scrollTop > _lastScrollTop.current;
    _lastScrollTop.current = scrollTop;

    if (!isScrollingDown) return;

    const isBottom = scrollHeight - scrollTop <= clientHeight;

    if (isBottom) setCurrentPage((prev) => prev + 1);
  }, []);

  const handleStartScroll = (direction: "left" | "right") => {
    const el = _kanbanWrapper.current;
    if (!el) return;

    handleStopScroll();

    _scrollInterval.current = window.setInterval(() => {
      el.scrollLeft += direction === "left" ? -10 : 10;
    }, 16); // ~60fps
  };

  const handleStopScroll = () => {
    if (_scrollInterval.current) {
      clearInterval(_scrollInterval.current);
      _scrollInterval.current = null;
    }
  };

  const stopScrolling = () => {
    if (_scrollAnimationFrame.current) {
      cancelAnimationFrame(_scrollAnimationFrame.current);
      _scrollAnimationFrame.current = null;
    }

    _scrollSpeedRef.current = 0;
  };

  const darkenColor = (hex: string, percent: number) => {
    let num = parseInt(hex.slice(1), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) - amt,
      G = ((num >> 8) & 0x00ff) - amt,
      B = (num & 0x0000ff) - amt;

    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 0 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  // useEffects
  useEffect(() => {
    let _data = columns.map((col) => ({
      ...col,
      items: [...col.items],
    }));

    setData(_data);

    const selectMap = new Map<string, Set<string | null>>();
    const dateMap = new Map<string, true>();

    columns.forEach((col) => {
      col.items.forEach((item) => {
        const keys = config?.filter?.keys(item);

        keys?.forEach((k) => {
          if (k.type === "select") {
            if (!selectMap.has(k.name)) selectMap.set(k.name, new Set());

            selectMap.get(k.name)!.add(k.value ?? null);
          }

          if (k.type === "date") dateMap.set(k.name, true);
        });
      });
    });

    setSelectFilters(Object.fromEntries(Array.from(selectMap.entries()).map(([name, set]) => [name, Array.from(set)])));
    setDateFilters((prev) => {
      const next = { ...prev };

      Array.from(dateMap.keys()).forEach((name) => {
        if (!next[name]) {
          next[name] = { from: null, to: null };
        }
      });

      return next;
    });
  }, [columns]);

  const _prevFilters = useRef(JSON.stringify({ search, selectedFilters, dateFilters }));

  useEffect(() => {
    const normalizedFilters = JSON.stringify({
      search,
      selectedFilters: Object.fromEntries(Object.entries(selectedFilters).map(([k, v]) => [k, Array.from(v).sort()])),
      dateFilters,
    });

    const hasSelectedFilters = Object.values(selectedFilters).some((set) => set.size > 0);
    const hasDateFilters = Object.values(dateFilters).some((r) => r.from || r.to);

    // Page reset + Scroll logic.
    if (_prevFilters.current !== normalizedFilters) {
      setCurrentPage(1);
      _prevFilters.current = normalizedFilters;

      if (_kanbanWrapper.current) {
        _isProgrammaticScroll.current = true;
        _kanbanWrapper.current.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    }

    // Query Build Logic.
    if (!search && !hasSelectedFilters && !hasDateFilters) {
      setQuery(null);

      return;
    }

    const sampleItem = columns?.[0]?.items?.[0];
    const keys = config?.filter?.keys(sampleItem) ?? [];
    const keyMap = Object.fromEntries(keys.map((k) => [k.name, k.key]));

    const dateQuery = Object.entries(dateFilters).reduce((acc: Record<string, any>, [name, range]) => {
      if (range.from || range.to) {
        const technicalKey = keyMap[name] || name;
        acc[technicalKey as string] = {
          from: range.from,
          to: range.to,
        };
      }
      return acc;
    }, {});

    const selectQuery = Object.entries(selectedFilters).reduce((acc: Record<string, any>, [name, set]) => {
      if (set.size > 0) {
        const technicalKey = keyMap[name] || name;
        acc[technicalKey as string] = Array.from(set);
      }
      return acc;
    }, {});

    setQuery({
      keyword: search ?? "",
      ...dateQuery,
      ...selectQuery,
    });
  }, [search, selectedFilters, dateFilters, columns, config]);

  useEffect(() => {
    if (!onLazyLoad) return;

    const key = JSON.stringify({ query, currentPage, perPage });

    if (_lastRequest.current === key) return;

    _lastRequest.current = key;

    onLazyLoad(query, perPage, currentPage);
  }, [query, currentPage, perPage, onLazyLoad]);

  return (
    <>
      {config?.filter && (
        <Filter
          states={{
            search: {
              get: search,
              set: setSearch,
            },
            dateFilters: {
              get: dateFilters,
              set: setDateFilters,
            },
            selectFilters: {
              get: selectFilters,
              set: setSelectFilters,
            },
            selectedFilters: {
              get: selectedFilters,
              set: setSelectedFilters,
            },
          }}
          config={config}
        />
      )}

      <div
        ref={_kanbanWrapper}
        className="ar-kanban-board"
        style={{
          height: `calc(100dvh - (${_kanbanWrapper.current?.getBoundingClientRect().top}px + ${config?.safeAreaOffset?.bottom ?? 0}px))`,
        }}
        onScroll={handleLazyLoadScroll}
        onDragOver={handleBoardDragOver}
        onDragEnd={stopScrolling}
        onDrop={stopScrolling}
      >
        <div className="buttons">
          <div
            className="button left"
            onMouseDown={() => handleStartScroll("left")}
            onMouseUp={handleStopScroll}
            onMouseLeave={handleStopScroll}
          >
            <ARIcon icon={"ArrowLeft"} />
          </div>
          <div
            className="button right"
            onMouseDown={() => handleStartScroll("right")}
            onMouseUp={handleStopScroll}
            onMouseLeave={handleStopScroll}
          >
            <ARIcon icon={"ArrowRight"} />
          </div>
        </div>

        <div className="titles">
          {data.map((board, index) => (
            <div key={index} className="title">
              <h4>
                <span
                  style={{
                    backgroundColor: darkenColor(board.titleColor ?? "", 1),
                    borderColor: darkenColor(board.titleColor ?? "", 1),
                  }}
                ></span>
                {board.title.toLocaleUpperCase("tr")}
              </h4>
              {board.description && <span>{board.description}</span>}
            </div>
          ))}
        </div>

        <div className="columns">
          {data.map((board, index) => (
            <div key={index} className="column" onDrop={handleDrop(board.key)}>
              <div
                className="items"
                onDragOver={handleItemsDragOver}
                onDragLeave={handleItemsDragLeave}
                onDrop={handleItemsDrop}
              >
                <DnD
                  key={board.key}
                  data={board.items}
                  renderItem={(item, dndIndex) => {
                    return (
                      <div
                        key={dndIndex}
                        ref={(el) => {
                          if (!el) return;

                          _kanbanItems.current[trackBy(item)] = el;
                        }}
                        className="item"
                        onDragOver={(event) => {
                          event.preventDefault();

                          const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
                          const mouseY = event.clientY;
                          const isBelow = mouseY > rect.top + rect.height / 2;

                          _hoverItemIndex.current = isBelow ? dndIndex + 1 : dndIndex;
                        }}
                      >
                        {board.renderItem(item, index)}
                      </div>
                    );
                  }}
                  columnKey={board.key}
                  confing={{ isMoveIcon: false }}
                  // onChange={(data) => {
                  //   const now = Date.now();

                  //   setBoardData((prev) =>
                  //     prev.map((col) => (col.key === board.key ? { ...col, items: data,  } : col))
                  //   );
                  // }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default KanbanBoard;
