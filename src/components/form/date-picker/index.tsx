"use client";

import React, { useEffect, useRef, useState } from "react";
import "../../../assets/css/components/form/date-picker/date-picker.css";
import Input from "../input";
import { Option } from "../../../libs/infrastructure/types";
import Button from "../button";
import Alert from "../../feedback/alert";
import Props from "./Props";
import ReactDOM from "react-dom";
import DATE from "./DATE";
import DatePickerTR from "../../../libs/core/application/locales/date-picker/tr";
import DatePickerEN from "../../../libs/core/application/locales/date-picker/en";
import IDatePickerLocale from "../../../libs/core/application/locales/date-picker/IDatePickerLocale";
import { useTranslation } from "@harjs/translation";

const DatePicker: React.FC<Props> = ({ variant, color, onChange, config, validation, ...attributes }) => {
  // refs
  const _arCalendar = useRef<HTMLDivElement>(null);
  const _arClock = useRef<HTMLDivElement>(null);
  const _placeholder = useRef<HTMLLabelElement>(null);
  const _calendarHeader = useRef<HTMLDivElement>(null);
  const _calendarFooter = useRef<HTMLDivElement>(null);
  const _clockHeader = useRef<HTMLDivElement>(null);
  const _clockFooter = useRef<HTMLDivElement>(null);
  const _currentDate = useRef<Date>(new Date()).current;
  const _beginDate = useRef<HTMLInputElement>(null);
  // refs -> Geçerli Tarih ve Saat Bilgileri.
  const _year = useRef<number>(_currentDate.getFullYear());
  const _month = useRef<number>(_currentDate.getMonth());
  const _day = useRef<number>(_currentDate.getDate());
  const _hours = useRef<number>(_currentDate.getHours());
  const _minutes = useRef<number>(_currentDate.getMinutes());
  // refs -> List Elements
  const _hoursListElement = useRef<HTMLUListElement>(null);
  const _hoursLiElements = useRef<(HTMLLIElement | null)[]>([]);
  const _minutesListElement = useRef<HTMLUListElement>(null);
  const _minutesLiElements = useRef<(HTMLLIElement | null)[]>([]);

  // states
  const [calendarIsOpen, setCalendarIsOpen] = useState<boolean>(false);
  const [calendarDays, setCalendarDays] = useState<React.ReactNode[]>([]);
  const [years, setYears] = useState<Option[]>([]);
  const [hours, setHours] = useState<React.ReactNode>();
  const [minutes, setMinutes] = useState<React.ReactNode>();
  const [dateChanged, setDateChanged] = useState<boolean>(false);
  const [timeChanged, setTimeChanged] = useState<boolean>(false);
  // states => Seçilmiş Tarihler
  const [selectedYear, setSelectedYear] = useState<number>(_currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(_currentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(_currentDate.getDate());
  const [selectedHours, setSelectedHours] = useState<number>(_currentDate.getHours());
  const [selectedMinutes, setSelectedMinutes] = useState<number>(_currentDate.getMinutes());

  const { t } = useTranslation<IDatePickerLocale>(String(config?.locale ?? "tr"), {
    tr: { ...DatePickerTR },
    en: { ...DatePickerEN },
  });
  const weekdays = [
    t("DatePicker.Mon"),
    t("DatePicker.Tue"),
    t("DatePicker.Wed"),
    t("DatePicker.Thu"),
    t("DatePicker.Fri"),
    t("DatePicker.Sat"),
    t("DatePicker.Sun"),
  ];
  const months = [
    { value: 0, text: t("DatePicker.January") },
    { value: 1, text: t("DatePicker.February") },
    { value: 2, text: t("DatePicker.March") },
    { value: 3, text: t("DatePicker.April") },
    { value: 4, text: t("DatePicker.May") },
    { value: 5, text: t("DatePicker.June") },
    { value: 6, text: t("DatePicker.July") },
    { value: 7, text: t("DatePicker.August") },
    { value: 8, text: t("DatePicker.September") },
    { value: 9, text: t("DatePicker.October") },
    { value: 10, text: t("DatePicker.November") },
    { value: 11, text: t("DatePicker.December") },
  ];

  // methods
  const handleClickOutSide = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (target === _beginDate.current) return;

    if (_arCalendar.current && !_arCalendar.current.contains(target)) closeCalendar();
  };

  const handleKeys = (event: KeyboardEvent) => {
    const key = event.key;

    if (key === "Escape") {
      event.stopPropagation();
      closeCalendar();
    }
  };

  const handlePosition = () => {
    if (_arCalendar.current && _beginDate.current) {
      const arCalendarRect = _arCalendar.current.getBoundingClientRect();
      const InpuRect = _beginDate.current?.getBoundingClientRect();

      if (InpuRect) {
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;
        const sx = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
        const sy = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
        const _isClock = InpuRect.left > screenCenterX ? -Math.abs(config?.isClock ? 7.5 * 16.75 : 0) : 0;

        _arCalendar.current.style.visibility = "visible";
        _arCalendar.current.style.opacity = "1";
        _arCalendar.current.style.top = `${
          (InpuRect.top > screenCenterY ? InpuRect.top - arCalendarRect.height : InpuRect.top + InpuRect.height) + sy
        }px`;
        _arCalendar.current.style.left = `${
          (InpuRect.left > screenCenterX ? InpuRect.right - arCalendarRect.width : InpuRect.left) + sx + _isClock
        }px`;
      }
    }
  };

  const handleHeight = () => {
    if (_arCalendar.current && _arClock.current) {
      const calendar = _arCalendar.current?.getBoundingClientRect()?.height;
      _arClock.current.style.maxHeight = `${calendar}px`;
    }

    if (_calendarHeader.current && _clockHeader.current) {
      const calendarHeaderH = _calendarHeader.current?.getBoundingClientRect()?.height;
      _clockHeader.current.style.minHeight = `${calendarHeaderH}px`;
    }

    if (_calendarFooter && _clockFooter.current) {
      const calendarFooterH = _calendarFooter.current?.getBoundingClientRect()?.height;
      _clockFooter.current.style.minHeight = `${calendarFooterH}px`;
    }
  };

  const handleOk = (isShutdownOn: boolean = true) => {
    // Stateler güncelleniyor...
    setSelectedYear(_year.current);
    setSelectedMonth(_month.current);
    setSelectedDay(_day.current);
    setSelectedHours(_hours.current);
    setSelectedMinutes(_minutes.current);

    const inputDate = new Date(
      Date.UTC(
        _year.current,
        _month.current,
        _day.current,
        !config?.isClock ? 0 : _hours.current,
        !config?.isClock ? 0 : _minutes.current,
        0,
      ),
    );

    onChange(inputDate.toISOString());
    isShutdownOn && setCalendarIsOpen(false);
  };

  const setNowButton = () => {
    const now = new Date();

    // Stateler güncelleniyor...
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth());
    setSelectedDay(now.getDate());
    setSelectedHours(now.getHours());
    setSelectedMinutes(now.getMinutes());

    _year.current = now.getFullYear();
    _month.current = now.getMonth();
    _day.current = now.getDate();
    _hours.current = now.getHours();
    _minutes.current = now.getMinutes();

    // Takvim kapatılıyor...
    setCalendarIsOpen(false);

    // Değer gönderiliyor...
    const inputDate = new Date(
      Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        !config?.isClock ? 0 : now.getHours(),
        !config?.isClock ? 0 : now.getMinutes(),
        0,
      ),
    );

    onChange(inputDate.toISOString());
  };

  const okayButton = () => {
    return (
      <Button variant="borderless" color="green" onClick={() => handleOk()}>
        {t("DatePicker.Button.Okay")}
      </Button>
    );
  };

  const closeCalendar = () => {
    const { year, month, day, hours, minutes } = DATE.Parse(String(attributes.value), config?.isClock);

    _year.current = attributes.value ? year : selectedYear;
    _month.current = attributes.value ? month - 1 : selectedMonth;
    _day.current = attributes.value ? day : selectedDay;
    _hours.current = attributes.value ? hours : selectedHours;
    _minutes.current = attributes.value ? minutes : selectedMinutes;

    setCalendarIsOpen(false);
  };

  // useEffects
  useEffect(() => {
    if (calendarIsOpen) {
      setTimeout(() => {
        handleHeight();
        handlePosition();
      }, 0);

      const days = [];
      const firstDayOfMonth = new Date(_year.current, _month.current, 1);
      const lastDayOfMonth = new Date(_year.current, _month.current + 1, 0);
      const startingDay = firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
      const endingDay = lastDayOfMonth.getDay() === 0 ? 7 : lastDayOfMonth.getDay();

      for (let i = 1; i < startingDay; i++) {
        days.push(<span key={`prev-${i}`} className="empty-day"></span>);
      }

      for (let i = firstDayOfMonth.getDate(); i <= lastDayOfMonth.getDate(); i++) {
        const isSelected = !isNaN(firstDayOfMonth.getTime())
          ? firstDayOfMonth.getFullYear() === _year.current &&
            firstDayOfMonth.getMonth() === _month.current &&
            i === _day.current
          : _currentDate.getFullYear() === _year.current &&
            _currentDate.getMonth() === _month.current &&
            i === _day.current;

        days.push(
          <span
            key={`current-${i}`}
            className={isSelected ? "selection-day" : ""}
            onClick={(event) => {
              event.preventDefault();

              _day.current = i;
              setSelectedDay(i);
              setDateChanged(!dateChanged);

              handleOk(false);
            }}
          >
            <span>{i}</span>
          </span>,
        );
      }

      for (let i = endingDay; i < 7; i++) {
        days.push(<span key={`next-${i}`} className="empty-day"></span>);
      }

      setCalendarDays(days);

      // window.addEventListener("blur", () => closeCalendar());
      document.addEventListener("click", handleClickOutSide);
      document.addEventListener("keydown", handleKeys);
    }

    return () => {
      // window.removeEventListener("blur", () => closeCalendar());
      document.removeEventListener("click", handleClickOutSide);
      document.removeEventListener("keydown", handleKeys);
    };
  }, [dateChanged, calendarIsOpen]);

  useEffect(() => {
    const generateList = (count: number, current: number, setFunc: React.Dispatch<React.SetStateAction<any>>) => {
      const items = Array.from({ length: count }, (_, i) => (
        <li
          ref={(element) => {
            if (!element) return;

            count === 24 ? (_hoursLiElements.current[i] = element) : (_minutesLiElements.current[i] = element);
          }}
          key={i}
          {...(current === i ? { className: "selection-time" } : {})}
          onClick={() => {
            if (count === 24) {
              setTimeChanged((prev) => !prev);
              _hours.current = i;
              setSelectedHours(i);
            } else {
              setTimeChanged((prev) => !prev);
              _minutes.current = i;
              setSelectedMinutes(i);
            }

            handleOk(false);
          }}
        >
          <span>
            <span>{i.toString().padStart(2, "0")}</span>
          </span>
        </li>
      ));

      setFunc(items);
    };

    // Listeler oluşturuyor...
    generateList(24, _hours.current, setHours);
    generateList(60, _minutes.current, setMinutes);

    if (!config?.isClock) return;
    if (calendarIsOpen) handleHeight();

    // Seçim sonrasında en yukarı getirme işlemi için aşağıda yer alan kodlar yazılmıştır
    const hourLiElement = _hoursLiElements.current[_hours.current];
    const minuteLiElement = _minutesLiElements.current[_minutes.current];

    if (hourLiElement) {
      _hoursListElement.current?.scrollTo({
        top: hourLiElement.offsetTop - _hoursListElement.current.offsetTop - 8,
        behavior: "smooth",
      });
    }

    if (minuteLiElement) {
      _minutesListElement.current?.scrollTo({
        top: minuteLiElement.offsetTop - _minutesListElement.current.offsetTop - 8,
        behavior: "smooth",
      });
    }
  }, [timeChanged, calendarIsOpen, config?.isClock]);

  useEffect(() => {
    if (isNaN(_year.current)) return;

    const years: Option[] = [];

    // Son 20 yıl
    for (let i = _year.current - 20; i <= _year.current; i++) {
      years.push({ value: i, text: `${i}` });
    }

    // Önümüzdeki 20 yıl
    for (let i = _year.current + 1; i <= _year.current + 20; i++) {
      years.push({ value: i, text: `${i}` });
    }

    setYears(years);
  }, [selectedYear]);

  return (
    <div className="ar-date-picker">
      {attributes.placeholder && attributes.placeholder.length > 0 && (
        <label ref={_placeholder}>
          {validation ? "* " : ""}
          {attributes.placeholder}
        </label>
      )}

      <div
        className="wrapper"
        style={{
          clipPath: `polygon(
                            -15px 0,
                            10px -5px,
                            10px 5px,
                            calc(${_placeholder.current?.getBoundingClientRect().width}px + 7px) 5px,
                            calc(${_placeholder.current?.getBoundingClientRect().width}px + 7px) -5px,
                            100% -70px,
                            calc(100% + 5px) calc(100% + 5px),
                            -5px calc(100% + 5px)
                          )`,
        }}
      >
        <Input
          ref={_beginDate}
          variant={variant}
          color={color}
          {...attributes}
          value={DATE.ParseValue(String(attributes.value), config?.isClock)}
          type={config?.isClock ? "datetime-local" : "date"}
          onKeyDown={(event) => {
            if (event.code === "Space") event.preventDefault();
            else if (event.code === "Enter") handleOk();
          }}
          onChange={(event) => {
            // Disabled gelmesi durumunda işlem yapmasına izin verme...
            if (attributes.disabled) return;

            (() => {
              if (!calendarIsOpen) setCalendarIsOpen(true);
              const value = event.target.value;

              const [date, time] = value.split("T");
              const [year, month, day] = date.split("-").map(Number);
              const hours = time ? time.split(".")[0].split(":").map(Number)[0] : 0;
              const minutes = time ? time.split(".")[0].split(":").map(Number)[1] : 0;

              _year.current = year;
              _month.current = month - 1;
              _day.current = day;

              if (hours || minutes) {
                _hours.current = hours;
                _minutes.current = minutes;
              }

              // Yıl ve Ay'ı anlık yeniler.
              setSelectedYear(_year.current);
              setSelectedMonth(_month.current);
              // Takvimi anlık yeniler.
              setDateChanged((prev) => !prev);
              setTimeChanged((prev) => !prev);
              onChange(value);
            })();
          }}
          onClick={(event) => {
            event.preventDefault();
            setCalendarIsOpen(true);
          }}
          autoComplete="off"
          validation={validation}
        />
      </div>

      {calendarIsOpen &&
        ReactDOM.createPortal(
          <div ref={_arCalendar} className="ar-date-calendar">
            {/* :Begin: Calendar */}
            <div ref={_calendarHeader} className="header">
              <div className="select-field">
                <div className="prev">
                  <span
                    onClick={() => {
                      _year.current -= 1;
                      setSelectedYear(_year.current);
                      setDateChanged((prev) => !prev);
                    }}
                  ></span>
                  <span
                    onClick={() => {
                      if (_month.current <= 0) {
                        _year.current -= 1;
                        _month.current = 12;
                      }

                      _month.current -= 1;
                      setSelectedYear(_year.current);
                      setSelectedMonth(_month.current);
                      setDateChanged((prev) => !prev);
                    }}
                  ></span>
                </div>

                <div className="selects">
                  <div>
                    <span>{months.find((month) => month.value === selectedMonth)?.text}</span>
                  </div>
                  <div>
                    <span>{years.find((year) => year.value === selectedYear)?.text}</span>
                  </div>
                </div>

                <div className="next">
                  <span
                    onClick={() => {
                      if (_month.current >= 11) {
                        _year.current += 1;
                        _month.current = -1;
                      }

                      _month.current += 1;
                      setSelectedYear(_year.current);
                      setSelectedMonth(_month.current);
                      setDateChanged((prev) => !prev);
                    }}
                  ></span>
                  <span
                    onClick={() => {
                      _year.current += 1;
                      setSelectedYear(_year.current);
                      setDateChanged((prev) => !prev);
                    }}
                  ></span>
                </div>
              </div>
            </div>

            <div className="content">
              {!isNaN(_month.current) && !isNaN(_year.current) ? (
                <div className="calendar">
                  {/* :Begin: Weekdays */}
                  <div className="weekdays">
                    {weekdays.map((weekday, index) => (
                      <span key={index}>{weekday}</span>
                    ))}
                  </div>
                  {/* :End: Weekdays */}

                  {/* :Begin: Days */}
                  <div className="days">{calendarDays}</div>
                  {/* :End: Days */}
                </div>
              ) : (
                <Alert status="warning">{t("DatePicker.Alert.1.Text")}</Alert>
              )}
            </div>

            {config?.isFooterButton && (
              <div ref={_calendarFooter} className="footer">
                <div>
                  <Button variant="borderless" onClick={() => setNowButton()}>
                    {t("DatePicker.Button.Now")}
                  </Button>
                </div>

                <div>{!config?.isClock && okayButton()}</div>
              </div>
            )}
            {/* :End: Calendar */}

            {/* :Begin: Clock */}
            {config?.isClock && (
              <div ref={_arClock} className="clock">
                <div ref={_clockHeader} className="header">
                  {_hours.current.toString().padStart(2, "0")}
                  {" : "}
                  {_minutes.current.toString().padStart(2, "0")}
                </div>

                <div className="content">
                  <ul ref={_hoursListElement}>{hours}</ul>
                  <ul ref={_minutesListElement}>{minutes}</ul>
                </div>

                <div ref={_clockFooter} className="footer">
                  {okayButton()}
                </div>
              </div>
            )}
            {/* :End: Clock */}
          </div>,
          document.body,
        )}
    </div>
  );
};

DatePicker.displayName = "DatePicker";
export default DatePicker;
