'use client';

import { useState } from 'react';
import { Button, Drawer, GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const tabs = [
  {
    title: 'Overview',
    content: <Paragraph>Project overview and status for the Aurora release.</Paragraph>,
  },
  {
    title: 'Activity',
    content: <Paragraph>Comments, deploys, and review events from the last 24 hours.</Paragraph>,
  },
  {
    title: 'Settings',
    content: <Paragraph>Workspace preferences. Changes save to this browser session.</Paragraph>,
  },
];

const orientations = ['vertical', 'horizontal'] as const;
const variants = ['underline', 'pill', 'segmented', 'folder', 'minimal'] as const;

export function DrawerTabs() {
  const [open, setOpen] = useState(false);
  const [orientation, setOrientation] = useState<(typeof orientations)[number]>('vertical');
  const [variant, setVariant] = useState<(typeof variants)[number]>('underline');

  return (
    <Flex flexDirection="column" gap="var(--space-12)">
      <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
        {orientations.map((value) => (
          <Button
            key={value}
            variant={orientation === value ? 'filled' : 'outlined'}
            color="green"
            onClick={() => {
              setOrientation(value);
              setOpen(true);
            }}
          >
            {value[0].toUpperCase() + value.slice(1)}
          </Button>
        ))}
      </Flex>
      <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
        {variants.map((value) => (
          <Button
            key={value}
            variant={variant === value ? 'filled' : 'outlined'}
            color="orange"
            onClick={() => {
              setVariant(value);
              setOpen(true);
            }}
          >
            {value[0].toUpperCase() + value.slice(1)}
          </Button>
        ))}
      </Flex>
      <Drawer
        name="docs-drawer-tabs"
        title="Workspace"
        size="md"
        config={{ tabs: { orientation, variant } }}
        tabs={tabs}
        open={{ get: open, set: setOpen }}
      />
    </Flex>
  );
}
