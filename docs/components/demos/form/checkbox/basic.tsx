'use client';

import { useState } from 'react';
import { Checkbox } from '@/lib/ui';

export function CheckboxBasic() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      label="Accept terms"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  );
}
