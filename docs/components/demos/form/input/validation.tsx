'use client';

import { Input } from '@/lib/ui';

export function InputValidation() {
  return (
    <Input
      placeholder="Username"
      validation={{ text: 'Username is required' }}
    />
  );
}
