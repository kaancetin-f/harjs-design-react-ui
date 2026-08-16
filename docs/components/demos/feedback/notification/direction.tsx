'use client';

import { useState } from 'react';
import { Button, GridSystem, Notification } from '@/lib/ui';

const { Flex } = GridSystem;

const directions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

export function NotificationDirection() {
  const [trigger, setTrigger] = useState(false);
  const [direction, setDirection] = useState<(typeof directions)[number]>('bottom-left');

  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
      {directions.map((value) => (
        <Button
          key={value}
          variant={direction === value ? 'filled' : 'outlined'}
          color="purple"
          onClick={() => {
            setDirection(value);
            setTrigger((current) => !current);
          }}
        >
          {value
            .split('-')
            .map((part) => part[0].toUpperCase() + part.slice(1))
            .join(' ')}
        </Button>
      ))}
      <Notification
        title={`Docked ${direction}`}
        message="Each toast keeps the corner it was created with."
        status="information"
        direction={direction}
        trigger={trigger}
      />
    </Flex>
  );
}
