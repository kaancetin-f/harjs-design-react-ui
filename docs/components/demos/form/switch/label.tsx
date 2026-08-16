'use client';

import { useState } from 'react';
import { Switch } from '@/lib/ui';

export function SwitchLabel() {
  const [checked, setChecked] = useState(true);

  return (
    <Switch
      label="Email notifications"
      color="blue"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  );
}
