"use client";

import React, { useEffect, useRef, useState } from "react";
import "../../../assets/css/components/form/date-picker/styles.css";
import Input from "../input";
import { Option } from "../../../libs/infrastructure/types";
import Button from "../button";
import Alert from "../../feedback/alert";
import ReactDOM from "react-dom";
import DATE from "./DATE";
import DatePickerTR from "../../../libs/core/application/locales/date-picker/tr";
import DatePickerEN from "../../../libs/core/application/locales/date-picker/en";
import IDatePickerLocale from "../../../libs/core/application/locales/date-picker/IDatePickerLocale";
import { useTranslation } from "@harjs/translation";
import Props from "./Props";
import Flex from "../../layout/grid-system/flex/Flex";
import Utils from "../../../libs/infrastructure/shared/Utils";
import Tooltip from "../../feedback/tooltip";
import { Icon } from "../../icons";

const DatePicker: React.FC<Props> = ({
  variant = "outlined",
  color = "gray",
  border,
  size = "lg",
  value,
  onChange,
  config,
  validation,
  multiple,
  direction,
  ...attributes
}) => {
  const isOnlyClock = Boolean(config?.isOnlyClock);
  const isClock = Boolean(config?.isClock) || isOnlyClock;

  // refs
  const _harCalendar = useRef<HTMLDivElement>(null);
  const _harClock = useRef<HTMLDivElement>(null);
  const _placeholder = useRef<HTMLLabelElement>(null);
  const _calendarHeader = useRef<HTMLDivElement>(null);
  const _calendarFooter = useRef<HTMLDivElement>(null);
  const _clockHeader = useRef<HTMLDivElement>(null);
  const _clockFooter = useRef<HTMLDivElement>(null);
  const _currentDate = useRef<Date>(new Date()).current;
  const _beginDate = useRef<HTMLInputElement>(null);
  const _endDate = useRef<HTMLInputElement>(null);

  // Initial parsed values
  const initStart = multiple ? (value?.start ? DATE.Parse(String(value.start), isClock, isOnlyClock) : null) : null;
  const initEnd = multiple ? (value?.end ? DATE.Parse(String(value.end), isClock, isOnlyClock) : null) : null;
  const initSingle = !multiple && value ? DATE.Parse(String(value), isClock, isOnlyClock) : null;

  // refs -> Start Date or Single
  const _year = useRef<number>(initStart?.year ?? initSingle?.year ?? _currentDate.getFullYear());
  const _month = useRef<number>(
    initStart ? initStart.month - 1 : initSingle ? initSingle.month - 1 : _currentDate.getMonth(),
  );
  const _day = useRef<number | null>(initStart?.day ?? initSingle?.day ?? null);
  const _hours = useRef<number>(initStart?.hours ?? initSingle?.hours ?? 0);
  const _minutes = useRef<number>(initStart?.minutes ?? initSingle?.minutes ?? 0);
  // refs -> End Date (Multiple)
  const _endYear = useRef<number>(initEnd?.year ?? _currentDate.getFullYear());
  const _endMonth = useRef<number>(initEnd ? initEnd.month - 1 : _currentDate.getMonth());
  const _endDay = useRef<number | null>(initEnd?.day ?? null);
  const _endHours = useRef<number>(initEnd?.hours ?? 0);
  const _endMinutes = useRef<number>(initEnd?.minutes ?? 0);
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
  // states => Start Date or Single
  const [selectedYear, setSelectedYear] = useState<number>(_year.current);
  const [selectedMonth, setSelectedMonth] = useState<number>(_month.current);
  const [selectedDay, setSelectedDay] = useState<number | null>(_day.current);
  const [selectedHours, setSelectedHours] = useState<number>(_hours.current);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(_minutes.current);
  // states => End Date (Multiple)
  const [selectedEndYear, setSelectedEndYear] = useState<number>(_endYear.current);
  const [selectedEndMonth, setSelectedEndMonth] = useState<number>(_endMonth.current);
  const [selectedEndDay, setSelectedEndDay] = useState<number | null>(_endDay.current);
  const [selectedEndHours, setSelectedEndHours] = useState<number>(_endHours.current);
  const [selectedEndMinutes, setSelectedEndMinutes] = useState<number>(_endMinutes.current);

  // states => Aktif alan
  const [activeField, setActiveField] = useState<"start" | "end">("start");
  // states => Date Picker View (Navigasyon ayı ve yılı)
  const [viewYear, setViewYear] = useState<number>(_year.current);
  const [viewMonth, setViewMonth] = useState<number>(_month.current);

  // variables
  const _inputsFieldClassNames: string[] = ["inputs-field"];

  _inputsFieldClassNames.push(
    ...Utils.GetClassName(
      variant ?? "outlined",
      undefined,
      !Utils.IsNullOrEmpty(validation?.text) ? "red" : attributes.disabled ? "gray" : color,
      border ?? { radius: "4" },
      size,
      undefined,
      attributes.className,
    ),
  );
  if (attributes.disabled) _inputsFieldClassNames.push("disabled");

  // hooks
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

  const isEndActive = Boolean(multiple) && activeField === "end";
  const activeHoursRef = isEndActive ? _endHours : _hours;
  const activeMinutesRef = isEndActive ? _endMinutes : _minutes;

  const setActiveSelectedHours = isEndActive ? setSelectedEndHours : setSelectedHours;
  const setActiveSelectedMinutes = isEndActive ? setSelectedEndMinutes : setSelectedMinutes;

  // methods
  const handleClickOutSide = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target === _beginDate.current) return;
    if (multiple && target === _endDate.current) return;
    if (_harCalendar.current && !_harCalendar.current.contains(target)) closeCalendar();
  };

  const handleKeys = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      closeCalendar();
    }
  };

  const handlePosition = () => {
    const _activeInput = multiple && activeField === "end" ? _endDate.current : _beginDate.current;
    const calendarEl = _harCalendar.current;

    if (!calendarEl || !_activeInput) return;

    const inputRect = _activeInput.getBoundingClientRect();
    const calendarRect = calendarEl.getBoundingClientRect();

    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;
    const sx = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
    const sy = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;

    // Sol: shortcut-buttons, Sağ: clock (only-clock'ta yan panel yok)
    const shortcutEl = calendarEl.querySelector<HTMLElement>(".shortcut-buttons");
    const clockEl = isOnlyClock ? null : _harClock.current;
    const shortcutRect = shortcutEl?.getBoundingClientRect();
    const clockRect = clockEl?.getBoundingClientRect();

    const leftOverhang = shortcutRect ? Math.max(0, calendarRect.left - shortcutRect.left) : 0;
    const rightOverhang = clockRect ? Math.max(0, clockRect.right - calendarRect.right) : 0;

    const openToLeft = inputRect.left > screenCenterX;
    const openAbove = inputRect.top > screenCenterY;

    // Sol yarı: shortcut sol kenarı input.left'e hizalanır
    // Sağ yarı: saat varsa saatin sağı, yoksa calendar sağı → input.right
    const left = openToLeft
      ? inputRect.right - calendarRect.width - rightOverhang + sx
      : inputRect.left + leftOverhang + sx;

    const top = (openAbove ? inputRect.top - calendarRect.height : inputRect.top + inputRect.height) + sy;

    calendarEl.style.visibility = "visible";
    calendarEl.style.opacity = "1";
    calendarEl.style.top = `${top}px`;
    calendarEl.style.left = `${left}px`;
  };

  const handleHeight = () => {
    if (isOnlyClock) return;

    if (_harCalendar.current && _harClock.current) {
      const calendar = _harCalendar.current?.getBoundingClientRect()?.height;
      _harClock.current.style.maxHeight = `${calendar}px`;
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
    if (isOnlyClock) {
      setSelectedHours(_hours.current);
      setSelectedMinutes(_minutes.current);

      if (multiple) {
        setSelectedEndHours(_endHours.current);
        setSelectedEndMinutes(_endMinutes.current);

        onChange({
          start: DATE.FormatTime(_hours.current, _minutes.current),
          end: DATE.FormatTime(_endHours.current, _endMinutes.current),
        });
        isShutdownOn && setCalendarIsOpen(false);
        return;
      }

      onChange(DATE.FormatTime(_hours.current, _minutes.current));
      isShutdownOn && setCalendarIsOpen(false);
      return;
    }

    if (multiple) {
      setSelectedYear(_year.current);
      setSelectedMonth(_month.current);
      setSelectedDay(_day.current);
      setSelectedHours(_hours.current);
      setSelectedMinutes(_minutes.current);

      setSelectedEndYear(_endYear.current);
      setSelectedEndMonth(_endMonth.current);
      setSelectedEndDay(_endDay.current);
      setSelectedEndHours(_endHours.current);
      setSelectedEndMinutes(_endMinutes.current);

      const startString =
        _day.current !== null
          ? new Date(
              Date.UTC(
                _year.current,
                _month.current,
                _day.current,
                !isClock ? 0 : _hours.current,
                !isClock ? 0 : _minutes.current,
                0,
              ),
            ).toISOString()
          : "";

      const endString =
        _endDay.current !== null
          ? new Date(
              Date.UTC(
                _endYear.current,
                _endMonth.current,
                _endDay.current,
                !isClock ? 0 : _endHours.current,
                !isClock ? 0 : _endMinutes.current,
                0,
              ),
            ).toISOString()
          : "";

      onChange({ start: startString, end: endString });
      isShutdownOn && setCalendarIsOpen(false);
      return;
    }

    if (_day.current === null) return;

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
        !isClock ? 0 : _hours.current,
        !isClock ? 0 : _minutes.current,
        0,
      ),
    );

    onChange(inputDate.toISOString());
    isShutdownOn && setCalendarIsOpen(false);
  };

  const applyShortcut = (
    type: "today" | "yesterday" | "last7days" | "last30days" | "thisWeek" | "thisMonth" | "lastMonth" | "thisYear",
  ) => {
    const now = new Date();
    let start = new Date(now);
    let end = new Date(now);

    switch (type) {
      case "today":
        break;
      case "yesterday":
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
        break;
      case "last7days":
        start.setDate(start.getDate() - 6);
        break;
      case "last30days":
        start.setDate(start.getDate() - 29);
        break;
      case "thisWeek": {
        // Pazar gününü 7 kabul ederek Pazartesiyi haftanın 1. günü yapıyoruz.
        const currentDay = now.getDay() === 0 ? 7 : now.getDay();
        // Pazartesi'ye gitmek için kaç gün geri çıkılacağını hesapla.
        start.setDate(now.getDate() - (currentDay - 1));
        // Pazar'a gitmek için kaç gün ileri gidileceğini hesapla.
        end.setDate(now.getDate() + (7 - currentDay));
        break;
      }
      case "thisMonth":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "lastMonth":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "thisYear":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
    }

    // Start Tarihi Güncellemesi.
    _year.current = start.getFullYear();
    _month.current = start.getMonth();
    _day.current = start.getDate();
    _hours.current = isClock ? start.getHours() : 0;
    _minutes.current = isClock ? start.getMinutes() : 0;

    setSelectedYear(_year.current);
    setSelectedMonth(_month.current);
    setSelectedDay(_day.current);
    setSelectedHours(_hours.current);
    setSelectedMinutes(_minutes.current);

    const startString = new Date(
      Date.UTC(
        _year.current,
        _month.current,
        _day.current,
        !isClock ? 0 : _hours.current,
        !isClock ? 0 : _minutes.current,
        0,
      ),
    ).toISOString();

    if (multiple) {
      // End Tarihi Güncellemesi.
      _endYear.current = end.getFullYear();
      _endMonth.current = end.getMonth();
      _endDay.current = end.getDate();
      _endHours.current = isClock ? end.getHours() : 0;
      _endMinutes.current = isClock ? end.getMinutes() : 0;

      setSelectedEndYear(_endYear.current);
      setSelectedEndMonth(_endMonth.current);
      setSelectedEndDay(_endDay.current);
      setSelectedEndHours(_endHours.current);
      setSelectedEndMinutes(_endMinutes.current);

      const endString = new Date(
        Date.UTC(
          _endYear.current,
          _endMonth.current,
          _endDay.current,
          !isClock ? 0 : _endHours.current,
          !isClock ? 0 : _endMinutes.current,
          0,
        ),
      ).toISOString();

      onChange({ start: startString, end: endString });

      // Takvim görünümünü başlangıç tarihine çek.
      setViewYear(_year.current);
      setViewMonth(_month.current);
    } else {
      onChange(startString);

      // Takvim görünümünü başlangıç tarihine çek.
      setViewYear(_year.current);
      setViewMonth(_month.current);
    }

    setDateChanged((prev) => !prev);
  };

  const setNowButton = () => {
    const now = new Date();

    if (isOnlyClock) {
      if (multiple) {
        if (isEndActive) {
          _endHours.current = now.getHours();
          _endMinutes.current = now.getMinutes();
          setSelectedEndHours(now.getHours());
          setSelectedEndMinutes(now.getMinutes());
        } else {
          _hours.current = now.getHours();
          _minutes.current = now.getMinutes();
          setSelectedHours(now.getHours());
          setSelectedMinutes(now.getMinutes());
        }

        setTimeChanged((prev) => !prev);
        setCalendarIsOpen(false);
        onChange({
          start: DATE.FormatTime(_hours.current, _minutes.current),
          end: DATE.FormatTime(_endHours.current, _endMinutes.current),
        });
        return;
      }

      _hours.current = now.getHours();
      _minutes.current = now.getMinutes();
      setSelectedHours(now.getHours());
      setSelectedMinutes(now.getMinutes());
      setTimeChanged((prev) => !prev);
      setCalendarIsOpen(false);
      onChange(DATE.FormatTime(now.getHours(), now.getMinutes()));
      return;
    }

    if (multiple) {
      if (isEndActive) {
        _endYear.current = now.getFullYear();
        _endMonth.current = now.getMonth();
        _endDay.current = now.getDate();
        _endHours.current = now.getHours();
        _endMinutes.current = now.getMinutes();

        setSelectedEndYear(now.getFullYear());
        setSelectedEndMonth(now.getMonth());
        setSelectedEndDay(now.getDate());
        setSelectedEndHours(now.getHours());
        setSelectedEndMinutes(now.getMinutes());
      } else {
        _year.current = now.getFullYear();
        _month.current = now.getMonth();
        _day.current = now.getDate();
        _hours.current = now.getHours();
        _minutes.current = now.getMinutes();

        setSelectedYear(now.getFullYear());
        setSelectedMonth(now.getMonth());
        setSelectedDay(now.getDate());
        setSelectedHours(now.getHours());
        setSelectedMinutes(now.getMinutes());
      }

      setViewYear(now.getFullYear());
      setViewMonth(now.getMonth());
      setCalendarIsOpen(false);

      const startInputDate =
        _day.current !== null
          ? new Date(
              Date.UTC(
                _year.current,
                _month.current,
                _day.current,
                !isClock ? 0 : _hours.current,
                !isClock ? 0 : _minutes.current,
                0,
              ),
            ).toISOString()
          : "";

      const endInputDate =
        _endDay.current !== null
          ? new Date(
              Date.UTC(
                _endYear.current,
                _endMonth.current,
                _endDay.current,
                !isClock ? 0 : _endHours.current,
                !isClock ? 0 : _endMinutes.current,
                0,
              ),
            ).toISOString()
          : "";

      onChange({ start: startInputDate, end: endInputDate });
      return;
    }

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

    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setCalendarIsOpen(false);

    const inputDate = new Date(
      Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        !isClock ? 0 : now.getHours(),
        !isClock ? 0 : now.getMinutes(),
        0,
      ),
    );

    onChange(inputDate.toISOString());
  };

  const setClearButton = () => {
    const now = new Date();

    _year.current = now.getFullYear();
    _month.current = now.getMonth();
    _day.current = null;
    _hours.current = 0;
    _minutes.current = 0;

    _endYear.current = now.getFullYear();
    _endMonth.current = now.getMonth();
    _endDay.current = null;
    _endHours.current = 0;
    _endMinutes.current = 0;

    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth());
    setSelectedDay(null);
    setSelectedHours(0);
    setSelectedMinutes(0);

    setSelectedEndYear(now.getFullYear());
    setSelectedEndMonth(now.getMonth());
    setSelectedEndDay(null);
    setSelectedEndHours(0);
    setSelectedEndMinutes(0);

    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setActiveField("start");
    setDateChanged((prev) => !prev);
    setTimeChanged((prev) => !prev);
    setCalendarIsOpen(false);

    if (isOnlyClock) {
      if (multiple) {
        onChange({ start: "", end: "" });
        return;
      }

      onChange("");
      return;
    }

    if (multiple) {
      onChange({ start: "", end: "" });
      return;
    }

    onChange("");
  };

  const handleNativeChange = (val: string, field: "start" | "end") => {
    if (!multiple) return;
    if (!val) return;

    if (isOnlyClock) {
      const [hours, minutes] = val.split(":").map(Number);
      const hoursRef = field === "end" ? _endHours : _hours;
      const minutesRef = field === "end" ? _endMinutes : _minutes;
      const setHoursState = field === "end" ? setSelectedEndHours : setSelectedHours;
      const setMinutesState = field === "end" ? setSelectedEndMinutes : setSelectedMinutes;

      hoursRef.current = Number.isFinite(hours) ? hours : 0;
      minutesRef.current = Number.isFinite(minutes) ? minutes : 0;
      setHoursState(hoursRef.current);
      setMinutesState(minutesRef.current);
      setTimeChanged((prev) => !prev);

      onChange({
        start: DATE.FormatTime(_hours.current, _minutes.current),
        end: DATE.FormatTime(_endHours.current, _endMinutes.current),
      });
      return;
    }

    const [date, time] = val.split("T");
    const [year, month, day] = date.split("-").map(Number);
    const hours = time ? time.split(".")[0].split(":").map(Number)[0] : 0;
    const minutes = time ? time.split(".")[0].split(":").map(Number)[1] : 0;

    const yearRef = field === "end" ? _endYear : _year;
    const monthRef = field === "end" ? _endMonth : _month;
    const dayRef = field === "end" ? _endDay : _day;
    const hoursRef = field === "end" ? _endHours : _hours;
    const minutesRef = field === "end" ? _endMinutes : _minutes;
    const setYear = field === "end" ? setSelectedEndYear : setSelectedYear;
    const setMonth = field === "end" ? setSelectedEndMonth : setSelectedMonth;

    yearRef.current = year;
    monthRef.current = month - 1;
    dayRef.current = day;

    if (hours || minutes) {
      hoursRef.current = hours;
      minutesRef.current = minutes;
    }

    setYear(yearRef.current);
    setMonth(monthRef.current);

    setViewYear(yearRef.current);
    setViewMonth(monthRef.current);

    setDateChanged((prev) => !prev);
    setTimeChanged((prev) => !prev);

    const startInputDate =
      _day.current !== null
        ? new Date(
            Date.UTC(
              _year.current,
              _month.current,
              _day.current,
              !isClock ? 0 : _hours.current,
              !isClock ? 0 : _minutes.current,
              0,
            ),
          ).toISOString()
        : "";

    const endInputDate =
      _endDay.current !== null
        ? new Date(
            Date.UTC(
              _endYear.current,
              _endMonth.current,
              _endDay.current,
              !isClock ? 0 : _endHours.current,
              !isClock ? 0 : _endMinutes.current,
              0,
            ),
          ).toISOString()
        : "";

    onChange({ start: startInputDate, end: endInputDate });
  };

  const okayButton = () => {
    return (
      <Button variant="borderless" color="green" onClick={() => handleOk()}>
        {t("DatePicker.Button.Okay")}
      </Button>
    );
  };

  const closeCalendar = () => {
    if (multiple) {
      const startParsed = value?.start ? DATE.Parse(String(value.start), isClock, isOnlyClock) : null;
      const endParsed = value?.end ? DATE.Parse(String(value.end), isClock, isOnlyClock) : null;

      _year.current = startParsed ? startParsed.year : selectedYear;
      _month.current = startParsed ? startParsed.month - 1 : selectedMonth;
      _day.current = startParsed ? startParsed.day : selectedDay;
      _hours.current = startParsed ? startParsed.hours : selectedHours;
      _minutes.current = startParsed ? startParsed.minutes : selectedMinutes;

      _endYear.current = endParsed ? endParsed.year : selectedEndYear;
      _endMonth.current = endParsed ? endParsed.month - 1 : selectedEndMonth;
      _endDay.current = endParsed ? endParsed.day : selectedEndDay;
      _endHours.current = endParsed ? endParsed.hours : selectedEndHours;
      _endMinutes.current = endParsed ? endParsed.minutes : selectedEndMinutes;

      setCalendarIsOpen(false);
      return;
    }

    const parsed = value ? DATE.Parse(String(value), isClock, isOnlyClock) : null;

    _year.current = parsed ? parsed.year : selectedYear;
    _month.current = parsed ? parsed.month - 1 : selectedMonth;
    _day.current = parsed ? parsed.day : selectedDay;
    _hours.current = parsed ? parsed.hours : selectedHours;
    _minutes.current = parsed ? parsed.minutes : selectedMinutes;

    setCalendarIsOpen(false);
  };

  // useEffects
  useEffect(() => {
    if (calendarIsOpen) {
      setTimeout(() => {
        handleHeight();
        handlePosition();
      }, 0);

      if (isOnlyClock) {
        document.addEventListener("click", handleClickOutSide);
        document.addEventListener("keydown", handleKeys);

        return () => {
          document.removeEventListener("click", handleClickOutSide);
          document.removeEventListener("keydown", handleKeys);
        };
      }

      const days = [];
      const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
      const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);
      const startingDay = firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
      const endingDay = lastDayOfMonth.getDay() === 0 ? 7 : lastDayOfMonth.getDay();

      for (let i = 1; i < startingDay; i++) {
        days.push(<span key={`prev-${i}`} className="empty-day"></span>);
      }

      for (let i = firstDayOfMonth.getDate(); i <= lastDayOfMonth.getDate(); i++) {
        let dayClassName = "";

        // Hücrenin tarihi takvimin gezinme (view) yılı ve ayına göre hesaplanır
        const cellDate = Date.UTC(viewYear, viewMonth, i);

        if (multiple) {
          const hasStart = _day.current !== null;
          const hasEnd = _endDay.current !== null;

          const startDate = hasStart ? Date.UTC(_year.current, _month.current, _day.current!) : null;
          const endDate = hasEnd ? Date.UTC(_endYear.current, _endMonth.current, _endDay.current!) : null;

          const isStartDay = startDate !== null && cellDate === startDate;
          const isEndDay = endDate !== null && cellDate === endDate;

          let isInRange = false;
          if (startDate !== null && endDate !== null) {
            const minDate = Math.min(startDate, endDate);
            const maxDate = Math.max(startDate, endDate);
            isInRange = cellDate > minDate && cellDate < maxDate;
          }

          if (isStartDay || isEndDay) {
            dayClassName = "selection-day";
          } else if (isInRange) {
            dayClassName = "in-range-day";
          }
        } else {
          const isSelected =
            _day.current !== null && viewYear === _year.current && viewMonth === _month.current && i === _day.current;

          dayClassName = isSelected ? "selection-day" : "";
        }

        days.push(
          <span
            key={`current-${i}`}
            className={dayClassName}
            onClick={(event) => {
              event.preventDefault();

              if (multiple && activeField === "end") {
                _endYear.current = viewYear;
                _endMonth.current = viewMonth;
                _endDay.current = i;
                setSelectedEndYear(viewYear);
                setSelectedEndMonth(viewMonth);
                setSelectedEndDay(i);
              } else {
                _year.current = viewYear;
                _month.current = viewMonth;
                _day.current = i;
                setSelectedYear(viewYear);
                setSelectedMonth(viewMonth);
                setSelectedDay(i);
              }

              setDateChanged(!dateChanged);

              if (multiple) {
                if (activeField !== "end") {
                  setActiveField("end");
                  handleOk(false);
                } else {
                  handleOk(!isClock);
                }

                return;
              }

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

      document.addEventListener("click", handleClickOutSide);
      document.addEventListener("keydown", handleKeys);
    }

    return () => {
      document.removeEventListener("click", handleClickOutSide);
      document.removeEventListener("keydown", handleKeys);
    };
  }, [dateChanged, calendarIsOpen, activeField, viewYear, viewMonth]);

  useEffect(() => {
    const generateList = (count: number, current: number, setFunc: React.Dispatch<React.SetStateAction<any>>) => {
      const items = Array.from({ length: count }, (_, i) => {
        if (count === 60 && config?.step?.minutes && i % config.step.minutes !== 0) return;

        return (
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
                activeHoursRef.current = i;
                setActiveSelectedHours(i);
              } else {
                setTimeChanged((prev) => !prev);
                activeMinutesRef.current = i;
                setActiveSelectedMinutes(i);
              }

              handleOk(false);
            }}
          >
            <span>
              <span>{i.toString().padStart(2, "0")}</span>
            </span>
          </li>
        );
      });

      setFunc(items);
    };

    generateList(24, activeHoursRef.current, setHours);
    generateList(60, activeMinutesRef.current, setMinutes);

    if (!isClock) return;
    if (calendarIsOpen) handleHeight();

    const hourLiElement = _hoursLiElements.current[activeHoursRef.current];
    const minuteLiElement = _minutesLiElements.current[activeMinutesRef.current];

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
  }, [timeChanged, calendarIsOpen, isClock, config?.step?.minutes, activeField]);

  useEffect(() => {
    if (isNaN(viewYear)) return;

    const yearsList: Option[] = [];

    for (let i = viewYear - 20; i <= viewYear; i++) {
      yearsList.push({ value: i, text: `${i}` });
    }

    for (let i = viewYear + 1; i <= viewYear + 20; i++) {
      yearsList.push({ value: i, text: `${i}` });
    }

    setYears(yearsList);
  }, [viewYear]);

  // activeField değiştiğinde veya takvim açıldığında görünümü ilgili alanın tarihine senkronize et
  useEffect(() => {
    const currentYear = isEndActive ? _endYear.current : _year.current;
    const currentMonth = isEndActive ? _endMonth.current : _month.current;

    setViewYear(currentYear);
    setViewMonth(currentMonth);
    setDateChanged((prev) => !prev);
  }, [activeField, calendarIsOpen]);

  return (
    <div className="har-date-picker">
      {attributes.placeholder && attributes.placeholder.length > 0 && (
        <label ref={_placeholder}>
          {validation ? "* " : ""}
          {attributes.placeholder}
        </label>
      )}

      <div
        className="container"
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
        {multiple ? (
          <div className={_inputsFieldClassNames.map((c) => c).join(" ")} style={attributes.style}>
            <Flex flexDirection={direction || "row"} alignItems="center" width="100%" gap="var(--space-8)">
              <Input
                ref={_beginDate}
                variant="borderless"
                color={color}
                disabled={attributes.disabled}
                style={{ padding: 0 }}
                value={DATE.ParseValue(String(value?.start ?? ""), isClock, isOnlyClock)}
                type={isOnlyClock ? "time" : isClock ? "datetime-local" : "date"}
                size={size}
                onKeyDown={(event) => {
                  if (event.code === "Space") event.preventDefault();
                  else if (event.code === "Enter") handleOk();
                }}
                onChange={(event) => {
                  if (attributes.disabled) return;

                  (() => {
                    if (!calendarIsOpen) setCalendarIsOpen(true);
                    setActiveField("start");
                    handleNativeChange(event.target.value, "start");
                  })();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveField("start");
                  setCalendarIsOpen(true);
                }}
                autoComplete="off"
              />

              {direction === "row" && <Icon icon="ArrowRight" size={16} />}

              <Input
                ref={_endDate}
                variant="borderless"
                color={color}
                disabled={attributes.disabled}
                style={{ padding: 0 }}
                value={DATE.ParseValue(String(value?.end ?? ""), isClock, isOnlyClock)}
                type={isOnlyClock ? "time" : isClock ? "datetime-local" : "date"}
                size={size}
                onKeyDown={(event) => {
                  if (event.code === "Space") event.preventDefault();
                  else if (event.code === "Enter") handleOk();
                }}
                onChange={(event) => {
                  if (attributes.disabled) return;

                  (() => {
                    if (!calendarIsOpen) setCalendarIsOpen(true);
                    setActiveField("end");
                    handleNativeChange(event.target.value, "end");
                  })();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveField("end");
                  setCalendarIsOpen(true);
                }}
                autoComplete="off"
              />
            </Flex>
          </div>
        ) : (
          <Input
            ref={_beginDate}
            variant={variant}
            color={!Utils.IsNullOrEmpty(validation?.text) ? "red" : color}
            {...attributes}
            value={DATE.ParseValue(String(value ?? ""), isClock, isOnlyClock)}
            type={isOnlyClock ? "time" : isClock ? "datetime-local" : "date"}
            size={size}
            onKeyDown={(event) => {
              if (event.code === "Space") event.preventDefault();
              else if (event.code === "Enter") handleOk();
            }}
            onChange={(event) => {
              if (attributes.disabled) return;
              (() => {
                if (!calendarIsOpen) setCalendarIsOpen(true);
                const val = event.target.value;
                if (!val) return;

                if (isOnlyClock) {
                  const [hours, minutes] = val.split(":").map(Number);
                  _hours.current = Number.isFinite(hours) ? hours : 0;
                  _minutes.current = Number.isFinite(minutes) ? minutes : 0;
                  setSelectedHours(_hours.current);
                  setSelectedMinutes(_minutes.current);
                  setTimeChanged((prev) => !prev);
                  onChange(DATE.FormatTime(_hours.current, _minutes.current));
                  return;
                }

                const [date, time] = val.split("T");
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

                setSelectedYear(_year.current);
                setSelectedMonth(_month.current);
                setViewYear(_year.current);
                setViewMonth(_month.current);
                setDateChanged((prev) => !prev);
                setTimeChanged((prev) => !prev);
                onChange(val);
              })();
            }}
            onClick={(event) => {
              event.preventDefault();
              setCalendarIsOpen(true);
            }}
            autoComplete="off"
          />
        )}
      </div>

      {validation?.text ? <div className="har-validation-text">{validation.text}</div> : null}

      {calendarIsOpen &&
        ReactDOM.createPortal(
          <div ref={_harCalendar} className={`har-date-calendar${isOnlyClock ? " only-clock" : ""}`}>
            {!isOnlyClock && (
              <>
                {config?.isShortcutButtons !== false && (
                  <div className="shortcut-buttons">
                    <Flex flexDirection="column" justifyContent="space-between" alignItems="flex-start">
                      <Button variant="borderless" onClick={() => applyShortcut("today")}>
                        {t("DatePicker.Shortcuts.Today") || "Bugün"}
                      </Button>
                      <Button variant="borderless" onClick={() => applyShortcut("yesterday")}>
                        {t("DatePicker.Shortcuts.Yesterday") || "Dün"}
                      </Button>

                      {/* Aşağıdaki butonlar sadece Multiple (Tarih Aralığı) seçiliyken gösterilir */}
                      {multiple && (
                        <>
                          <Button variant="borderless" onClick={() => applyShortcut("last7days")}>
                            {t("DatePicker.Shortcuts.Last7Days") || "Son 7 Gün"}
                          </Button>
                          <Button variant="borderless" onClick={() => applyShortcut("last30days")}>
                            {t("DatePicker.Shortcuts.Last30Days") || "Son 30 Gün"}
                          </Button>
                          <Button variant="borderless" onClick={() => applyShortcut("thisWeek")}>
                            {t("DatePicker.Shortcuts.ThisWeek") || "Bu Hafta"}
                          </Button>
                          <Button variant="borderless" onClick={() => applyShortcut("thisMonth")}>
                            {t("DatePicker.Shortcuts.ThisMonth") || "Bu Ay"}
                          </Button>
                          <Button variant="borderless" onClick={() => applyShortcut("lastMonth")}>
                            {t("DatePicker.Shortcuts.LastMonth") || "Geçen Ay"}
                          </Button>
                          <Button variant="borderless" onClick={() => applyShortcut("thisYear")}>
                            {t("DatePicker.Shortcuts.ThisYear") || "Bu Yıl"}
                          </Button>
                        </>
                      )}
                    </Flex>
                  </div>
                )}

                <div ref={_calendarHeader} className="header">
                  <div className="select-field">
                    <div className="prev">
                      {/* Önceki Yıl */}
                      <Icon
                        icon="CaretDoubleLeft"
                        size={16}
                        fill="#000000"
                        onClick={() => {
                          setViewYear((prev) => prev - 1);
                          setDateChanged((prev) => !prev);
                        }}
                      />

                      {/* Önceki Ay */}
                      <Icon
                        icon="CaretLeft"
                        size={16}
                        fill="#000000"
                        onClick={() => {
                          if (viewMonth <= 0) {
                            setViewYear((prev) => prev - 1);
                            setViewMonth(11);
                          } else {
                            setViewMonth((prev) => prev - 1);
                          }
                          setDateChanged((prev) => !prev);
                        }}
                      />
                    </div>

                    <div className="selects">
                      <div>
                        <span>{months.find((month) => month.value === viewMonth)?.text}</span>
                      </div>
                      <div>
                        <span>{years.find((year) => year.value === viewYear)?.text}</span>
                      </div>
                    </div>

                    <div className="next">
                      {/* Sonraki Ay */}
                      <Icon
                        icon="CaretRight"
                        size={16}
                        fill="#000000"
                        onClick={() => {
                          if (viewMonth >= 11) {
                            setViewYear((prev) => prev + 1);
                            setViewMonth(0);
                          } else {
                            setViewMonth((prev) => prev + 1);
                          }
                          setDateChanged((prev) => !prev);
                        }}
                      />

                      {/* Sonraki Yıl */}
                      <Icon
                        icon="CaretDoubleRight"
                        size={16}
                        fill="#000000"
                        onClick={() => {
                          setViewYear((prev) => prev + 1);
                          setDateChanged((prev) => !prev);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="content">
                  {!isNaN(viewMonth) && !isNaN(viewYear) ? (
                    <div className="calendar">
                      <div className="weekdays">
                        {weekdays.map((weekday, index) => (
                          <span key={index}>{weekday}</span>
                        ))}
                      </div>
                      <div className="days">{calendarDays}</div>
                    </div>
                  ) : (
                    <Alert status="warning">{t("DatePicker.Alert.1.Text")}</Alert>
                  )}
                </div>

                {config?.isFooterButton !== false && (
                  <div ref={_calendarFooter} className="footer">
                    <Flex flexDirection="row" alignItems="center">
                      <Button variant="borderless" color="red" onClick={() => setClearButton()}>
                        {t("DatePicker.Button.Clear")}
                      </Button>
                      <Button variant="borderless" onClick={() => setNowButton()}>
                        {t("DatePicker.Button.Now")}
                      </Button>
                    </Flex>

                    <div>{!isClock && okayButton()}</div>
                  </div>
                )}
              </>
            )}

            {isClock && (
              <div ref={_harClock} className="clock">
                <div ref={_clockHeader} className="header">
                  {activeHoursRef.current.toString().padStart(2, "0")}
                  {" : "}
                  {activeMinutesRef.current.toString().padStart(2, "0")}
                </div>

                <div className="content">
                  <ul ref={_hoursListElement}>{hours}</ul>
                  <ul ref={_minutesListElement}>{minutes}</ul>
                </div>

                <div ref={_clockFooter} className="footer">
                  {isOnlyClock && config?.isFooterButton !== false ? (
                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between" gap="var(--space-4)">
                      <Tooltip text={t("DatePicker.Button.Clear")}>
                        <Button
                          variant="borderless"
                          color="red"
                          shape="square"
                          size="sm"
                          icon={{
                            element: <Icon icon="Trash-Fill" fill="currentColor" size={14} />,
                          }}
                          onClick={() => setClearButton()}
                        />
                      </Tooltip>

                      <Tooltip text={t("DatePicker.Button.Now")}>
                        <Button
                          variant="borderless"
                          shape="square"
                          size="sm"
                          icon={{
                            element: <Icon icon="Clock" size={14} />,
                          }}
                          onClick={() => setNowButton()}
                        />
                      </Tooltip>

                      <Tooltip text={t("DatePicker.Button.Okay")}>
                        <Button
                          variant="borderless"
                          color="green"
                          shape="square"
                          size="sm"
                          icon={{
                            element: <Icon icon="CheckAll" fill="currentColor" size={14} />,
                          }}
                          onClick={() => handleOk()}
                        />
                      </Tooltip>
                    </Flex>
                  ) : (
                    okayButton()
                  )}
                </div>
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};

DatePicker.displayName = "DatePicker";
export default DatePicker;
