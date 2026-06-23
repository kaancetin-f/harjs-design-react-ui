import React from "react";
import Button from "../../form/button";
import { ARIcon } from "../../icons";
import Box from "../grid-system/box/Box";
import { View } from "../../../libs/infrastructure/types";

interface IProps {
  states: {
    currentDate: {
      get: Date;
      set: React.Dispatch<React.SetStateAction<Date>>;
    };
    view: { get: View; set: React.Dispatch<React.SetStateAction<View>> };
  };
  config?: {
    locale?: Intl.LocalesArgument;
    weekStartsOn?: number;
  };
}

const Header = ({ states, config }: IProps) => {
  // methods
  const changeWeek = (direction: "today" | "prev" | "next") => {
    states.currentDate.set((prev) => {
      if (direction === "today") return new Date();

      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === "next" ? 7 : -7));

      return newDate;
    });
  };

  return (
    <div className="header">
      <Box>
        <Button variant="outlined" color="green" border={{ radius: "xxl" }} onClick={() => changeWeek("today")}>
          Bugün
        </Button>
        <Button
          variant="borderless"
          color="light"
          border={{ radius: "pill" }}
          icon={{ element: <ARIcon icon={"ArrowLeft"} stroke="currentColor" /> }}
          onClick={() => changeWeek("prev")}
        />
        <Button
          variant="borderless"
          color="light"
          border={{ radius: "pill" }}
          icon={{ element: <ARIcon icon={"ArrowRight"} stroke="currentColor" /> }}
          onClick={() => changeWeek("next")}
        />

        <span className="week-time">
          {states.currentDate.get.toLocaleString(config?.locale ?? "tr-TR", { month: "long" })}{" "}
          {states.currentDate.get.getFullYear()}
        </span>
      </Box>
    </div>
  );
};

export default Header;
