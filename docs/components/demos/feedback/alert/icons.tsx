'use client';

import { Alert, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden>
      <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.31a40,40,0,0,0,79.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.34,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.66,16,80Z" />
    </svg>
  );
}

export function AlertIcons() {
  return (
    <Flex flexDirection="column" gap="var(--space-12)" width="100%">
      <Alert status="information" message="The status mark is on by default." />
      <Alert
        icon={{ element: <BellIcon /> }}
        status="warning"
        message="Pass icon.element to replace it."
      />
      <Alert
        icon={{ element: <BellIcon />, position: 'end' }}
        status="success"
        message="icon.position end places the mark after the copy."
      />
    </Flex>
  );
}
