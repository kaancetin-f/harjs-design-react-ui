'use client';

import { useState } from 'react';
import { Radio } from '@/lib/ui';

export function RadioGroupBasic() {
  const [selected, setSelected] = useState('starter');

  return (
    <Radio.Group
      name="plan"
      title="Plan"
      orientation="vertical"
      color="blue"
      onChange={(e) => setSelected(e.target.value)}
    >
      <Radio label="Starter" value="starter" checked={selected === 'starter'} />
      <Radio label="Pro" value="pro" checked={selected === 'pro'} />
      <Radio label="Enterprise" value="enterprise" checked={selected === 'enterprise'} />
    </Radio.Group>
  );
}
