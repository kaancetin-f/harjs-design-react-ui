'use client';

import { useState } from 'react';
import { Button, Notification } from '@/lib/ui';

export function NotificationStack() {
  const [trigger, setTrigger] = useState(false);

  return (
    <>
      <Button variant="outlined" color="orange" onClick={() => setTrigger((value) => !value)}>
        Push toast
      </Button>
      <Notification
        title="Deploy queued"
        message="Click again to stack. After five, the pile compacts."
        status="warning"
        direction="bottom-left"
        trigger={trigger}
      />
    </>
  );
}
