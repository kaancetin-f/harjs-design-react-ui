"use client";

import React from "react";
import { useTranslation } from "@harjs/translation";
import Button from "../../form/button";
import { Icon } from "../../icons";
import Flex from "../../layout/grid-system/flex/Flex";
import ICalendarLocale from "../../../libs/core/application/locales/calendar/ICalendarLocale";
import CalendarTR from "../../../libs/core/application/locales/calendar/tr";
import CalendarEN from "../../../libs/core/application/locales/calendar/en";
import { CalendarConfig, CalendarStates } from "./IProps";
import {
  DEFAULT_VIEW,
  DEFAULT_WEEK_STARTS_ON,
  VIEWS,
  formatCalendarTitle,
  shiftDate,
} from "./helpers";

interface IProps {
  states: CalendarStates;
  config?: CalendarConfig;
}

const Header = ({ states, config }: IProps) => {
  const locale = config?.locale ?? "tr";
  const view = states.view.get ?? DEFAULT_VIEW;
  const { t } = useTranslation<ICalendarLocale>(String(locale), {
    tr: { ...CalendarTR },
    en: { ...CalendarEN },
  });

  const changeDate = (direction: "today" | "prev" | "next") => {
    if (direction === "today") {
      states.currentDate.set(new Date());
      return;
    }
    states.currentDate.set((prev) => shiftDate(prev, view, direction === "next" ? 1 : -1));
  };

  return (
    <div className="header">
      <Flex alignItems="center" gap="var(--space-8)" className="nav">
        <Button variant="outlined" color="green" border={{ radius: "16" }} size="md" onClick={() => changeDate("today")}>
          {t("Calendar.Today")}
        </Button>
        <Button
          variant="borderless"
          color="gray"
          border={{ radius: "full" }}
          shape="square"
          size="md"
          aria-label={t("Calendar.Previous")}
          icon={{ element: <Icon icon="ArrowLeft" stroke="currentColor" /> }}
          onClick={() => changeDate("prev")}
        />
        <Button
          variant="borderless"
          color="gray"
          border={{ radius: "full" }}
          shape="square"
          size="md"
          aria-label={t("Calendar.Next")}
          icon={{ element: <Icon icon="ArrowRight" stroke="currentColor" /> }}
          onClick={() => changeDate("next")}
        />
        <h2 className="title">
          {formatCalendarTitle(states.currentDate.get, view, locale, config?.weekStartsOn ?? DEFAULT_WEEK_STARTS_ON)}
        </h2>
      </Flex>

      <Button.Group size="md" color="gray" border={{ radius: "8" }} variant="outlined">
        {VIEWS.map((item) => (
          <Button
            key={item}
            variant={view === item ? "filled" : "outlined"}
            color={view === item ? "blue" : "gray"}
            aria-pressed={view === item}
            onClick={() => states.view.set(item)}
          >
            {t(`Calendar.View.${item}` as keyof ICalendarLocale)}
          </Button>
        ))}
      </Button.Group>
    </div>
  );
};

Header.displayName = "Calendar.Header";
export default Header;
