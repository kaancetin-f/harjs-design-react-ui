'use client';

import { useState } from 'react';
import { Badge, Button, GridSystem, Switch } from '@/lib/ui';

const { Flex } = GridSystem;

function Host() {
  return (
    <span
      style={{
        display: 'block',
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-8)',
        background: 'var(--gray-200)',
      }}
    />
  );
}

export function BadgeDynamic() {
  const [count, setCount] = useState(5);
  const [show, setShow] = useState(true);

  return (
    <Flex flexDirection="column" gap="var(--space-16)">
      <Flex alignItems="center" gap="var(--space-16)">
        <Badge count={show ? count : 0}>
          <Host />
        </Badge>
        <Badge dot={show}>
          <Host />
        </Badge>
      </Flex>
      <Flex alignItems="center" gap="var(--space-12)">
        <Button size="sm" color="blue" onClick={() => setCount((value) => value + 1)}>
          +
        </Button>
        <Button size="sm" variant="outlined" color="blue" onClick={() => setCount((value) => Math.max(0, value - 1))}>
          −
        </Button>
        <Switch checked={show} onChange={(event) => setShow(event.target.checked)} />
      </Flex>
    </Flex>
  );
}
