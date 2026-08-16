'use client';

import { useState } from 'react';
import { Radio } from '@/lib/ui';

export function RadioValidation() {
  const [checked, setChecked] = useState(false);

  return (
    <Radio
      label="Notify me"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
      validation={!checked ? { text: 'This field is required' } : undefined}
    />
  );
}

export function RadioValidationGroup() {
  const [selected, setSelected] = useState('');

  return (
    <Radio.Group
      name="plan"
      title="Plan"
      orientation="vertical"
      color="blue"
      onChange={(e) => setSelected(e.target.value)}
      validation={!selected ? { text: 'Select an option' } : undefined}
    >
      <Radio label="Starter" value="starter" checked={selected === 'starter'} />
      <Radio label="Pro" value="pro" checked={selected === 'pro'} />
      <Radio label="Enterprise" value="enterprise" checked={selected === 'enterprise'} />
    </Radio.Group>
  );
}
