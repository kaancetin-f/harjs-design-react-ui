'use client';

import { useState } from 'react';
import { Button, Chip, GridSystem, Icon, Table, Typography } from '@/lib/ui';

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
  const [note, setNote] = useState('Use Invite on the left, or Create / Delete on the right.');

  return (
    <Flex flexDirection="column" gap="var(--space-12)" width="100%">
      <Table
        title="Team"
        description="Custom extra buttons sit on the left. Pass text on an action to label it; the tooltip comes from locale."
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
        extra={
          <Button
            variant="outlined"
            size="sm"
            icon={{ element: <Icon icon="Inbox-Fill" size={16} /> }}
            onClick={() => {
              const count = selected.length > 0 ? selected.length : people.length;
              setNote(`Invite queued for ${count} teammate${count === 1 ? '' : 's'}.`);
            }}
          >
            Invite
          </Button>
        }
        actions={{
          create: {
            onClick: () => {
              setPeople((prev) => {
                const id = String(prev.length + 1);
                return [...prev, { id, name: `New teammate ${id}`, role: 'Engineer', status: 'Active' }];
              });
              setNote('Created a teammate.');
            },
          },
          export: {
            title: 'Export team',
            message: 'Download the visible rows. In an app this would write CSV or PDF.',
            onClick: () => setNote(`Export queued for ${people.length} rows.`),
          },
          delete: {
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
