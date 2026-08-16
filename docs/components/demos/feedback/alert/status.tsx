'use client';

import { Alert, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const items = [
  { status: 'information', message: 'A new version is ready. Install when the window is clear.' },
  { status: 'success', message: 'Checks passed. Coverage is 94% and the bundle is in budget.' },
  { status: 'warning', message: 'Staging is two commits behind. Sync before you promote.' },
  { status: 'danger', message: 'INV-2041 was declined. Update billing to keep the workspace.' },
] as const;

export function AlertStatus() {
  return (
    <Flex flexWrap="wrap" gap="var(--space-12)" width="100%">
      {items.map((item) => (
        <div key={item.status} style={{ flex: '1 1 16rem', minWidth: 0 }}>
          <Alert status={item.status} message={item.message} />
        </div>
      ))}
    </Flex>
  );
}
