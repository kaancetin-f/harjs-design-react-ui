'use client';

import { Calendar, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

type EventItem = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

const at = (dayOffset: number, startHour: number, endHour: number) => {
  const start = new Date();
  start.setDate(start.getDate() + dayOffset);
  start.setHours(startHour, 0, 0, 0);
  const end = new Date();
  end.setDate(end.getDate() + dayOffset);
  end.setHours(endHour, 0, 0, 0);
  return { start, end };
};

const events: EventItem[] = [
  { id: '1', title: 'Tasarım incelemesi', ...at(0, 10, 12) },
  { id: '2', title: 'Sprint planlama', ...at(1, 13, 14) },
  { id: '3', title: 'Müşteri görüşmesi', ...at(4, 9, 10) },
];

export function CalendarLocale() {
  return (
      <Calendar
        trackedBy="id"
        data={events}
        defaultView="Month"
        renderItem={(item) => <span>{item.title}</span>}
        config={{ locale: 'tr' }}
      />
  );
}
