'use client';

import { useCallback, useMemo, useState } from 'react';
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
  dueDate: string;
  assigneeName: string;
  assignee: { initials: string; name: string; bg: string; fg: string };
};

type Query = {
  keyword?: string;
  tag?: string[];
  assigneeName?: string[];
  dueDate?: { from?: Date | string | null; to?: Date | string | null };
} | null;

const ada = { initials: 'AL', name: 'Ada Lovelace', bg: 'var(--blue-100)', fg: 'var(--blue-700)' };
const grace = { initials: 'GH', name: 'Grace Hopper', bg: 'var(--purple-100)', fg: 'var(--purple-700)' };
const alan = { initials: 'AT', name: 'Alan Turing', bg: 'var(--teal-100)', fg: 'var(--teal-700)' };

const tasks: Record<string, Task[]> = {
  todo: [
    {
      id: '1',
      title: 'Collect requirements',
      hint: 'Intake, scope, and success metrics',
      tag: 'Research',
      tagColor: 'blue',
      due: 'Apr 16',
      dueDate: '2026-04-16',
      assigneeName: ada.name,
      assignee: ada,
    },
    {
      id: '2',
      title: 'Draft the API',
      hint: 'Contracts, types, and error map',
      tag: 'Backend',
      tagColor: 'gray',
      due: 'Apr 18',
      dueDate: '2026-04-18',
      assigneeName: alan.name,
      assignee: alan,
    },
  ],
  doing: [
    {
      id: '3',
      title: 'Build the upload UI',
      hint: 'Dropzone, progress, and file list',
      tag: 'Design',
      tagColor: 'orange',
      due: 'Apr 14',
      dueDate: '2026-04-14',
      assigneeName: grace.name,
      assignee: grace,
    },
    {
      id: '5',
      title: 'Wire filter query',
      hint: 'Select, date, and keyword params',
      tag: 'Backend',
      tagColor: 'gray',
      due: 'Apr 19',
      dueDate: '2026-04-19',
      assigneeName: ada.name,
      assignee: ada,
    },
  ],
  review: [
    {
      id: '7',
      title: 'Review the motion spec',
      hint: 'Drag preview and drop indicator',
      tag: 'Design',
      tagColor: 'purple',
      due: 'Apr 17',
      dueDate: '2026-04-17',
      assigneeName: grace.name,
      assignee: grace,
    },
  ],
  done: [
    {
      id: '4',
      title: 'Write the docs outline',
      hint: 'Pages, examples, and props table',
      tag: 'Docs',
      tagColor: 'green',
      due: 'Apr 12',
      dueDate: '2026-04-12',
      assigneeName: alan.name,
      assignee: alan,
    },
    {
      id: '6',
      title: 'Audit the color tokens',
      hint: 'Surface, border, and accent contrast',
      tag: 'Design',
      tagColor: 'teal',
      due: 'Apr 11',
      dueDate: '2026-04-11',
      assigneeName: grace.name,
      assignee: grace,
    },
  ],
};

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

function matchesQuery(item: Task, query: Query) {
  if (!query) return true;

  const keyword = query.keyword?.trim().toLowerCase() ?? '';
  if (keyword) {
    const haystack = `${item.title} ${item.hint} ${item.tag} ${item.assigneeName}`.toLowerCase();
    if (!haystack.includes(keyword)) return false;
  }

  if (query.tag?.length && !query.tag.includes(item.tag)) return false;
  if (query.assigneeName?.length && !query.assigneeName.includes(item.assigneeName)) return false;

  const from = query.dueDate?.from ? new Date(query.dueDate.from).getTime() : null;
  const to = query.dueDate?.to ? new Date(query.dueDate.to).getTime() : null;

  if (from || to) {
    const time = new Date(`${item.dueDate}T00:00:00`).getTime();
    if (from && time < from) return false;
    if (to && time > to) return false;
  }

  return true;
}

export function KanbanBoardFilters() {
  const blueprint = useMemo(
    () => [
      {
        key: 'todo',
        title: 'To do',
        description: 'Ready to pick up',
        titleColor: '#3b82f6',
        items: tasks.todo,
        columnProperties: { status: 'todo' },
        renderItem: (item: Task) => <TaskCard item={item} />,
      },
      {
        key: 'doing',
        title: 'In progress',
        description: 'Actively moving',
        titleColor: '#f59e0b',
        items: tasks.doing,
        columnProperties: { status: 'doing' },
        renderItem: (item: Task) => <TaskCard item={item} />,
      },
      {
        key: 'review',
        title: 'Review',
        description: 'Waiting on feedback',
        titleColor: '#a855f7',
        items: tasks.review,
        columnProperties: { status: 'review' },
        renderItem: (item: Task) => <TaskCard item={item} />,
      },
      {
        key: 'done',
        title: 'Done',
        description: 'Shipped this week',
        titleColor: '#22c55e',
        items: tasks.done,
        columnProperties: { status: 'done' },
        renderItem: (item: Task) => <TaskCard item={item} />,
      },
    ],
    [],
  );

  const [columns, setColumns] = useState(blueprint);

  const handleLazyLoad = useCallback(
    (query: Record<string, string>) => {
      setColumns(
        blueprint.map((column) => ({
          ...column,
          items: column.items.filter((item) => matchesQuery(item, query as Query)),
        })),
      );
    },
    [blueprint],
  );

  return (
    <Flex flexDirection="column" width="100%" height="38rem">
      <KanbanBoard
        trackBy={(item) => item.id}
        columns={columns}
        onLazyLoad={handleLazyLoad}
        config={{
          locale: 'en',
          filter: {
            keys: (item) => [
              { key: 'tag', name: 'Tag', value: item.tag, type: 'select' },
              { key: 'assigneeName', name: 'Assignee', value: item.assigneeName, type: 'select' },
              { key: 'dueDate', name: 'Due date', value: item.dueDate, type: 'date' },
            ],
          },
        }}
      />
    </Flex>
  );
}
