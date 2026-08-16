"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../../../assets/css/components/charts/gantt/styles.css";
import Pagination from "../../navigation/pagination";
import IProps, { Task } from "./IProps";
import { useTranslation } from "@harjs/translation";
import ITableLocale from "../../../libs/core/application/locales/table/ITableLocale";
import TableTR from "../../../libs/core/application/locales/table/tr";
import TableEN from "../../../libs/core/application/locales/table/en";

const colors = ["var(--purple-500)", "var(--green-500)", "var(--red-500)", "var(--orange-500)"];

const Gantt: React.FC<IProps> = ({ title, description, data, pagination, config = { isSearchable: false } }) => {
  // refs
  const _svg = useRef<SVGSVGElement>(null);
  const _mapIsMoveField = useRef<SVGRectElement>(null);
  const _timeGroupRef = useRef<SVGGElement>(null); // Sürükleme sırasında transform'u doğrudan DOM üzerinden güncellemek için
  const _scrollX = useRef<number>(0);
  const _isPressedCtrl = useRef<boolean>(false);
  const _rafId = useRef<number | null>(null); // Sürükleme sırasındaki state güncellemelerini kareye göre sınırlamak için

  // states
  const [startX, setStartX] = useState<number>(0);
  const [scrollX, setScrollX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1); // 1 = %100, 1.5 = %150 zoom
  const [containerWidth, setContainerWidth] = useState<number>(0); // Görünür gün aralığını (virtualization) hesaplamak için
  // states -> Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedPerPage, setSelectedPerPage] = useState<number>(pagination?.perPage ?? 10);
  // states -> Mobil
  const [isMobile, setIsMobile] = useState(false);

  // variables
  const getData = useMemo(() => {
    let _data: Task[] = [...data];

    if (pagination && !config.isServerSide) {
      const indexOfLastRow = currentPage * selectedPerPage;
      const indexOfFirstRow = indexOfLastRow - selectedPerPage;

      _data = _data.slice(indexOfFirstRow, indexOfLastRow);
    }

    return _data;
  }, [data, currentPage, selectedPerPage, config.isServerSide]);

  const DAY_WIDTH = 60 * zoom;
  const TIMELINE = useMemo(() => generateGanttTimeline(data), [data]);

  const HEADER_HEIGHT = 75;
  const STROKE_WIDTH = 0.5;
  const ROW_HEIGHT = 45;

  const LABEL_WIDTH = useMemo(() => {
    const longestName = getData.reduce(
      (maxTask, currentTask) => (currentTask.name.length > maxTask.name.length ? currentTask : maxTask), // Corrected logic
      {
        name: "",
      },
    ).name;
    const estimatedWidth = longestName.length * 7 + 25;

    return Math.min(Math.max(estimatedWidth, 120), 250);
  }, [getData]);

  const SVG_WIDTH = "100%";
  const SVG_HEIGHT = HEADER_HEIGHT + getData.length * ROW_HEIGHT + ROW_HEIGHT * 2;

  // Üst satırdaki ay etiketlerini (Pazar/ay sonu bazlı segmentler) sadece TIMELINE.days veya
  // DAY_WIDTH değiştiğinde bir kez hesaplıyoruz. Önceden bu hesap her render'da (örn. her
  // sürükleme pikselinde) tekrar yapılıyordu; mantık aynı, sadece artık memoize edilmiş durumda.
  const weekMonthLabels = useMemo(() => {
    const labels: Array<{ key: string; xPos: number; labelX: number; label: string }> = [];
    let prevMatchMonth = 0;
    let prevMatchDay = 0;

    TIMELINE.days.forEach((day, index) => {
      const xPos = (index + 1) * DAY_WIDTH;
      const nextDay = new Date(day.date);
      nextDay.setDate(nextDay.getDate() + 1);
      const isLastDayOfMonth = day.date.getMonth() !== nextDay.getMonth();
      const isSunday = day.date.getDay() === 0;

      if (!isSunday && !isLastDayOfMonth) return;

      const currentMonthNum = day.date.getMonth();
      const currentDayNum = day.date.getDate();

      if (index === 0) {
        prevMatchMonth = 0;
        prevMatchDay = 0;
      }

      const dayDiff = currentDayNum - (currentMonthNum !== prevMatchMonth ? 0 : prevMatchDay);
      prevMatchMonth = currentMonthNum;
      prevMatchDay = currentDayNum;

      labels.push({
        key: String(index),
        xPos,
        labelX: xPos - (dayDiff * DAY_WIDTH) / 2,
        label: day.date.toLocaleDateString("tr-TR", { month: "long" }),
      });
    });

    return labels;
  }, [TIMELINE.days, DAY_WIDTH]);

  // Görev çubuklarının (x, y, width, height) hesaplamalarını memoize ediyoruz. Bu hesap
  // scrollX'e bağlı DEĞİL; ama önceden JSX içinde inline yapıldığı için scrollX her
  // değiştiğinde (yani her sürükleme karesinde) gereksiz yere tekrar hesaplanıyordu.
  const taskBars = useMemo(() => {
    const timelineStartMs = TIMELINE.timelineStart?.getTime() ?? 0;
    const barHeight = ROW_HEIGHT / 1.5;

    return getData.map((task, index) => {
      const taskStart = new Date(task.start);
      const taskEnd = new Date(task.end);

      const diffMsFromStart = taskStart.getTime() - timelineStartMs;
      const hoursFromStart = diffMsFromStart / (1000 * 60 * 60);
      const x = hoursFromStart * (DAY_WIDTH / 24);

      const durationHours = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60);
      const width = durationHours * (DAY_WIDTH / 24);

      const y = index * ROW_HEIGHT + barHeight / 4;

      return {
        id: task.id,
        name: task.name,
        x,
        y,
        width,
        height: barHeight,
        color: colors[index % colors.length],
      };
    });
  }, [getData, DAY_WIDTH, TIMELINE.timelineStart, ROW_HEIGHT]);

  // Sadece görünür alan (+ tampon) içindeki günleri render etmek için aralık hesaplıyoruz.
  // Bu, uzun tarih aralıklarında (örn. 1-2 yıllık proje) binlerce yerine onlarca SVG node'u
  // oluşturulmasını sağlayan asıl performans iyileştirmesi (virtualization).
  const visibleDayRange = useMemo(() => {
    const totalDays = TIMELINE.days.length;
    if (!containerWidth || totalDays === 0) {
      return { start: 0, end: Math.max(totalDays - 1, 0) };
    }

    const BUFFER_DAYS = 5;
    const availableWidth = containerWidth - LABEL_WIDTH;

    const firstVisibleIndex = Math.floor(scrollX / DAY_WIDTH) - BUFFER_DAYS;
    const lastVisibleIndex = Math.ceil((scrollX + availableWidth) / DAY_WIDTH) + BUFFER_DAYS;

    return {
      start: Math.max(0, firstVisibleIndex),
      end: Math.min(totalDays - 1, lastVisibleIndex),
    };
  }, [scrollX, DAY_WIDTH, containerWidth, LABEL_WIDTH, TIMELINE.days.length]);

  // hooks
  const { t } = useTranslation<ITableLocale>(String(config?.locale ?? "tr"), {
    tr: { ...TableTR },
    en: { ...TableEN },
  });

  // methods
  const handleResize = useCallback(() => {
    return (_: UIEvent) => {
      setIsMobile(window.innerWidth <= 768);
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;

    setIsDragging(true);
    setStartX(e.clientX + _scrollX.current);
  }, []);

  const handleKeyboardDown = useCallback((event: KeyboardEvent) => {
    if (["Control", "Meta"].includes(event.key)) {
      event.preventDefault();
      _isPressedCtrl.current = true;
    }
  }, []);

  const handleKeyboardUp = useCallback((event: KeyboardEvent) => {
    if (["Control", "Meta"].includes(event.key)) {
      event.preventDefault();
      _isPressedCtrl.current = false;
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isDragging) return;

      let newScrollX = startX - e.clientX;

      if (newScrollX < 0) newScrollX = 0;

      // Ekrana sığan alanı çıkarırken doğru clientWidth kontrolü
      const availableWidth = (_svg.current?.clientWidth ?? 0) - LABEL_WIDTH;
      const maxScrollWidth = TIMELINE.days.length * DAY_WIDTH - availableWidth;

      if (newScrollX > maxScrollWidth) newScrollX = maxScrollWidth;

      // Eğer içerik zaten ekrana sığıyorsa scrollX 0 olmalı
      if (maxScrollWidth <= 0) newScrollX = 0;

      _scrollX.current = newScrollX;

      // PERFORMANS: React state güncellemesini (ve dolayısıyla tüm re-render'ı) beklemeden
      // transform'u doğrudan DOM'a yazıyoruz. Böylece mousemove olayı React'in render
      // hızından çok daha sık tetiklense bile sürükleme her zaman akıcı kalır.
      if (_timeGroupRef.current) {
        _timeGroupRef.current.setAttribute("transform", `translate(${LABEL_WIDTH - newScrollX}, 0)`);
      }

      // React state'ini (görünür gün aralığını yeniden hesaplamak için gerekli) en fazla
      // animasyon karesi başına bir kez güncelliyoruz; her piksel için değil.
      if (_rafId.current === null) {
        _rafId.current = requestAnimationFrame(() => {
          setScrollX(_scrollX.current);
          _rafId.current = null;
        });
      }
    },
    [startX, isDragging, TIMELINE.days.length, DAY_WIDTH, LABEL_WIDTH],
  );

  const handleMouseUpOrLeave = useCallback(() => {
    // Bekleyen bir animasyon karesi varsa iptal edip son konumu senkron şekilde uyguluyoruz.
    if (_rafId.current !== null) {
      cancelAnimationFrame(_rafId.current);
      _rafId.current = null;
    }

    const svgElement = _svg.current;

    if (svgElement) {
      const chartContentWidth = TIMELINE.days.length * DAY_WIDTH;
      const viewportWidth = svgElement.clientWidth;
      const availableChartWidth = viewportWidth - LABEL_WIDTH;

      let finalScrollX = _scrollX.current;

      if (chartContentWidth > availableChartWidth) {
        const maxScrollX = chartContentWidth - availableChartWidth;
        if (finalScrollX > maxScrollX) finalScrollX = maxScrollX;
      } else {
        finalScrollX = 0;
      }

      _scrollX.current = finalScrollX;
      setScrollX(finalScrollX);
    }

    setIsDragging(false);
    // Not: Orijinal kodda DAY_WIDTH bağımlılık dizisinden eksikti (stale closure riski
    // oluşturuyordu, zoom değiştikten hemen sonra ilk mouse-up yanlış genişlikle hesaplanabilirdi).
  }, [TIMELINE.days.length, DAY_WIDTH, LABEL_WIDTH]);

  const handleWheel = useCallback(
    (event: React.WheelEvent<SVGGElement>) => {
      if (!_isPressedCtrl.current) return;

      // 1. Mevcut toplam genişliği hesapla. (eski zoom ile)
      const currentTotalWidth = TIMELINE.days.length * DAY_WIDTH;
      const availableWidth = (_svg.current?.clientWidth ?? 0) - LABEL_WIDTH;

      // 2. Şu anki kaydırma oranını bul. (0 ile 1 arasında bir değer)
      const currentScrollRatio =
        currentTotalWidth > availableWidth ? scrollX / (currentTotalWidth - availableWidth) : 0;

      // 3. Yeni zoom değerini hesapla.
      const nextZoom = event.deltaY < 0 ? Math.min(zoom + 0.5, 5) : Math.max(zoom - 0.5, 1);

      if (nextZoom === zoom) return;

      // 4. Yeni zoom'a göre yeni DAY_WIDTH ve yeni toplam genişliği hesapla.
      const nextDayWidth = 60 * nextZoom;
      const nextTotalWidth = TIMELINE.days.length * nextDayWidth;

      // 5. Yeni maksimum kaydırma genişliğini bul ve eski orana göre scrollX'i güncelle.
      const nextMaxScrollWidth = nextTotalWidth - availableWidth;
      const nextScrollX = Math.max(0, nextMaxScrollWidth * currentScrollRatio);

      setZoom(nextZoom);
      setScrollX(nextScrollX);
      _scrollX.current = nextScrollX;
    },
    [zoom, scrollX, TIMELINE.days.length, DAY_WIDTH, LABEL_WIDTH],
  );

  // useEffects
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);

    window.addEventListener("resize", handleResize);
    // Keyboard Events
    window.addEventListener("keydown", handleKeyboardDown);
    window.addEventListener("keyup", handleKeyboardUp);

    return () => {
      window.removeEventListener("resize", handleResize);
      // Keyboard Events
      window.removeEventListener("keydown", handleKeyboardDown);
      window.removeEventListener("keyup", handleKeyboardUp);
    };
  }, [handleResize]);

  // Görünür gün aralığını (virtualization) doğru hesaplayabilmek için gerçek konteyner
  // genişliğini izliyoruz. window.innerWidth yerine ResizeObserver kullanmak, sidebar
  // açılıp kapandığında vb. durumlarda da doğru sonuç verir.
  useEffect(() => {
    const svgElement = _svg.current;
    if (!svgElement || typeof ResizeObserver === "undefined") return;

    const updateWidth = () => setContainerWidth(svgElement.clientWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(svgElement);

    return () => observer.disconnect();
  }, []);

  // Bileşen unmount olduğunda bekleyen bir animasyon karesi varsa iptal et.
  useEffect(() => {
    return () => {
      if (_rafId.current !== null) cancelAnimationFrame(_rafId.current);
    };
  }, []);

  return (
    <div className="ar-gantt-chart">
      <svg
        ref={_svg}
        xmlns="http://www.w3.org/2000/svg"
        // viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        className="ar-gantt-chart-svg"
      >
        <defs>
          <pattern id="weekend-stripes" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="rgba(0, 0, 0, 0.03)" />
            <line x1="0" y1="8" x2="8" y2="0" opacity={0.25} stroke="var(--red-500)" strokeWidth={0.5} />
          </pattern>
        </defs>

        {/* :Begin: Header */}
        <g className="header" width={"100%"}>
          {/* Background */}
          <rect x={0} y={0} width={"100%"} height={HEADER_HEIGHT} />

          <g transform={`translate(25, ${HEADER_HEIGHT / 2})`} className="title-group">
            <text className="title">{title}</text>

            <text y={20} className="title-description">
              {description}
            </text>
          </g>

          <line
            x1="0"
            y1={HEADER_HEIGHT}
            x2={"100%"}
            y2={HEADER_HEIGHT}
            opacity={0.25}
            stroke="var(--black-alpha-100)"
            strokeWidth={1}
          />
        </g>
        {/* :END: Header */}

        {/* :Begin: Body */}
        <g className="body" transform={`translate(0, ${HEADER_HEIGHT + ROW_HEIGHT * 2})`}>
          {/* :Begin: Time Axis & Bars */}
          <g
            ref={_timeGroupRef}
            className={`${isDragging ? "dragging" : "no-dragging"} time-and-bars`}
            transform={`translate(${LABEL_WIDTH - scrollX}, 0)`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onWheel={handleWheel}
            style={{
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
            }}
          >
            {/* :Begin: Months & Days */}
            <g id="month-and-days">
              {/* PERFORMANS: Ay etiketleri önceden hesaplanmış (weekMonthLabels), burada sadece
                  görünür aralık (+ tampon) içinde kalanlar filtrelenip render ediliyor. */}
              {weekMonthLabels
                .filter(
                  (label) =>
                    label.xPos >= visibleDayRange.start * DAY_WIDTH &&
                    label.xPos <= (visibleDayRange.end + 2) * DAY_WIDTH,
                )
                .map((label) => (
                  <g key={label.key}>
                    <line
                      x1={label.xPos}
                      y1={-ROW_HEIGHT * 2}
                      x2={label.xPos}
                      y2={0}
                      opacity={0.15}
                      stroke="var(--black-alpha-100)"
                      strokeWidth={STROKE_WIDTH}
                    />

                    <text
                      x={label.labelX}
                      y={-ROW_HEIGHT * 2 + ROW_HEIGHT / 2}
                      fill="var(--black-alpha-100)"
                      fontSize="12"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {label.label}
                    </text>
                  </g>
                ))}

              {/* PERFORMANS: Gün numaraları, hafta sonu şeritleri ve dikey grid çizgileri
                  sadece görünür aralık (+ tampon) için render ediliyor (virtualization). Bu
                  döngünün önceki bir günün durumuna bağımlılığı olmadığından dilimlemek
                  (slice) davranışı değiştirmeden güvenle yapılabiliyor. */}
              {TIMELINE.days.slice(visibleDayRange.start, visibleDayRange.end + 1).map((day, i) => {
                const index = visibleDayRange.start + i;
                const xPos = (index + 1) * DAY_WIDTH; // 01:00 -> 60px, 02:00 -> 120px...

                return (
                  <g key={index}>
                    <text
                      x={xPos - 30}
                      y={-ROW_HEIGHT + ROW_HEIGHT / 2}
                      fill={day.isWeekend ? "var(--red-500)" : "var(--black-alpha-100)"}
                      fontSize="12"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {String(day.number).padStart(2, "0")} {day.name}
                    </text>

                    {day.isWeekend && (
                      <rect
                        x={xPos - DAY_WIDTH}
                        y={0}
                        width={DAY_WIDTH}
                        height={SVG_HEIGHT}
                        fill="url(#weekend-stripes)"
                      />
                    )}

                    <line
                      x1={xPos}
                      y1={0}
                      x2={xPos}
                      y2={SVG_HEIGHT}
                      opacity={0.25}
                      stroke="var(--black-alpha-100)"
                      strokeWidth={STROKE_WIDTH}
                      strokeDasharray={"5,5"}
                    />
                  </g>
                );
              })}

              <line
                x1={0}
                y1={-ROW_HEIGHT}
                x2={TIMELINE.days.length * DAY_WIDTH}
                y2={-ROW_HEIGHT}
                opacity={0.15}
                stroke="var(--black-alpha-100)"
                strokeWidth={STROKE_WIDTH}
              />

              <line
                x1={0}
                y1={0}
                x2={TIMELINE.days.length * DAY_WIDTH}
                y2={0}
                opacity={0.15}
                stroke="var(--black-alpha-100)"
                strokeWidth={STROKE_WIDTH}
              />
            </g>
            {/* :End: Months & Days */}

            {/* :Begin: Map */}
            <g transform={`translate(0, 0)`}>
              {/* PERFORMANS: Pozisyonlar artık taskBars memo'sunda önceden hesaplanmış durumda;
                  scrollX değiştiğinde (sürükleme sırasında) yeniden hesaplanmıyor. */}
              {taskBars.map((bar) => (
                <g key={bar.id}>
                  <rect x={bar.x} y={bar.y} width={bar.width} height={bar.height} fill={bar.color} rx={3} />

                  {/* Yazının taşmaması kontrolünü de DAY_WIDTH yerine dinamik yazı boyutuna veya width'e göre yapıyoruz */}
                  {bar.width > 60 && (
                    <text
                      x={bar.x + bar.width / 2}
                      y={bar.y + bar.height / 2 + 4}
                      fontSize={12}
                      fontWeight="600"
                      fill="var(--black-alpha-100)"
                      textAnchor="middle"
                    >
                      {bar.name}
                    </text>
                  )}
                </g>
              ))}
            </g>
            {/* :End: Map */}

            <rect
              ref={_mapIsMoveField}
              x={0}
              y={-ROW_HEIGHT}
              width={TIMELINE.days.length * DAY_WIDTH}
              height={SVG_HEIGHT}
              fill="transparent"
              pointerEvents="all"
            />
          </g>
          {/* :End: Time Axis & Bars */}

          {/* :Begin:Left Label Axis */}
          <g className="left-axis">
            {/* Background */}
            <rect
              x={0}
              y={-ROW_HEIGHT * 2 + 0.5}
              width={LABEL_WIDTH}
              height={SVG_HEIGHT}
              fill="var(--white-alpha-100)"
            />

            <line
              x1={LABEL_WIDTH}
              y1={-ROW_HEIGHT * 2}
              x2={LABEL_WIDTH}
              y2={SVG_HEIGHT}
              opacity={0.25}
              stroke="var(--black-alpha-100)"
              strokeWidth={1}
            />

            <g className="label-list">
              {getData.map((item, index) => {
                const y = index * ROW_HEIGHT;
                const textContent = item.name;
                const maxTextWidth = LABEL_WIDTH - 20;

                return (
                  <g key={item.id} className="label-row">
                    <text x="10" y={y + ROW_HEIGHT / 2} className="label-text">
                      {textContent.length * 7 > maxTextWidth
                        ? `${textContent.substring(0, Math.floor(maxTextWidth / 7) - 3)}...`
                        : textContent}
                    </text>

                    <line
                      x1={0}
                      y1={y + ROW_HEIGHT}
                      x2={LABEL_WIDTH}
                      y2={y + ROW_HEIGHT}
                      opacity={0.15}
                      stroke="var(--black-alpha-100)"
                      strokeWidth="0.5"
                    ></line>

                    <line
                      x1={LABEL_WIDTH}
                      y1={y + ROW_HEIGHT}
                      x2={LABEL_WIDTH + TIMELINE.days.length * DAY_WIDTH}
                      y2={y + ROW_HEIGHT}
                      opacity={0.25}
                      stroke="var(--black-alpha-100)"
                      strokeWidth={STROKE_WIDTH}
                      strokeDasharray={"5,5"}
                    />
                  </g>
                );
              })}
            </g>
          </g>
          {/* :End:Left Label Axis */}
        </g>
        {/* :End: Body */}
      </svg>

      <div className="footer">
        <span>
          {isMobile ? (
            <>
              <strong>
                {(currentPage - 1) * selectedPerPage + 1} -{" "}
                {Math.min(currentPage * selectedPerPage, pagination?.totalRecords || data.length)} of{" "}
                {pagination?.totalRecords || data.length}
              </strong>
            </>
          ) : (
            t(
              "Table.Pagination.Information.Text",
              (currentPage - 1) * selectedPerPage + 1,
              Math.min(currentPage * selectedPerPage, pagination?.totalRecords || data.length),
              pagination?.totalRecords || data.length,
            )
          )}
        </span>

        {pagination && (
          <Pagination
            totalRecords={config.isServerSide ? pagination.totalRecords : (data.length ?? 0)}
            currentPage={currentPage}
            perPage={selectedPerPage}
            locale={config.locale}
            showTotal={false}
            onChange={(currentPage, perPage) => {
              setCurrentPage(currentPage);
              setSelectedPerPage(perPage);
              pagination.onChange?.(currentPage, perPage);
            }}
          />
        )}
      </div>
    </div>
  );
};

const generateGanttTimeline = (data: Task[]) => {
  if (!data || data.length === 0) {
    return { minDate: null, maxDate: null, months: [], days: [] };
  }

  // 1. En erken başlangıç ve en geç bitiş tarihlerini buluyoruz.
  let minDate = new Date(data[0].start);
  let maxDate = new Date(data[0].end);

  data.forEach((task) => {
    const start = new Date(task.start);
    const end = new Date(task.end);
    if (start < minDate) minDate = start;
    if (end > maxDate) maxDate = end;
  });

  // Şemanın düzgün görünmesi için başlangıcı o ayın 1'ine,
  // bitişi ise o ayın son gününe yuvarlamak yerleşim açısından daha iyi sonuç verir.
  const startTimeline = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const endTimeline = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0); // Ayın son günü

  const months: Array<{
    year: number;
    number: number;
    name: string;
    totalDays: number;
  }> = [];
  const days: Array<{
    date: Date;
    number: number;
    name: string;
    isWeekend: boolean;
  }> = [];

  // 2. Günleri ve Ayları döngüyle oluşturuyoruz.
  const current = new Date(startTimeline);

  while (current <= endTimeline) {
    // Gün listesini doldur.
    const dayOfWeek = current.getDay();
    days.push({
      date: new Date(current),
      number: current.getDate(),
      name: current.toLocaleDateString("tr-TR", { weekday: "short" }), // Pzt, Sal...
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6, // Hafta sonu kontrolü (Gantt'ta boyamak için).
    });

    // Ay listesini doldur. (Eğer listede bu ay henüz yoksa ekle)
    const year = current.getFullYear();
    const number = current.getMonth();
    const name = current.toLocaleDateString("tr-TR", { month: "long" }); // Ocak, Şubat...

    const monthExists = months.some((m) => m.year === year && m.number === number);
    if (!monthExists) {
      // O ayın toplam gün sayısını bulalım.
      const totalDays = new Date(year, number + 1, 0).getDate();
      months.push({ year, number, name, totalDays });
    }

    // Bir sonraki güne geç.
    current.setDate(current.getDate() + 1);
  }

  return {
    timelineStart: startTimeline,
    timelineEnd: endTimeline,
    months, // Üst zaman bandı için (Örn: Ocak, Şubat)
    days, // Alt zaman bandı için (Örn: 1, 2, 3... veya haftalık kırılım için)
  };
};

// Üst bileşen gereksiz yere re-render olduğunda (örn. parent state değişiminde) props aynı
// kalıyorsa Gantt'ın da yeniden render olmasını engelliyoruz.
export default React.memo(Gantt);
