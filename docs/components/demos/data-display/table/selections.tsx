'use client';

import { useState } from 'react';
import { Chip, GridSystem, Table, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

type Status = 'Active' | 'Away' | 'On leave';

type Person = {
  id: string;
  name: string;
  role: string;
  status: Status;
};

const people: Person[] = [
  { id: '1', name: 'Ada Lovelace', role: 'Engineer', status: 'Active' },
  { id: '2', name: 'Alan Turing', role: 'Research', status: 'Active' },
  { id: '3', name: 'Grace Hopper', role: 'Lead', status: 'Away' },
  { id: '4', name: 'Katherine Johnson', role: 'Analyst', status: 'Active' },
  { id: '5', name: 'Margaret Hamilton', role: 'Engineer', status: 'On leave' },
];

const statusColor: Record<Status, 'green' | 'orange' | 'gray'> = {
  Active: 'green',
  Away: 'orange',
  'On leave': 'gray',
};

export function TableSelections() {
  const [selected, setSelected] = useState<Person[]>([]);

  return (
    <Flex flexDirection="column" gap="var(--space-12)" width="100%">
      <Table
        title="Team"
        description="Pass `selections` to add a checkbox column. Leave rows can be locked."
        trackBy={(item) => item.id}
        data={people}
        columns={[
          { title: 'Name', key: 'name' },
          { title: 'Role', key: 'role' },
          {
            title: 'Status',
            key: 'status',
            render: (item) => (
              <Chip text={item.status} color={statusColor[item.status]} variant="surface" size="sm" />
            ),
          },
        ]}
        selections={setSelected}
        previousSelections={selected}
        selectionDisabled={(item) => item.status === 'On leave'}
        config={{ locale: 'en', columnManagement: { enabled: false } }}
      />
      <Paragraph size="sm" color="gray-500">
        {selected.length === 0
          ? 'No rows selected. Margaret Hamilton is locked while on leave.'
          : `Selected · ${selected.map((item) => item.name).join(', ')}`}
      </Paragraph>
    </Flex>
  );
}
