'use client';

import { Radio } from '@/lib/ui';

export function RadioGroupOrientation() {
  return (
    <Radio.Group name="orientation" title="Horizontal" orientation="horizontal" color="blue">
      <Radio label="One" value="one" defaultChecked />
      <Radio label="Two" value="two" />
      <Radio label="Three" value="three" />
    </Radio.Group>
  );
}
