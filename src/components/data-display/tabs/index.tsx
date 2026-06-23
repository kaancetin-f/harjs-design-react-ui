"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import IProps from "./IProps";
import "../../../assets/css/components/data-display/tabs/tabs.css";
import Skeleton from "./skeleton";
import { ARIcon } from "../../icons";

const Tabs: React.FC<IProps> = ({ name, tabs = [], activeTab, onChange, onClose }) => {
  // ref
  const _container = useRef<HTMLDivElement>(null);
  const _items = useRef<(HTMLDivElement | null)[]>([]);
  const _itemIndex = useRef<number>(0);

  // states
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [scrollInfo, setScrollInfo] = useState({
    isMaxLeft: true,
    isMaxRight: false,
    current: 0,
    maxScrollable: 0,
  });
  // states -> Loading
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // methods
  const handleScroll = useMemo(() => {
    return () => {
      if (_container.current) {
        const { scrollLeft, scrollWidth, clientWidth } = _container.current;

        // Maksimum sağ değer: Toplam genişlik - Görünür genişlik
        const maxRight = scrollWidth - clientWidth;

        setScrollInfo({
          isMaxLeft: scrollLeft <= 0, // En solda mı?
          isMaxRight: scrollLeft >= maxRight - 1, // En sağda mı?
          current: scrollLeft, // Anlık ne kadar sağda.
          maxScrollable: maxRight, // Gidebileceği max piksel.
        });
      }
    };
  }, []);

  const scroll = useMemo(() => {
    return (direction: "left" | "right") => {
      const container = _container.current;

      if (!container) return;

      let nextIndex = direction === "left" ? _itemIndex.current - 1 : _itemIndex.current + 1;

      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= _items.current.length) nextIndex = _items.current.length - 1;

      const targetItem = _items.current[nextIndex];

      if (targetItem) {
        const targetLeft = targetItem.offsetLeft - container.offsetLeft;

        container.scrollTo({
          left: targetLeft,
          behavior: "smooth",
        });

        _itemIndex.current = nextIndex;
      }
    };
  }, []);

  // useEffects
  useEffect(() => setCurrentTab(activeTab ?? 0), [activeTab]);

  useEffect(() => {
    const key = `${window.location.pathname}::${name}`;
    const stored = sessionStorage.getItem(key);

    setCurrentTab(stored !== null ? Number(stored) : 0);
    onChange?.(stored !== null ? Number(stored) : 0);

    setIsLoading(false);
  }, [name]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (_container.current) {
        handleScroll();
      }
    }, 100);

    window.addEventListener("resize", handleScroll);

    return () => {
      clearTimeout(timeoutId);

      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  if (isLoading) return <Skeleton name={name} tabs={tabs} />;

  return (
    <div className="ar-tabs">
      <div className="tabs">
        {scrollInfo.current > 0 && (
          <div className="button left" onClick={() => scroll("left")}>
            <ARIcon icon={"ArrowLeft"} stroke="var(--gray-700)" />
          </div>
        )}

        {!scrollInfo.isMaxRight && (
          <div className="button right" onClick={() => scroll("right")}>
            <ARIcon icon={"ArrowRight"} stroke="var(--gray-700)" />
          </div>
        )}

        <div ref={_container} className="container" onScroll={handleScroll}>
          {tabs.length > 0 &&
            tabs.map((tab, index) => {
              let className: string[] = ["item"];

              if (currentTab === index) className.push("selection");

              return (
                <div
                  key={tab.title ?? index}
                  ref={(element) => {
                    if (!element) return;

                    _items.current[index] = element;
                  }}
                  className={className.map((c) => c).join(" ")}
                  onClick={() => {
                    setCurrentTab(index);
                    onChange?.(index);

                    const key = `${window.location.pathname}::${name}`;
                    sessionStorage.setItem(key, String(index));
                  }}
                >
                  <span>{tab.title}</span>

                  {tab.config?.canBeClosed && (
                    <span
                      className="close-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onClose && onClose(index);
                      }}
                    >
                      ✖
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      <div className="content">{tabs.map((tab, index) => currentTab === index && tab.content)}</div>
    </div>
  );
};

export default Tabs;
