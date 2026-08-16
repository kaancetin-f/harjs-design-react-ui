'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
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

const work: [string, string, TagColor, string][] = [
  ['Collect requirements', 'Intake, scope, and success metrics', 'blue', 'Research'],
  ['Draft the API', 'Contracts, types, and error map', 'gray', 'Backend'],
  ['Build the upload UI', 'Dropzone, progress, and file list', 'orange', 'Design'],
  ['Wire filter query', 'Select, date, and keyword params', 'gray', 'Backend'],
  ['Write the docs outline', 'Pages, examples, and props table', 'green', 'Docs'],
  ['Audit the color tokens', 'Surface, border, and accent contrast', 'teal', 'Design'],
  ['Review the motion spec', 'Drag preview and drop indicator', 'purple', 'Design'],
  ['Ship the empty state', 'Placeholder copy and illustration', 'green', 'Docs'],
  ['Map the error codes', 'Client, timeout, and retry paths', 'gray', 'Backend'],
  ['Sketch the board shell', 'Columns, nav, and safe area', 'orange', 'Design'],
  ['Tune the card density', 'Title, hint, tag, and assignee', 'teal', 'Design'],
  ['Close the a11y gaps', 'Live region and keyboard filters', 'blue', 'Research'],
];

const people = [ada, grace, alan];

function makeTasks(column: string) {
  return work.map(([title, hint, tagColor, tag], index) => ({
    id: `${column}-${index + 1}`,
    title,
    hint,
    tag,
    tagColor,
    due: `Apr ${10 + (index % 18)}`,
    assignee: people[index % people.length],
  }));
}

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

const catalog = {
  todo: makeTasks('todo'),
  doing: makeTasks('doing'),
  review: makeTasks('review'),
  done: makeTasks('done'),
};

export function KanbanBoardLazyLoad() {
  const request = useRef(0);
  const [loading, setLoading] = useState(true);

  const blueprint = useMemo(
    () => [
      {
        key: 'todo',
        title: 'To do',
        description: 'Ready to pick up',
        titleColor: '#3b82f6',
        items: [] as Task[],
        columnProperties: { status: 'todo' },
        renderItem: (item: Task) => <TaskCard item={item} />,
      },
      {
        key: 'doing',
        title: 'In progress',
        description: 'Actively moving',
        titleColor: '#f59e0b',
        items: [] as Task[],
        columnProperties: { status: 'doing' },
        renderItem: (item: Task) => <TaskCard item={item} />,
      },
      {
        key: 'review',
        title: 'Review',
        description: 'Waiting on feedback',
        titleColor: '#a855f7',
        items: [] as Task[],
        columnProperties: { status: 'review' },
        renderItem: (item: Task) => <TaskCard item={item} />,
      },
      {
        key: 'done',
        title: 'Done',
        description: 'Shipped this week',
        titleColor: '#22c55e',
        items: [] as Task[],
        columnProperties: { status: 'done' },
        renderItem: (item: Task) => <TaskCard item={item} />,
      },
    ],
    [],
  );

  const [columns, setColumns] = useState(blueprint);

  const handleLazyLoad = useCallback(
    (_query: Record<string, string>, perPage: number, currentPage: number) => {
      const start = (currentPage - 1) * perPage;
      const hasMore = Object.values(catalog).some((items) => start < items.length);

      if (!hasMore) return;

      const id = ++request.current;
      setLoading(true);

      window.setTimeout(() => {
        if (id !== request.current) return;

        setColumns((prev) =>
          blueprint.map((column) => {
            const page = catalog[column.key as keyof typeof catalog].slice(start, start + perPage);
            const existing = prev.find((entry) => entry.key === column.key)?.items ?? [];

            return {
              ...column,
              items: currentPage === 1 ? page : [...existing, ...page],
            };
          }),
        );
        setLoading(false);
      }, 450);
    },
    [blueprint],
  );

  return (
    <Flex flexDirection="column" width="100%" height="28rem">
      <KanbanBoard
        trackBy={(item) => item.id}
        columns={columns}
        loading={loading}
        onLazyLoad={handleLazyLoad}
        config={{ locale: 'en', perPage: 4 }}
      />
    </Flex>
  );
}
