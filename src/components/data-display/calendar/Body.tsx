import React from "react";
import Day from "./views/Day";
import Week from "./views/Week";
import Month from "./views/Month";
import Year from "./views/Year";
import { CalendarViewProps } from "./IProps";

const Body = function <T>(props: CalendarViewProps<T>) {
  const view = props.states.view.get;

  if (view === "Day") return <Day {...props} />;
  if (view === "Week") return <Week {...props} />;
  if (view === "Month") return <Month {...props} />;
  if (view === "Year") return <Year {...props} />;

  return <Week {...props} />;
};

Body.displayName = "Calendar.Body";
export default Body;
