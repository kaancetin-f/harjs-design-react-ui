import React, { useEffect, useMemo, useRef, useState } from "react";
import { CalendarEvent } from "../IProps";
import ReactDOM from "react-dom";

interface IProps<T> {
  trackedBy: keyof (T & CalendarEvent);
  data: (T & CalendarEvent)[];
  renderItem: (item: T, index: number) => React.JSX.Element;
  states: {
    currentDate: {
      get: Date;
      set: React.Dispatch<React.SetStateAction<Date>>;
    };
  };
  config?: {
    locale?: Intl.LocalesArgument;
    weekStartsOn?: number;
  };
}

type PositionedEvent<T> = {
  event: T & CalendarEvent;
  originalIndex: number;
  layout: {
    top: number;
    height: number;
    column: number;
    totalColumns: number;
  };
};

const Week = function <T>({ trackedBy, data, renderItem, states, config }: IProps<T>) {
  // states
  const [activeTooltip, setActiveTooltip] = useState<{ id: number; content: React.JSX.Element } | null>(null);

  // refs
  // Tooltip pozisyonu artık state yerine ref + doğrudan DOM güncellemesiyle yönetiliyor.
  // Böylece fare hareket ettikçe tüm Week bileşeni (grid + event hesaplamaları) yeniden render edilmiyor,
  // sadece tooltip'in kendi stil özellikleri güncelleniyor.
  const tooltipRef = useRef<HTMLDivElement>(null);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  // variables
  const startHour = 0;
  const endHour = 24;
  const hours = endHour - startHour;

  // methods
  const weekDays = useMemo(
    () => getWeekDays(states.currentDate.get, config?.weekStartsOn ?? 1),
    [states.currentDate.get, config?.weekStartsOn],
  );

  // Her günün etkinlik yerleşimi artık sadece data/hafta değiştiğinde hesaplanıyor,
  // hover veya tooltip render'larında tekrar hesaplanmıyor.
  const eventsByDay = useMemo(
    () =>
      weekDays.map((day) => {
        const dayStart = new Date(day).setHours(0, 0, 0, 0);
        const dayEnd = new Date(day).setHours(23, 59, 59, 999);

        // 1. Bu güne ait etkinlikleri filtrele ve sırala.
        const dayEvents = data
          .filter((event) => event.start.getTime() <= dayEnd && event.end.getTime() >= dayStart)
          .sort((a, b) => a.start.getTime() - b.start.getTime());

        // 2. Çakışmaları hesapla (Görsel yerleşim için kritik adım).
        return computeEventLayout(dayEvents, dayStart, dayEnd);
      }),
    [data, weekDays],
  );

  // useEffects
  const positionTooltip = (x: number, y: number) => {
    const node = tooltipRef.current;
    if (!node) return;

    const isRightHalf = x > window.innerWidth / 2;
    const isBottomHalf = y > window.innerHeight / 2;

    node.style.top = `${y}px`;
    node.style.left = `${x}px`;
    node.style.transform = `translate(${isRightHalf ? "-110%" : "10%"}, ${isBottomHalf ? "-110%" : "10%"})`;
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      lastMousePosition.current = { x: event.clientX, y: event.clientY };
      positionTooltip(event.clientX, event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Tooltip yeni açıldığında, son bilinen fare konumunu hemen uygula (ilk karede 0,0'a "zıplamayı" önler).
  useEffect(() => {
    if (activeTooltip) {
      positionTooltip(lastMousePosition.current.x, lastMousePosition.current.y);
    }
  }, [activeTooltip]);

  return (
    <>
      <div className="ar-calendar-week-view">
        <div className="head">
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="item" role="columnheader">
              <span className="day-name">
                {day.toLocaleString(config?.locale ?? "tr", { weekday: "short" }).toUpperCase()}
              </span>
              <span className="date">{day.getDate()}</span>
            </div>
          ))}
        </div>

        <div className="body">
          <div className="clocks">
            {Array.from({ length: hours }, (_, index) => (
              <div key={index}>
                <span>{String(startHour + index).padStart(2, "0")}:00</span>
              </div>
            ))}
          </div>

          <div role="grid" className="grid">
            {Array.from({ length: hours }).map((_, rowIndex) => (
              <div key={rowIndex} className="row" role="row">
                {weekDays.map((_, colIndex) => (
                  <div key={colIndex} className="cell" role="gridcell" />
                ))}
              </div>
            ))}
          </div>

          <div className="events-layer">
            {eventsByDay.map((positionedEvents, dayIndex) =>
              positionedEvents.map(({ event, layout, originalIndex }: PositionedEvent<T>) => {
                const uniqueValue = event[trackedBy];
                const eventColor = getColor(uniqueValue as string | number);

                return (
                  <div
                    key={`${originalIndex}-${dayIndex}`}
                    onMouseEnter={() =>
                      setActiveTooltip({ content: renderItem(event, originalIndex), id: originalIndex })
                    }
                    onMouseLeave={() => setActiveTooltip(null)}
                    className="event-box"
                    style={{
                      backgroundColor: eventColor.bg,
                      position: "absolute",
                      top: `${layout.top}px`,
                      height: `${layout.height}px`,
                      // Dinamik genişlik ve sol mesafe hesaplama.
                      left: `calc(${(100 / 7) * dayIndex}% + ${(layout.column * (100 / 7)) / layout.totalColumns}%)`,
                      width: `${100 / 7 / layout.totalColumns}%`,
                      border: `1px solid ${eventColor.border}`,
                      borderRadius: "var(--radius-4)",
                      zIndex: 10,
                    }}
                  >
                    {layout.height > 20 && renderItem(event, originalIndex)}
                  </div>
                );
              }),
            )}
          </div>
        </div>
      </div>

      {activeTooltip &&
        ReactDOM.createPortal(
          <div ref={tooltipRef} className="ar-calendar-tooltip">
            {activeTooltip.content}
          </div>,
          document.body,
        )}
    </>
  );
};

