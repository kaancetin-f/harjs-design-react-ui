'use client';

import { useMemo } from 'react';
import { Card, Chip, Divider, GridSystem, KanbanBoard, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph, Title } = Typography;

type TagColor = 'blue' | 'orange' | 'green' | 'purple' | 'teal' | 'gray';

type Task = {
  id: string;
  title: string;
  hint: string;
  tag: string;
  tagColor: TagColor;
  due: string;
  assignee: { initials: string; name: string; bg: string; fg: string };
};

const ada = { initials: 'AL', name: 'Ada Lovelace', bg: 'var(--blue-100)', fg: 'var(--blue-700)' };
const grace = { initials: 'GH', name: 'Grace Hopper', bg: 'var(--purple-100)', fg: 'var(--purple-700)' };
const alan = { initials: 'AT', name: 'Alan Turing', bg: 'var(--teal-100)', fg: 'var(--teal-700)' };

function TaskCard({ item }: { item: Task }) {
  return (
    <Card border={{ radius: '8' }}>
      <Flex flexDirection="column" gap="var(--space-12)">
        <Flex flexDirection="column" gap="var(--space-4)">
          <Title
            size="md"
            fontWeight="600"
            style={{ margin: 0, fontSize: '0.875rem', letterSpacing: '-0.02em', lineHeight: 1.35 }}
          >
            {item.title}
          </Title>
          <Paragraph size="xs" color="gray-500">
            {item.hint}
          </Paragraph>
        </Flex>
        <Divider config={{ margin: '0' }} />
        <Flex alignItems="center" justifyContent="space-between" gap="var(--space-8)">
          <Chip text={item.tag} color={item.tagColor} variant="surface" size="sm" />
          <Flex alignItems="center" gap="var(--space-8)">
            <Paragraph size="xs" color="gray-500">
              {item.due}
            </Paragraph>
            <span
              title={item.assignee.name}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '999px',
                background: item.assignee.bg,
                color: item.assignee.fg,
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                flexShrink: 0,
              }}
            >
              {item.assignee.initials}
            </span>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

export function KanbanBoardBasic() {
  const columns = useMemo(
    () => [
      {
        key: 'todo',
        title: 'To do',
        description: 'Ready to pick up',
        titleColor: '#3b82f6',
        items: [
          {
            id: '1',
            title: 'Collect requirements',
            hint: 'Intake, scope, and success metrics',
            tag: 'Research',
            tagColor: 'blue' as const,
            due: 'Apr 16',
            assignee: ada,
          },
          {
            id: '2',
            title: 'Draft the API',
            hint: 'Contracts, types, and error map',
            tag: 'Backend',
            tagColor: 'gray' as const,
            due: 'Apr 18',
            assignee: alan,
          },
        ],
        columnProperties: { status: 'todo' },
        renderItem: (item: Task) => <TaskCard item={item} />,
      },
      {
        key: 'doing',
        title: 'In progress',
        description: 'Actively moving',
        titleColor: '#f59e0b',
        items: [
          {
            id: '3',
            title: 'Build the upload UI',
            hint: 'Dropzone, progress, and file list',
            tag: 'Design',
            tagColor: 'orange' as const,
            due: 'Today',
            assignee: grace,
          },
          {
            id: '5',
            title: 'Wire filter query',
            hint: 'Select, date, and keyword params',
            tag: 'Backend',
            tagColor: 'gray' as const,
            due: 'Apr 19',
            assignee: ada,
          },
        ],
        columnProperties: { status: 'doing' },
        renderItem: (item: Task) => <TaskCard item={item} />,
      },
      {
        key: 'review',
        title: 'Review',
        description: 'Waiting on feedback',
        titleColor: '#a855f7',
        items: [],
        columnProperties: { status: 'review' },
        renderItem: (item: Task) => <TaskCard item={item} />,
      },
      {
        key: 'done',
        title: 'Done',
        description: 'Shipped this week',
        titleColor: '#22c55e',
        items: [
          {
            id: '4',
            title: 'Write the docs outline',
            hint: 'Pages, examples, and props table',
            tag: 'Docs',
            tagColor: 'green' as const,
            due: 'Apr 12',
            assignee: alan,
          },
          {
            id: '6',
            title: 'Audit the color tokens',
            hint: 'Surface, border, and accent contrast',
            tag: 'Design',
            tagColor: 'teal' as const,
            due: 'Apr 11',
            assignee: grace,
          },
        ],
        columnProperties: { status: 'done' },
        renderItem: (item: Task) => <TaskCard item={item} />,
      },
    ],
    [],
  );

  return (
    <Flex flexDirection="column" width="100%" height="34rem">
      <KanbanBoard trackBy={(item) => item.id} columns={columns} config={{ locale: 'en' }} />
    </Flex>
  );
}
