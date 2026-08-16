'use client';

import { useState } from 'react';
import { Radio, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function RadioCardBasic() {
  const [checked, setChecked] = useState(false);

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="min(100%, 360px)">
      <Radio.Card
        title="Pro plan"
        description="Unlimited projects and priority support."
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        color="blue"
      />
    </Flex>
  );
}
