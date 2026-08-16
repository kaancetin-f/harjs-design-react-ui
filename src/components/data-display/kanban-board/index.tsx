"use client";

import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import IProps from "./IProps";
import "../../../assets/css/components/data-display/kanban-board/styles.css";
import DnD from "../dnd";
import { Icon } from "../../icons";
import Filter from "./filter";
import { KanbanBoardColumnProps } from "../../../libs/infrastructure/types";
import { collectFilterMeta, columnsSignature, findMovedItem, mergeSelectFilters, normalizeHex, parseDragItem } from "./helpers";
import { useTranslation } from "@harjs/translation";
import IKanbanBoardLocale from "../../../libs/core/application/locales/kanban-board/IKanbanBoardLocale";
import KanbanBoardTR from "../../../libs/core/application/locales/kanban-board/tr";
import KanbanBoardEN from "../../../libs/core/application/locales/kanban-board/en";

const KanbanBoard = function <T extends object, TColumnProperties>({
  trackBy,
  columns,
  onChange,
  onLazyLoad,
  loading = false,
  config,
}: IProps<T, TColumnProperties>) {
  // refs
  const _kanbanWrapper = useRef<HTMLDivElement>(null);
  const _kanbanItems = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const _hover = useRef<{ columnKey: string; index: number } | null>(null);
  const _scrollInterval = useRef<number | null>(null);
  const _scrollAnimationFrame = useRef<number | null>(null);
  const _scrollSpeedRef = useRef(0);
  const _lastScrollTop = useRef<Record<string, number>>({});
  const _lastRequest = useRef<string>("");
  const _onLazyLoad = useRef(onLazyLoad);
  const _loading = useRef(loading);
  const _columnsSignature = useRef("");
  const _filterKeyMap = useRef<Record<string, keyof T>>({});
  const _filterKeys = useRef(config?.filter?.keys);
  const _prevFilters = useRef(
    JSON.stringify({
      search: null,
      selectedFilters: {},
      dateFilters: {},
    }),
  );
  // refs -> Latest
  const _boards = useRef<KanbanBoardColumnProps<T, TColumnProperties>[]>([]);
  const _trackBy = useRef(trackBy);
  const _onChange = useRef(onChange);

  _trackBy.current = trackBy;
  _onChange.current = onChange;
  _onLazyLoad.current = onLazyLoad;
  _loading.current = loading;
  _filterKeys.current = config?.filter?.keys;

  // states
  const [data, setData] = useState<KanbanBoardColumnProps<T, TColumnProperties>[]>([]);
  const [boardOffsetTop, setBoardOffsetTop] = useState(0);
  const [scrollNav, setScrollNav] = useState({ left: false, right: false });
  const [announcement, setAnnouncement] = useState("");
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

  // hooks
  const boardId = useId();
  const { t } = useTranslation<IKanbanBoardLocale>(String(config?.locale ?? "tr"), {
    tr: { ...KanbanBoardTR },
    en: { ...KanbanBoardEN },
  });

  // methods
  const commitBoards = (next: KanbanBoardColumnProps<T, TColumnProperties>[]) => {
    _boards.current = next;
    setData(next);
  };

  const announce = (message: string) => setAnnouncement(message);

  const updateScrollNav = useCallback(() => {
    const el = _kanbanWrapper.current;
    if (!el) return;

    const left = el.scrollLeft > 8;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 8;

    setScrollNav((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
  }, []);

  const measureBoard = useCallback(() => {
    const el = _kanbanWrapper.current;
    if (!el) return;

    const nextTop = el.getBoundingClientRect().top;
    setBoardOffsetTop((prev) => (prev === nextTop ? prev : nextTop));
    updateScrollNav();
  }, [updateScrollNav]);

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

  const clearDropTargets = () => {
    _kanbanWrapper.current?.querySelectorAll(".is-drop-target").forEach((node) => {
      node.classList.remove("is-drop-target");
    });
  };

  const handleBoardDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    const kanbanWrapper = _kanbanWrapper.current;

    if (!kanbanWrapper) return;

    const rect = kanbanWrapper.getBoundingClientRect();
    const mouseX = event.clientX;
    const edgeThreshold = 100;

    if (mouseX - rect.left < edgeThreshold) {
      _scrollSpeedRef.current = -Math.max(1, (edgeThreshold - (mouseX - rect.left)) / 2);
    } else if (rect.right - mouseX < edgeThreshold) {
      _scrollSpeedRef.current = Math.max(1, (edgeThreshold - (rect.right - mouseX)) / 2);
    } else {
      _scrollSpeedRef.current = 0;
    }

    if (_scrollSpeedRef.current === 0) {
      stopScrolling();
      return;
    }

    if (_scrollAnimationFrame.current) return;

    const scrollLoop = () => {
      const wrapper = _kanbanWrapper.current;
      const speed = _scrollSpeedRef.current;

      if (!wrapper || speed === 0) {
        _scrollAnimationFrame.current = null;
        return;
      }

      wrapper.scrollLeft += speed;
      _scrollAnimationFrame.current = requestAnimationFrame(scrollLoop);
    };

    _scrollAnimationFrame.current = requestAnimationFrame(scrollLoop);
  };

  const handleBoardDragLeave = (event: React.DragEvent) => {
    const next = event.relatedTarget;
    if (next instanceof Node && _kanbanWrapper.current?.contains(next)) return;

    stopScrolling();
    clearDropTargets();
  };

  const handleColumnDragOver = (columnKey: string) => (event: React.DragEvent) => {
    event.preventDefault();

    if (_hover.current?.columnKey === columnKey) return;

    const column = _boards.current.find((board) => board.key === columnKey);
    _hover.current = { columnKey, index: column?.items.length ?? 0 };
  };

  const handleDrop = (toColumn: string) => (event: React.DragEvent) => {
    event.preventDefault();
    clearDropTargets();

    const { item: parsedItem, fromColumn } = parseDragItem<T>(event.dataTransfer);

    document.querySelectorAll("[data-id='placeholder']").forEach((node) => node.remove());

    if (!parsedItem || fromColumn === toColumn) {
      _hover.current = null;
      return;
    }

    const id = _trackBy.current(parsedItem);
    const boards = _boards.current;
    const fromBoard = boards.find((board) => board.key === fromColumn);
    const toBoard = boards.find((board) => board.key === toColumn);
    const sourceItem = fromBoard?.items.find((item) => _trackBy.current(item) === id) ?? parsedItem;

    if (!fromBoard || !toBoard) {
      _hover.current = null;
      return;
    }

    const hoverIndex =
      _hover.current?.columnKey === toColumn
        ? Math.min(_hover.current.index, toBoard.items.length)
        : toBoard.items.length;

    const next = boards.map((board) => {
      if (board.key === fromColumn) {
        return {
          ...board,
          items: board.items.filter((item) => _trackBy.current(item) !== id),
        };
      }

      if (board.key === toColumn) {
        const boardItems = [...board.items];
        boardItems.splice(hoverIndex, 0, sourceItem);

        return {
          ...board,
          items: boardItems,
        };
      }

      return board;
    });

    commitBoards(next);
    _onChange.current?.(sourceItem, toBoard.key, toBoard.columnProperties, hoverIndex);
    announce(t("KanbanBoard.Announce.MovedTo").replace("{column}", toBoard.title));

    try {
      event.dataTransfer.clearData("item");
      event.dataTransfer.clearData("fromColumn");
    } catch {
      // dataTransfer is locked after drop in some browsers
    }

    _hover.current = null;
  };

  const handleColumnReorder = (columnKey: string) => (items: T[]) => {
    const boards = _boards.current;
    const column = boards.find((board) => board.key === columnKey);
    if (!column) return;

    const moved = findMovedItem(column.items, items, _trackBy.current);
    if (!moved) return;

    commitBoards(boards.map((board) => (board.key === columnKey ? { ...board, items } : board)));
    _onChange.current?.(moved.item, column.key, column.columnProperties, moved.index);
    announce(t("KanbanBoard.Announce.Reordered").replace("{column}", column.title));
  };

  const handleItemsDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const item = event.currentTarget as HTMLElement;

    if (!item.classList.contains("is-drop-target")) item.classList.add("is-drop-target");
    item.parentElement?.classList.add("is-drop-target");
  };

  const handleItemsDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const item = event.currentTarget as HTMLElement;
    const rect = item.getBoundingClientRect();
    const { clientX, clientY } = event;

    const isInside = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;

    if (!isInside && item.classList.contains("is-drop-target")) {
      item.classList.remove("is-drop-target");
      item.parentElement?.classList.remove("is-drop-target");
    }
  };

  const handleItemsDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const item = event.currentTarget as HTMLElement;

    item.classList.remove("is-drop-target");
    item.parentElement?.classList.remove("is-drop-target");
  };

  const handleColumnScroll = useCallback((columnKey: string) => (event: React.UIEvent<HTMLDivElement>) => {
    if (!_onLazyLoad.current || _loading.current) return;

    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const last = _lastScrollTop.current[columnKey] ?? 0;
    const isScrollingDown = scrollTop > last;

    _lastScrollTop.current[columnKey] = scrollTop;

    if (!isScrollingDown) return;
    if (scrollHeight - scrollTop > clientHeight + 16) return;

    setCurrentPage((prev) => prev + 1);
  }, []);

  const handleStartScroll = (direction: "left" | "right") => {
    const el = _kanbanWrapper.current;
    if (!el) return;

    handleStopScroll();

    _scrollInterval.current = window.setInterval(() => {
      el.scrollLeft += direction === "left" ? -10 : 10;
      updateScrollNav();
    }, 16);
  };

  const handleDragEnd = () => {
    stopScrolling();
    clearDropTargets();
  };

  // useEffects
  useEffect(() => {
    const signature = columnsSignature(columns, _trackBy.current);
    const prevSignature = _columnsSignature.current;

    if (prevSignature === signature && _boards.current.length > 0) {
      const next = columns.map((column) => {
        const current = _boards.current.find((board) => board.key === column.key);

        return {
          ...column,
          items: current?.items ?? [...column.items],
        };
      });

      commitBoards(next);
      return;
    }

    _columnsSignature.current = signature;
    commitBoards(columns.map((column) => ({ ...column, items: [...column.items] })));
  }, [columns]);

  useEffect(() => {
    const meta = collectFilterMeta(columns, _filterKeys.current);

    if (Object.keys(meta.keyMap).length > 0) {
      _filterKeyMap.current = { ..._filterKeyMap.current, ...meta.keyMap };
    }

    if (Object.keys(meta.selectFilters).length > 0) {
      setSelectFilters((prev) => mergeSelectFilters(prev, meta.selectFilters));
    }

    setDateFilters((prev) => {
      let changed = false;
      const next = { ...prev };

      meta.dateNames.forEach((name) => {
        if (!next[name]) {
          next[name] = { from: null, to: null };
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [columns]);

  useEffect(() => {
    const normalizedFilters = JSON.stringify({
      search,
      selectedFilters: Object.fromEntries(Object.entries(selectedFilters).map(([k, v]) => [k, Array.from(v).sort()])),
      dateFilters,
    });

    const hasSelectedFilters = Object.values(selectedFilters).some((set) => set.size > 0);
    const hasDateFilters = Object.values(dateFilters).some((r) => r.from || r.to);

    if (_prevFilters.current !== normalizedFilters) {
      setCurrentPage(1);
      _prevFilters.current = normalizedFilters;
      _lastScrollTop.current = {};

      if (_kanbanWrapper.current) {
        _kanbanWrapper.current.scrollTo({ left: 0, behavior: "smooth" });
        _kanbanWrapper.current.querySelectorAll<HTMLElement>(".column > .items").forEach((el) => {
          el.scrollTop = 0;
        });
      }
    }

    if (!search && !hasSelectedFilters && !hasDateFilters) {
      setQuery(null);

      return;
    }

    const keyMap = _filterKeyMap.current;

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
  }, [search, selectedFilters, dateFilters, columns]);

  useEffect(() => {
    if (!onLazyLoad) return;

    const key = JSON.stringify({ query, currentPage, perPage });

    if (_lastRequest.current === key) return;

    _lastRequest.current = key;

    onLazyLoad(query, perPage, currentPage);
  }, [query, currentPage, perPage, onLazyLoad]);

  useLayoutEffect(() => {
    measureBoard();
    window.addEventListener("resize", measureBoard);
    window.addEventListener("scroll", measureBoard, true);

    return () => {
      window.removeEventListener("resize", measureBoard);
      window.removeEventListener("scroll", measureBoard, true);
    };
  }, [measureBoard]);

  useEffect(() => {
    updateScrollNav();
  }, [data, updateScrollNav]);

  useEffect(() => {
    return () => {
      if (_scrollAnimationFrame.current != null) {
        cancelAnimationFrame(_scrollAnimationFrame.current);
        _scrollAnimationFrame.current = null;
      }

      _scrollSpeedRef.current = 0;

      if (_scrollInterval.current != null) {
        clearInterval(_scrollInterval.current);
        _scrollInterval.current = null;
      }
    };
  }, []);

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
        className="har-kanban-shell"
        style={
          config?.safeAreaOffset
            ? {
                height: `calc(100dvh - (${boardOffsetTop}px + ${config.safeAreaOffset.bottom ?? 0}px))`,
              }
            : undefined
        }
      >
        <div className="nav">
          <button
            type="button"
            className={["left", scrollNav.left ? "is-visible" : undefined].filter(Boolean).join(" ")}
            aria-label={t("KanbanBoard.Scroll.Previous")}
            disabled={!scrollNav.left}
            onMouseDown={() => handleStartScroll("left")}
            onMouseUp={handleStopScroll}
            onMouseLeave={handleStopScroll}
          >
            <Icon icon={"ArrowLeft"} fill="currentColor" stroke="currentColor" />
          </button>
          <button
            type="button"
            className={["right", scrollNav.right ? "is-visible" : undefined].filter(Boolean).join(" ")}
            aria-label={t("KanbanBoard.Scroll.Next")}
            disabled={!scrollNav.right}
            onMouseDown={() => handleStartScroll("right")}
            onMouseUp={handleStopScroll}
            onMouseLeave={handleStopScroll}
          >
            <Icon icon={"ArrowRight"} fill="currentColor" stroke="currentColor" />
          </button>
        </div>

        <div
          ref={_kanbanWrapper}
          className="har-kanban-board"
          role="region"
          aria-label={t("KanbanBoard.Board.Label")}
          aria-describedby={`${boardId}-hint`}
          aria-busy={loading || undefined}
          onScroll={updateScrollNav}
          onDragOver={handleBoardDragOver}
          onDragLeave={handleBoardDragLeave}
          onDragEnd={handleDragEnd}
          onDrop={handleDragEnd}
        >
          <div id={`${boardId}-hint`} className="live">
            {t("KanbanBoard.Board.Hint")}
          </div>
          <div className="live" aria-live="polite" aria-atomic="true">
            {announcement}
          </div>

          <div className="columns">
          {data.map((board) => {
            const titleId = `${boardId}-${board.key}-title`;
            const accent = normalizeHex(board.titleColor);
            const isEmpty = board.items.length === 0 && !loading;
            const showSkeletons = loading && board.items.length === 0;

            return (
              <section
                key={board.key}
                className="column"
                aria-labelledby={titleId}
                style={accent ? { color: accent } : undefined}
                onDragOver={handleColumnDragOver(board.key)}
                onDrop={handleDrop(board.key)}
              >
                <header className="header">
                  <span className="accent" aria-hidden />
                  <h4 id={titleId}>{board.title}</h4>
                  <span className="count">{board.items.length}</span>
                  {board.description && <p className="description">{board.description}</p>}
                </header>

                <div
                  className="items"
                  onScroll={handleColumnScroll(board.key)}
                  onDragOver={handleItemsDragOver}
                  onDragLeave={handleItemsDragLeave}
                  onDrop={handleItemsDrop}
                >
                  {isEmpty && <div className="empty">{t("KanbanBoard.Column.Empty")}</div>}

                  {showSkeletons && (
                    <div className="skeletons" aria-hidden>
                      <div className="skeleton" />
                      <div className="skeleton" />
                      <div className="skeleton" />
                    </div>
                  )}

                  {!showSkeletons && (
                    <DnD
                      data={board.items}
                      itemKey={(item) => _trackBy.current(item)}
                      renderItem={(item, itemIndex) => {
                        return (
                          <div
                            className="item"
                            ref={(el) => {
                              if (!el) return;

                              _kanbanItems.current[_trackBy.current(item)] = el;
                            }}
                            onDragOver={(event) => {
                              event.preventDefault();

                              const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
                              const mouseY = event.clientY;
                              const isBelow = mouseY > rect.top + rect.height / 2;

                              _hover.current = {
                                columnKey: board.key,
                                index: isBelow ? itemIndex + 1 : itemIndex,
                              };
                            }}
                          >
                            {board.renderItem(item, itemIndex)}
                          </div>
                        );
                      }}
                      columnKey={board.key}
                      config={{ handle: false }}
                      onChange={handleColumnReorder(board.key)}
                    />
                  )}

                  {loading && board.items.length > 0 && (
                    <div className="loading-more" aria-label={t("KanbanBoard.Column.Loading")}>
                      <span className="spinner" />
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
        </div>
      </div>
    </>
  );
};

export default KanbanBoard;
