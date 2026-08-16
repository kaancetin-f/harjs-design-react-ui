'use client';

import { useState } from 'react';
import { Input, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function InputFormattedDecimal() {
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Input.FormattedDecimal
        locale="tr-TR"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Input.FormattedDecimal
        locale="tr-TR"
        placeholder="Price"
        digits={{ minimum: 2, maximum: 2 }}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
    </Flex>
  );
}
