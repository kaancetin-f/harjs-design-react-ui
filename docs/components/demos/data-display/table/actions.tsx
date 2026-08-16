'use client';

import { useState } from 'react';
import { Chip, GridSystem, Table, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

type Status = 'Active' | 'Away';

type Person = {
  id: string;
  name: string;
  role: string;
  status: Status;
};

const seed: Person[] = [
  { id: '1', name: 'Ada Lovelace', role: 'Engineer', status: 'Active' },
  { id: '2', name: 'Alan Turing', role: 'Research', status: 'Active' },
  { id: '3', name: 'Grace Hopper', role: 'Lead', status: 'Away' },
];

const statusColor: Record<Status, 'green' | 'orange'> = {
  Active: 'green',
  Away: 'orange',
};

export function TableActions() {
  const [people, setPeople] = useState(seed);
  const [selected, setSelected] = useState<Person[]>([]);
  const [note, setNote] = useState('Use Create to add a row, or select rows and Delete.');

  return (
    <Flex flexDirection="column" gap="var(--space-12)" width="100%">
      <Table
        title="Team"
        description="Header actions wrap create, export, import, and delete behind confirm dialogs."
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
        actions={{
          create: {
            tooltip: 'Add a person',
            onClick: () => {
              setPeople((prev) => {
                const id = String(prev.length + 1);
                return [...prev, { id, name: `New teammate ${id}`, role: 'Engineer', status: 'Active' }];
              });
              setNote('Created a teammate.');
            },
          },
          export: {
            tooltip: 'Export the current view',
            title: 'Export team',
            message: 'Download the visible rows. In an app this would write CSV or PDF.',
            onClick: () => setNote(`Export queued for ${people.length} rows.`),
          },
          delete: {
            tooltip: 'Remove selected rows',
            title: 'Delete selected',
            message: 'This removes the checked rows from local state.',
            onClick: () => {
              const ids = new Set(selected.map((item) => item.id));
              if (ids.size === 0) {
                setNote('Select at least one row to delete.');
                return;
              }
              setPeople((prev) => prev.filter((item) => !ids.has(item.id)));
              setSelected([]);
              setNote(`Removed ${ids.size} row${ids.size === 1 ? '' : 's'}.`);
            },
          },
        }}
        config={{ locale: 'en', columnManagement: { enabled: false } }}
      />
      <Paragraph size="sm" color="gray-500">
        {note}
      </Paragraph>
    </Flex>
  );
}
