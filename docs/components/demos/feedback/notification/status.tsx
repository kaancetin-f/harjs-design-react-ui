'use client';

import { useState } from 'react';
import { Button, GridSystem, Notification } from '@/lib/ui';

const { Flex } = GridSystem;

const statuses = [
  { status: 'information', color: 'cyan', label: 'Information' },
  { status: 'success', color: 'green', label: 'Success' },
  { status: 'warning', color: 'orange', label: 'Warning' },
  { status: 'error', color: 'red', label: 'Error' },
] as const;

export function NotificationStatus() {
  const [trigger, setTrigger] = useState(false);
  const [status, setStatus] = useState<(typeof statuses)[number]['status']>('success');

  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
      {statuses.map((item) => (
        <Button
          key={item.status}
          variant={status === item.status ? 'filled' : 'outlined'}
          color={item.color}
          onClick={() => {
            setStatus(item.status);
            setTrigger((value) => !value);
          }}
        >
          {item.label}
        </Button>
      ))}
      <Notification
        title={`${status[0].toUpperCase()}${status.slice(1)}`}
        message="Numeric codes map the same way: 2xx is success, 4xx and 5xx are error."
        status={status}
        direction="bottom-left"
        trigger={trigger}
      />
    </Flex>
  );
}
