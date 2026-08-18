'use client';

import { Calendar, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

type EventItem = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

const at = (startHour: number, startMinute: number, endHour: number, endMinute: number) => {
  const start = new Date();
  start.setHours(startHour, startMinute, 0, 0);
  const end = new Date();
  end.setHours(endHour, endMinute, 0, 0);
  return { start, end };
};

const events: EventItem[] = [
  { id: '1', title: 'Standup', ...at(9, 0, 9, 30) },
  { id: '2', title: 'Pairing', ...at(9, 15, 10, 45) },
  { id: '3', title: 'Design critique', ...at(9, 30, 11, 0) },
  { id: '4', title: 'Office hours', ...at(14, 0, 15, 0) },
  { id: '5', title: 'Incident review', ...at(14, 30, 16, 0) },
];

export function CalendarOverlapping() {
  return (
    <Flex flexDirection="column" width="100%" height="36rem">
      <Calendar
        trackedBy="id"
        data={events}
        defaultView="Day"
        renderItem={(item) => <span>{item.title}</span>}
        config={{ locale: 'en' }}
      />
    </Flex>
  );
}
