'use client';

import { useState } from 'react';
import { Checkbox, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function CheckboxCardBasic() {
  const [checked, setChecked] = useState(false);

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="min(100%, 360px)">
      <Checkbox.Card
        title="Pro plan"
        description="Unlimited projects and priority support."
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        color="blue"
      />
    </Flex>
  );
}