/**
 * Etkinliklerin çakışma durumuna göre konumlarını hesaplayan yardımcı fonksiyon
 */
function computeEventLayout<T>(events: (T & CalendarEvent)[], dayStart: number, dayEnd: number): PositionedEvent<T>[] {
  const cellHeight = 60;
  const results: PositionedEvent<T>[] = [];

  type ClusterItem = { event: T & CalendarEvent; idx: number; start: number; end: number };

  // Gruplandırma (Aynı anda çakışan etkinlik kümeleri)
  const clusters: ClusterItem[][] = [];
  let lastEventEnd = 0;

  events.forEach((event, idx) => {
    const start = Math.max(event.start.getTime(), dayStart);
    const end = Math.min(event.end.getTime(), dayEnd);

    if (start >= lastEventEnd) {
      clusters.push([]); // Yeni bir küme başlat
    }

    const lastCluster = clusters[clusters.length - 1];
    lastCluster.push({ event, idx, start, end });
    lastEventEnd = Math.max(lastEventEnd, end);
  });

  // Her küme içindeki kolonları hesapla
  clusters.forEach((cluster) => {
    const columns: ClusterItem[][] = [];

    cluster.forEach((item) => {
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        // Eğer bu kolondaki son etkinlikle çakışmıyorsa buraya koy
        const lastInColumn = columns[i][columns[i].length - 1];
        if (item.start >= lastInColumn.end) {
          columns[i].push(item);
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([item]); // Yeni kolon aç
      }
    });

    // Sonuçları formatla
    cluster.forEach((item) => {
      const colIndex = columns.findIndex((col) => col.includes(item));
      const startMinutes = new Date(item.start).getHours() * 60 + new Date(item.start).getMinutes();
      const duration = (item.end - item.start) / 60000;

      results.push({
        event: item.event,
        originalIndex: item.idx,
        layout: {
          top: (startMinutes / 60) * cellHeight,
          height: (duration / 60) * cellHeight,
          column: colIndex,
          totalColumns: columns.length,
        },
      });
    });
  });

  return results;
}

const getWeekRange = (date: Date, weekStartsOn: number = 1) => {
  const current = new Date(date);
  const currentDay = current.getDay();
  const diff = (currentDay - weekStartsOn + 7) % 7;
  const start = new Date(current);
  start.setDate(current.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
};

const getWeekDays = (date: Date, weekStartsOn: number = 1) => {
  const { start } = getWeekRange(date, weekStartsOn);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

const getColor = (id: string | number) => {
  const colors = [
    { bg: "var(--blue-500)", border: "var(--blue-600)" }, // Mavi
    { bg: "var(--green-500)", border: "var(--green-600)" }, // Yeşil
    { bg: "var(--orange-500)", border: "var(--orange-600)" }, // Turuncu
    { bg: "var(--purple-500)", border: "var(--purple-600)" }, // Mor
    { bg: "var(--pink-500)", border: "var(--pink-600)" }, // Pembe
    { bg: "var(--cyan-500)", border: "var(--cyan-600)" }, // Turkuaz
  ];

  // Eğer id string ise karakter kodlarının toplamını alarak tutarlı bir index üretiriz
  let hash = 0;
  const identifier = String(id);
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash);
  return colors[index % colors.length];
};

export default Week;
