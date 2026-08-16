'use client';

import { useState } from 'react';
import { DnD, GridSystem } from '@/lib/ui';
import { DnDRow, queue } from './queue';

const { Flex } = GridSystem;

const colors = ['blue', 'teal', 'orange'] as const;

function ColorQueue({ color }: { color: (typeof colors)[number] }) {
  const [items, setItems] = useState(queue.slice(0, 3));

  return (
    <DnD
      data={items}
      itemKey={(item) => item.id}
      onChange={setItems}
      config={{ color }}
      renderItem={(item) => <DnDRow title={item.title} hint={item.hint} />}
    />
  );
}

export function DnDColors() {
  return (
    <Flex flexDirection="column" gap="var(--space-20)" width="100%">
      {colors.map((color) => (
        <ColorQueue key={color} color={color} />
      ))}
    </Flex>
  );
}
