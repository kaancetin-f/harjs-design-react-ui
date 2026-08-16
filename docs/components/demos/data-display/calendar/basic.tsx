"use client";

import { Calendar } from "@/lib/ui";

type EventItem = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

const events: EventItem[] = [
  {
    id: "1",
    title: "Design review",
    start: new Date(2026, 7, 14, 10, 0),
    end: new Date(2026, 7, 14, 11, 30),
  },
  {
    id: "2",
    title: "Sprint planning",
    start: new Date(2026, 7, 15, 13, 0),
    end: new Date(2026, 7, 15, 14, 0),
  },
];

export function CalendarBasic() {
  return (
    <Calendar trackedBy="id" data={events} renderItem={(item) => <span>{item.title}</span>} config={{ locale: "en" }} />
  );
}
