import React, { useEffect, useMemo, useState } from "react";
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

const Week = function <T>({ trackedBy, data, renderItem, states, config }: IProps<T>) {
  // states
  const [mouseCoordinate, setMouseCoordinate] = useState<{
    x: number;
    y: number;
    isRightHalf: boolean;
    isBottomHalf: boolean;
  }>({
    x: 0,
    y: 0,
    isRightHalf: false,
    isBottomHalf: false,
  });
  const [activeTooltip, setActiveTooltip] = useState<{ id: number; content: React.JSX.Element } | null>(null);

  // variables
  const startHour = 0;
  const endHour = 24;
  const hours = endHour - startHour;
  // const cellHeight = 60;

  // methods
  const weekDays = useMemo(
    () => getWeekDays(states.currentDate.get, config?.weekStartsOn ?? 1),
    [states.currentDate.get, config?.weekStartsOn],
  );

  // useEffects
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouseCoordinate({
        x: event.clientX,
        y: event.clientY,
        isRightHalf: event.clientX > window.innerWidth / 2,
        isBottomHalf: event.clientY > window.innerHeight / 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className="ar-calendar-week-view">
        <div className="head">
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="item">
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
              <div key={rowIndex} className="row">
                {weekDays.map((_, colIndex) => (
                  <div key={colIndex} className="cell" />
                ))}
              </div>
            ))}
          </div>

          <div className="events-layer">
            {weekDays.map((day, dayIndex) => {
              const dayStart = new Date(day).setHours(0, 0, 0, 0);
              const dayEnd = new Date(day).setHours(23, 59, 59, 999);

              // 1. Bu güne ait etkinlikleri filtrele ve sırala.
              const dayEvents = data
                .filter((event) => {
                  return event.start.getTime() <= dayEnd && event.end.getTime() >= dayStart;
                })
                .sort((a, b) => a.start.getTime() - b.start.getTime());

              // 2. Çakışmaları hesapla (Görsel yerleşim için kritik adım).
              const positionedEvents = computeEventLayout(dayEvents, dayStart, dayEnd);

              return positionedEvents.map(({ event, layout, originalIndex }) => {
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
                      borderRadius: "var(--border-radius-sm)",
                      zIndex: 10,
                    }}
                  >
                    {layout.height > 20 && renderItem(event, originalIndex)}
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>

      {activeTooltip &&
        ReactDOM.createPortal(
          <div
            className="ar-calendar-tooltip"
            style={{
              top: mouseCoordinate.y,
              left: mouseCoordinate.x,
              transform: `translate(${mouseCoordinate.isRightHalf ? "-110%" : "10%"}, ${mouseCoordinate.isBottomHalf ? "-110%" : "10%"})`,
            }}
          >
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
function computeEventLayout<T>(events: (T & CalendarEvent)[], dayStart: number, dayEnd: number) {
  const cellHeight = 60;
  const results: { event: any; originalIndex: number; layout: any }[] = [];

  // Gruplandırma (Aynı anda çakışan etkinlik kümeleri)
  let clusters: any[][] = [];
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
    const columns: any[][] = [];

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
    { bg: "#3174ad", border: "#2a6293" }, // Mavi
    { bg: "#4caf50", border: "#388e3c" }, // Yeşil
    { bg: "#ff9800", border: "#f57c00" }, // Turuncu
    { bg: "#9c27b0", border: "#7b1fa2" }, // Mor
    { bg: "#e91e63", border: "#c2185b" }, // Pembe
    { bg: "#00bcd4", border: "#0097a7" }, // Turkuaz
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
