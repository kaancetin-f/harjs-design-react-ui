'use client';

import { useState } from 'react';
import { Switch } from '@/lib/ui';

export function SwitchValidation() {
  const [checked, setChecked] = useState(false);

  return (
    <Switch
      label="Enable two-factor authentication"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
      validation={!checked ? { text: 'This field is required' } : undefined}
    />
  );
}
