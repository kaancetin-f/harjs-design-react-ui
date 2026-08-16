'use client';

import { useState } from 'react';
import { Button, Notification } from '@/lib/ui';

export function NotificationBasic() {
  const [trigger, setTrigger] = useState(false);

  return (
    <>
      <Button variant="outlined" color="teal" onClick={() => setTrigger((value) => !value)}>
        Show toast
      </Button>
      <Notification
        title="Aurora is live"
        message="Sprint 24 shipped to production."
        status="success"
        direction="bottom-left"
        trigger={trigger}
      />
    </>
  );
}
