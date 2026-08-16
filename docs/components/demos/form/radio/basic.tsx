'use client';

import { useState } from 'react';
import { Radio } from '@/lib/ui';

export function RadioBasic() {
  const [checked, setChecked] = useState(false);

  return (
    <Radio
      label="Notify me"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  );
}
