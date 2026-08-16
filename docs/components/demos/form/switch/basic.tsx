'use client';

import { useState } from 'react';
import { Switch } from '@/lib/ui';

export function SwitchBasic() {
  const [checked, setChecked] = useState(false);

  return (
    <Switch
      label="Notifications"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  );
}
