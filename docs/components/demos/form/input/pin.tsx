'use client';

import { useState } from 'react';
import { Input } from '@/lib/ui';

export function InputPin() {
  const [value, setValue] = useState('');

  return (
    <Input.Pin
      character={4}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
