'use client';

import { Button, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function ButtonShapes() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Button shape="circle" color="blue" icon={{ element: <PlusIcon /> }} />
      <Button shape="square" color="blue" icon={{ element: <PlusIcon /> }} />
      <Button shape="circle" color="teal" variant="outlined" icon={{ element: <PlusIcon /> }} />
      <Button shape="square" color="teal" variant="outlined" icon={{ element: <PlusIcon /> }} />
    </Flex>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 3v10M3 8h10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
