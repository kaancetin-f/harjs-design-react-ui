'use client';

import { useState } from 'react';
import { Button, GridSystem, Notification } from '@/lib/ui';

const { Flex } = GridSystem;

export function NotificationDuration() {
  const [trigger, setTrigger] = useState(false);
  const [duration, setDuration] = useState(3000);

  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
      <Button
        variant={duration === 3000 ? 'filled' : 'outlined'}
        color="blue"
        onClick={() => {
          setDuration(3000);
          setTrigger((value) => !value);
        }}
      >
        3 Seconds
      </Button>
      <Button
        variant={duration === 8000 ? 'filled' : 'outlined'}
        color="blue"
        onClick={() => {
          setDuration(8000);
          setTrigger((value) => !value);
        }}
      >
        8 Seconds
      </Button>
      <Notification
        title={duration === 3000 ? 'Default duration' : 'Held for 8 seconds'}
        message="Close dismisses immediately and clears the timeout."
        status="information"
        direction="bottom-left"
        duration={duration}
        trigger={trigger}
      />
    </Flex>
  );
}
